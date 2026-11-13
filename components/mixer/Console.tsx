"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import type { ReviewLink } from "@/components/review/portfolio";

export type Channel = { name: string; short: string; items: string[]; color: string };
export type Track = {
  id: number;
  code: string;
  title: string;
  category: string;
  year?: number;
  short: string;
  problem?: string;
  fix?: string;
  facts: { value: string; label: string }[];
  image: string;
  links: ReviewLink[];
  /** How strongly this project uses each channel's skills, 0 to 1, in channel order. */
  weights: number[];
  /** Each technology with the index of the channel it belongs to (-1 if none). */
  stack: { tech: string; ch: number }[];
};

const PRESETS: { name: string; levels: number[] }[] = [
  { name: "Flat", levels: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] },
  { name: "Full-stack role", levels: [0.8, 0.8, 1, 0.9, 0.7, 0.15, 0.5] },
  { name: "Frontend role", levels: [0.7, 1, 0.25, 0.2, 0.75, 0.6, 0.2] },
  { name: "Backend & data", levels: [0.7, 0.2, 1, 1, 0.6, 0, 0.55] },
  { name: "Motion", levels: [0.4, 0.6, 0.1, 0, 0.3, 1, 0] },
  { name: "AI products", levels: [0.6, 0.5, 0.6, 0.5, 0.3, 0, 1] },
];
const SEGMENTS = 12;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function Fader({
  channel,
  index,
  value,
  live,
  onChange,
}: {
  channel: Channel;
  index: number;
  value: number;
  live: number;
  onChange: (index: number, value: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const grab = useRef<{ id: number; offset: number } | null>(null);
  const KNOB = 44;

  const fromPointer = (clientY: number, offset: number) => {
    const el = track.current;
    if (!el) return value;
    const box = el.getBoundingClientRect();
    const travel = box.height - KNOB;
    return clamp(1 - (clientY - box.top - offset - KNOB / 2) / travel);
  };
  const set = (next: number) => {
    // Move the knob in the same event, before React renders, so it never trails the pointer.
    track.current?.style.setProperty("--v", String(next));
    onChange(index, next);
  };

  return (
    <div className="mx-strip" style={{ "--ch": channel.color } as React.CSSProperties}>
      <span className="mx-strip-n">{String(index + 1).padStart(2, "0")}</span>
      <span className="mx-meter" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, s) => (
          <i key={s} data-on={s < Math.round(live * SEGMENTS) || undefined} />
        ))}
      </span>
      <div
        ref={track}
        className="mx-fader"
        style={{ "--v": value } as React.CSSProperties}
        role="slider"
        tabIndex={0}
        aria-label={`${channel.name} level`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={`${Math.round(value * 100)} percent`}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const el = event.currentTarget;
          el.setPointerCapture(event.pointerId);
          const knob = (event.target as Element).closest(".mx-knob");
          // Grabbing the knob keeps the grab point under the cursor; clicking the track jumps to it.
          let offset = 0;
          if (knob) {
            const k = knob.getBoundingClientRect();
            offset = event.clientY - (k.top + k.height / 2);
          }
          grab.current = { id: event.pointerId, offset };
          set(fromPointer(event.clientY, offset));
        }}
        onPointerMove={(event) => {
          const g = grab.current;
          if (!g || g.id !== event.pointerId) return;
          set(fromPointer(event.clientY, g.offset));
        }}
        onPointerUp={() => (grab.current = null)}
        onPointerCancel={() => (grab.current = null)}
        onKeyDown={(event) => {
          const step =
            event.key === "ArrowUp" || event.key === "ArrowRight"
              ? 0.05
              : event.key === "ArrowDown" || event.key === "ArrowLeft"
                ? -0.05
                : event.key === "PageUp"
                  ? 0.2
                  : event.key === "PageDown"
                    ? -0.2
                    : null;
          if (event.key === "Home") set(0);
          else if (event.key === "End") set(1);
          else if (step !== null) set(clamp(value + step));
          else return;
          event.preventDefault();
        }}
      >
        <span className="mx-scale" aria-hidden="true" />
        <span className="mx-knob" aria-hidden="true" />
      </div>
      <span className="mx-strip-val" aria-hidden="true">
        {Math.round(value * 100)}
      </span>
      <span className="mx-strip-name" title={channel.name}>
        <span className="mx-long">{channel.name}</span>
        <span className="mx-short" aria-hidden="true">
          {channel.short}
        </span>
      </span>
    </div>
  );
}

/**
 * The desk. Seven faders, one per skill set, and a solo button on each. Every project is scored by
 * how much of its stack falls in the channels you turned up, and the list re-orders to match.
 */
