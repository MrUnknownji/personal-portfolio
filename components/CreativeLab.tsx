"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { applyPortfolioSettings, portfolioPalettes, readPortfolioSettings } from "@/components/PortfolioPreferences";

const studies = [
  { number: "001", title: "Motion type", medium: "Typography / Interaction", note: "Tune the spacing here, then see it travel through the portfolio." },
  { number: "002", title: "Signal paths", medium: "SVG / Systems", note: "One network, three ways to get a signal from input to output." },
  { number: "003", title: "Color study", medium: "Color / Contrast", note: "Choose an accent. It follows you into the work and case studies." },
] as const;

const routes = [
  { name: "Direct", path: "M48 126 H592", detail: "01 / Shortest path · 3 hops" },
  { name: "Detour", path: "M48 126 H220 L300 55 L390 126 H592", detail: "02 / Alternate path · 4 hops" },
  { name: "Loop", path: "M48 126 H220 C220 166 260 197 300 197 C340 197 390 166 390 126 H592", detail: "03 / Scenic path · 4 hops" },
] as const;

function SignalDiagram({ route, compact = false }: { route: number; compact?: boolean }) {
  return (
    <svg className={`offset-signal-diagram${compact ? " offset-signal-compact" : ""}`} viewBox="0 0 640 250" role="img" aria-label={`${routes[route].name} route from input to output`}>
      <path className="offset-signal-grid" d="M48 55 H592 M48 126 H592 M48 197 H592 M48 38 V214 M220 38 V214 M300 38 V214 M390 38 V214 M592 38 V214" />
      <path className="offset-signal-idle" d={routes[0].path} />
      <path className="offset-signal-idle" d={routes[1].path} />
      <path className="offset-signal-idle" d={routes[2].path} />
      <path key={route} className="offset-signal-active" d={routes[route].path} />
      {[[48, 126], [220, 126], [390, 126], [592, 126], [300, 55], [300, 197]].map(([x, y], index) =>
        <circle key={index} className={`offset-signal-node${index === 0 || index === 3 ? " offset-signal-terminal" : ""}`} cx={x} cy={y} r={index === 0 || index === 3 ? 8 : 5} />
      )}
      {!compact && <><text x="48" y="235">INPUT</text><text x="220" y="235">ROUTER</text><text x="592" y="235" textAnchor="end">OUTPUT</text></>}
    </svg>
  );
}

export default function CreativeLab() {
  const [open, setOpen] = useState<number | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [route, setRoute] = useState(0);
  const [signalPreviewActive, setSignalPreviewActive] = useState(false);
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

  return (
    <section className="offset-lab" id="lab" aria-labelledby="lab-title">
      <div className="offset-wrap">
        <div className="offset-lab-heading" data-offset-reveal>
          <span className="offset-kicker">02 / The lab</span>
          <h2 id="lab-title">Small ideas.<br /><span>Big curiosity.</span></h2>
          <p>Short interactive studies. Type and color choices travel through the entire site.</p>
        </div>
        <div className="offset-lab-grid">
          {studies.map((study, index) => (
            <button className={`offset-lab-card offset-lab-card-${index + 1}`} key={study.number} type="button" onClick={() => setOpen(index)} onPointerEnter={index === 1 ? () => setSignalPreviewActive(true) : undefined} onPointerLeave={index === 1 ? () => setSignalPreviewActive(false) : undefined} onFocus={index === 1 ? () => setSignalPreviewActive(true) : undefined} onBlur={index === 1 ? () => setSignalPreviewActive(false) : undefined} aria-label={`Open ${study.title} experiment`}>
              <span className="offset-lab-card-top"><span>LAB / {study.number}</span><span>OPEN ↗</span></span>
              <span className="offset-lab-preview" aria-hidden="true">
                {index === 0 ? <strong>SHIFT</strong> : index === 1 ? <SignalDiagram route={signalPreviewActive ? (route + 1) % routes.length : route} compact /> : <span className="offset-lab-color-block" style={{ "--study-yellow": portfolioPalettes[1].accent, "--study-blue": portfolioPalettes[4].accent, "--study-violet": portfolioPalettes[3].accent } as CSSProperties} />}
              </span>
              <span className="offset-lab-card-bottom"><strong>{study.title}</strong><span>{study.medium}</span></span>
            </button>
          ))}
        </div>
      </div>
      <Dialog open={open !== null} onClose={() => setOpen(null)} ariaLabel={open === null ? undefined : `${studies[open].title} experiment`} className="offset-lab-dialog">
        <div className="offset-lab-dialog-inner">
          <button type="button" className="offset-lab-close" data-autofocus onClick={() => setOpen(null)}>Close ×</button>
          {open !== null && <>
            <span className="offset-kicker">LAB / {studies[open].number} / {studies[open].medium}</span>
            <h2>{studies[open].title}<span>.</span></h2>
            <p>{studies[open].note}</p>
            {open === 0 && <div className="offset-lab-type-play">
              <strong style={{ letterSpacing: `${spacing}px` }}>SHIFT</strong>
              <label>Letter spacing <input type="range" min="-7" max="22" value={spacing} onChange={(event) => changeSpacing(Number(event.target.value))} /></label>
              <span className="offset-lab-applied">Applied across the portfolio / {spacing > 0 ? "+" : ""}{spacing}</span>
            </div>}
            {open === 1 && <div className="offset-lab-signal-play">
              <SignalDiagram route={route} />
              <div className="offset-lab-route-bar"><span>{routes[route].detail}</span><div className="offset-lab-route-controls">{routes.map((item, index) => <button type="button" key={item.name} aria-pressed={route === index} onClick={() => setRoute(index)}>{item.name}</button>)}</div></div>
            </div>}
            {open === 2 && <div className="offset-lab-palette-play" style={{ "--study-color": portfolioPalettes[palette].accent } as CSSProperties}>
              <strong>ONE<br />ACCENT.</strong>
              <div>{portfolioPalettes.map((color, index) => <button type="button" key={color.name} aria-label={`Use ${color.name} accent`} aria-pressed={palette === index} onClick={() => changePalette(index)} style={{ background: color.accent }} />)}</div>
              <span className="offset-lab-palette-name">{portfolioPalettes[palette].name} / Applied sitewide</span>
            </div>}
          </>}
        </div>
      </Dialog>
    </section>
  );
}
