"use client";

import { useMemo } from "react";

function CherryBlossom({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
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

// Simple seeded random so petals are consistent across renders (no layout shift)
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function randomBetween(seed: number, min: number, max: number) {
  return min + seededRandom(seed) * (max - min);
}

interface PetalData {
  left: string;
  size: number;
  style: React.CSSProperties;
}

function generatePetals(count: number): PetalData[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (s: number) => randomBetween(i * 7 + s, 0, 1);

    const duration = 3.5 + r(1) * 4;       // 3.5s – 7.5s
    const delay = r(2) * 8;                 // 0s – 8s
    const left = r(3) * 98 + 1;             // 1% – 99%
    const size = 10 + r(4) * 12;            // 10px – 22px
    const opacity = 0.5 + r(5) * 0.5;       // 0.5 – 1.0
    const scale = 0.6 + r(6) * 0.6;         // 0.6 – 1.2

    // Random drift points (px) — each waypoint drifts left or right
    const drift1 = (r(10) - 0.5) * 80;
    const drift2 = (r(11) - 0.5) * 80;
    const drift3 = (r(12) - 0.5) * 80;
    const drift4 = (r(13) - 0.5) * 80;

    // Random rotation at each waypoint
    const dir = r(14) > 0.5 ? 1 : -1;
    const rot1 = dir * (90 + r(15) * 180);
    const rot2 = dir * (180 + r(16) * 360);
    const rot3 = dir * (360 + r(17) * 360);
    const rot4 = dir * (540 + r(18) * 360);

    return {
      left: `${left}%`,
      size: Math.round(size),
      style: {
        "--petal-duration": `${duration.toFixed(1)}s`,
        "--petal-delay": `${delay.toFixed(1)}s`,
        "--petal-opacity": opacity.toFixed(2),
        "--petal-scale": scale.toFixed(2),
        "--drift-1": `${drift1.toFixed(0)}px`,
        "--drift-2": `${drift2.toFixed(0)}px`,
        "--drift-3": `${drift3.toFixed(0)}px`,
        "--drift-4": `${drift4.toFixed(0)}px`,
        "--rot-1": `${rot1.toFixed(0)}deg`,
        "--rot-2": `${rot2.toFixed(0)}deg`,
        "--rot-3": `${rot3.toFixed(0)}deg`,
        "--rot-4": `${rot4.toFixed(0)}deg`,
      } as React.CSSProperties,
    };
  });
}

const PETAL_COUNT = 80;

export function FallingPetals() {
  const petals = useMemo(() => generatePetals(PETAL_COUNT), []);

  return (
    <>
      {petals.map((p, i) => (
        <div
          key={i}
          className="petal"
          style={{ left: p.left, top: 0, ...p.style }}
        >
          <CherryBlossom size={p.size} />
        </div>
      ))}
    </>
  );
}
