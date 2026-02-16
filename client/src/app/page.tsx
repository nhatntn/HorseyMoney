"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Horse } from "@/components/Horse";
import { FallingPetals } from "@/components/FallingPetals";
import { getSoundEnabled, setSoundEnabled } from "@/lib/soundPref";

const HOME_BG_MUSIC_URL = "/sounds/race-bg.mp3";

/* ── Inline SVG components for Tết decorations ── */

function CherryBlossom({ className = "", size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <g opacity="0.9">
        <ellipse cx="12" cy="6" rx="3.5" ry="5" fill="#F9A8D4" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="6" rx="3.5" ry="5" fill="#FDA4AF" transform="rotate(72 12 12)" />
        <ellipse cx="12" cy="6" rx="3.5" ry="5" fill="#F9A8D4" transform="rotate(144 12 12)" />
        <ellipse cx="12" cy="6" rx="3.5" ry="5" fill="#FDA4AF" transform="rotate(216 12 12)" />
        <ellipse cx="12" cy="6" rx="3.5" ry="5" fill="#F9A8D4" transform="rotate(288 12 12)" />
        <circle cx="12" cy="12" r="2.5" fill="#FBBF24" />
      </g>
    </svg>
  );
}

function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg width="36" height="60" viewBox="0 0 36 60" className={className} fill="none">
      {/* String */}
      <line x1="18" y1="0" x2="18" y2="10" stroke="#92400E" strokeWidth="1.5" />
      {/* Top cap */}
      <rect x="12" y="9" width="12" height="4" rx="1" fill="#EAB308" />
      {/* Body */}
      <ellipse cx="18" cy="30" rx="16" ry="18" fill="#DC2626" />
      <ellipse cx="18" cy="30" rx="16" ry="18" fill="url(#lanternGrad)" />
      {/* Ribs */}
      <path d="M18 12 L18 48" stroke="#EAB308" strokeWidth="0.8" opacity="0.6" />
      <path d="M10 14 Q18 32 10 46" stroke="#EAB308" strokeWidth="0.6" opacity="0.4" />
      <path d="M26 14 Q18 32 26 46" stroke="#EAB308" strokeWidth="0.6" opacity="0.4" />
      {/* 福 character */}
      <text x="18" y="34" textAnchor="middle" fill="#FBBF24" fontSize="14" fontWeight="bold" fontFamily="serif">福</text>
      {/* Bottom cap */}
      <rect x="13" y="46" width="10" height="3" rx="1" fill="#EAB308" />
      {/* Tassel */}
      <line x1="16" y1="49" x2="15" y2="57" stroke="#EAB308" strokeWidth="1.2" />
      <line x1="18" y1="49" x2="18" y2="58" stroke="#EAB308" strokeWidth="1.2" />
      <line x1="20" y1="49" x2="21" y2="57" stroke="#EAB308" strokeWidth="1.2" />
      <defs>
        <radialGradient id="lanternGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Sparkle({ className = "", size = 12 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z"
        fill="#FBBF24"
        opacity="0.8"
      />
    </svg>
  );
}

function EnvelopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" className={className} fill="none">
      {/* Envelope body */}
      <rect x="3" y="6" width="26" height="20" rx="3" fill="#DC2626" />
      {/* Gold flap */}
      <path d="M3 9L16 18L29 9V6H3Z" fill="#EAB308" opacity="0.9" />
      {/* 福 */}
      <text x="16" y="23" textAnchor="middle" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="serif">福</text>
      {/* Gold border */}
      <rect x="3" y="6" width="26" height="20" rx="3" stroke="#EAB308" strokeWidth="1" fill="none" />
    </svg>
  );
}

/* ── Petal positions now in shared FallingPetals component ── */

