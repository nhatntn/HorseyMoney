import { PrismaClient } from "@prisma/client";

export interface RoomState {
  room: {
    id: string;
    code: string;
    name: string | null;
    maxPeople: number;
    raceDuration: number;
    raceMode: string; // "manual" | "voice"
    creatorId: string | null;
  };
  participants: Array<{
    id: string;
    displayName: string;
    gender: string;
    age: number | null;
    openedAt: Date | null;
  }>;
  envelopes: Array<{
    participantId: string;
    displayName: string;
    amount: number;
    wishText: string;
  }>;
  availableCount: number;
  totalEnvelopes: number;
}

export async function getRoomState(
  prisma: PrismaClient,
  roomCode: string
): Promise<RoomState | null> {
  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: {
      participants: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          displayName: true,
          gender: true,
          age: true,
          openedAt: true,
        },
      },
      envelopes: {
        orderBy: { amount: "desc" },
        include: {
          participant: {
            select: { displayName: true },
          },
        },
      },
      amountPool: {
        select: {
          id: true,
          takenByParticipantId: true,
        },
      },
    },
  });

  if (!room) return null;

  return {
    room: {
      id: room.id,
      code: room.code,
      name: room.name,
      maxPeople: room.maxPeople,
      raceDuration: room.raceDuration,
      raceMode: room.raceMode ?? "manual",
      creatorId: room.creatorId,
    },
    participants: room.participants,
    envelopes: room.envelopes.map((e) => ({
      participantId: e.participantId,
      displayName: e.participant.displayName,
      amount: e.amount,
      wishText: e.wishText,
    })),
    availableCount: room.amountPool.filter((a) => !a.takenByParticipantId)
      .length,
    totalEnvelopes: room.amountPool.length,
  };
}
