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

/** Tiếng pháo bông (nổ bông) khi về đích 100% */
export function playFireworks(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    // "Boom" thấp — nổ
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.connect(boomGain);
    boomGain.connect(ctx.destination);
    boom.frequency.value = 80;
    boom.type = "sine";
    boomGain.gain.setValueAtTime(0.35, t);
    boomGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    boom.start(t);
    boom.stop(t + 0.15);
    // Vài "sparkle" cao — tàn pháo
    const sparkFreqs = [1200, 1800, 2200, 1600, 2000];
    sparkFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const start = t + 0.05 + i * 0.04;
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.08);
      osc.start(start);
      osc.stop(start + 0.08);
    });
  } catch {
    // ignore
  }
}

/** Tiếng kết thúc vòng + cờ kết thúc khi race:complete */
export function playRaceComplete(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const playTone = (freq: number, start: number, duration: number, vol = 0.2) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.connect(gain);
      gain.connect(ctx!.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(vol, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      osc.start(start);
      osc.stop(start + duration);
    };
    const t = ctx.currentTime;
    // Fanfare cờ kết thúc: C5 - E5 - G5 - C6
    playTone(523, t, 0.12, 0.18);
    playTone(659, t + 0.14, 0.12, 0.18);
    playTone(784, t + 0.28, 0.12, 0.18);
    playTone(1047, t + 0.42, 0.35, 0.22);
  } catch {
    // ignore
  }
}
