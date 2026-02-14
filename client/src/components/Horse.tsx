interface HorseProps {
  color: string;
  state?: "idle" | "running" | "finished";
  className?: string;
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const d = (c: number) => Math.max(0, Math.floor(c * (1 - amount)));
  return `rgb(${d(r)},${d(g)},${d(b)})`;
}

export function Horse({ color, state = "idle", className = "" }: HorseProps) {
  const mane = color;
  const legShade = darken(color, 0.15);
  const hoof = "#9CA3AF";
  const skin = "#FBBF83";
  const helmet = "#374151";
  const shirt = "#93C5FD";
  const pants = "#6B7280";
  const boot = "#374151";
  const hair = "#FBBF24";

  const isRunning = state === "running";
  const isFinished = state === "finished";
  const rootClass = isRunning
    ? "horse-running"
    : isFinished
      ? "horse-finished"
      : "";

  return (
    <svg
      viewBox="0 0 92 82"
      className={`${className} ${rootClass}`}
      style={{ overflow: "visible" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ══════════ Tail ══════════ */}
      <path
        className="horse-tail"
        d="M 16 46 C 10 38 5 28 9 18 C 11 14 14 18 12 22 C 9 30 12 40 16 44"
        fill={mane}
        style={{ transformOrigin: "16px 46px" }}
      />
      <path
        className="horse-tail"
        d="M 14 44 C 8 36 4 26 7 16"
        stroke={mane}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
        style={{ transformOrigin: "14px 44px" }}
      />

      {/* ══════════ Back legs ══════════ */}
      <g
        className="horse-leg-bl"
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
      >
        <rect x="22" y="58" width="6" height="17" rx="3" fill={legShade} />
        <rect x="20" y="73" width="9.5" height="5" rx="2.2" fill={hoof} />
      </g>
      <g
        className="horse-leg-br"
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
      >
        <rect x="30" y="58" width="6" height="17" rx="3" fill={legShade} />
        <rect x="28" y="73" width="9.5" height="5" rx="2.2" fill={hoof} />
      </g>

      {/* ══════════ Upper body group (bounces together) ══════════ */}
      <g className="horse-upper">
        {/* ── Horse body ── */}
        <ellipse cx="38" cy="50" rx="22" ry="14" fill={color} />
        <ellipse cx="38" cy="55" rx="15" ry="6" fill="white" opacity="0.08" />

        {/* ── Neck ── */}
        <path
          d="M 55 42 C 59 36 63 30 67 27 L 73 33 C 69 36 63 42 59 48 Z"
          fill={color}
        />

        {/* ── Head (large, cute cartoon) ── */}
        <ellipse cx="73" cy="30" rx="14" ry="12" fill={color} />

        {/* Snout/muzzle (rounded, slightly extended) */}
        <ellipse cx="85" cy="36" rx="7.5" ry="5.5" fill={color} />
        <ellipse cx="85" cy="37.5" rx="5.5" ry="3.5" fill="white" opacity="0.08" />

        {/* ── Ears (upright, close together) ── */}
        <path d="M 71 19 L 70 10 L 74 18 Z" fill={color} />
        <path d="M 72 18 L 71 12 L 73.5 18 Z" fill="#F9A8A8" opacity="0.5" />
        <path d="M 75 19 L 74 10 L 78 18 Z" fill={color} />
        <path d="M 76 18 L 75 12 L 77.5 18 Z" fill="#F9A8A8" opacity="0.5" />

        {/* ── Mane (thin short brown tufts) ── */}
        <g className="horse-mane" style={{ transformOrigin: "66px 22px" }}>
          <path
            d="M 69 19 C 67 15 65 17 64 14"
            stroke={mane}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 67 22 C 65 18 63 20 62 17"
            stroke={mane}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 64 26 C 62 22 60 24 59 21"
            stroke={mane}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 61 30 C 59 26 57 28 56 25"
            stroke={mane}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 58 34 C 56 30 55 32 54 30"
            stroke={mane}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 55 38 C 53 34 52 36 51 34"
            stroke={mane}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* ── Eye (cartoon eye with highlight) ── */}
        <ellipse
          cx="77"
          cy="27"
          rx="3.5"
          ry="4.2"
          fill="white"
          stroke={mane}
          strokeWidth="0.7"
        />
        <ellipse cx="78" cy="27.3" rx="2.2" ry="3" fill="#2D1B0E" />
        <circle cx="79" cy="25.8" r="1.3" fill="white" />
        <circle cx="77" cy="29" r="0.5" fill="white" opacity="0.4" />

        {/* ── Mouth / smile ── */}
        <path
          d="M 84 41 C 86 43 89 42 90 40"
          stroke={mane}
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Nostril ── */}
        <ellipse cx="89" cy="36" rx="1.4" ry="1" fill={mane} opacity="0.5" />

        {/* ── Bridle ── */}
        <path
          d="M 68 21 L 83 28"
          stroke="#52525B"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <path
          d="M 83 28 L 84 38"
          stroke="#52525B"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <circle cx="84" cy="38" r="1.8" fill="#DC2626" opacity="0.7" />

        {/* ══════════ Saddle ══════════ */}
        <path
          d="M 28 44 C 30 38 48 38 50 44 L 50 48 C 48 52 30 52 28 48 Z"
          fill="#4B5563"
        />
        <ellipse cx="39" cy="42" rx="9.5" ry="3" fill="#374151" />
        {/* Stirrup strap */}
        <path d="M 30 48 L 29 52 L 31 53 L 32 49" fill="#374151" />

        {/* ══════════ Jockey ══════════ */}

        {/* Body / shirt */}
        <rect x="34" y="27" width="11" height="13" rx="3.5" fill={shirt} />

        {/* Arms reaching forward */}
        <path
          d="M 45 29 C 53 25 62 25 70 29"
          stroke={shirt}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 45 29 C 53 25 62 25 70 29"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.2"
        />

        {/* Hands */}
        <circle cx="70" cy="29" r="2.2" fill={skin} />

        {/* Reins */}
        <path
          d="M 70 29 C 76 32 82 36 84 38"
          stroke="#EAB308"
          strokeWidth="1"
          fill="none"
        />

        {/* Leg (side view — < arrow shape, knee bent forward) */}
        <path
          d="M 38 38 L 44 48 L 38 58"
          stroke={pants}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Boot */}
        <rect x="35" y="56" width="6.5" height="3.5" rx="1.5" fill={boot} />

        {/* Head / face */}
        <circle cx="39.5" cy="18" r="9.5" fill={skin} />

        {/* Cheek blush */}
        <circle cx="33.5" cy="20.5" r="2.2" fill="#F9A8A8" opacity="0.35" />
        <circle cx="45.5" cy="20.5" r="2.2" fill="#F9A8A8" opacity="0.35" />

        {/* Smile */}
        <path
          d="M 36 22 C 37.5 24.5 41.5 24.5 43 22"
          stroke="#B37A3A"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <circle cx="35.5" cy="17.5" r="1.6" fill="#2D1B0E" />
        <circle cx="43.5" cy="17.5" r="1.6" fill="#2D1B0E" />
        <circle cx="36" cy="17" r="0.5" fill="white" />
        <circle cx="44" cy="17" r="0.5" fill="white" />

        {/* Helmet (taller) */}
        <path
          d="M 29.5 14 C 29 5 50 5 49.5 14 L 49.5 17.5 C 47.5 18.5 31.5 18.5 29.5 17.5 Z"
          fill={helmet}
        />
        <rect x="29" y="16.5" width="21" height="3" rx="1" fill="#52525B" />

        {/* Hair peeking below helmet (short) */}
        <path
          d="M 30 19 C 29 22 29 24 30 26"
          stroke={hair}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 31 19.5 C 30 21.5 30 23 31 25"
          stroke="#EAB308"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* ══════════ Front legs ══════════ */}
      <g
        className="horse-leg-fl"
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
      >
        <rect x="49" y="58" width="6" height="17" rx="3" fill={color} />
        <rect x="47" y="73" width="9.5" height="5" rx="2.2" fill={hoof} />
      </g>
      <g
        className="horse-leg-fr"
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
      >
        <rect x="57" y="58" width="6" height="17" rx="3" fill={color} />
        <rect x="55" y="73" width="9.5" height="5" rx="2.2" fill={hoof} />
      </g>
    </svg>
  );
}

