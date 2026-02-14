"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Horse } from "@/components/Horse";

export default function HomePage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-16 mx-auto mb-4">
            <Horse color="#DC2626" state="running" />
          </div>
          <h1 className="text-4xl font-bold text-red-700 mb-2">Horse Race Lì Xì</h1>
          <p className="text-amber-700 text-lg">
            Race your horse to win lucky envelopes!
          </p>
        </div>

        {/* Create Room */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 p-6 mb-4">
          <h2 className="text-lg font-semibold text-red-800 mb-3">
            Create a Race Room
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Set up envelopes and race to win them
          </p>
          <button
            onClick={() => router.push("/create")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-200 active:scale-[0.98]"
          >
            Create Room
          </button>
        </div>

        {/* Join Room */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-3">
            Join a Room
          </h2>
          <form onSubmit={handleJoinRoom} className="space-y-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="Enter room code (e.g. 8K2F9A)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center text-lg font-mono tracking-widest uppercase placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
              maxLength={6}
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-200 active:scale-[0.98]"
            >
              Join Room
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">
          Chúc Mừng Năm Mới 🎊
        </p>
      </div>
    </div>
  );
}