export default function HomePage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [soundOn, setSoundOn] = useState(() => (typeof window !== "undefined" ? getSoundEnabled() : true));
  const homeBgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Nhạc nền: tự phát khi trang home load xong (nếu đang bật sound)
  useEffect(() => {
    if (!soundOn) {
      if (homeBgAudioRef.current) {
        homeBgAudioRef.current.pause();
        homeBgAudioRef.current.currentTime = 0;
      }
      return;
    }
    const audio = new Audio(HOME_BG_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.6;
    homeBgAudioRef.current = audio;
    // Phát ngay khi trang đã load (trình duyệt có thể chặn autoplay cho đến khi user tương tác)
    const playWhenReady = () => {
      audio.play().catch(() => {});
    };
    if (document.readyState === "complete") {
      playWhenReady();
    } else {
      window.addEventListener("load", playWhenReady, { once: true });
    }
    return () => {
      window.removeEventListener("load", playWhenReady);
      audio.pause();
      audio.currentTime = 0;
      homeBgAudioRef.current = null;
    };
  }, [soundOn]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      setError("Please enter a room code");
      return;
    }
    router.push(`/room/${code}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ═══ Falling Cherry Blossom Petals ═══ */}
      <FallingPetals />

      {/* Nút bật/tắt âm thanh — góc dưới phải */}
      <button
        type="button"
        onClick={toggleSound}
        className="fixed bottom-6 right-6 z-30 w-11 h-11 flex items-center justify-center rounded-xl border border-yellow-400/30 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-yellow-300 hover:text-yellow-200 transition-all duration-200 shadow-lg shadow-black/10"
        title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
        aria-label={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
      >
        {soundOn ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
        )}
      </button>

      {/* ═══ Lanterns ═══ */}
      <div className="fixed top-0 left-4 sm:left-8 z-10 lantern">
        <Lantern />
      </div>
      <div className="fixed top-0 right-4 sm:right-8 z-10 lantern lantern-delay">
        <Lantern />
      </div>

      {/* ═══ Sparkles scattered ═══ */}
      <div className="fixed top-20 left-[20%] sparkle sparkle-delay-1 z-0">
        <Sparkle size={10} />
      </div>
      <div className="fixed top-40 right-[15%] sparkle sparkle-delay-2 z-0">
        <Sparkle size={14} />
      </div>
      <div className="fixed bottom-32 left-[12%] sparkle sparkle-delay-3 z-0">
        <Sparkle size={8} />
      </div>
      <div className="fixed bottom-20 right-[22%] sparkle sparkle-delay-4 z-0">
        <Sparkle size={12} />
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">

          {/* ── Header ── */}
          <div className="text-center mb-8 animate-bounce-in">
            {/* Decorative top border */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-500/70"></div>
              <span className="text-yellow-400/90 text-xs tracking-[0.3em] uppercase font-semibold">Chúc Mừng Năm Mới</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-500/70"></div>
            </div>

            {/* Horse */}
            <div className="w-28 h-20 mx-auto mb-3 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">
              <Horse color="#FBBF24" state="running" />
            </div>

            {/* Title */}
            <h1 className="text-5xl font-extrabold mb-1 text-shimmer drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Horsey Money
            </h1>
            <p className="text-2xl font-bold text-yellow-400 mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
              🧧 Mã Đáo Phát Bao 🧧
            </p>
            <p className="text-red-100/90 text-base">
              Phi ngựa giật bao lì xì may mắn!
            </p>

            {/* Decorative bottom */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <CherryBlossom size={20} />
              <span className="text-yellow-500">✦</span>
              <CherryBlossom size={16} />
              <span className="text-yellow-500">✦</span>
              <CherryBlossom size={20} />
            </div>
          </div>

          {/* ── Create Room Card ── */}
          <div className="relative bg-gradient-to-br from-white/95 to-yellow-50/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-6 mb-4 animate-bounce-in-delay-1 group hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:border-yellow-400/50 transition-all duration-300">
            {/* Corner ornament */}
            <div className="absolute -top-2 -right-2 opacity-80">
              <CherryBlossom size={24} />
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shadow-sm">
                <EnvelopeIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-800">
                  Tạo Phòng Đua
                </h2>
                <p className="text-xs text-red-400">
                  Chuẩn bị bao lì xì & đua ngựa nào!
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/create")}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>🏇</span>
              Tạo Phòng
            </button>
          </div>

          {/* ── Join Room Card ── */}
          <div className="relative bg-gradient-to-br from-white/95 to-yellow-50/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-6 animate-bounce-in-delay-2 group hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:border-yellow-400/50 transition-all duration-300">
            {/* Corner ornament */}
            <div className="absolute -top-2 -left-2 opacity-80">
              <CherryBlossom size={24} />
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl shadow-sm">
                🎯
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-800">
                  Vào Phòng
                </h2>
                <p className="text-xs text-amber-500">
                  Nhập mã phòng để tham gia
                </p>
              </div>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="Nhập mã phòng (VD: 8K2F9A)"
                className="w-full px-4 py-3 border border-amber-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center text-lg font-mono tracking-widest uppercase placeholder:text-sm placeholder:tracking-normal placeholder:font-sans shadow-inner"
                maxLength={6}
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/30 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>🎪</span>
                Vào Phòng
              </button>
            </form>
          </div>

          {/* ── Footer ── */}
          <div className="text-center mt-8 animate-bounce-in-delay-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-500/40"></div>
              <span className="text-2xl">🧧</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-500/40"></div>
            </div>
            <p className="text-yellow-300/90 text-sm font-medium">
              Chúc Mừng Năm Mới 🎊 Phát Tài Phát Lộc
            </p>
            <p className="text-red-300/50 text-xs mt-1">
              Năm Bính Ngọ 2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
