"use client";

import VersionSwitch from "@/components/review/VersionSwitch";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { animate } from "@/lib/lumen/springs";
import type { Rect, Region, Stop } from "./content";

type Cam = { x: number; y: number; s: number };
type Flight = { at: (t: number) => [number, number, number]; start: number; duration: number };
type Pointer = { x: number; y: number };

const MIN_S = 0.1;
const MAX_S = 2.6;
const NARROW = 720;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Van Wijk and Nuij's smooth zoom: the camera pulls back while it travels and settles in at the
 * end, so a long jump across the map stays readable. Positions are world centres, w is the
 * visible width in world units.
 */
function zoomPath(a: [number, number, number], b: [number, number, number], rho = 1.42) {
  const [x0, y0, w0] = a;
  const [x1, y1, w1] = b;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const d2 = dx * dx + dy * dy;
  const rho2 = rho * rho;
  if (d2 < 1e-6) {
    const S = Math.log(w1 / w0) / rho;
    return {
      S: Math.abs(S),
      at: (t: number): [number, number, number] => [
        x0 + t * dx,
        y0 + t * dy,
        w0 * Math.exp(rho * t * S),
      ],
    };
  }
  const d1 = Math.sqrt(d2);
  const b0 = (w1 * w1 - w0 * w0 + rho2 * rho2 * d2) / (2 * w0 * rho2 * d1);
  const b1 = (w1 * w1 - w0 * w0 - rho2 * rho2 * d2) / (2 * w1 * rho2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / rho;
  return {
    S,
    at: (t: number): [number, number, number] => {
      const s = t * S;
      const cosh0 = Math.cosh(r0);
      const u = (w0 / (rho2 * d1)) * (cosh0 * Math.tanh(rho * s + r0) - Math.sinh(r0));
      return [x0 + u * dx, y0 + u * dy, (w0 * cosh0) / Math.cosh(rho * s + r0)];
    },
  };
}

/** A ruler step that keeps labels at least ~90 px apart on screen. */
function rulerStep(s: number) {
  for (const step of [25, 50, 100, 200, 250, 500, 1000, 2000]) if (step * s >= 90) return step;
  return 5000;
}

export default function AtlasCanvas({
  stops,
  regions,
  world,
  children,
}: {
  stops: Stop[];
  regions: Region[];
  world: { w: number; h: number };
  children: React.ReactNode;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const worldEl = useRef<HTMLDivElement>(null);
  const rulerX = useRef<HTMLCanvasElement>(null);
  const rulerY = useRef<HTMLCanvasElement>(null);
  const miniView = useRef<SVGRectElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  const cam = useRef<Cam>({ x: 1150, y: 1410, s: 1 });
  const flight = useRef<Flight | null>(null);
  const zoomTo = useRef<{ s: number; px: number; py: number; wx: number; wy: number } | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const running = useRef(false);
  const idleTimer = useRef(0);
  const lod = useRef("");
  const pointers = useRef(new Map<number, Pointer>());
  const gesture = useRef({ moved: false, lastT: 0, lastX: 0, lastY: 0, pinch: 0 });
  const lastPointer = useRef(0);
  const cursor = useRef<{ x: number; y: number } | null>(null);
  const tick = useRef<(dt: number) => boolean>(() => false);

  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"map" | "list">("map");
  const [readerOpen, setReaderOpen] = useState(true);
  const [hint, setHint] = useState(true);
  const activeRef = useRef(0);

  /** The part of the screen the map can use, between the top bar and the tour bar. */
  const frame = useCallback(() => {
    const el = viewport.current;
    const vw = el?.clientWidth ?? 1200;
    const vh = el?.clientHeight ?? 800;
    const narrow = vw < NARROW;
    const top = narrow ? 64 : 76;
    const bottom = narrow ? (readerOpen ? Math.min(vh * 0.46, 380) : 132) : 128;
    const side = narrow ? 14 : 48;
    return {
      vw,
      vh,
      cx: vw / 2,
      cy: top + (vh - top - bottom) / 2,
      w: vw - side * 2,
      h: vh - top - bottom,
    };
  }, [readerOpen]);

  const fit = useCallback(
    (rect: Rect): Cam => {
      const f = frame();
      const s = Math.min(MAX_S, Math.max(MIN_S, Math.min(f.w / rect.w, f.h / rect.h)));
      return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, s };
    },
    [frame],
  );

  const draw = useCallback(() => {
    const el = viewport.current;
    const w = worldEl.current;
    if (!el || !w) return;
    const { x, y, s } = cam.current;
    const f = frame();
    const tx = f.cx - x * s;
    const ty = f.cy - y * s;
    w.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
    el.style.setProperty("--s", s.toFixed(4));
    let grid = 40;
    while (grid * s < 18) grid *= 2;
    while (grid * s > 48) grid /= 2;
    el.style.setProperty("--grid", `${(grid * s).toFixed(2)}px`);
    el.style.setProperty("--gx", `${tx.toFixed(1)}px`);
    el.style.setProperty("--gy", `${ty.toFixed(1)}px`);
    const level = s < 0.36 ? "far" : s < 0.78 ? "mid" : "near";
    if (level !== lod.current) {
      lod.current = level;
      el.dataset.lod = level;
    }

    // Rulers: world coordinates along the top and left edges.
    const styles = getComputedStyle(el);
    const ink = styles.getPropertyValue("--atlas-mute").trim() || "#667";
    const dpr = window.devicePixelRatio || 1;
    const step = rulerStep(s);
    for (const [canvas, horizontal] of [
      [rulerX.current, true],
      [rulerY.current, false],
    ] as const) {
      if (!canvas) continue;
      const length = horizontal ? f.vw : f.vh;
      const thick = 22;
      if (canvas.width !== Math.round(length * dpr)) {
        canvas.width = Math.round((horizontal ? length : thick) * dpr);
        canvas.height = Math.round((horizontal ? thick : length) * dpr);
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, horizontal ? length : thick, horizontal ? thick : length);
      ctx.fillStyle = ink;
      ctx.strokeStyle = ink;
      ctx.font = "10px var(--atlas-mono), ui-monospace, monospace";
      ctx.lineWidth = 1;
      const offset = horizontal ? tx : ty;
      const first = Math.floor(-offset / s / (step / 5)) * (step / 5);
      const last = (length - offset) / s;
      ctx.beginPath();
      for (let v = first; v <= last; v += step / 5) {
        const p = Math.round(v * s + offset) + 0.5;
        const major = Math.abs(v % step) < 0.01;
        const tick = major ? 9 : 4;
        if (horizontal) {
          ctx.moveTo(p, thick);
          ctx.lineTo(p, thick - tick);
          if (major && p > 30) ctx.fillText(String(Math.round(v)), p + 3, 10);
        } else {
          ctx.moveTo(thick, p);
          ctx.lineTo(thick - tick, p);
          if (major && p > 30) {
            ctx.save();
            ctx.translate(10, p - 3);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(String(Math.round(v)), 0, 0);
            ctx.restore();
          }
        }
      }
      ctx.stroke();
    }

    // Minimap viewport rectangle.
    const mini = miniView.current;
    if (mini) {
      mini.setAttribute("x", String(-tx / s));
      mini.setAttribute("y", String(-ty / s));
      mini.setAttribute("width", String(f.vw / s));
      mini.setAttribute("height", String(f.vh / s));
    }
    if (readout.current) {
      const c = cursor.current;
      const wx = c ? (c.x - tx) / s : x;
      const wy = c ? (c.y - ty) / s : y;
      readout.current.textContent = `x ${Math.round(wx)} · y ${Math.round(wy)} · ${s.toFixed(2)}×`;
    }
  }, [frame]);

  const clamp = useCallback(() => {
    const c = cam.current;
    c.s = Math.min(MAX_S, Math.max(MIN_S, c.s));
    c.x = Math.min(world.w + 200, Math.max(-200, c.x));
    c.y = Math.min(world.h + 200, Math.max(-200, c.y));
  }, [world]);

  /** Text is rasterised once while moving, then re-drawn sharp when the camera rests. */
  const settle = () => {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      viewport.current?.classList.remove("is-moving");
    }, 140);
  };
  const run = useCallback(() => {
    window.clearTimeout(idleTimer.current);
    viewport.current?.classList.add("is-moving");
    if (running.current) return;
    running.current = true;
    animate((dt) => tick.current(dt));
  }, []);

  // The frame step reads the latest closures; it is swapped in after each render.
  useLayoutEffect(() => {
    tick.current = (dt: number) => {
      const c = cam.current;
      let moving = false;
      if (flight.current) {
        const { at, start, duration } = flight.current;
        const t = Math.min(1, (performance.now() - start) / duration);
        const [x, y, w] = at(ease(t));
        c.x = x;
        c.y = y;
        c.s = frame().w / w;
        if (t >= 1) flight.current = null;
        moving = true;
      } else if (zoomTo.current) {
        const z = zoomTo.current;
        const k = 1 - Math.exp(-dt * 16);
        const next = Math.exp(Math.log(c.s) + (Math.log(z.s) - Math.log(c.s)) * k);
        c.s = Math.abs(next - z.s) < 0.0008 ? z.s : next;
        const f = frame();
        c.x = z.wx - (z.px - f.cx) / c.s;
        c.y = z.wy - (z.py - f.cy) / c.s;
        if (c.s === z.s) zoomTo.current = null;
        moving = true;
      } else {
        const v = velocity.current;
        if (Math.hypot(v.x, v.y) > 6 / c.s) {
          c.x += v.x * dt;
          c.y += v.y * dt;
          const decay = Math.exp(-dt * 4.2);
          v.x *= decay;
          v.y *= decay;
          moving = true;
        } else {
          v.x = v.y = 0;
        }
      }
      clamp();
      draw();
      if (!moving) settle();
      running.current = moving;
      return moving;
    };
  });

  const stopMotion = () => {
    flight.current = null;
    zoomTo.current = null;
    velocity.current = { x: 0, y: 0 };
  };

  const flyTo = useCallback(
    (to: Cam) => {
      stopMotion();
      const f = frame();
      if (reducedMotion()) {
        cam.current = { ...to };
        clamp();
        draw();
        return;
      }
      const from = cam.current;
      const path = zoomPath([from.x, from.y, f.w / from.s], [to.x, to.y, f.w / to.s]);
      const duration = Math.min(1700, Math.max(520, path.S * 560));
      flight.current = { at: path.at, start: performance.now(), duration };
      run();
    },
    [clamp, draw, frame, run],
  );

  const goTo = useCallback(
    (index: number) => {
      const i = (index + stops.length) % stops.length;
      activeRef.current = i;
      setActive(i);
      setHint(false);
      flyTo(fit(stops[i].rect));
    },
    [fit, flyTo, stops, setActive],
  );

  const overview = useCallback(() => {
    setHint(false);
    flyTo(fit({ x: 0, y: 0, w: world.w, h: world.h }));
  }, [fit, flyTo, world]);

  const zoomBy = useCallback(
    (factor: number, px?: number, py?: number) => {
      flight.current = null;
      velocity.current = { x: 0, y: 0 };
      const f = frame();
      const c = cam.current;
      const sx = px ?? f.cx;
      const sy = py ?? f.cy;
      const base = zoomTo.current?.s ?? c.s;
      const s = Math.min(MAX_S, Math.max(MIN_S, base * factor));
      const wx = zoomTo.current ? zoomTo.current.wx : c.x + (sx - f.cx) / c.s;
      const wy = zoomTo.current ? zoomTo.current.wy : c.y + (sy - f.cy) / c.s;
      zoomTo.current = { s, px: sx, py: sy, wx, wy };
      if (reducedMotion()) {
        c.s = s;
        c.x = wx - (sx - f.cx) / s;
        c.y = wy - (sy - f.cy) / s;
        zoomTo.current = null;
        clamp();
        draw();
        return;
      }
      run();
    },
    [clamp, draw, frame, run],
  );

  // First frame: open on the whole map, then fly in to the origin.
  useLayoutEffect(() => {
    if (mode !== "map") return;
    const home = fit(stops[activeRef.current].rect);
    if (reducedMotion() || sessionStorageGet("atlas-seen")) {
      cam.current = home;
      draw();
      return;
    }
    cam.current = fit({ x: 0, y: 0, w: world.w, h: world.h });
    draw();
    const timer = window.setTimeout(() => {
      sessionStorageSet("atlas-seen");
      flyTo(home);
    }, 650);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs when the map is shown
  }, [mode]);

  // Keep the current stop framed when the window or the reader changes size.
  useEffect(() => {
    const el = viewport.current;
    if (!el || mode !== "map") return;
    let last = `${el.clientWidth}x${el.clientHeight}`;
    const observer = new ResizeObserver(() => {
      const size = `${el.clientWidth}x${el.clientHeight}`;
      if (size === last) return;
      last = size;
      if (!flight.current) {
        cam.current = { ...fit(stops[activeRef.current].rect) };
      }
      draw();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [draw, fit, mode, stops]);

  useEffect(() => {
    if (mode === "map") draw();
  }, [readerOpen, draw, mode]);

  // Wheel: trackpads pan with two fingers and zoom with a pinch; mouse wheels zoom.
  useEffect(() => {
    const el = viewport.current;
    if (!el || mode !== "map") return;
    const onWheel = (event: WheelEvent) => {
      if ((event.target as HTMLElement).closest(".atlas-reader, .atlas-chrome")) return;
      event.preventDefault();
      setHint(false);
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const lines = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1;
      const dy = event.deltaY * lines;
      const mouseWheel =
        event.deltaMode !== 0 || (event.deltaX === 0 && Math.abs(dy) >= 48 && dy % 1 === 0);
      if (event.ctrlKey || mouseWheel) {
        zoomBy(Math.exp(-dy * (event.ctrlKey ? 0.012 : 0.0016)), px, py);
        return;
      }
      stopMotion();
      const c = cam.current;
      c.x += (event.deltaX * lines) / c.s;
      c.y += dy / c.s;
      clamp();
      draw();
      viewport.current?.classList.add("is-moving");
      settle();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handlers read refs
  }, [mode, zoomBy]);

  // Keyboard: arrows pan, + and − zoom, 0 shows everything, N and P walk the tour.
  useEffect(() => {
    if (mode !== "map") return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const c = cam.current;
      const nudge = 520 / c.s;
      const pans: Record<string, [number, number]> = {
        ArrowLeft: [-nudge, 0],
        ArrowRight: [nudge, 0],
        ArrowUp: [0, -nudge],
        ArrowDown: [0, nudge],
      };
      if (pans[event.key] && !target.closest("button, a, [role='button']")) {
        event.preventDefault();
        flight.current = null;
        zoomTo.current = null;
        velocity.current = { x: pans[event.key][0] * 2.4, y: pans[event.key][1] * 2.4 };
        if (reducedMotion()) {
          c.x += pans[event.key][0] / 2;
          c.y += pans[event.key][1] / 2;
          velocity.current = { x: 0, y: 0 };
          clamp();
          draw();
          return;
        }
        run();
      } else if (event.key === "+" || event.key === "=") zoomBy(1.4);
      else if (event.key === "-" || event.key === "_") zoomBy(1 / 1.4);
      else if (event.key === "0") overview();
      else if (event.key === "n" || event.key === "N") goTo(activeRef.current + 1);
      else if (event.key === "p" || event.key === "P") goTo(activeRef.current - 1);
      else return;
      setHint(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handlers read refs
  }, [mode, goTo, overview, zoomBy]);

  const local = (event: React.PointerEvent) => {
    const rect = viewport.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "map" || event.button !== 0) return;
    if ((event.target as HTMLElement).closest(".atlas-reader, .atlas-chrome")) return;
    lastPointer.current = performance.now();
    pointers.current.set(event.pointerId, local(event));
    stopMotion();
    const g = gesture.current;
    if (pointers.current.size === 1) {
      g.moved = false;
      g.lastT = performance.now();
      g.lastX = event.clientX;
      g.lastY = event.clientY;
    }
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.pinch = Math.hypot(a.x - b.x, a.y - b.y);
      g.moved = true;
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "map") return;
    const p = local(event);
    cursor.current = event.pointerType === "mouse" ? p : null;
    const prev = pointers.current.get(event.pointerId);
    if (!prev) {
      if (event.pointerType === "mouse" && !running.current) draw();
      return;
    }
    const c = cam.current;
    const g = gesture.current;
    if (pointers.current.size >= 2) {
      const others = [...pointers.current.entries()].filter(([id]) => id !== event.pointerId);
      const other = others[0][1];
      const before = { x: (prev.x + other.x) / 2, y: (prev.y + other.y) / 2 };
      const after = { x: (p.x + other.x) / 2, y: (p.y + other.y) / 2 };
      const distance = Math.hypot(p.x - other.x, p.y - other.y);
      const f = frame();
      const wx = c.x + (before.x - f.cx) / c.s;
      const wy = c.y + (before.y - f.cy) / c.s;
      c.s = Math.min(MAX_S, Math.max(MIN_S, c.s * (distance / (g.pinch || distance))));
      g.pinch = distance;
      c.x = wx - (after.x - f.cx) / c.s;
      c.y = wy - (after.y - f.cy) / c.s;
    } else {
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      if (!g.moved && Math.hypot(event.clientX - g.lastX, event.clientY - g.lastY) < 5) return;
      if (!g.moved) {
        g.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        window.getSelection()?.removeAllRanges();
        viewport.current?.classList.add("is-grabbing");
        setHint(false);
      }
      c.x -= dx / c.s;
      c.y -= dy / c.s;
      const now = performance.now();
      const dt = Math.max(1, now - g.lastT) / 1000;
      const v = velocity.current;
      v.x = v.x * 0.5 + (-dx / c.s / dt) * 0.5;
      v.y = v.y * 0.5 + (-dy / c.s / dt) * 0.5;
      g.lastT = now;
    }
    pointers.current.set(event.pointerId, p);
    clamp();
    draw();
    viewport.current?.classList.add("is-moving");
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);
    viewport.current?.classList.remove("is-grabbing");
    const g = gesture.current;
    if (pointers.current.size === 0 && g.moved) {
      // Only throw when the finger was still moving at release.
      if (performance.now() - g.lastT > 70 || reducedMotion()) velocity.current = { x: 0, y: 0 };
      run();
    } else if (pointers.current.size === 1) {
      g.pinch = 0;
      const [rest] = [...pointers.current.values()];
      g.lastX = rest.x;
      g.lastY = rest.y;
    }
  };

  // A drag ends in a click on whatever was under the finger; swallow it. A plain click on an
  // island flies to it.
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gesture.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      gesture.current.moved = false;
      return;
    }
    const target = event.target as HTMLElement;
    if (mode !== "map" || target.closest("a, button, .atlas-reader, .atlas-chrome")) return;
    const island = target.closest<HTMLElement>("[data-stop]");
    if (island) {
      const index = stops.findIndex((stop) => stop.id === island.dataset.stop);
      if (index >= 0) goTo(index);
    }
  };

  // Tabbing through the map flies the camera to whatever has focus.
  const onFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (mode !== "map" || performance.now() - lastPointer.current < 600) return;
    const island = (event.target as HTMLElement).closest<HTMLElement>("[data-stop]");
    if (!island) return;
    const index = stops.findIndex((stop) => stop.id === island.dataset.stop);
    if (index >= 0 && index !== activeRef.current) goTo(index);
  };

  const stop = stops[active];
  const toggleMode = () => {
    stopMotion();
    setMode((current) => (current === "map" ? "list" : "map"));
  };

  return (
    <div
      ref={viewport}
      className="atlas-viewport"
      data-mode={mode}
      data-lod="mid"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => {
        cursor.current = null;
      }}
      onClickCapture={onClickCapture}
      onFocus={onFocus}
    >
      <div className="atlas-grid" aria-hidden="true" />
      <div ref={worldEl} className="atlas-world" style={{ width: world.w, height: world.h }}>
        {children}
      </div>

      <canvas ref={rulerX} className="atlas-ruler atlas-ruler-x" aria-hidden="true" />
      <canvas ref={rulerY} className="atlas-ruler atlas-ruler-y" aria-hidden="true" />

      <div className="atlas-chrome atlas-top">
        <a
          className="atlas-mark"
          href="#atlas-origin"
          onClick={(e) => (e.preventDefault(), goTo(0))}
        >
          <span className="atlas-mark-pin" aria-hidden="true" />
          Sandeep Kumar <em>Atlas</em>
        </a>
        <VersionSwitch current={2} className="atlas-versions" />
        <div className="atlas-tools">
          <button
            type="button"
            className="atlas-chip"
            onClick={toggleMode}
            aria-pressed={mode === "list"}
          >
            {mode === "map" ? "Read as a list" : "Back to the map"}
          </button>
          <ThemeChip />
        </div>
      </div>

      {mode === "map" && (
        <>
          <div className="atlas-chrome atlas-zoom" role="group" aria-label="Zoom">
            <button type="button" onClick={() => zoomBy(1.4)} aria-label="Zoom in">
              +
            </button>
            <button type="button" onClick={() => zoomBy(1 / 1.4)} aria-label="Zoom out">
              −
            </button>
            <button type="button" onClick={overview} aria-label="Show the whole map">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          </div>

          <svg
            className="atlas-chrome atlas-mini"
            viewBox={`0 0 ${world.w} ${world.h}`}
            role="img"
            aria-label="Minimap. Click to move there."
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - box.left) / box.width) * world.w;
              const y = ((event.clientY - box.top) / box.height) * world.h;
              setHint(false);
              flyTo({ x, y, s: Math.max(cam.current.s, 0.45) });
            }}
          >
            {regions.map((region) => (
              <rect
                key={region.id}
                x={region.rect.x}
                y={region.rect.y}
                width={region.rect.w}
                height={region.rect.h}
                rx="60"
                className={stop.rect && contains(region.rect, stop.rect) ? "is-here" : undefined}
              />
            ))}
            <rect ref={miniView} className="atlas-mini-view" rx="30" />
          </svg>

          <span className="atlas-chrome atlas-readout" ref={readout} aria-hidden="true" />

          {hint && (
            <p className="atlas-chrome atlas-hint">
              Drag to explore · scroll or pinch to zoom · or take the tour
              <span aria-hidden="true"> ↓</span>
            </p>
          )}
        </>
      )}

      {mode === "map" && (
        <aside className="atlas-chrome atlas-reader" data-open={readerOpen} aria-label="Tour">
          <div className="atlas-tour">
            <button
              type="button"
              className="atlas-step"
              onClick={() => goTo(active - 1)}
              aria-label="Previous stop"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
            <button
              type="button"
              className="atlas-stop"
              onClick={() => setReaderOpen((open) => !open)}
              aria-expanded={readerOpen}
            >
              <span className="atlas-stop-count">
                {String(active + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}
              </span>
              <span className="atlas-stop-kicker">{stop.kicker}</span>
              <strong aria-live="polite">{stop.title}</strong>
            </button>
            <button
              type="button"
              className="atlas-step atlas-step-next"
              onClick={() => goTo(active + 1)}
              aria-label="Next stop"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
          <ol className="atlas-dots" aria-label="Stops">
            {stops.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-label={`${s.kicker}: ${s.title}`}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => goTo(i)}
                />
              </li>
            ))}
          </ol>
          {/* On phones the map is for finding your way and this sheet is for reading. */}
          <div className="atlas-sheet" hidden={!readerOpen}>
            <p>{stop.summary}</p>
            {stop.points && (
              <ul>
                {stop.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
            {stop.facts && (
              <dl className="atlas-facts">
                {stop.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {stop.links && (
              <p className="atlas-links">
                {stop.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                    <span aria-hidden="true">{link.external ? " ↗" : " →"}</span>
                  </a>
                ))}
              </p>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

const contains = (outer: Rect, inner: Rect) =>
  inner.x + inner.w / 2 >= outer.x &&
  inner.x + inner.w / 2 <= outer.x + outer.w &&
  inner.y + inner.h / 2 >= outer.y &&
  inner.y + inner.h / 2 <= outer.y + outer.h;

function sessionStorageGet(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function sessionStorageSet(key: string) {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* private mode: the intro simply plays again */
  }
}

const themeListeners = new Set<() => void>();
const readDark = () => {
  const stored = document.documentElement.dataset.atlasTheme;
  return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
};
const subscribeTheme = (listener: () => void) => {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
};

function ThemeChip() {
  const dark = useSyncExternalStore(subscribeTheme, readDark, () => false);
  return (
    <button
      type="button"
      className="atlas-chip"
      aria-pressed={dark}
      onClick={() => {
        const next = !dark;
        document.documentElement.dataset.atlasTheme = next ? "dark" : "light";
        themeListeners.forEach((listener) => listener());
        try {
          localStorage.setItem("atlas-theme", next ? "dark" : "light");
        } catch {
          /* the choice lasts for this visit */
        }
      }}
    >
      Night map
    </button>
  );
}
