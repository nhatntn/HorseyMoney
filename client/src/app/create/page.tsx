"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FallingPetals } from "@/components/FallingPetals";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Mệnh giá nhanh: bội số 10k từ 10k tới 200k, cộng thêm 500k
const QUICK_AMOUNTS = [
  ...Array.from({ length: 20 }, (_, i) => 10 + i * 10), // 10, 20, ..., 200
  500,
];

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [maxPeople, setMaxPeople] = useState("10");
  const [amountsCsv, setAmountsCsv] = useState("50,60,70,80,90,100,110,110,120,150");
  const [raceDuration, setRaceDuration] = useState("30");
  const [raceMode, setRaceMode] = useState<"manual" | "voice">("manual");
  const [creatorJoin, setCreatorJoin] = useState(true);
  const [creatorName, setCreatorName] = useState("");
  const [creatorGender, setCreatorGender] = useState("other");
  const [creatorAge, setCreatorAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedAmounts = amountsCsv
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0);

  const totalAmount = parsedAmounts.reduce((sum, n) => sum + n, 0);

  const appendAmount = (amount: number) => {
    const trimmed = amountsCsv.trim();
    if (!trimmed) {
      setAmountsCsv(String(amount));
      return;
    }
    const hasTrailingComma = /,\s*$/.test(trimmed);
    setAmountsCsv(hasTrailingComma ? `${trimmed}${amount}` : `${trimmed},${amount}`);
  };

  const removeAmountAt = (index: number) => {
    const next = parsedAmounts.filter((_, i) => i !== index);
    setAmountsCsv(next.join(","));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (parsedAmounts.length === 0) {
      setError("Vui lòng nhập ít nhất một mệnh giá hợp lệ");
      return;
    }

    if (!maxPeople || parseInt(maxPeople) < 1) {
      setError("Số người tối đa phải ít nhất là 1");
      return;
    }

    if (creatorJoin && !creatorName.trim()) {
      setError("Vui lòng nhập tên hiển thị để tham gia đua");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName, maxPeople, amountsCsv, raceDuration, raceMode,
          creatorJoin, creatorName: creatorName.trim(), creatorGender, creatorAge: creatorAge || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.details || data.error || "Tạo phòng thất bại");
        return;
      }

      // Save creator info to localStorage
      if (data.creatorId) {
        localStorage.setItem(`creator_${data.roomCode}`, data.creatorId);
        if (creatorJoin) {
          localStorage.setItem(`tet_participant_${data.roomCode}`, data.creatorId);
        }
      }

      router.push(`/room/${data.roomCode}`);
    } catch {
      setError("Lỗi mạng. Server đang chạy chưa?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* ═══ Falling Cherry Blossom Petals ═══ */}
      <FallingPetals />

      {/* Back button — fixed top-left */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-30 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-yellow-300 hover:text-yellow-200 text-sm font-medium px-4 py-2 rounded-xl border border-yellow-400/30 transition-all duration-200 shadow-lg shadow-black/10"
      >
        ← Về Trang Chủ
      </button>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🧧</div>
          <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">Tạo Phòng Đua</h1>
          <p className="text-red-200/80 mt-1">
            Chuẩn bị bao lì xì cho nhóm của bạn
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-yellow-400/30 p-6 space-y-5"
        >
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Phòng{" "}
              <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="VD: Đội Nhà Nghèo Nhưng Giàu Tình Cảm"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Max People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số Người Tối Đa
            </label>
            <input
              type="number"
              value={maxPeople}
              onChange={(e) => setMaxPeople(e.target.value)}
              min={1}
              max={100}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mệnh Giá Lì Xì{" "}
              <span className="text-gray-400 font-normal">
                (cách nhau bởi dấu phẩy, đơn vị: nghìn VND)
              </span>
            </label>
            <textarea
              value={amountsCsv}
              onChange={(e) => setAmountsCsv(e.target.value)}
              placeholder="50,60,70,80,90,100,110,110,120,150"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent font-mono text-sm"
            />
            {parsedAmounts.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                {parsedAmounts.map((amount, i) => (
                  <span
                    key={`${i}-${amount}`}
                    className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 text-xs font-medium pl-2 pr-1 py-1 rounded-lg border border-amber-200"
                  >
                    {amount.toLocaleString()}k
                    <button
                      type="button"
                      onClick={() => removeAmountAt(i)}
                      className="ml-0.5 w-5 h-5 rounded-full hover:bg-amber-200/80 text-amber-600 hover:text-amber-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-0"
                      aria-label="Xoá bao này"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {parsedAmounts.length > 0 && (
              <div className="mt-2">
                <span className="inline-block bg-red-50 text-red-700 text-xs font-semibold px-2 py-1 rounded-lg border border-red-200">
                  Tổng: {totalAmount.toLocaleString()}k VND • {parsedAmounts.length} bao
                </span>
              </div>
            )}
            <p className="text-xs text-gray-500 mb-1.5 mt-2">Thêm nhanh — bấm để thêm 1 bao:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => appendAmount(amount)}
                  className="min-w-[2.75rem] px-2.5 py-1.5 rounded-lg border-2 border-amber-200 bg-amber-50/80 hover:border-amber-400 hover:bg-amber-100 text-amber-800 text-sm font-medium transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
                >
                  {amount}k
                </button>
              ))}
            </div>
          </div>

          {/* Race Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời Gian Đua
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "15", label: "15s" },
                { value: "30", label: "30s" },
                { value: "45", label: "45s" },
                { value: "60", label: "60s" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRaceDuration(option.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    raceDuration === option.value
                      ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                      : "border-gray-200 hover:border-red-300 text-gray-600"
                  }`}
                >
                  <span className="text-lg font-bold">{option.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Giới hạn thời gian đua. Ai chưa về đích sẽ xếp hạng theo tiến độ.
            </p>
          </div>

          {/* Race Mode: Manual vs Voice */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thể thức phi ngựa
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRaceMode("manual")}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  raceMode === "manual"
                    ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                    : "border-gray-200 hover:border-red-300 text-gray-600"
                }`}
              >
                <div className="text-sm font-medium">👆 Bằng tay</div>
                <div className="text-xs text-gray-500 mt-0.5">Bấm liên tục để phi</div>
              </button>
              <button
                type="button"
                onClick={() => setRaceMode("voice")}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  raceMode === "voice"
                    ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                    : "border-gray-200 hover:border-red-300 text-gray-600"
                }`}
              >
                <div className="text-sm font-medium">🎤 Bằng giọng nói</div>
                <div className="text-xs text-gray-500 mt-0.5">La to vào mic để tăng tốc</div>
              </button>
            </div>
          </div>

          {/* Creator Join Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bạn Có Tham Gia Đua Không?
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setCreatorJoin(true)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  creatorJoin
                    ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                    : "border-gray-200 hover:border-red-300 text-gray-600"
                }`}
              >
                <div className="text-sm font-medium">🏇 Có, tôi đua luôn!</div>
              </button>
              <button
                type="button"
                onClick={() => setCreatorJoin(false)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  !creatorJoin
                    ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                    : "border-gray-200 hover:border-red-300 text-gray-600"
                }`}
              >
                <div className="text-sm font-medium">👀 Không, chỉ host</div>
              </button>
            </div>

            {creatorJoin && (
              <div className="space-y-3 bg-red-50/50 rounded-xl p-4 border border-red-100">
                {/* Creator Name */}
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Tên của bạn"
                  maxLength={30}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-center"
                />

                {/* Creator Gender */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "male", label: "♂ Nam" },
                    { value: "female", label: "♀ Nữ" },
                    { value: "other", label: "⚧ Khác" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCreatorGender(opt.value)}
                      className={`py-2 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                        creatorGender === opt.value
                          ? "border-red-500 bg-white text-red-700"
                          : "border-gray-200 text-gray-500 hover:border-red-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Creator Age */}
                <input
                  type="number"
                  value={creatorAge}
                  onChange={(e) => setCreatorAge(e.target.value)}
                  placeholder="Tuổi của bạn"
                  min={1}
                  max={120}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-center"
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 active:scale-[0.98]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Đang tạo...
              </span>
            ) : (
              "Tạo Phòng 🧧"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
