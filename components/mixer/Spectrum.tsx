"use client";

import { useRef } from "react";

const BARS = 56;
// The resting shape: a low, uneven floor with two slow swells, fixed so the server and client match.
const REST = Array.from({ length: BARS }, (_, i) => {
  const t = i / (BARS - 1);
  const v = 0.16 + 0.22 * Math.sin(t * Math.PI * 2.2 + 0.6) ** 2 + (0.08 * ((i * 7) % 5)) / 4;
  // Rounded so the server and every browser engine print the same style string.
  return Math.round(v * 1000) / 1000;
});

/**
 * An analyser strip under the name. Each bar's height is set straight from the pointer's position
 * in the same event (no smoothing toward the pointer), so the peak always sits under the cursor.
 */
export default function Spectrum({ children }: { children: React.ReactNode }) {
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);

  const draw = (peak: number | null) => {
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      const d = peak === null ? 99 : (i + 0.5) / BARS - peak;
      const bump = Math.exp(-(d * d) / 0.006);
      bar.style.transform = `scaleY(${Math.min(1, REST[i] * (1 - bump) + bump * 0.98)})`;
      bar.dataset.hot = bump > 0.55 ? "true" : "";
    });
  };

  return (
    <div
      ref={root}
      className="mx-hero-mix"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        draw((event.clientX - box.left) / box.width);
      }}
      onPointerLeave={() => draw(null)}
    >
      {children}
      <div className="mx-spectrum" aria-hidden="true">
        {REST.map((rest, i) => (
          <span
            key={i}
            ref={(el) => {
              bars.current[i] = el;
            }}
            style={{ transform: `scaleY(${rest})` }}
          />
        ))}
      </div>
    </div>
  );
}
