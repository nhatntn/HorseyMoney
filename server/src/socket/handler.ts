import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { getRoomState } from "../lib/roomState";
import { raceManager } from "../lib/raceManager";
import { getAgeGroup, AGE_GROUP_ALL } from "../data/wishes";

const BROADCAST_INTERVAL_MS = 80; // ~12 fps

function normalizeRoomCode(code: string): string {
  return (code || "").trim().toUpperCase();
}

// Track active intervals and timeouts for cleanup
const activeIntervals = new Map<string, NodeJS.Timeout>();
const activeTimeouts = new Map<string, NodeJS.Timeout[]>();

function cleanupRaceTimers(roomCode: string) {
  const interval = activeIntervals.get(roomCode);
  if (interval) {
    clearInterval(interval);
    activeIntervals.delete(roomCode);
  }
  const timeouts = activeTimeouts.get(roomCode);
  if (timeouts) {
    timeouts.forEach(clearTimeout);
    activeTimeouts.delete(roomCode);
  }
}

async function assignAmountsByFinishOrder(
  prisma: PrismaClient,
  io: Server,
  roomCode: string,
  finishOrder: string[]
) {
  const room = await prisma.room.findUnique({ where: { code: roomCode } });
  if (!room) return;

  try {
    await prisma.$transaction(async (tx) => {
      // Get available amounts sorted descending (1st place gets highest)
      const available = await tx.amountPool.findMany({
        where: { roomId: room.id, takenByParticipantId: null },
        orderBy: { amount: "desc" },
      });

      // Assign in finish order: 1st gets highest, 2nd gets second highest, etc.
      for (let i = 0; i < finishOrder.length && i < available.length; i++) {
        const participantId = finishOrder[i];
        const amountRecord = available[i];

        const participant = await tx.participant.findUnique({
          where: { id: participantId },
          select: { age: true },
        });
        const ageGroup = getAgeGroup(participant?.age ?? null);
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

        await tx.amountPool.update({
          where: { id: amountRecord.id },
          data: {
            takenByParticipantId: participantId,
            takenAt: new Date(),
          },
        });

        await tx.envelope.create({
          data: {
            id: uuidv4(),
            roomId: room.id,
            participantId,
            amount: amountRecord.amount,
            wishText: randomWish?.text || "Chúc mừng năm mới!",
          },
        });

        await tx.participant.update({
          where: { id: participantId },
          data: { openedAt: new Date() },
        });
      }
    });
  } catch (error) {
    console.error("Failed to assign amounts:", error);
  }

  // Broadcast updated room state with envelopes
  const roomState = await getRoomState(prisma, roomCode);
  io.to(roomCode).emit("room:update", roomState);
}

