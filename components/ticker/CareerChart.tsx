"use client";

import { useRef, useState } from "react";
import Crosshair from "./Crosshair";

type Entry = {
  title: string;
  place: string;
  start: number;
  end: number | null;
  period: string;
  note: string;
};

const FROM = 2023;
const TO = 2027.25;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pct = (t: number) => `${((t - FROM) / (TO - FROM)) * 100}%`;
const label = (t: number) => `${MONTHS[Math.min(11, Math.floor((t % 1) * 12))]} ${Math.floor(t)}`;

/** Each role as a bar on one time axis. The crosshair reads which roles were open on any date. */
export default function CareerChart({ entries, now }: { entries: Entry[]; now: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<number | null>(null);
  const active = (t: number) => entries.filter((e) => t >= e.start && t <= (e.end ?? now));

  return (
    <Crosshair
      className="tk-career"
      label="Career timeline from 2023 to now"
      onLeave={() => setAt(null)}
      read={({ clientX }) => {
        const el = track.current;
        if (!el) return null;
        const box = el.getBoundingClientRect();
        const t = FROM + ((clientX - box.left) / box.width) * (TO - FROM);
        if (t < FROM || t > TO) {
          setAt(null);
          return null;
        }
        setAt(Math.floor(t * 12) / 12);
        if (t > now) return `${label(t)} · next entry: your team?`;
        const open = active(t);
        return `${label(t)} · ${open.length ? open.map((e) => e.place.replace(/ \(.+\)/, "")).join(", ") : "nothing open"}`;
      }}
    >
      <div className="tk-career-grid">
        <div className="tk-career-axis" aria-hidden="true">
          <div ref={track} className="tk-career-ticks">
            {[2023, 2024, 2025, 2026, 2027].map((year) => (
              <span key={year} style={{ left: pct(year) }}>
                {year}
              </span>
            ))}
            <span className="tk-now" style={{ left: pct(now) }}>
              Now
            </span>
          </div>
        </div>
        <ol className="tk-career-rows">
          {entries.map((entry) => {
            const end = entry.end ?? now;
            const lit = at !== null && at >= entry.start && at <= end;
            return (
              <li key={entry.title + entry.place} data-lit={lit || undefined}>
                <p className="tk-career-name">
                  <strong>{entry.title}</strong>
                  <span>{entry.place}</span>
                </p>
                <div className="tk-career-track">
                  <span
                    className="tk-career-bar"
                    data-open={entry.end === null || undefined}
                    data-flip={(entry.start - FROM) / (TO - FROM) > 0.6 || undefined}
                    style={{ left: pct(entry.start), width: pct(FROM + (end - entry.start)) }}
                  >
                    <span>{entry.period}</span>
                  </span>
                  <span className="tk-career-now" style={{ left: pct(now) }} aria-hidden="true" />
                </div>
                <p className="tk-career-note">{entry.note}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </Crosshair>
  );
}
