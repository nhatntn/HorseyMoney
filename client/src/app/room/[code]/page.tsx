"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { Horse } from "@/components/Horse";
import { FallingPetals } from "@/components/FallingPetals";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const RACE_GOAL = 100;

// ─── Types ────────────────────────────────────────────────────
interface RoomState {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-yellow-400/30 p-8 w-full max-w-sm animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-12 mx-auto mb-3">
            <Horse color="#DC2626" state="idle" />
          </div>
          <h2 className="text-2xl font-bold text-red-700">Tham Gia Đua</h2>
          <p className="text-gray-500 text-sm mt-1">
            Nhập thông tin để tham gia đua ngựa
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên hiển thị của bạn"
            autoFocus
            maxLength={30}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-center text-lg"
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 text-center">
              Giới tính
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
                    : "border-gray-200 text-gray-500 hover:border-red-300"
                    }`}
                >
                  <span className="text-base">{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 text-center">
              Tuổi
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Tuổi của bạn"
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
            className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30"
          >
            {loading ? "Đang vào..." : "🏇 Vào Đua"}
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
              PHI!
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

            <div className="relative">
              <div
                className={`relative h-12 rounded-xl overflow-hidden ${lane.bg} track-lane border ${isMe ? "border-red-300 ring-2 ring-red-200" : lane.border
                  }`}
              >
                <div
                  className={`absolute inset-y-0 left-0 ${lane.fill} opacity-25 transition-all duration-75 ease-linear`}
                  style={{ width: `${pct}%` }}
                />
                <div className="absolute right-0 inset-y-0 w-5 finish-line opacity-50" />

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
    if (navigator.vibrate) navigator.vibrate(10);
    setFlash(true);
    setTimeout(() => setFlash(false), 80);
  }, [onTap, disabled, finished]);

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
      <div className="h-44 bg-gradient-to-b from-green-500 to-green-600 rounded-2xl flex flex-col items-center justify-center select-none shadow-lg">
        <div className="text-5xl mb-2">{medal}</div>
        <div className="text-white text-xl font-bold">
          Bạn về đích {medal}!
        </div>
        <div className="text-white/70 text-sm mt-1">
          Đang chờ người khác...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tapRef}
      onMouseDown={handleTap}
      className={`h-44 rounded-2xl flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-75 shadow-lg ${flash
        ? "bg-gradient-to-b from-amber-600 to-amber-700 scale-[0.97]"
        : "bg-gradient-to-b from-amber-500 to-amber-600"
        }`}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div className="text-5xl mb-1 pointer-events-none">👆</div>
      <div className="text-white text-2xl font-black pointer-events-none">
        BẤM LIÊN TỤC ĐỂ PHI NGỰA!
      </div>
      <div className="text-white/70 text-sm mt-1 pointer-events-none">
        {Math.round((myProgress / goal) * 100)}%
      </div>
    </div>
  );
}

// ─── Voice Area (mic volume → speed) ──────────────────────────
const VOICE_TICK_MS = 100;   // độ khó ~80% so với ban đầu
const VOICE_THRESHOLD = 0.16; // cần la rõ hơn mới cộng
const VOICE_DELTA_MAX = 1;    // mỗi lần +1

function VoiceArea({
  onVoice,
  disabled,
  myProgress,
  goal,
  finished,
  finishPosition,
}: {
  onVoice: (delta: number) => void;
  disabled: boolean;
  myProgress: number;
  goal: number;
  finished: boolean;
  finishPosition: number | null;
}) {
  const [volume, setVolume] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Setup mic and analyser
  useEffect(() => {
    if (finished || disabled) return;
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        src.connect(analyser);
        analyserRef.current = analyser;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;
        setMicError(null);
      } catch (e) {
        if (!cancelled) setMicError("Không truy cập được mic. Cho phép mic và tải lại.");
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      ctxRef.current?.close();
      ctxRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
    };
  }, [finished, disabled]);

  // Tick: read volume, optionally send voice progress
  useEffect(() => {
    if (finished || disabled || !analyserRef.current || !dataArrayRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const n = (dataArray[i] - 128) / 128;
        sum += n * n;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const normalized = Math.min(1, rms * 2.1); // độ khó ~80%
      setVolume(normalized);

      if (normalized > VOICE_THRESHOLD) {
        const delta = 1 + Math.min(VOICE_DELTA_MAX - 1, Math.floor(normalized * VOICE_DELTA_MAX));
        onVoice(delta);
      }
    };

    const id = setInterval(tick, VOICE_TICK_MS);
    return () => clearInterval(id);
  }, [finished, disabled, onVoice]);

  if (finished) {
    const medal =
      finishPosition && finishPosition <= 3
        ? MEDALS[finishPosition - 1]
        : `#${finishPosition}`;
    return (
      <div className="h-44 bg-gradient-to-b from-green-500 to-green-600 rounded-2xl flex flex-col items-center justify-center select-none shadow-lg">
        <div className="text-5xl mb-2">{medal}</div>
        <div className="text-white text-xl font-bold">
          Bạn về đích {medal}!
        </div>
        <div className="text-white/70 text-sm mt-1">
          Đang chờ người khác...
        </div>
      </div>
    );
  }

  return (
    <div className="h-44 rounded-2xl flex flex-col items-center justify-center select-none shadow-lg bg-gradient-to-b from-violet-600 to-violet-700 p-4">
      <div className="text-4xl mb-1">🎤</div>
      <div className="text-white text-lg font-black text-center">
        LA TO VÀO MIC ĐỂ PHI NGỰA!
      </div>
      <p className="text-white/80 text-xs mt-1 text-center">
        Càng to, càng dài hơi → ngựa chạy càng nhanh
      </p>
      <div className="w-full max-w-[200px] h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-75"
          style={{ width: `${Math.round(volume * 100)}%` }}
        />
      </div>
      <div className="text-white/70 text-sm mt-1">
        {Math.round((myProgress / goal) * 100)}%
      </div>
      {micError && (
        <p className="text-red-200 text-xs mt-1 text-center">{micError}</p>
      )}
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
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-5 animate-fade-in">
      <h2 className="font-bold text-amber-800 mb-4 flex items-center gap-2 text-lg">
        <span>🏆</span> Bảng Xếp Hạng
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
                        (bạn)
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

  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [raceState, setRaceState] = useState<RaceState | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [openEnvelopeLoading, setOpenEnvelopeLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const askedMicRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(`tet_participant_${code}`);
    const creatorStored = localStorage.getItem(`creator_${code}`);
    if (stored) {
      setParticipantId(stored);
    } else if (creatorStored) {
      setParticipantId(creatorStored);
      setInitialLoading(false);
    } else {
      setShowJoinModal(true);
      setInitialLoading(false);
    }
  }, [code]);

  useEffect(() => {
    if (!participantId || socketRef.current) return;
    socketRef.current = true;

    const socket = getSocket();
    socket.connect();

    socket.emit("room:subscribe", { roomCode: code, participantId });

    socket.on("room:state", (data: RoomState) => {
      setRoomState(data);
      setInitialLoading(false);
    });

    socket.on("room:update", (data: RoomState) => {
      setRoomState(data);
    });

    socket.on("race:countdown", (data: { count: number }) => {
      setCountdown(data.count);
    });

    socket.on("race:go", (data: RaceState) => {
      setCountdown(0);
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

  // Hỏi quyền microphone sớm khi vào phòng chơi bằng giọng nói (không đợi đến lúc start)
  useEffect(() => {
    if (showJoinModal || !roomState?.room || askedMicRef.current) return;
    const raceMode = roomState.room.raceMode ?? "manual";
    if (raceMode !== "voice") return;

    askedMicRef.current = true;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!cancelled) stream.getTracks().forEach((t) => t.stop());
      })
      .catch(() => {
        // User từ chối hoặc lỗi — VoiceArea sẽ hiển thị micError khi đua
      });

    return () => {
      cancelled = true;
    };
  }, [showJoinModal, roomState]);

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
          setJoinError(data.error || "Không thể vào phòng");
          return;
        }
        localStorage.setItem(`tet_participant_${code}`, data.participantId);
        setParticipantId(data.participantId);
        setShowJoinModal(false);
      } catch {
        setJoinError("Lỗi mạng. Server đang chạy chưa?");
      } finally {
        setJoinLoading(false);
      }
    },
    [code]
  );

  const handleStartRace = useCallback(() => {
    const socket = getSocket();
    const creatorId = localStorage.getItem(`creator_${code}`) || participantId;
    socket.emit("race:start", { roomCode: code, participantId: creatorId });
  }, [code, participantId]);

  const handleOpenEnvelope = useCallback(async () => {
    if (!participantId || openEnvelopeLoading) return;
    setOpenEnvelopeLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/rooms/${code}/open`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể mở bao");
        return;
      }
      // room:update will be emitted by server; refetch state if needed
      const roomRes = await fetch(`${API_URL}/api/rooms/${code}`);
      if (roomRes.ok) setRoomState(await roomRes.json());
    } catch {
      setError("Lỗi mạng");
    } finally {
      setOpenEnvelopeLoading(false);
    }
  }, [code, participantId, openEnvelopeLoading]);

  const handleTap = useCallback(() => {
    if (!raceState || raceState.status !== "racing") return;
    const socket = getSocket();
    socket.emit("race:tap", { roomCode: code, participantId });
  }, [raceState, code, participantId]);

  const handleVoice = useCallback(
    (delta: number) => {
      if (!raceState || raceState.status !== "racing") return;
      const socket = getSocket();
      socket.emit("race:voice", { roomCode: code, participantId, delta });
    },
    [raceState, code, participantId]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Người chưa nhận lì xì (cho vòng đua tiếp / mở bao muộn)
  const withoutEnvelopeCount =
    roomState?.participants.filter((p) => !p.openedAt).length ?? 0;
  const meWithoutEnvelope =
    !!participantId &&
    !roomState?.participants.find((p) => p.id === participantId)?.openedAt;
  const canStartNextRound =
    isCreator &&
    hasResults &&
    roomState &&
    roomState.availableCount > 0 &&
    withoutEnvelopeCount >= 2 &&
    !raceState;
  const showOpenEnvelopeButton =
    meWithoutEnvelope &&
    !!roomState &&
    roomState.availableCount > 0 &&
    withoutEnvelopeCount === 1;

  // Loading state
  if (initialLoading && !showJoinModal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FallingPetals />
        <div className="text-center relative z-20">
          <div className="w-16 h-12 mx-auto animate-float mb-4">
            <Horse color="#FBBF24" state="idle" />
          </div>
          <p className="text-yellow-300/80">Đang tải phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative p-4 pb-8 overflow-hidden">
      {/* Falling Petals */}
      <FallingPetals />

      {/* Join Modal */}
      {showJoinModal && (
        <JoinModal onJoin={handleJoin} loading={joinLoading} error={joinError} />
      )}

      {/* Countdown Overlay */}
      {countdown !== null && <CountdownOverlay count={countdown} />}

      {/* Back button — fixed top-left */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-30 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-yellow-300 hover:text-yellow-200 text-sm font-medium px-4 py-2 rounded-xl border border-yellow-400/30 transition-all duration-200 shadow-lg shadow-black/10"
      >
        ← Về Trang Chủ
      </button>

      <div className="max-w-lg mx-auto relative z-20">
        {/* Header */}
        <div className="text-center mb-5 pt-12">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-10 h-8"><Horse color="#FBBF24" state="running" /></span>
            <h1 className="text-2xl font-bold text-yellow-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              {roomState?.room.name || (<>Horsey Money<br /><span className="text-lg text-yellow-300/80">Mã Đáo Phát Bao</span></>)}
            </h1>
          </div>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className="bg-white/15 text-yellow-300 font-mono text-sm font-bold px-3 py-1 rounded-lg tracking-widest border border-yellow-400/30">
              {code}
            </span>
            <button
              onClick={handleCopy}
              className="text-red-200/70 hover:text-yellow-300 text-sm transition-colors"
            >
              {copied ? "✓ Đã copy!" : "📋 Copy Mã Phòng để mời người khác"}
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/50 text-red-200 text-sm px-4 py-3 rounded-xl border border-red-400/30 mb-4 text-center animate-fade-in">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-300 hover:text-white"
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
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <span className="inline-block w-8 h-6"><Horse color="#374151" state="idle" /></span> Người Chơi
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
                                  (bạn)
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
                        Đang chờ các người chơi tham gia...
                      </p>
                    )}
                  </div>
                </div>

                {/* Start Race Button */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-6 text-center">
                  <div className="flex items-center justify-center gap-3 text-sm mb-2">
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                      🧧 {roomState.totalEnvelopes} bao lì xì
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                      ⏱ {roomState.room.raceDuration}s
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                      {(roomState.room.raceMode ?? "manual") === "voice" ? "🎤 Giọng nói" : "👆 Bằng tay"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">
                    {(roomState.room.raceMode ?? "manual") === "voice"
                      ? "La to vào mic để phi ngựa — càng to càng nhanh!"
                      : "Bấm liên tục để phi ngựa — Về nhất lấy bao lì xì lớn nhất!"}
                  </p>
                  {canStartRace && (
                    <button
                      onClick={handleStartRace}
                      className="bg-gradient-to-r from-red-700 to-amber-500 hover:from-red-800 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg shadow-red-900/30 hover:shadow-xl active:scale-[0.97]"
                    >
                      Bắt Đầu Đua! 🏁
                    </button>
                  )}
                  {notEnoughPlayers && isCreator && (
                    <div className="text-amber-600 text-sm font-medium">
                      Cần ít nhất 2 người chơi để bắt đầu
                    </div>
                  )}
                  {!isCreator && roomState && !raceState && !hasResults && roomState.participants.length >= 2 && (
                    <div className="text-amber-600 text-sm font-medium animate-pulse">
                      Đang chờ host bắt đầu đua...
                    </div>
                  )}
                  {!isCreator && notEnoughPlayers && (
                    <div className="text-amber-600 text-sm font-medium">
                      Đang chờ thêm tay đua tham gia...
                    </div>
                  )}
                  {!participantId && !isCreator && (
                    <p className="text-gray-400 text-sm">
                      Vào phòng để tham gia
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
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span>🏁</span> Đường Đua
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

                  {isInRace &&
                    ((roomState.room.raceMode ?? "manual") === "voice" ? (
                      <VoiceArea
                        onVoice={handleVoice}
                        disabled={raceState.status !== "racing"}
                        myProgress={myProgress}
                        goal={raceState.goal}
                        finished={myFinished}
                        finishPosition={myFinishPosition}
                      />
                    ) : (
                      <TapArea
                        onTap={handleTap}
                        disabled={raceState.status !== "racing"}
                        myProgress={myProgress}
                        goal={raceState.goal}
                        finished={myFinished}
                        finishPosition={myFinishPosition}
                      />
                    ))}

                  {!isInRace && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-yellow-400/20">
                      <div className="text-3xl mb-2">👀</div>
                      <p className="text-yellow-200 font-medium">
                        {isCreator ? "Bạn đang host cuộc đua" : "Bạn đang xem cuộc đua"}
                      </p>
                      <p className="text-red-200/60 text-sm">
                        {isCreator ? "Ngồi lại và xem các tay đua thi đấu!" : "Bạn vào sau khi đua đã bắt đầu"}
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* ─── RACE FINISHED, CALCULATING ─── */}
            {isCalculating && (
              <div className="space-y-4">
                {raceState && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-4">
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>🏁</span> Vị Trí Cuối Cùng
                    </h2>
                    <RaceTrack
                      horses={raceState.horses}
                      myId={participantId}
                      goal={raceState.goal}
                      isRacing={false}
                    />
                  </div>
                )}
                <div className="bg-amber-500/20 backdrop-blur-sm rounded-2xl border border-amber-400/30 p-6 text-center animate-fade-in">
                  <div className="text-4xl animate-float mb-3">🧧</div>
                  <p className="text-yellow-200 font-semibold text-lg">
                    Đang chia lì xì...
                  </p>
                  <p className="text-yellow-300/60 text-sm mt-1">
                    Về nhất nhận bao lớn nhất!
                  </p>
                </div>
              </div>
            )}

            {/* ─── RESULTS ─── */}
            {hasResults && (
              <div className="mt-8 space-y-4">
                {/* Chỉ hiện "Vị Trí Cuối Cùng" khi user tham gia vòng đua đó và đua đã kết thúc — tránh người vào sau thấy 2 khung đua (RACING + RESULTS) */}
                {raceState?.status === "finished" && myHorse && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-4">
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>🏁</span> Vị Trí Cuối Cùng
                    </h2>
                    <RaceTrack
                      horses={raceState.horses}
                      myId={participantId}
                      goal={raceState.goal}
                      isRacing={false}
                    />
                  </div>
                )}

                {participantId && (() => {
                  const myEnvelope = roomState.envelopes.find(
                    (e) => e.participantId === participantId
                  );
                  if (!myEnvelope) return null;
                  return (
                    <div className="bg-gradient-to-b from-red-700 to-red-900 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-yellow-400/30 p-6 text-center animate-scale-in">
                      <div className="text-4xl mb-2">🧧</div>
                      <h3 className="text-amber-200 font-bold text-lg mb-1">
                        Lì Xì Của Bạn
                      </h3>
                      <div className="text-4xl font-black text-yellow-400 mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                        {myEnvelope.amount.toLocaleString()}k ₫
                      </div>
                      <p className="text-white/80 italic text-sm">
                        &ldquo;{myEnvelope.wishText}&rdquo;
                      </p>
                    </div>
                  );
                })()}

                <ResultsView
                  envelopes={roomState.envelopes}
                  myId={participantId}
                />

                {/* Còn bao lì xì — vòng đua tiếp hoặc mở bao (người vào sau) */}
                {roomState.availableCount > 0 && (
                  <div className="bg-amber-50/95 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-5 space-y-3">
                    <p className="text-amber-800 font-medium text-center">
                      🧧 Còn <strong>{roomState.availableCount}</strong> bao lì xì — người vào sau có thể nhận phần còn lại
                    </p>
                    {canStartNextRound && (
                      <div className="text-center">
                        <button
                          onClick={handleStartRace}
                          className="bg-gradient-to-r from-red-700 to-amber-500 hover:from-red-800 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl text-base transition-all shadow-lg"
                        >
                          Bắt đầu vòng đua tiếp ({withoutEnvelopeCount} người chưa nhận)
                        </button>
                      </div>
                    )}
                    {showOpenEnvelopeButton && (
                      <div className="text-center">
                        <button
                          onClick={handleOpenEnvelope}
                          disabled={openEnvelopeLoading}
                          className="bg-gradient-to-r from-red-700 to-amber-500 hover:from-red-800 hover:to-amber-600 disabled:opacity-70 text-white font-bold py-3 px-6 rounded-xl text-base transition-all shadow-lg"
                        >
                          {openEnvelopeLoading ? "Đang mở..." : "Mở bao lì xì 🧧"}
                        </button>
                      </div>
                    )}
                    {meWithoutEnvelope && withoutEnvelopeCount >= 2 && !isCreator && (
                      <p className="text-amber-700 text-sm text-center">
                        Đang chờ host bắt đầu vòng đua tiếp theo để giành bao còn lại...
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Room not found */}
        {!roomState && !initialLoading && !showJoinModal && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="text-xl font-semibold text-yellow-300 mb-2">
              Không tìm thấy phòng
            </h2>
            <p className="text-red-200/70 mb-4">
              Phòng này có thể không tồn tại hoặc đã hết hạn.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors shadow-lg shadow-red-900/30"
            >
              Về Trang Chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