// Horse head icon for lobby lists (matches race horse style)
export function HorseIcon({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  const mane = color;
  return (
    <svg
      viewBox="0 0 30 30"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Neck */}
      <path d="M 3 30 C 5 24 7 18 9 14 L 17 18 C 15 22 11 26 8 30 Z" fill={color} />

      {/* Head */}
      <ellipse cx="14" cy="14" rx="11" ry="10" fill={color} />

      {/* Muzzle */}
      <ellipse cx="21" cy="18" rx="6" ry="4.5" fill={color} />

      {/* Ears (upright, close) */}
      <path d="M 11 5 L 10 -1 L 14 4 Z" fill={color} />
      <path d="M 12 4.5 L 11 1 L 13.5 4 Z" fill="#F9A8A8" opacity="0.5" />
      <path d="M 15 4.5 L 14.5 -1 L 18 4 Z" fill={color} />
      <path d="M 16 4 L 15.5 1 L 17.5 4 Z" fill="#F9A8A8" opacity="0.5" />

      {/* Mane (tufts on head + neck) */}
      <path d="M 10 7 C 8 3 6.5 5 5.5 2.5" stroke={mane} strokeWidth="2" strokeLinecap="round" />
      <path d="M 8 10 C 6 6.5 4.5 8 3.5 5.5" stroke={mane} strokeWidth="2" strokeLinecap="round" />
      <path d="M 6 13 C 4 9.5 3 11 2 8.5" stroke={mane} strokeWidth="1.8" strokeLinecap="round" />
      {/* Mane on neck */}
      <path d="M 4 17 C 2 13.5 1 15 0 12.5" stroke={mane} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 2.5 21 C 0.5 17.5 -0.5 19 -1.5 16.5" stroke={mane} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 1.5 25 C -0.5 21.5 -1.5 23 -2.5 20.5" stroke={mane} strokeWidth="1.5" strokeLinecap="round" />

      {/* Eye (small, matching race horse) */}
      <ellipse cx="17" cy="12" rx="2.8" ry="3.2" fill="white" stroke={mane} strokeWidth="0.5" />
      <ellipse cx="17.5" cy="12.3" rx="1.8" ry="2.3" fill="#2D1B0E" />
      <circle cx="18.3" cy="11.2" r="1" fill="white" />

      {/* Nostril */}
      <ellipse cx="24" cy="18" rx="1.1" ry="0.8" fill={mane} opacity="0.5" />

      {/* Mouth */}
      <path
        d="M 21 21 C 23 22.5 25 22 26 20.5"
        stroke={mane}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