export default function Console({ channels, tracks }: { channels: Channel[]; tracks: Track[] }) {
  const [levels, setLevels] = useState(PRESETS[1].levels);
  const [preset, setPreset] = useState<string | null>(PRESETS[1].name);
  const [solo, setSolo] = useState<number[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const rows = useRef(new Map<number, HTMLLIElement>());
  const tops = useRef(new Map<number, number>());

  const live = levels.map((level, i) => (solo.length && !solo.includes(i) ? 0 : level));
  const total = live.reduce((sum, l) => sum + l, 0) || 1;
  const ranked = tracks
    .map((track) => ({
      track,
      score: track.weights.reduce((sum, w, i) => sum + w * live[i], 0) / total,
    }))
    .sort((a, b) => b.score - a.score || a.track.id - b.track.id);
  const best = ranked[0].score || 1;
  const orderKey = ranked.map((r) => r.track.id).join(",");

  // FLIP: when the order changes, each row starts where it was and slides to its new place.
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rows.current.forEach((el, id) => {
      const top = el.offsetTop;
      const before = tops.current.get(id);
      tops.current.set(id, top);
      if (reduce || before === undefined || before === top) return;
      el.animate([{ transform: `translateY(${before - top}px)` }, { transform: "none" }], {
        duration: 380,
        easing: "cubic-bezier(0.2, 0.9, 0.25, 1)",
      });
    });
  }, [orderKey]);

  const change = (i: number, v: number) => {
    setLevels((current) => current.map((l, k) => (k === i ? v : l)));
    setPreset(null);
  };

  return (
    <div className="mx-desk">
      <div className="mx-panel">
        <div className="mx-panel-head">
          <p className="mx-label">Input · skill channels</p>
          <div className="mx-presets" role="group" aria-label="Presets">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={preset === p.name}
                onClick={() => {
                  setLevels(p.levels);
                  setPreset(p.name);
                  setSolo([]);
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-strips">
          {channels.map((channel, i) => (
            <div key={channel.name} className="mx-channel" data-muted={live[i] === 0 || undefined}>
              <button
                type="button"
                className="mx-solo"
                aria-pressed={solo.includes(i)}
                aria-label={`Solo ${channel.name}`}
                onClick={() =>
                  setSolo((s) => (s.includes(i) ? s.filter((k) => k !== i) : [...s, i]))
                }
              >
                S
              </button>
              <Fader
                channel={channel}
                index={i}
                value={levels[i]}
                live={live[i]}
                onChange={change}
              />
            </div>
          ))}
        </div>
        <p className="mx-readout" aria-hidden="true">
          <span>Top of the mix</span>
          {ranked.slice(0, 3).map(({ track, score }, i) => (
            <span key={track.id}>
              {i + 1}. {track.title} <b>{Math.round(score * 100)}</b>
            </span>
          ))}
        </p>
        <ul className="mx-legend">
          {channels.map((channel) => (
            <li key={channel.name} style={{ "--ch": channel.color } as React.CSSProperties}>
              <b>{channel.name}</b> {channel.items.join(" · ")}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-out">
        <p className="mx-label">
          Output · {ranked.length} projects, best match first
          {solo.length > 0 && <span className="mx-solo-note"> · solo on</span>}
        </p>
        <ol className="mx-rank" aria-live="polite">
          {ranked.map(({ track, score }, rank) => {
            const isOpen = open === track.id;
            return (
              <li
                key={track.id}
                ref={(el) => {
                  if (el) rows.current.set(track.id, el);
                  else rows.current.delete(track.id);
                }}
                className="mx-row"
                data-open={isOpen || undefined}
              >
                <button
                  type="button"
                  className="mx-row-head"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : track.id)}
                >
                  <span className="mx-rank-n">{String(rank + 1).padStart(2, "0")}</span>
                  <span className="mx-row-title">
                    <strong>{track.title}</strong>
                    <span>
                      {track.category}
                      {track.year ? ` · ${track.year}` : ""}
                    </span>
                  </span>
                  <span
                    className="mx-match"
                    aria-label={`${Math.round(score * 100)} percent match`}
                  >
                    <span className="mx-match-bar">
                      <span style={{ transform: `scaleX(${score / best})` }} />
                    </span>
                    <span className="mx-match-n">{Math.round(score * 100)}</span>
                  </span>
                  <span className="mx-row-plus" aria-hidden="true" />
                </button>
                <p className="mx-chips">
                  {track.stack.map(({ tech, ch }) => (
                    <span
                      key={tech}
                      data-hot={(ch >= 0 && live[ch] > 0.55) || undefined}
                      style={
                        { "--ch": ch >= 0 ? channels[ch].color : "#9a978f" } as React.CSSProperties
                      }
                    >
                      {tech}
                    </span>
                  ))}
                </p>
                {isOpen && (
                  <div className="mx-detail">
                    <div className="mx-detail-shot">
                      <Image
                        src={track.image}
                        alt={`${track.title} screenshot`}
                        fill
                        sizes="(max-width: 900px) 90vw, 420px"
                      />
                    </div>
                    <div className="mx-detail-copy">
                      <p className="mx-detail-short">{track.short}</p>
                      {track.problem && (
                        <>
                          <p>
                            <b>Problem</b> {track.problem}
                          </p>
                          <p>
                            <b>Fix</b> {track.fix}
                          </p>
                        </>
                      )}
                      {track.facts.length > 0 && (
                        <dl className="mx-facts">
                          {track.facts.slice(0, 4).map((fact) => (
                            <div key={fact.label}>
                              <dd>{fact.value}</dd>
                              <dt>{fact.label}</dt>
                            </div>
                          ))}
                        </dl>
                      )}
                      <p className="mx-links">
                        {track.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            {...(link.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {link.label}
                            <span aria-hidden="true">{link.external ? " ↗" : " →"}</span>
                          </a>
                        ))}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
