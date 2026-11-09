"use client";

import { useEffect, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { Dialog } from "@/components/ui/Dialog";
import {
  applyPortfolioSettings,
  portfolioPalettes,
  readPortfolioSettings,
} from "@/components/PortfolioPreferences";

const studies = [
  {
    number: "001",
    title: "Motion type",
    medium: "Typography / Interaction",
    note: "Tune the spacing here, then see it travel through the portfolio.",
  },
  {
    number: "002",
    title: "Two bids, one price",
    medium: "Real-time / Systems",
    note: "Two people bid at the same moment over different networks. Change the latency, the server rule, and what the network drops, then watch lost updates and duplicate bids happen, or not.",
  },
  {
    number: "003",
    title: "Color study",
    medium: "Color / Contrast",
    note: "Choose an accent. It follows you into the work and case studies.",
  },
] as const;

const BidRace = dynamic(() => import("@/components/lab/BidRace"), {
  ssr: false,
  loading: () => <p className="bid-race-loading">Loading the simulation…</p>,
});

function RacePreview() {
  return (
    <svg className="lab-race-preview" viewBox="0 0 640 250" aria-hidden="true">
      <path className="lab-race-wire" d="M90 70 L540 125 M90 180 L540 125" />
      <rect x="40" y="48" width="100" height="44" />
      <rect x="40" y="158" width="100" height="44" />
      <rect className="lab-race-server" x="490" y="95" width="110" height="60" />
      <text x="90" y="76">
        A
      </text>
      <text x="90" y="186">
        B
      </text>
      <text x="545" y="131">
        SERVER
      </text>
      <circle className="lab-race-packet" r="8">
        <animateMotion dur="1.4s" repeatCount="indefinite" path="M90 70 L540 125" />
      </circle>
      <circle className="lab-race-packet lab-race-packet-late" r="8">
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M90 180 L540 125" />
      </circle>
    </svg>
  );
}

export default function CreativeLab() {
  const [open, setOpen] = useState<number | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [palette, setPalette] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = readPortfolioSettings();
      setSpacing(saved.spacing);
      setPalette(saved.palette);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const changeSpacing = (next: number) => {
    setSpacing(next);
    applyPortfolioSettings({ spacing: next, palette });
  };
  const changePalette = (next: number) => {
    setPalette(next);
    applyPortfolioSettings({ spacing, palette: next });
  };

  const resetSettings = () => {
    setSpacing(0);
    setPalette(0);
    applyPortfolioSettings({ spacing: 0, palette: 0 });
  };

  return (
    <section
      className="offset-lab"
      id="lab"
      data-build-file="CreativeLab.tsx"
      data-build-note="The lab is a place to inspect how type, events, and color respond to input."
      aria-labelledby="lab-title"
    >
      <div className="offset-wrap">
        <div className="offset-lab-heading" data-offset-reveal>
          <span className="offset-kicker">02 / The lab</span>
          <h2 id="lab-title">
            Small ideas.
            <br />
            <span>Big curiosity.</span>
          </h2>
          <p>Short interactive studies. Type and color choices travel through the entire site.</p>
        </div>
        <div className="offset-lab-grid">
          {studies.map((study, index) => (
            <button
              className={`offset-lab-card offset-lab-card-${index + 1}`}
              key={study.number}
              type="button"
              onClick={() => setOpen(index)}
            >
              <span className="offset-lab-card-top">
                <span>LAB / {study.number}</span>
                <span>
                  OPEN <span aria-hidden="true">↗</span>
                </span>
              </span>
              <span className="offset-lab-preview" aria-hidden="true">
                {index === 0 ? (
                  <strong>SHIFT</strong>
                ) : index === 1 ? (
                  <RacePreview />
                ) : (
                  <span
                    className="offset-lab-color-block"
                    style={
                      {
                        "--study-yellow": portfolioPalettes[1].accent,
                        "--study-blue": portfolioPalettes[4].accent,
                        "--study-violet": portfolioPalettes[3].accent,
                      } as CSSProperties
                    }
                  />
                )}
              </span>
              <span className="offset-lab-card-bottom">
                <strong>{study.title}</strong>
                <span>{study.medium}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <Dialog
        open={open !== null}
        onClose={() => setOpen(null)}
        ariaLabel={open === null ? undefined : `${studies[open].title} experiment`}
        className="offset-lab-dialog"
      >
        <div className="offset-lab-dialog-inner">
          <div className="offset-lab-dialog-actions">
            <button type="button" className="offset-lab-reset" onClick={resetSettings}>
              Reset site ↺
            </button>
            <button
              type="button"
              className="offset-lab-close"
              data-autofocus
              onClick={() => setOpen(null)}
            >
              Close ×
            </button>
          </div>
          {open !== null && (
            <>
              <span className="offset-kicker">
                LAB / {studies[open].number} / {studies[open].medium}
              </span>
              <h2>
                {studies[open].title}
                <span>.</span>
              </h2>
              <p>{studies[open].note}</p>
              {open === 0 && (
                <div className="offset-lab-type-play">
                  <div className="offset-lab-type-samples" aria-hidden="true">
                    {[0, 0.33, 0.66, 1].map((fraction, index) => (
                      <strong key={index} style={{ letterSpacing: `${spacing * fraction}px` }}>
                        BUILD
                      </strong>
                    ))}
                  </div>
                  <label>
                    Letter spacing{" "}
                    <input
                      type="range"
                      min="-7"
                      max="22"
                      value={spacing}
                      onChange={(event) => changeSpacing(Number(event.target.value))}
                    />
                  </label>
                  <span className="offset-lab-applied">
                    Preview / {spacing > 0 ? "+" : ""}
                    {spacing}px · Site-wide spacing stays within a readable range
                  </span>
                </div>
              )}
              {open === 1 && <BidRace />}
              {open === 2 && (
                <div
                  className="offset-lab-palette-play"
                  style={{ "--study-color": portfolioPalettes[palette].accent } as CSSProperties}
                >
                  <div className="offset-ink-strips">
                    {portfolioPalettes.map((color, index) => (
                      <button
                        type="button"
                        key={color.name}
                        aria-label={`Use ${color.name} accent`}
                        aria-pressed={palette === index}
                        onClick={() => changePalette(index)}
                        style={{ "--ink": color.accent } as CSSProperties}
                      >
                        <span>{color.name}</span>
                        <i aria-hidden="true">{palette === index ? "●" : "○"}</i>
                      </button>
                    ))}
                  </div>
                  <span className="offset-lab-palette-name">
                    {portfolioPalettes[palette].name} / Applied sitewide
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </Dialog>
    </section>
  );
}
