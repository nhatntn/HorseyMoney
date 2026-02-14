"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { Horse } from "@/components/Horse";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const RACE_GOAL = 100;

// ─── Types ────────────────────────────────────────────────────
interface RoomState {
  room: {
    id: string;
    code: string;
    name: string | null;
    maxPeople: number;
    wishTone: string;
    raceDuration: number;
    creatorId: string | null;
  };
  participants: Array<{
    id: string;
    displayName: string;
    gender: string;
    age: number | null;
    openedAt: string | null;
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

interface RaceHorse {
  participantId: string;
  displayName: string;
  progress: number;
  finishPosition: number | null;
  finished: boolean;
}

interface RaceState {
  status: "waiting" | "racing" | "finished";
  horses: RaceHorse[];
  finishOrder: string[];
  goal: number;
  raceDurationMs: number;
  timeRemainingMs: number | null;
}

const LANE_COLORS = [
  { bg: "bg-red-100", fill: "bg-red-500", border: "border-red-200", horse: "#DC2626" },
  { bg: "bg-blue-100", fill: "bg-blue-500", border: "border-blue-200", horse: "#2563EB" },
  { bg: "bg-emerald-100", fill: "bg-emerald-500", border: "border-emerald-200", horse: "#059669" },
  { bg: "bg-purple-100", fill: "bg-purple-500", border: "border-purple-200", horse: "#7C3AED" },
  { bg: "bg-orange-100", fill: "bg-orange-500", border: "border-orange-200", horse: "#EA580C" },
  { bg: "bg-pink-100", fill: "bg-pink-500", border: "border-pink-200", horse: "#DB2777" },
  { bg: "bg-cyan-100", fill: "bg-cyan-500", border: "border-cyan-200", horse: "#0891B2" },
  { bg: "bg-amber-100", fill: "bg-amber-500", border: "border-amber-200", horse: "#D97706" },
  { bg: "bg-indigo-100", fill: "bg-indigo-500", border: "border-indigo-200", horse: "#4F46E5" },
  { bg: "bg-teal-100", fill: "bg-teal-500", border: "border-teal-200", horse: "#0D9488" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

// ─── Join Modal ───────────────────────────────────────────────
function JoinModal({
  onJoin,
  loading,
  error,
}: {
  onJoin: (name: string, gender: string, age: string) => void;
  loading: boolean;
  error: string;
}) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("other");
  const [age, setAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim(), gender, age);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-12 mx-auto mb-3">
            <Horse color="#DC2626" state="idle" />
          </div>
          <h2 className="text-2xl font-bold text-red-700">Join the Race</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your info to join the horse race
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
            autoFocus
            maxLength={30}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-center text-lg"
          />

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 text-center">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "male", label: "Nam", icon: "♂" },
                { value: "female", label: "Nữ", icon: "♀" },
                { value: "other", label: "Khác", icon: "⚧" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(opt.value)}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${gender === opt.value
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                >
                  <span className="text-base">{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 text-center">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              min={1}
              max={120}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-center text-lg"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            {loading ? "Joining..." : "Join Race"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Countdown Overlay ────────────────────────────────────────
function CountdownOverlay({ count }: { count: number }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div
        key={count}
        className="animate-scale-in text-center"
      >
        {count > 0 ? (
          <div className="text-[10rem] font-black text-white drop-shadow-2xl leading-none">
            {count}
          </div>
        ) : (
          <div>
            <div className="text-8xl font-black text-amber-400 drop-shadow-2xl">
              GO!
            </div>
            <div className="w-16 h-12 mx-auto mt-4">
              <Horse color="#F59E0B" state="running" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Race Timer ───────────────────────────────────────────────
function RaceTimer({ timeRemainingMs }: { timeRemainingMs: number | null }) {
  if (timeRemainingMs === null) return null;

  const totalSeconds = Math.ceil(timeRemainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isUrgent = totalSeconds <= 10;
  const isCritical = totalSeconds <= 5;

  return (
    <div
      className={`font-mono text-sm font-bold px-3 py-1 rounded-lg transition-colors ${isCritical
        ? "bg-red-100 text-red-700 animate-pulse"
        : isUrgent
          ? "bg-amber-100 text-amber-700"
          : "bg-gray-100 text-gray-600"
        }`}
    >
      ⏱ {minutes > 0 ? `${minutes}:` : ""}{seconds.toString().padStart(minutes > 0 ? 2 : 1, "0")}s
    </div>
  );
}

// ─── Race Track ───────────────────────────────────────────────
function RaceTrack({
  horses,
  myId,
  goal,
  isRacing,
}: {
  horses: RaceHorse[];
  myId: string | null;
  goal: number;
  isRacing: boolean;
}) {
  // Sort: current user's horse first, then by progress descending
  const sorted = [...horses].sort((a, b) => {
    if (a.participantId === myId) return -1;
    if (b.participantId === myId) return 1;
    return b.progress - a.progress;
  });

  return (
    <div className="space-y-5">
      {sorted.map((horse) => {
        const isMe = horse.participantId === myId;
        const laneIdx = horses.findIndex(
          (h) => h.participantId === horse.participantId
        );
        const lane = LANE_COLORS[laneIdx % LANE_COLORS.length];
        const pct = Math.min((horse.progress / goal) * 100, 100);
        const isRunning = isRacing && !horse.finished;

        return (
          <div key={horse.participantId}>
            {/* Name row */}
            <div className="flex items-center justify-between text-sm mb-1 px-1">
              <span className={`font-semibold ${isMe ? "text-red-700" : "text-gray-700"}`}>
                {isMe && "⭐ "}
                {horse.displayName}
                {horse.finished && (
                  <span className="ml-1.5">
                    {MEDALS[(horse.finishPosition ?? 1) - 1] ??
                      `#${horse.finishPosition}`}
                  </span>
                )}
              </span>
              <span className="text-gray-400 font-mono text-xs">
                {Math.round((horse.progress / goal) * 100)}%
              </span>
            </div>

            {/* Lane wrapper — track inside, horse on top */}
            <div className="relative">
              {/* Track background (overflow-hidden for fill + finish line) */}
              <div
                className={`relative h-12 rounded-xl overflow-hidden ${lane.bg} track-lane border ${isMe ? "border-red-300 ring-2 ring-red-200" : lane.border
                  }`}
              >
                {/* Progress fill */}
                <div
                  className={`absolute inset-y-0 left-0 ${lane.fill} opacity-25 transition-all duration-75 ease-linear`}
                  style={{ width: `${pct}%` }}
                />
                {/* Finish line */}
                <div className="absolute right-0 inset-y-0 w-5 finish-line opacity-50" />

                {/* Dust trail particles */}
                {isRunning && pct > 4 && (
                  <>
                    <div
                      className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-amber-700/30 animate-dust-1"
                      style={{ left: `calc(${pct}% - 36px)` }}
                    />
                    <div
                      className="absolute top-1/2 w-2 h-2 rounded-full bg-amber-600/25 animate-dust-2"
                      style={{ left: `calc(${pct}% - 44px)` }}
                    />
                    <div
                      className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-amber-500/20 animate-dust-3"
                      style={{ left: `calc(${pct}% - 50px)` }}
                    />
                  </>
                )}
              </div>

              {/* Horse + jockey SVG — outside overflow-hidden for full visibility */}
              <div
                className="absolute z-10 pointer-events-none transition-all duration-75 ease-linear"
                style={{
                  left: `calc(${pct}% - ${pct > 5 ? 30 : 4}px)`,
                  top: "50%",
                  transform: "translateY(-58%)",
                  width: "60px",
                }}
              >
                <Horse
                  color={lane.horse}
                  state={isRunning ? "running" : horse.finished ? "finished" : "idle"}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tap Area ─────────────────────────────────────────────────
function TapArea({
  onTap,
  disabled,
  myProgress,
  goal,
  finished,
  finishPosition,
}: {
  onTap: () => void;
  disabled: boolean;
  myProgress: number;
  goal: number;
  finished: boolean;
  finishPosition: number | null;
}) {
  const [flash, setFlash] = useState(false);
  const tapRef = useRef<HTMLDivElement>(null);

  const handleTap = useCallback(() => {
    if (disabled || finished) return;
    onTap();
    // Haptic feedback (Android)
    if (navigator.vibrate) navigator.vibrate(10);
    setFlash(true);
    setTimeout(() => setFlash(false), 80);
  }, [onTap, disabled, finished]);

  // Use touchstart for faster response on mobile
  useEffect(() => {
    const el = tapRef.current;
    if (!el) return;

    const touchHandler = (e: TouchEvent) => {
      e.preventDefault();
      handleTap();
    };

    el.addEventListener("touchstart", touchHandler, { passive: false });
    return () => el.removeEventListener("touchstart", touchHandler);
  }, [handleTap]);

  if (finished) {
    const medal =
      finishPosition && finishPosition <= 3
        ? MEDALS[finishPosition - 1]
        : `#${finishPosition}`;
    return (
      <div className="h-44 bg-gradient-to-b from-green-500 to-green-600 rounded-2xl flex flex-col items-center justify-center select-none">
        <div className="text-5xl mb-2">{medal}</div>
        <div className="text-white text-xl font-bold">
          You finished {medal}!
        </div>
        <div className="text-white/70 text-sm mt-1">
          Waiting for others...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tapRef}
      onMouseDown={handleTap}
      className={`h-44 rounded-2xl flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-75 ${flash
        ? "bg-gradient-to-b from-red-700 to-red-800 scale-[0.97]"
        : "bg-gradient-to-b from-red-500 to-red-600"
        }`}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div className="text-5xl mb-1 pointer-events-none">👆</div>
      <div className="text-white text-2xl font-black pointer-events-none">
        TAP TO RUN!
      </div>
      <div className="text-white/70 text-sm mt-1 pointer-events-none">
        {Math.round((myProgress / goal) * 100)}%
      </div>
    </div>
  );
}

// ─── Results View ─────────────────────────────────────────────
function ResultsView({
  envelopes,
  myId,
}: {
  envelopes: RoomState["envelopes"];
  myId: string | null;
}) {
  const sorted = [...envelopes].sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 p-5 animate-fade-in">
      <h2 className="font-bold text-amber-800 mb-4 flex items-center gap-2 text-lg">
        <span>🏆</span> Race Results
      </h2>
      <div className="space-y-2.5">
        {sorted.map((envelope, index) => {
          const medal = MEDALS[index] ?? `#${index + 1}`;
          const isMe = envelope.participantId === myId;

          return (
            <div
              key={envelope.participantId}
              className={`rounded-xl p-3.5 text-sm ${isMe
                ? "bg-amber-50 border-2 border-amber-300 shadow-sm"
                : "bg-gray-50 border border-gray-100"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl w-8 text-center">{medal}</span>
                  <span className="font-semibold text-gray-800">
                    {envelope.displayName}
                    {isMe && (
                      <span className="text-amber-500 font-normal ml-1">
                        (you)
                      </span>
                    )}
                  </span>
                </div>
                <span className="font-bold text-amber-600 text-lg">
                  {envelope.amount.toLocaleString()}k ₫
                </span>
              </div>
              <p className="text-gray-500 italic text-xs mt-1.5 ml-10">
                &ldquo;{envelope.wishText}&rdquo;
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Room Page ───────────────────────────────────────────
export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string)?.toUpperCase();
  const socketRef = useRef(false);

  // Core state
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [raceState, setRaceState] = useState<RaceState | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  // UI state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`tet_participant_${code}`);
    const creatorStored = localStorage.getItem(`creator_${code}`);
    if (stored) {
      setParticipantId(stored);
    } else if (creatorStored) {
      // Host-only mode: creator doesn't race but can control the room
      setParticipantId(creatorStored);
      setInitialLoading(false);
    } else {
      setShowJoinModal(true);
      setInitialLoading(false);
    }
  }, [code]);

  // Socket connection
  useEffect(() => {
    if (!participantId || socketRef.current) return;
    socketRef.current = true;

    const socket = getSocket();
    socket.connect();

    socket.emit("room:subscribe", { roomCode: code, participantId });

    // Room events
    socket.on("room:state", (data: RoomState) => {
      setRoomState(data);
      setInitialLoading(false);
    });

    socket.on("room:update", (data: RoomState) => {
      setRoomState(data);
    });

    // Race events
    socket.on("race:countdown", (data: { count: number }) => {
      setCountdown(data.count);
    });

    socket.on("race:go", (data: RaceState) => {
      setCountdown(0); // Show "GO!"
      setRaceState(data);
      setTimeout(() => setCountdown(null), 700);
    });

    socket.on("race:progress", (data: RaceState) => {
      setRaceState(data);
    });

    socket.on("race:complete", (data: RaceState) => {
      setRaceState(data);
    });

    socket.on("room:error", (data: { message: string }) => {
      setError(data.message);
      setInitialLoading(false);
    });

    return () => {
      socket.off("room:state");
      socket.off("room:update");
      socket.off("race:countdown");
      socket.off("race:go");
      socket.off("race:progress");
      socket.off("race:complete");
      socket.off("room:error");
      socket.disconnect();
      socketRef.current = false;
    };
  }, [participantId, code]);

  // Fallback REST fetch if socket didn't deliver
  useEffect(() => {
    if (roomState || !participantId) return;

    const timeout = setTimeout(async () => {
      if (roomState) return;
      try {
        const res = await fetch(`${API_URL}/api/rooms/${code}`);
        if (res.ok) {
          const data = await res.json();
          setRoomState(data);
        }
      } catch {
        // Socket should recover
      } finally {
        setInitialLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [roomState, participantId, code]);

  // Join handler
  const handleJoin = useCallback(
    async (displayName: string, gender: string, age: string) => {
      setJoinLoading(true);
      setJoinError("");
      try {
        const res = await fetch(`${API_URL}/api/rooms/${code}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName, gender, age: age || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setJoinError(data.error || "Failed to join room");
          return;
        }
        localStorage.setItem(`tet_participant_${code}`, data.participantId);
        setParticipantId(data.participantId);
        setShowJoinModal(false);
      } catch {
        setJoinError("Network error. Is the server running?");
      } finally {
        setJoinLoading(false);
      }
    },
    [code]
  );

  // Start race handler
  const handleStartRace = useCallback(() => {
    const socket = getSocket();
    const creatorId = localStorage.getItem(`creator_${code}`) || participantId;
    socket.emit("race:start", { roomCode: code, participantId: creatorId });
  }, [code, participantId]);

  // Tap handler
  const handleTap = useCallback(() => {
    if (!raceState || raceState.status !== "racing") return;
    const socket = getSocket();
    socket.emit("race:tap", { roomCode: code, participantId });
  }, [raceState, code, participantId]);

  // Copy room code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Derived state
  const hasResults = roomState && roomState.envelopes.length > 0;
  const isRacing =
    raceState &&
    (raceState.status === "racing" || raceState.status === "waiting");
  const raceFinished = raceState?.status === "finished";
  const isCalculating = raceFinished && !hasResults;

  const myHorse = raceState?.horses.find(
    (h) => h.participantId === participantId
  );

  const isInRace = !!myHorse;
  const myFinished = myHorse?.finished ?? false;
  const myProgress = myHorse?.progress ?? 0;
  const myFinishPosition = myHorse?.finishPosition ?? null;

  const storedCreatorId = typeof window !== "undefined" ? localStorage.getItem(`creator_${code}`) : null;
  const isCreator = !!(
    storedCreatorId &&
    roomState?.room.creatorId &&
    storedCreatorId === roomState.room.creatorId
  );

  const canStartRace =
    isCreator &&
    roomState &&
    !raceState &&
    !hasResults &&
    roomState.participants.length >= 2;

  const notEnoughPlayers =
    roomState && !hasResults && !raceState && roomState.participants.length < 2;

  // Loading state
  if (initialLoading && !showJoinModal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-12 mx-auto animate-float mb-4">
            <Horse color="#DC2626" state="idle" />
          </div>
          <p className="text-gray-500">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Join Modal */}
      {showJoinModal && (
        <JoinModal onJoin={handleJoin} loading={joinLoading} error={joinError} />
      )}

      {/* Countdown Overlay */}
      {countdown !== null && <CountdownOverlay count={countdown} />}

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-5 pt-3">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-gray-600 text-sm mb-2 inline-block"
          >
            ← Home
          </button>
          <h1 className="text-2xl font-bold text-red-700 flex items-center justify-center gap-2">
            <span className="inline-block w-10 h-8"><Horse color="#DC2626" state="idle" /></span>
            {roomState?.room.name || "Horsey Money - Mã Đáo Để Phát Bao"}
          </h1>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className="bg-red-100 text-red-700 font-mono text-sm font-bold px-3 py-1 rounded-lg tracking-widest">
              {code}
            </span>
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-red-500 text-sm transition-colors"
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 mb-4 text-center animate-fade-in">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {roomState && (
          <>
            {/* ─── LOBBY (waiting for race) ─── */}
            {!raceState && !hasResults && (
              <div className="space-y-4">
                {/* Participants */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <span className="inline-block w-8 h-6"><Horse color="#374151" state="idle" /></span> Riders
                    </h2>
                    <span className="text-sm text-gray-500">
                      {roomState.participants.length}/
                      {roomState.room.maxPeople}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {roomState.participants.map((p, idx) => {
                      const lane =
                        LANE_COLORS[idx % LANE_COLORS.length];
                      return (
                        <div
                          key={p.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${lane.bg} border ${lane.border}`}
                        >
                          <span className="inline-block w-12 h-9 flex-shrink-0"><Horse color={lane.horse} state="idle" /></span>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-700">
                              {p.displayName}
                              {p.id === participantId && (
                                <span className="text-gray-400 font-normal ml-1">
                                  (you)
                                </span>
                              )}
                            </span>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {p.gender === "male" ? "♂ Nam" : p.gender === "female" ? "♀ Nữ" : "⚧ Khác"}
                              {p.age && <span className="ml-1.5">• {p.age} tuổi</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {roomState.participants.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">
                        Waiting for riders to join...
                      </p>
                    )}
                  </div>
                </div>

                {/* Start Race Button */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                  <div className="flex items-center justify-center gap-3 text-sm mb-2">
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                      🧧 {roomState.totalEnvelopes} envelopes
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                      ⏱ {roomState.room.raceDuration}s race
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">
                    Tap rapidly to race your horse — 1st place gets the
                    highest amount!
                  </p>
                  {canStartRace && (
                    <button
                      onClick={handleStartRace}
                      className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-200 active:scale-[0.97]"
                    >
                      Start Race! 🏁
                    </button>
                  )}
                  {notEnoughPlayers && isCreator && (
                    <div className="text-amber-600 text-sm font-medium">
                      Need at least 2 riders to start the race
                    </div>
                  )}
                  {!isCreator && roomState && !raceState && !hasResults && roomState.participants.length >= 2 && (
                    <div className="text-amber-600 text-sm font-medium animate-pulse">
                      Waiting for host to start the race...
                    </div>
                  )}
                  {!isCreator && notEnoughPlayers && (
                    <div className="text-amber-600 text-sm font-medium">
                      Waiting for more riders to join...
                    </div>
                  )}
                  {!participantId && !isCreator && (
                    <p className="text-gray-400 text-sm">
                      Join the room to participate
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ─── RACING ─── */}
            {raceState &&
              (raceState.status === "racing" ||
                raceState.status === "waiting") && (
                <div className="space-y-4">
                  {/* Race Track */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span>🏁</span> Race Track
                      </h2>
                      <RaceTimer timeRemainingMs={raceState.timeRemainingMs} />
                    </div>
                    <RaceTrack
                      horses={raceState.horses}
                      myId={participantId}
                      goal={raceState.goal}
                      isRacing={raceState.status === "racing"}
                    />
                  </div>

                  {/* Tap Area */}
                  {isInRace && (
                    <TapArea
                      onTap={handleTap}
                      disabled={raceState.status !== "racing"}
                      myProgress={myProgress}
                      goal={raceState.goal}
                      finished={myFinished}
                      finishPosition={myFinishPosition}
                    />
                  )}

                  {!isInRace && (
                    <div className="bg-gray-100 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-2">👀</div>
                      <p className="text-gray-600 font-medium">
                        {isCreator ? "You're hosting the race" : "You're watching the race"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {isCreator ? "Sit back and watch the riders compete!" : "You joined after the race started"}
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* ─── RACE FINISHED, CALCULATING ─── */}
            {isCalculating && (
              <div className="space-y-4">
                {/* Final track */}
                {raceState && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4">
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>🏁</span> Final Positions
                    </h2>
                    <RaceTrack
                      horses={raceState.horses}
                      myId={participantId}
                      goal={raceState.goal}
                      isRacing={false}
                    />
                  </div>
                )}
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 text-center animate-fade-in">
                  <div className="text-4xl animate-float mb-3">🧧</div>
                  <p className="text-amber-800 font-semibold text-lg">
                    Assigning envelopes...
                  </p>
                  <p className="text-amber-600 text-sm mt-1">
                    1st place gets the highest amount!
                  </p>
                </div>
              </div>
            )}

            {/* ─── RESULTS ─── */}
            {hasResults && (
              <div className="space-y-4">
                {/* Final track (if race data still available) */}
                {raceState && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4">
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>🏁</span> Final Positions
                    </h2>
                    <RaceTrack
                      horses={raceState.horses}
                      myId={participantId}
                      goal={raceState.goal}
                      isRacing={false}
                    />
                  </div>
                )}

                {/* My result highlight */}
                {participantId && (() => {
                  const myEnvelope = roomState.envelopes.find(
                    (e) => e.participantId === participantId
                  );
                  if (!myEnvelope) return null;
                  return (
                    <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-2xl shadow-lg p-6 text-center animate-scale-in">
                      <div className="text-4xl mb-2">🧧</div>
                      <h3 className="text-amber-200 font-bold text-lg mb-1">
                        Your Lì Xì
                      </h3>
                      <div className="text-4xl font-black text-amber-300 mb-2">
                        {myEnvelope.amount.toLocaleString()}k ₫
                      </div>
                      <p className="text-white/80 italic text-sm">
                        &ldquo;{myEnvelope.wishText}&rdquo;
                      </p>
                    </div>
                  );
                })()}

                {/* Full leaderboard */}
                <ResultsView
                  envelopes={roomState.envelopes}
                  myId={participantId}
                />
              </div>
            )}
          </>
        )}

        {/* Room not found */}
        {!roomState && !initialLoading && !showJoinModal && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Room not found
            </h2>
            <p className="text-gray-500 mb-4">
              This room may not exist or has expired.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
