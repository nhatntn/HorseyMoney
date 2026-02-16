import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { getRoomState } from "../lib/roomState";
import { getAgeGroup, AGE_GROUP_ALL } from "../data/wishes";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function normalizeRoomCode(code: string): string {
  return (code || "").trim().toUpperCase();
}

export function roomRoutes(prisma: PrismaClient, io: Server): Router {
  const router = Router();

  // Create Room
  router.post("/rooms", async (req, res) => {
    try {
      const { roomName, maxPeople, amountsCsv, raceDuration, raceMode, creatorJoin, creatorName, creatorGender, creatorAge } = req.body;

      if (!maxPeople || !amountsCsv) {
        return res.status(400).json({ error: "maxPeople and amountsCsv are required" });
      }

      const amounts = amountsCsv
        .split(",")
        .map((s: string) => parseInt(s.trim(), 10))
        .filter((n: number) => !isNaN(n) && n > 0);

      if (amounts.length === 0) {
        return res.status(400).json({ error: "Invalid amounts" });
      }

      // Generate unique room code
      let code = generateRoomCode();
      let existing = await prisma.room.findUnique({ where: { code } });
      while (existing) {
        code = generateRoomCode();
        existing = await prisma.room.findUnique({ where: { code } });
      }

      const roomId = uuidv4();

      const room = await prisma.room.create({
        data: {
          id: roomId,
          code,
          name: roomName || null,
          maxPeople: parseInt(maxPeople, 10),
          raceDuration: Math.max(10, Math.min(120, parseInt(raceDuration, 10) || 30)),
          raceMode: raceMode === "voice" ? "voice" : "manual",
          amountPool: {
            create: amounts.map((amount: number) => ({
              id: uuidv4(),
              amount,
            })),
          },
        },
      });

      // If creator wants to join the race, create participant and set creatorId
      let creatorParticipantId: string | null = null;
      if (creatorJoin && creatorName && creatorName.trim()) {
        const participant = await prisma.participant.create({
          data: {
            id: uuidv4(),
            roomId: room.id,
            displayName: creatorName.trim(),
            gender: creatorGender || "other",
            age: creatorAge ? parseInt(creatorAge, 10) || null : null,
          },
        });
        creatorParticipantId = participant.id;
        await prisma.room.update({
          where: { id: room.id },
          data: { creatorId: participant.id },
        });
      } else {
        // Creator doesn't join but we still track them via a placeholder
        await prisma.room.update({
          where: { id: room.id },
          data: { creatorId: "host-" + roomId },
        });
        creatorParticipantId = "host-" + roomId;
      }

      return res.json({ roomCode: room.code, creatorId: creatorParticipantId });
    } catch (error: unknown) {
      console.error("Create room error:", error);
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to create room";
      const hint =
        typeof message === "string" && message.toLowerCase().includes("racemode")
          ? " Chạy trong thư mục server: npx prisma db push"
          : "";
      return res.status(500).json({
        error: "Failed to create room",
        details: message + hint,
      });
    }
  });

  // Join Room
  router.post("/rooms/:code/join", async (req, res) => {
    try {
      const code = normalizeRoomCode(req.params.code);
      const { displayName, gender, age } = req.body;

      if (!displayName || !displayName.trim()) {
        return res.status(400).json({ error: "Display name is required" });
      }

      const room = await prisma.room.findUnique({
        where: { code },
        include: { participants: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (room.participants.length >= room.maxPeople) {
        return res.status(400).json({ error: "Room is full" });
      }

      const participant = await prisma.participant.create({
        data: {
          id: uuidv4(),
          roomId: room.id,
          displayName: displayName.trim(),
          gender: gender || "other",
          age: age ? parseInt(age, 10) || null : null,
        },
      });

      // Broadcast update to room
      const roomState = await getRoomState(prisma, code);
      io.to(code).emit("room:update", roomState);

      return res.json({
        participantId: participant.id,
        roomCode: code,
      });
    } catch (error) {
      console.error("Join room error:", error);
      return res.status(500).json({ error: "Failed to join room" });
    }
  });

  // Open Envelope
  router.post("/rooms/:code/open", async (req, res) => {
    try {
      const code = normalizeRoomCode(req.params.code);
      const { participantId } = req.body;

      if (!participantId) {
        return res.status(400).json({ error: "participantId is required" });
      }

      const room = await prisma.room.findUnique({ where: { code } });
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Atomic transaction to prevent race conditions
      const result = await prisma.$transaction(async (tx) => {
        // 1. Validate participant exists and hasn't opened
        const participant = await tx.participant.findUnique({
          where: { id: participantId },
        });

        if (!participant) throw new Error("Participant not found");
        if (participant.roomId !== room.id) throw new Error("Wrong room");
        if (participant.openedAt) throw new Error("Already opened an envelope");

        // 2. Get available amounts
        const available = await tx.amountPool.findMany({
          where: { roomId: room.id, takenByParticipantId: null },
        });

        if (available.length === 0) throw new Error("No envelopes left");

        // 3. Random selection
        const randomIndex = Math.floor(Math.random() * available.length);
        const selected = available[randomIndex];

        // 4. Mark amount as taken
        await tx.amountPool.update({
          where: { id: selected.id },
          data: {
            takenByParticipantId: participant.id,
            takenAt: new Date(),
          },
        });

        // 5. Get random wish by participant age
        const ageGroup = getAgeGroup(participant.age ?? null);
        const wishes = await tx.wish.findMany({
          where: {
            active: true,
            OR: [{ ageGroup }, { ageGroup: AGE_GROUP_ALL }],
          },
        });
        const randomWish =
          wishes.length > 0
            ? wishes[Math.floor(Math.random() * wishes.length)]
            : null;
        const wishText = randomWish?.text || "Chúc mừng năm mới!";

        // 6. Create envelope record
        const envelope = await tx.envelope.create({
          data: {
            id: uuidv4(),
            roomId: room.id,
            participantId: participant.id,
            amount: selected.amount,
            wishText,
          },
        });

        // 7. Update participant openedAt
        await tx.participant.update({
          where: { id: participant.id },
          data: { openedAt: new Date() },
        });

        return { amount: envelope.amount, wishText: envelope.wishText };
      });

      // Broadcast update to room
      const roomState = await getRoomState(prisma, code);
      io.to(code).emit("room:update", roomState);

      return res.json(result);
    } catch (error: any) {
      console.error("Open envelope error:", error);
      const message = error?.message || "Failed to open envelope";
      return res.status(400).json({ error: message });
    }
  });

  // Get Room State (fallback)
  router.get("/rooms/:code", async (req, res) => {
    try {
      const code = normalizeRoomCode(req.params.code);
      const roomState = await getRoomState(prisma, code);

      if (!roomState) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.json(roomState);
    } catch (error) {
      console.error("Get room error:", error);
      return res.status(500).json({ error: "Failed to get room" });
    }
  });

  return router;
}
