"use client";

import { useEffect, useRef } from "react";
import { animate, Spring } from "@/lib/lumen/springs";
import { haptic, tone } from "./feedback";

/** The droplet switch: its knob travels on the snap spring and stretches with speed. */
export default function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
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
      className="ld-drop"
      onClick={() => {
        onChange(!checked);
        tone("snap", 0.6);
        haptic(8);
      }}
    >
      <span className="ld-drop-track" ref={track} aria-hidden="true">
        <span className="ld-drop-knob" ref={knob} />
      </span>
      <span className="ld-drop-label">{label}</span>
    </button>
  );
}
