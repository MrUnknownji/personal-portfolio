"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, Spring } from "@/lib/lumen/springs";
import { haptic } from "./feedback";

/**
 * The droplet switch: its knob travels on the snap spring and stretches with speed. With an
 * icon, the icon rides in the knob and the label is read by assistive tech only.
 */
export default function Toggle({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  icon?: ReactNode;
}) {
  const knob = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const spring = useRef<Spring | null>(null);

  useEffect(() => {
    const knobEl = knob.current;
    const trackEl = track.current;
    if (!knobEl || !trackEl) return;
    const travel = () => trackEl.clientWidth - knobEl.offsetWidth - 6;
    const render = (s: Spring) => {
      const stretch = Math.min(0.55, Math.abs(s.v) / 650);
      knobEl.style.transform = `translateX(${s.x.toFixed(2)}px) scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * 0.45).toFixed(3)})`;
    };
    if (!spring.current) {
      spring.current = new Spring(checked ? travel() : 0, "snap");
      render(spring.current);
      return;
    }
    const s = spring.current;
    s.target = checked ? travel() : 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return animate((dt) => {
      s.step(dt, reduced);
      if (s.resting) s.jump(s.target);
      render(s);
      return !s.resting;
    });
  }, [checked]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={icon ? "ld-drop ld-drop-icon" : "ld-drop"}
      title={icon ? label : undefined}
      onClick={() => {
        onChange(!checked);
        haptic(8);
      }}
    >
      <span className="ld-drop-track" ref={track} aria-hidden="true">
        <span className="ld-drop-knob" ref={knob}>
          {icon}
        </span>
      </span>
      <span className={icon ? "ld-sr-only" : "ld-drop-label"}>{label}</span>
    </button>
  );
}
