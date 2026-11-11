"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { animate, Spring } from "@/lib/lumen/springs";
import { SoftLayers, softStyle, type Body } from "./Soft";
import { haptic, tone } from "./feedback";

const BEATS: { name: string; body: Body }[] = [
  { name: "Hook", body: "putty" },
  { name: "Problem", body: "clay" },
  { name: "Reveal", body: "sage" },
  { name: "Proof", body: "peach" },
  { name: "Price", body: "putty" },
  { name: "Outro", body: "sage" },
];
const START: [number, number][] = [
  [0, 0],
  [2, 1],
  [4, 0],
  [1, 2],
  [5, 2],
  [3, 1],
];
const ROWS = 3;
const SLOP = 6;
const zone = (col: number, row: number) => `${String.fromCharCode(65 + col)}${row + 1}`;

type Tile = { col: number; row: number; x: Spring; y: Spring; rot: Spring };
type Drag = {
  id: number;
  sx: number;
  sy: number;
  ox: number;
  oy: number;
  lx: number;
  ly: number;
  lt: number;
  vx: number;
  vy: number;
  active: boolean;
};

/** Snap with give: beats move freely, then land on the nearest free cell and wobble once. */
export default function SnapField() {
  const wrap = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const tileEls = useRef<(HTMLDivElement | null)[]>([]);
  const [grid, setGrid] = useState({ cell: 96, cols: 8 });
  const [readout, setReadout] = useState("Six beats on a three-row grid");
  const [labels, setLabels] = useState(() => START.map(([c, r]) => zone(c, r)));
  const tiles = useRef<Tile[]>(
    START.map(([col, row]) => ({
      col,
      row,
      x: new Spring(0, "snap", 0.3),
      y: new Spring(0, "snap", 0.3),
      rot: new Spring(0, "snap", 0.05),
    })),
  );
  const gridRef = useRef(grid);
  // Drags live in a ref: the readout re-renders the field on every move, and a drag kept in
  // render scope would be dropped mid-gesture, leaving the beat stuck where it was.
  const drags = useRef<(Drag | null)[]>([]);

  const render = (index: number) => {
    const t = tiles.current[index];
    const el = tileEls.current[index];
    if (!el) return;
    const sx = 1 + Math.min(0.1, Math.abs(t.x.v) / 8000) - Math.min(0.06, Math.abs(t.y.v) / 12000);
    const sy = 1 + Math.min(0.1, Math.abs(t.y.v) / 8000) - Math.min(0.06, Math.abs(t.x.v) / 12000);
    el.style.translate = `${t.x.x.toFixed(1)}px ${t.y.x.toFixed(1)}px`;
    el.style.rotate = `${t.rot.x.toFixed(2)}deg`;
    el.style.scale = `${sx.toFixed(3)} ${sy.toFixed(3)}`;
  };

  const occupied = (col: number, row: number, except: number) =>
    tiles.current.some((t, i) => i !== except && t.col === col && t.row === row);

  const nearestFree = (px: number, py: number, except: number) => {
    const { cell, cols } = gridRef.current;
    let best: [number, number] | null = null;
    let bestDistance = Infinity;
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < ROWS; r++) {
        if (occupied(c, r, except)) continue;
        const d = Math.hypot(c * cell - px, r * cell - py);
        if (d < bestDistance) {
          bestDistance = d;
          best = [c, r];
        }
      }
    return best;
  };

  const settle = (index: number) => {
    const t = tiles.current[index];
    const { cell } = gridRef.current;
    t.x.target = t.col * cell;
    t.y.target = t.row * cell;
    t.rot.target = 0;
    setLabels((current) => current.map((label, i) => (i === index ? zone(t.col, t.row) : label)));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let landed = false;
    animate((dt) => {
      t.x.step(dt, reduced);
      t.y.step(dt, reduced);
      t.rot.step(dt, reduced);
      render(index);
      if (!landed && Math.hypot(t.x.x - t.x.target, t.y.x - t.y.target) < 3) {
        landed = true;
        tone("snap");
        haptic(10);
        setReadout(`${BEATS[index].name} landed on ${zone(t.col, t.row)}`);
      }
      if (t.x.resting && t.y.resting && t.rot.resting) {
        t.x.jump(t.x.target);
        t.y.jump(t.y.target);
        t.rot.jump(0);
        render(index);
        return false;
      }
      return true;
    });
  };

  // Fit the grid to the plate before paint; tiles that fall off the edge move to the nearest
  // free cell.
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let lastWidth = 0;
    const layout = () => {
      const width = el.clientWidth - 24;
      if (width === lastWidth) return;
      lastWidth = width;
      const cell = width < 520 ? 72 : width < 820 ? 84 : 96;
      const cols = Math.max(4, Math.min(12, Math.floor(width / cell)));
      gridRef.current = { cell, cols };
      tiles.current.forEach((t, i) => {
        if (t.col >= cols || occupied(t.col, t.row, i)) {
          const next = nearestFree(Math.min(t.col, cols - 1) * cell, t.row * cell, i);
          if (next) [t.col, t.row] = next;
        }
        t.x.jump(t.col * cell);
        t.y.jump(t.row * cell);
        render(i);
      });
      setLabels(tiles.current.map((t) => zone(t.col, t.row)));
      setGrid({ cell, cols });
    };
    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- layout reads refs only
  }, []);

  const endDrag = (index: number, el: HTMLElement, pointerId: number) => {
    const current = drags.current[index];
    if (!current || pointerId !== current.id) return;
    drags.current[index] = null;
    if (!current.active) return;
    el.classList.remove("is-dragging");
    ghost.current?.classList.remove("is-on");
    const t = tiles.current[index];
    const target = nearestFree(t.x.x + current.vx * 0.15, t.y.x + current.vy * 0.15, index);
    if (target) [t.col, t.row] = target;
    settle(index);
  };

  const bindDrag = (index: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const t = tiles.current[index];
      // A drag must never turn into a text selection: drop any selection already on the page.
      window.getSelection()?.removeAllRanges();
      event.currentTarget.setPointerCapture(event.pointerId);
      drags.current[index] = {
        id: event.pointerId,
        sx: event.clientX,
        sy: event.clientY,
        ox: t.x.x,
        oy: t.y.x,
        lx: t.x.x,
        ly: t.y.x,
        lt: performance.now(),
        vx: 0,
        vy: 0,
        active: false,
      };
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      const drag = drags.current[index];
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.sx;
      const dy = event.clientY - drag.sy;
      if (!drag.active) {
        if (Math.hypot(dx, dy) <= SLOP) return;
        drag.active = true;
        el.classList.add("is-dragging");
      }
      const { cell, cols } = gridRef.current;
      const t = tiles.current[index];
      const now = performance.now();
      const dt = Math.max(1, now - drag.lt) / 1000;
      const nx = Math.max(-cell * 0.3, Math.min((cols - 0.7) * cell, drag.ox + dx));
      const ny = Math.max(-cell * 0.3, Math.min((ROWS - 0.7) * cell, drag.oy + dy));
      drag.vx = drag.vx * 0.6 + ((nx - drag.lx) / dt) * 0.4;
      drag.vy = drag.vy * 0.6 + ((ny - drag.ly) / dt) * 0.4;
      drag.lx = nx;
      drag.ly = ny;
      drag.lt = now;
      t.x.x = t.x.target = nx;
      t.y.x = t.y.target = ny;
      t.x.v = drag.vx;
      t.y.v = drag.vy;
      t.rot.target = Math.max(-10, Math.min(10, drag.vx / 90));
      t.rot.step(dt);
      render(index);
      const target = nearestFree(nx + drag.vx * 0.15, ny + drag.vy * 0.15, index);
      if (target && ghost.current) {
        ghost.current.style.translate = `${target[0] * cell}px ${target[1] * cell}px`;
        ghost.current.classList.add("is-on");
        setReadout(
          `${BEATS[index].name} → ${zone(target[0], target[1])} · ${Math.round(Math.hypot(target[0] * cell - nx, target[1] * cell - ny))} px to go`,
        );
      }
    },
    onPointerUp: (event: React.PointerEvent<HTMLDivElement>) =>
      endDrag(index, event.currentTarget, event.pointerId),
    onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) =>
      endDrag(index, event.currentTarget, event.pointerId),
    onLostPointerCapture: (event: React.PointerEvent<HTMLDivElement>) =>
      endDrag(index, event.currentTarget, event.pointerId),
  });

  return (
    <div className="ld-field-wrap" ref={wrap}>
      <div
        className="ld-field"
        ref={field}
        data-compact={grid.cell < 84}
        style={
          {
            "--cell": `${grid.cell}px`,
            "--cols": grid.cols,
            width: grid.cols * grid.cell,
          } as React.CSSProperties
        }
      >
        <div className="ld-zones-x ld-anno" aria-hidden="true">
          {Array.from({ length: grid.cols }, (_, c) => (
            <span key={c}>{String.fromCharCode(65 + c)}</span>
          ))}
        </div>
        <div className="ld-zones-y ld-anno" aria-hidden="true">
          {Array.from({ length: ROWS }, (_, r) => (
            <span key={r}>{r + 1}</span>
          ))}
        </div>
        <div className="ld-ghost" ref={ghost} aria-hidden="true" />
        {BEATS.map((beat, index) => {
          const handlers = bindDrag(index);
          return (
            <div
              key={beat.name}
              ref={(el) => {
                tileEls.current[index] = el;
              }}
              className="ld-tile ld-soft"
              style={softStyle(beat.body)}
              role="button"
              tabIndex={0}
              aria-describedby="ld-beat-help"
              {...handlers}
              onKeyDown={(event) => {
                const step = {
                  ArrowLeft: [-1, 0],
                  ArrowRight: [1, 0],
                  ArrowUp: [0, -1],
                  ArrowDown: [0, 1],
                }[event.key];
                if (!step) return;
                event.preventDefault();
                const t = tiles.current[index];
                const col = t.col + step[0];
                const row = t.row + step[1];
                if (col < 0 || row < 0 || col >= gridRef.current.cols || row >= ROWS) {
                  setReadout(`${beat.name} is at the edge of the grid`);
                  return;
                }
                if (occupied(col, row, index)) {
                  setReadout(`${zone(col, row)} is taken`);
                  return;
                }
                t.col = col;
                t.row = row;
                t.x.v = step[0] * 300;
                t.y.v = step[1] * 300;
                settle(index);
              }}
            >
              <SoftLayers />
              <span className="ld-anno">Beat 0{index + 1}</span>
              <strong>{beat.name}</strong>
              <span className="ld-sr-only">, cell {labels[index]}</span>
            </div>
          );
        })}
      </div>
      <p id="ld-beat-help" className="ld-sr-only">
        Drag a beat, or use the arrow keys to move it one cell.
      </p>
      <p className="ld-readout ld-anno" aria-live="polite">
        {readout}
      </p>
    </div>
  );
}
