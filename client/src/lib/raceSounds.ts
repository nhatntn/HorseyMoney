/**
 * Tiếng ting countdown (3, 2, 1) và tiếng "Bắt đầu" khi đua bắt đầu.
 * Dùng Web Audio API, không cần file.
 */

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioContext) return audioContext;
  try {
    audioContext = new AudioContext();
    return audioContext;
  } catch {
    return null;
  }
}

/** Tiếng "ting" ngắn cho mỗi nhịp 3, 2, 1 */
export function playCountdownTing(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // ignore
  }
}

/** Tiếng "Bắt đầu!" khi đua bắt đầu (hai nốt ngắn cao hơn) */
export function playRaceGo(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.connect(gain);
      gain.connect(ctx!.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      osc.start(start);
      osc.stop(start + duration);
    };
    const t = ctx.currentTime;
    playTone(523, t, 0.08);       // C5
    playTone(659, t + 0.1, 0.15); // E5 — "bắt đầu"
  } catch {
    // ignore
  }
}
