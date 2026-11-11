"use client";

import { useRef, useState, type ComponentType } from "react";
import { flushSync } from "react-dom";
import SnapField from "./SnapField";
import { tone } from "./feedback";

type Study = {
  id: string;
  anno: string;
  title: string;
  text: string;
  hint: string;
};

const STUDIES: Study[] = [
  {
    id: "snap",
    anno: "Study 001 · Snap with give",
    title: "A storyboard grid",
    text: "How things should feel: beats that move freely, land on the nearest free cell, and wobble once.",
    hint: "Drag or fling a beat. Arrow keys move a focused beat.",
  },
  {
    id: "race",
    anno: "Study 002 · Real-time / Systems",
    title: "Two bids, one price",
    text: "What keeps a real-time product honest: two people bid at the same moment over different networks.",
    hint: "Set each phone's signal, the server's rule, and what the network loses. Then send both bids and watch what the server stores.",
  },
];

// The simulation is only fetched when someone shows interest in its card.
let racePromise: Promise<ComponentType> | null = null;
const loadRace = () => (racePromise ??= import("./RaceLab").then((module) => module.default));

/**
 * Two lab cards. Opening one morphs it to full width with a view transition: the browser
 * animates snapshots on the compositor, so the expansion never re-lays out the page per frame.
 */
export default function LabStudies() {
  const [open, setOpen] = useState<number | null>(null);
  const [Race, setRace] = useState<ComponentType | null>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);

  const toggle = async (index: number) => {
    const next = open === index ? null : index;
    const RaceComponent = next === 1 && !Race ? await loadRace() : null;
    const apply = () => {
      if (RaceComponent) setRace(() => RaceComponent);
      setOpen(next);
    };
    tone(next === null ? "settle" : "morph", 0.7);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }
    const root = document.documentElement;
    root.classList.add("ld-vt-lab");
    const transition = document.startViewTransition(() => flushSync(apply));
    transition.finished.finally(() => {
      root.classList.remove("ld-vt-lab");
      const card = cards.current[next ?? index];
      const header = parseFloat(getComputedStyle(root).getPropertyValue("--ld-header")) || 64;
      if (card && card.getBoundingClientRect().top < header) {
        card.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
      }
    });
  };

  return (
    <div className="ld-labs" data-open={open ?? undefined}>
      {STUDIES.map((study, index) => {
        const state = open === index ? "open" : open === null ? "rest" : "folded";
        const titleId = `ld-study-${study.id}-title`;
        const bodyId = `ld-study-${study.id}-body`;
        return (
          <article
            key={study.id}
            ref={(el) => {
              cards.current[index] = el;
            }}
            className="ld-lab"
            data-state={state}
            style={{ viewTransitionName: `ld-study-${index}` }}
            aria-labelledby={titleId}
            onPointerEnter={index === 1 ? () => void loadRace() : undefined}
          >
            <div className="ld-lab-head">
              <span className="ld-anno">{study.anno}</span>
              <h3 id={titleId}>
                <button
                  type="button"
                  className="ld-lab-toggle"
                  aria-expanded={state === "open"}
                  aria-controls={bodyId}
                  onFocus={index === 1 ? () => void loadRace() : undefined}
                  onClick={() => void toggle(index)}
                >
                  <span>{study.title}</span>
                  <span className="ld-lab-icon" aria-hidden="true" />
                </button>
              </h3>
              <p>{state === "open" ? study.hint : study.text}</p>
            </div>
            {state === "rest" && (
              <div className="ld-lab-preview" aria-hidden="true">
                {index === 0 ? <GridPreview /> : <RacePreview />}
                <span className="ld-anno">Open the study →</span>
              </div>
            )}
            <div id={bodyId} className="ld-lab-body" hidden={state !== "open"}>
              {state === "open" && (index === 0 ? <SnapField /> : Race ? <Race /> : null)}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function GridPreview() {
  const tiles: [number, number, string][] = [
    [0, 0, "putty"],
    [2, 1, "clay"],
    [4, 0, "sage"],
    [1, 2, "peach"],
    [5, 2, "putty"],
  ];
  return (
    <svg className="ld-preview" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`x${i}`} x1={i * 40} y1="0" x2={i * 40} y2="120" />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <line key={`y${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} />
      ))}
      {tiles.map(([c, r, body]) => (
        <rect
          key={`${c}${r}`}
          className={`ld-preview-${body}`}
          x={c * 40 + 4}
          y={r * 40 + 4}
          width="32"
          height="32"
          rx="9"
        />
      ))}
      <rect className="ld-preview-ghost" x="124" y="4" width="32" height="32" rx="9" />
      <rect
        className="ld-preview-sage"
        x="136"
        y="22"
        width="32"
        height="32"
        rx="9"
        transform="rotate(-8 152 38)"
      />
    </svg>
  );
}

function RacePreview() {
  return (
    <svg className="ld-preview" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
      <path className="ld-preview-wire" d="M70 30 C150 30 160 60 230 60" />
      <path className="ld-preview-wire" d="M70 90 C150 90 160 60 230 60" />
      <rect className="ld-preview-putty" x="10" y="14" width="60" height="32" rx="10" />
      <rect className="ld-preview-putty" x="10" y="74" width="60" height="32" rx="10" />
      <rect className="ld-preview-clay" x="230" y="38" width="80" height="44" rx="12" />
      <text x="40" y="34">
        A
      </text>
      <text x="40" y="94">
        B
      </text>
      <text x="270" y="64">
        Server
      </text>
      <circle className="ld-preview-packet" cx="128" cy="36" r="6" />
      <circle className="ld-preview-packet" cx="176" cy="74" r="6" />
    </svg>
  );
}
