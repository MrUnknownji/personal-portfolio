"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const milestones = [
  { year: "2020", title: "First builds", detail: "Mostly broken. Enough to keep going." },
  { year: "2023", title: "Computer Science", detail: "BSc. Learning why things work." },
  { year: "2024", title: "Developer at TCS", detail: "Joined in 2024." },
  { year: "Now", title: "Keep exploring", detail: "Web, mobile and creative code." },
];

const desktopWave = "M -70 125 C -20 175 25 205 85 205 C 200 205 220 75 340 75 C 465 75 520 245 640 245 C 770 245 785 110 850 110 C 920 110 970 75 1070 110";
const mobileWave = "M 0 -40 C -10 0 -20 20 20 40 C 93 90 90 150 70 190 S -5 290 20 350 S 95 465 70 510 C 50 555 20 580 40 640";

export default function FieldNote() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(ref.current.querySelector(".offset-field-path") ?? ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = ref.current;
    const chart = root?.querySelector<HTMLElement>(".offset-field-path");
    if (!visible || !chart || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = window.matchMedia("(max-width: 760px)");
    let frame = 0;
    let timer = 0;
    let inView = false;
    let hasStarted = false;
    let ribbon: SVGPathElement | null = null;

    const stop = () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      ribbon?.setAttribute("d", "");
    };

    const start = () => {
      stop();
      const svg = chart.querySelector<SVGSVGElement>(media.matches ? ".offset-field-mobile-path" : ".offset-field-desktop-path");
      const line = svg?.querySelector<SVGPathElement>(".offset-field-path-line");
      ribbon = svg?.querySelector<SVGPathElement>(".offset-field-path-ribbon") ?? null;
      if (!line || !ribbon) return;

      const length = line.getTotalLength();
      const points = Array.from({ length: 513 }, (_, index) => line.getPointAtLength(length * index / 512));
      const sample = (distance: number) => {
        const position = Math.max(0, Math.min(512, distance / length * 512));
        const index = Math.min(511, Math.floor(position));
        const blend = position - index;
        return { x: points[index].x + (points[index + 1].x - points[index].x) * blend, y: points[index].y + (points[index + 1].y - points[index].y) * blend };
      };
      const span = length * .15;
      const duration = 6400;
      let beganAt = 0;
      let lastDraw = 0;

      const draw = (now: number) => {
        if (now - lastDraw >= 32) {
          const travel = ((now - beganAt) % duration) / duration;
          const center = -span / 2 + travel * (length + span);
          const upper: string[] = [];
          const lower: string[] = [];
          for (let index = 0; index <= 32; index++) {
            const fraction = index / 32;
            const distance = center + (fraction - .5) * span;
            if (distance < 0 || distance > length) continue;
            const point = sample(distance);
            const before = sample(distance - 2);
            const after = sample(distance + 2);
            const tangent = Math.hypot(after.x - before.x, after.y - before.y) || 1;
            const normalX = -(after.y - before.y) / tangent;
            const normalY = (after.x - before.x) / tangent;
            const halfWidth = 2.75 + 4.5 * Math.sin(Math.PI * fraction) ** 2;
            upper.push(`${(point.x + normalX * halfWidth).toFixed(1)} ${(point.y + normalY * halfWidth).toFixed(1)}`);
            lower.push(`${(point.x - normalX * halfWidth).toFixed(1)} ${(point.y - normalY * halfWidth).toFixed(1)}`);
          }
          ribbon!.setAttribute("d", upper.length > 1 ? `M ${upper.join(" L ")} L ${lower.reverse().join(" L ")} Z` : "");
          lastDraw = now;
        }
        frame = requestAnimationFrame(draw);
      };

      timer = window.setTimeout(() => {
        beganAt = performance.now();
        frame = requestAnimationFrame(draw);
      }, hasStarted ? 0 : 1800);
      hasStarted = true;
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    });
    observer.observe(chart);
    const onMediaChange = () => { if (inView) start(); };
    media.addEventListener("change", onMediaChange);
    return () => { observer.disconnect(); media.removeEventListener("change", onMediaChange); stop(); };
  }, [visible]);

  return (
    <div className="offset-field-note" ref={ref} data-visible={visible}>
      <div className="offset-field-note-head"><span>Field notes</span><span>2020 → Today</span></div>
      <div className="offset-field-path" aria-label="Sandeep's journey from 2020 to today">
        <svg className="offset-field-desktop-path" viewBox="0 0 1000 350" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="offset-field-edge-fade"><stop offset="0%" stopColor="white" stopOpacity="0" /><stop offset="8%" stopColor="white" /><stop offset="92%" stopColor="white" /><stop offset="100%" stopColor="white" stopOpacity="0" /></linearGradient>
            <mask id="offset-field-edge-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="350"><rect width="1000" height="350" fill="url(#offset-field-edge-fade)" /></mask>
          </defs>
          <g mask="url(#offset-field-edge-mask)"><path className="offset-field-path-line" d={desktopWave} pathLength="1000" /><path className="offset-field-path-ribbon" /></g>
        </svg>
        <svg className="offset-field-mobile-path" viewBox="0 0 110 580" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="offset-field-edge-fade-mobile" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="white" stopOpacity="0" /><stop offset="7%" stopColor="white" /><stop offset="92%" stopColor="white" /><stop offset="100%" stopColor="white" stopOpacity="0" /></linearGradient>
            <mask id="offset-field-edge-mask-mobile" maskUnits="userSpaceOnUse" x="0" y="0" width="110" height="580"><rect width="110" height="580" fill="url(#offset-field-edge-fade-mobile)" /></mask>
          </defs>
          <g mask="url(#offset-field-edge-mask-mobile)"><path className="offset-field-path-line" d={mobileWave} pathLength="1000" /><path className="offset-field-path-ribbon" /></g>
        </svg>
        {milestones.map((item, index) => <div className={`offset-field-stop offset-field-stop-${index + 1}`} key={item.year} style={{ "--stop-index": index } as CSSProperties}><i aria-hidden="true" /><div><span>{item.year}</span><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}
      </div>
    </div>
  );
}
