"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { describeLight, lightVector } from "@/lib/lumen/light";
import { SoftLayers, softStyle } from "./Soft";
import Toggle from "./Toggle";
import { lightStore, useLight } from "./lightStore";
import { soundStore } from "./feedback";

const THEME_KEY = "ld-theme";
const subscribeTheme = (listener: () => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, { attributeFilter: ["data-ld-theme"] });
  media.addEventListener("change", listener);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", listener);
  };
};
const isNight = () => {
  const theme = document.documentElement.dataset.ldTheme;
  return theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/** The instrument panel: the light dial, orbit pause, night draft, and sound. */
export default function Dock() {
  const light = useLight();
  const night = useSyncExternalStore(subscribeTheme, isNight, () => false);
  const sound = useSyncExternalStore(soundStore.subscribe, soundStore.get, soundStore.getServer);
  const [angle, setAngle] = useState<number | null>(null);
  const dial = useRef<HTMLButtonElement>(null);

  // The readout follows the light once a second; the light itself never waits on React.
  useEffect(() => {
    const update = () => setAngle(lightStore.angle());
    update();
    if (!light.running) return;
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [light.running, light.pausedAt]);

  const dialTo = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 42;
    const y = ((event.clientY - rect.top) / rect.height) * 42;
    const lx = (x - 21) / 14;
    const ly = (y - 21) / 14;
    const sin = Math.max(-1.5, Math.min(1.5, (ly + 0.55) / 0.45));
    lightStore.setAngle((Math.atan2(sin, lx) * 180) / Math.PI);
  };

  const [lx, ly] = lightVector(angle ?? 225);
  const reading = describeLight(angle ?? 225);

  return (
    <aside aria-label="Display controls">
      <div
        className="ld-dock ld-soft"
        style={softStyle("sheet", 12)}
        role="toolbar"
        aria-label="Light and display"
      >
        <SoftLayers z={12} />
        <button
          ref={dial}
          type="button"
          className="ld-dial"
          aria-label={`Light from ${reading.direction}. Drag, or use arrow keys, to move it.`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            dialTo(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) dialTo(event);
          }}
          onKeyDown={(event) => {
            const step = { ArrowLeft: -10, ArrowDown: -10, ArrowRight: 10, ArrowUp: 10 }[event.key];
            if (!step) return;
            event.preventDefault();
            lightStore.setAngle(lightStore.angle() + step);
          }}
        >
          <svg viewBox="0 0 42 42" aria-hidden="true">
            <ellipse className="ld-dial-orbit" cx="21" cy="13.3" rx="14" ry="6.3" />
            <line className="ld-dial-beam" x1="21" y1="21" x2={21 + lx * 14} y2={21 + ly * 14} />
            <rect className="ld-dial-centre" x="18.5" y="18.5" width="5" height="5" rx="1.5" />
            <circle className="ld-dial-sun" cx={21 + lx * 14} cy={21 + ly * 14} r="3.6" />
          </svg>
        </button>
        <span className="ld-dock-read">
          <span className="ld-anno">{light.running ? "Orbiting" : "Paused"}</span>
          <b>
            {reading.direction} · {reading.azimuth}°
          </b>
        </span>
        <button
          type="button"
          className="ld-iconbtn"
          aria-pressed={!light.running}
          aria-label={light.running ? "Pause the light" : "Resume the light"}
          onClick={() => lightStore.setRunning(!light.running)}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
            {light.running ? (
              <>
                <rect x="3.5" y="3" width="3" height="10" rx="1" />
                <rect x="9.5" y="3" width="3" height="10" rx="1" />
              </>
            ) : (
              <path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5z" />
            )}
          </svg>
        </button>
        <span className="ld-dock-sep" aria-hidden="true" />
        <Toggle label="Sound" checked={sound} onChange={soundStore.set} />
        <Toggle
          label="Night"
          checked={night}
          onChange={(next) => {
            document.documentElement.dataset.ldTheme = next ? "dark" : "light";
            try {
              localStorage.setItem(THEME_KEY, next ? "dark" : "light");
            } catch {
              /* Storage can be disabled. */
            }
          }}
        />
      </div>
    </aside>
  );
}
