export const RACE_GOAL = 100;
const TAP_COOLDOWN_MS = 50; // max ~20 taps/sec per player

interface InternalHorse {
  participantId: string;
  displayName: string;
  progress: number;
  finishPosition: number | null;
  finished: boolean;
  lastTapTime: number;
}

interface InternalRaceState {
  status: "waiting" | "racing" | "finished";
  horses: Map<string, InternalHorse>;
  finishOrder: string[];
  goal: number;
  startTime: number | null;
  totalParticipants: number;
  raceDurationMs: number;
}

export interface SerializedHorse {
  participantId: string;
  displayName: string;
  progress: number;
  finishPosition: number | null;
  finished: boolean;
}

export interface SerializedRaceState {
  status: "waiting" | "racing" | "finished";
  horses: SerializedHorse[];
  finishOrder: string[];
  goal: number;
  raceDurationMs: number;
  timeRemainingMs: number | null;
}

class RaceManager {
  private races = new Map<string, InternalRaceState>();

  initRace(
    roomCode: string,
    participants: Array<{ id: string; displayName: string }>,
    raceDurationSeconds: number = 30
  ): void {
    const horses = new Map<string, InternalHorse>();
    for (const p of participants) {
      horses.set(p.id, {
        participantId: p.id,
        displayName: p.displayName,
        progress: 0,
        finishPosition: null,
        finished: false,
        lastTapTime: 0,
      });
    }
    this.races.set(roomCode, {
      status: "waiting",
      horses,
      finishOrder: [],
      goal: RACE_GOAL,
      startTime: null,
      totalParticipants: participants.length,
      raceDurationMs: raceDurationSeconds * 1000,
    });
  }

  startRace(roomCode: string): void {
    const race = this.races.get(roomCode);
    if (!race) return;
    race.status = "racing";
    race.startTime = Date.now();
  }

  handleTap(roomCode: string, participantId: string): boolean {
    const race = this.races.get(roomCode);
    if (!race || race.status !== "racing") return false;

    const horse = race.horses.get(participantId);
    if (!horse || horse.finished) return false;

    // Rate limiting
    const now = Date.now();
    if (now - horse.lastTapTime < TAP_COOLDOWN_MS) return false;
    horse.lastTapTime = now;

    // Increment progress
    horse.progress = Math.min(horse.progress + 1, race.goal);

    // Check finish
    if (horse.progress >= race.goal && !horse.finished) {
      horse.finished = true;
      horse.finishPosition = race.finishOrder.length + 1;
      race.finishOrder.push(participantId);

      // Check if all finished
      if (race.finishOrder.length >= race.totalParticipants) {
        race.status = "finished";
      }
    }

    return true;
  }

  forceFinishAll(roomCode: string): void {
    const race = this.races.get(roomCode);
    if (!race) return;

    // Sort unfinished horses by progress (descending), then by join order
    const unfinished = Array.from(race.horses.values())
      .filter((h) => !h.finished)
      .sort((a, b) => b.progress - a.progress);

    for (const horse of unfinished) {
      horse.finished = true;
      horse.finishPosition = race.finishOrder.length + 1;
      race.finishOrder.push(horse.participantId);
    }

    race.status = "finished";
  }

  getSerializedState(roomCode: string): SerializedRaceState | null {
    const race = this.races.get(roomCode);
    if (!race) return null;

    let timeRemainingMs: number | null = null;
    if (race.status === "racing" && race.startTime) {
      const elapsed = Date.now() - race.startTime;
      timeRemainingMs = Math.max(0, race.raceDurationMs - elapsed);
    } else if (race.status === "finished") {
      timeRemainingMs = 0;
    }

    return {
      status: race.status,
      horses: Array.from(race.horses.values()).map((h) => ({
        participantId: h.participantId,
        displayName: h.displayName,
        progress: h.progress,
        finishPosition: h.finishPosition,
        finished: h.finished,
      })),
      finishOrder: race.finishOrder,
      goal: race.goal,
      raceDurationMs: race.raceDurationMs,
      timeRemainingMs,
    };
  }

  isComplete(roomCode: string): boolean {
    const race = this.races.get(roomCode);
    return race?.status === "finished" || false;
  }

  getFinishOrder(roomCode: string): string[] {
    return this.races.get(roomCode)?.finishOrder || [];
  }

  getRaceDurationMs(roomCode: string): number {
    return this.races.get(roomCode)?.raceDurationMs ?? 30000;
  }

  hasRace(roomCode: string): boolean {
    return this.races.has(roomCode);
  }

  cleanup(roomCode: string): void {
    this.races.delete(roomCode);
  }
}

export const raceManager = new RaceManager();
