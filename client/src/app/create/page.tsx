"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [maxPeople, setMaxPeople] = useState("10");
  const [amountsCsv, setAmountsCsv] = useState("50,50,100,100,200,200,500");
  const [wishTone, setWishTone] = useState("mix");
  const [raceDuration, setRaceDuration] = useState("30");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (parsedAmounts.length === 0) {
      setError("Please enter at least one valid amount");
      return;
    }

    if (!maxPeople || parseInt(maxPeople) < 1) {
      setError("Max people must be at least 1");
      return;
    }

    if (creatorJoin && !creatorName.trim()) {
      setError("Please enter your display name to join the race");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName, maxPeople, amountsCsv, wishTone, raceDuration,
          creatorJoin, creatorName: creatorName.trim(), creatorGender, creatorAge: creatorAge || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create room");
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
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block"
          >
            ← Back to Home
          </button>
          <div className="text-5xl mb-3">🧧</div>
          <h1 className="text-3xl font-bold text-red-700">Create Room</h1>
          <p className="text-gray-500 mt-1">
            Set up lucky envelopes for your group
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 p-6 space-y-5"
        >
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Team Tennis Tết Party"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Max People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Participants
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
              Envelope Amounts{" "}
              <span className="text-gray-400 font-normal">
                (comma-separated, unit: thousand VND)
              </span>
            </label>
            <textarea
              value={amountsCsv}
              onChange={(e) => setAmountsCsv(e.target.value)}
              placeholder="50,50,100,100,200,200,500"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent font-mono text-sm"
            />
            {parsedAmounts.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {parsedAmounts.map((amount, i) => (
                  <span
                    key={i}
                    className="inline-block bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-lg border border-amber-200"
                  >
                    {amount.toLocaleString()}k
                  </span>
                ))}
                <span className="inline-block bg-red-50 text-red-700 text-xs font-semibold px-2 py-1 rounded-lg border border-red-200">
                  Total: {totalAmount.toLocaleString()}k VND •{" "}
                  {parsedAmounts.length} envelopes
                </span>
              </div>
            )}
          </div>

          {/* Race Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Race Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "15", label: "15s", desc: "Sprint" },
                { value: "30", label: "30s", desc: "Normal" },
                { value: "45", label: "45s", desc: "Long" },
                { value: "60", label: "60s", desc: "Marathon" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRaceDuration(option.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    raceDuration === option.value
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-lg font-bold">{option.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Time limit for the race. Unfinished riders are ranked by progress.
            </p>
          </div>

          {/* Wish Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wish Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "mix", label: "🎭 Mix", desc: "Both styles" },
                { value: "funny", label: "😄 Funny", desc: "Humorous" },
                { value: "formal", label: "🎋 Formal", desc: "Traditional" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setWishTone(option.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    wishTone === option.value
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Creator Join Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Join the Race?
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setCreatorJoin(true)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  creatorJoin
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className="text-sm font-medium">Yes, I race too!</div>
              </button>
              <button
                type="button"
                onClick={() => setCreatorJoin(false)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  !creatorJoin
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className="text-sm font-medium">No, just host</div>
              </button>
            </div>

            {creatorJoin && (
              <div className="space-y-3 bg-red-50/50 rounded-xl p-4 border border-red-100">
                {/* Creator Name */}
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Your display name"
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
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
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
                  placeholder="Your age"
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
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-200 active:scale-[0.98]"
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
                Creating...
              </span>
            ) : (
              "Create Room 🧧"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