export function setupSocketHandlers(io: Server, prisma: PrismaClient) {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // ─── Subscribe to Room ────────────────────────────────
    socket.on(
      "room:subscribe",
      async (data: { roomCode: string; participantId: string }) => {
        try {
          const roomCode = normalizeRoomCode(data.roomCode || "");
          const participantId = data.participantId;

          if (!roomCode) {
            socket.emit("room:error", { message: "Room code is required" });
            return;
          }

          // Check if this is a host-only user or a participant
          const isHostOnly = participantId.startsWith("host-");

          if (isHostOnly) {
            // Verify the room exists and this is the actual creator
            const room = await prisma.room.findUnique({
              where: { code: roomCode },
            });
            if (!room || room.creatorId !== participantId) {
              socket.emit("room:error", {
                message: "Invalid host or room",
              });
              return;
            }
          } else {
            const participant = await prisma.participant.findUnique({
              where: { id: participantId },
              include: { room: true },
            });

            if (!participant || participant.room.code !== roomCode) {
              socket.emit("room:error", {
                message: "Invalid participant or room",
              });
              return;
            }
          }

          socket.join(roomCode);
          console.log(`Socket ${socket.id} joined room ${roomCode}`);

          // Send current room state
          const roomState = await getRoomState(prisma, roomCode);
          if (roomState) {
            socket.emit("room:state", roomState);
          } else {
            socket.emit("room:error", { message: "Room not found" });
          }

          // If a race is in progress, send current race state
          const raceData = raceManager.getSerializedState(roomCode);
          if (raceData) {
            socket.emit("race:progress", raceData);
          }
        } catch (error) {
          console.error("Subscribe error:", error);
          socket.emit("room:error", { message: "Failed to subscribe" });
        }
      }
    );

    // ─── Start Race ───────────────────────────────────────
    socket.on("race:start", async (data: { roomCode: string; participantId?: string }) => {
        try {
          const roomCode = normalizeRoomCode(data.roomCode || "");
          const participantId = data.participantId;
          if (!roomCode) return;

        // Get room and participants (include openedAt to allow "next round" for late joiners)
        const room = await prisma.room.findUnique({
          where: { code: roomCode },
          include: {
            participants: { orderBy: { createdAt: "asc" } },
            envelopes: true,
            amountPool: true,
          },
        });

        if (!room) {
          socket.emit("room:error", { message: "Room not found" });
          return;
        }

        // Only room creator can start the race
        if (room.creatorId && participantId !== room.creatorId) {
          socket.emit("room:error", {
            message: "Only the room creator can start the race",
          });
          return;
        }

        // Chỉ host mới được bắt đầu đua (vòng đầu hoặc vòng tiếp)
        if (room.creatorId && participantId !== room.creatorId) {
          socket.emit("room:error", {
            message: "Chỉ host mới có thể bắt đầu đua",
          });
          return;
        }

        const availableCount = room.amountPool.filter((a) => !a.takenByParticipantId).length;
        const participantsWithoutEnvelope = room.participants.filter((p) => !p.openedAt);

        if (availableCount === 0) {
          socket.emit("room:error", {
            message: "Đã hết bao lì xì trong phòng",
          });
          return;
        }

        if (participantsWithoutEnvelope.length < 2) {
          socket.emit("room:error", {
            message: "Cần ít nhất 2 người chưa nhận lì xì để bắt đầu đua",
          });
          return;
        }

        // If a previous race was still in memory (e.g. just finished), clean it so we can start next round
        if (raceManager.hasRace(roomCode)) {
          cleanupRaceTimers(roomCode);
          raceManager.cleanup(roomCode);
        }

        // Initialize race with only participants who haven't received an envelope yet
        const raceDurationSeconds = room.raceDuration || 30;
        raceManager.initRace(
          roomCode,
          participantsWithoutEnvelope.map((p) => ({
            id: p.id,
            displayName: p.displayName,
          })),
          raceDurationSeconds
        );

        const raceTimeoutMs = raceDurationSeconds * 1000;

        console.log(
          `Race starting in room ${roomCode} with ${participantsWithoutEnvelope.length} participants (vòng đua cho người chưa nhận lì xì)`
        );

        const timeouts: NodeJS.Timeout[] = [];

        // Countdown: 3... 2... 1... GO!
        io.to(roomCode).emit("race:countdown", { count: 3 });

        timeouts.push(
          setTimeout(() => {
            io.to(roomCode).emit("race:countdown", { count: 2 });
          }, 1000)
        );

        timeouts.push(
          setTimeout(() => {
            io.to(roomCode).emit("race:countdown", { count: 1 });
          }, 2000)
        );

        timeouts.push(
          setTimeout(() => {
            // Start the race
            raceManager.startRace(roomCode);
            const state = raceManager.getSerializedState(roomCode);
            io.to(roomCode).emit("race:go", state);

            // Start broadcasting progress at fixed interval
            const interval = setInterval(() => {
              if (raceManager.isComplete(roomCode)) {
                clearInterval(interval);
                activeIntervals.delete(roomCode);
                return;
              }
              const currentState = raceManager.getSerializedState(roomCode);
              if (currentState) {
                io.to(roomCode).emit("race:progress", currentState);
              }
            }, BROADCAST_INTERVAL_MS);
            activeIntervals.set(roomCode, interval);

            // Race timeout — force finish after configured duration
            timeouts.push(
              setTimeout(async () => {
                if (!raceManager.isComplete(roomCode)) {
                  console.log(`Race timeout for room ${roomCode} (${raceDurationSeconds}s)`);
                  raceManager.forceFinishAll(roomCode);
                  const finalState =
                    raceManager.getSerializedState(roomCode);
                  io.to(roomCode).emit("race:progress", finalState);
                  io.to(roomCode).emit("race:complete", finalState);

                  const finishOrder =
                    raceManager.getFinishOrder(roomCode);
                  await assignAmountsByFinishOrder(
                    prisma,
                    io,
                    roomCode,
                    finishOrder
                  );

                  cleanupRaceTimers(roomCode);
                  // Delay cleanup so reconnecting clients can get state
                  setTimeout(
                    () => raceManager.cleanup(roomCode),
                    5000
                  );
                }
              }, raceTimeoutMs)
            );
          }, 3000)
        );

        activeTimeouts.set(roomCode, timeouts);
      } catch (error) {
        console.error("Race start error:", error);
        socket.emit("room:error", { message: "Failed to start race" });
      }
    });

    // ─── Race Tap ─────────────────────────────────────────
    socket.on(
      "race:tap",
      async (data: { roomCode: string; participantId: string }) => {
          try {
            const roomCode = normalizeRoomCode(data.roomCode || "");
            const participantId = data.participantId;
            if (!roomCode || !participantId) return;

          const progressed = raceManager.handleTap(roomCode, participantId);
          if (!progressed) return;

          // Check if race just completed (all horses finished)
          if (raceManager.isComplete(roomCode)) {
            // Send final state immediately
            const finalState = raceManager.getSerializedState(roomCode);
            io.to(roomCode).emit("race:progress", finalState);
            io.to(roomCode).emit("race:complete", finalState);

            // Assign amounts by finish order
            const finishOrder = raceManager.getFinishOrder(roomCode);
            await assignAmountsByFinishOrder(
              prisma,
              io,
              roomCode,
              finishOrder
            );

            cleanupRaceTimers(roomCode);
            setTimeout(() => raceManager.cleanup(roomCode), 5000);
          }
        } catch (error) {
          console.error("Race tap error:", error);
        }
      }
    );

    // ─── Race Voice (volume-based progress for voice mode) ──
    socket.on(
      "race:voice",
      async (data: { roomCode: string; participantId: string; delta: number }) => {
        try {
          const roomCode = normalizeRoomCode(data.roomCode || "");
          const participantId = data.participantId;
          const delta = Math.max(1, Math.min(5, Math.floor(Number(data.delta) || 1)));
          if (!roomCode || !participantId) return;

          const progressed = raceManager.handleVoice(roomCode, participantId, delta);
          if (!progressed) return;

          if (raceManager.isComplete(roomCode)) {
            const finalState = raceManager.getSerializedState(roomCode);
            io.to(roomCode).emit("race:progress", finalState);
            io.to(roomCode).emit("race:complete", finalState);
            const finishOrder = raceManager.getFinishOrder(roomCode);
            await assignAmountsByFinishOrder(prisma, io, roomCode, finishOrder);
            cleanupRaceTimers(roomCode);
            setTimeout(() => raceManager.cleanup(roomCode), 5000);
          }
        } catch (error) {
          console.error("Race voice error:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
