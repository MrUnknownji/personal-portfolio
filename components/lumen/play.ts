/**
 * Toys from the tweak panel. Loaded the first time a visitor presses one, never before.
 *
 * Every toy works on what is on screen right now and can be undone: "Put it back" (or Escape)
 * restores the page exactly. Nothing here uses blur, and the dragging in Gravity and Zero-G is
 * written straight to the transform on every pointer event, so a held block never trails the cursor.
 */
import { haptic } from "./feedback";
import { accentInk, onAccent } from "./tweaks";
import "./play.css";

type Stop = () => void | Promise<void>;

let active: { stop: Stop } | null = null;
let pill: HTMLButtonElement | null = null;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
/** Overlays live inside the site root, so they share its fonts and colour tokens. */
const host = () => document.querySelector<HTMLElement>(".ld") ?? document.body;

/* ---------- Shared pieces ---------- */

function onEscape(event: KeyboardEvent) {
  if (event.key === "Escape" && active) void putBack();
}

function showPill(label: string) {
  if (!pill) {
    pill = document.createElement("button");
    pill.type = "button";
    pill.className = "ldp-pill";
    pill.addEventListener("click", () => void putBack());
  }
  pill.textContent = label;
  host().append(pill);
  window.addEventListener("keydown", onEscape);
}

function hidePill() {
  pill?.remove();
  window.removeEventListener("keydown", onEscape);
}

/** Blocks the page from scrolling without touching layout (no overflow change, no shift). */
function lockScroll() {
  const keys = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);
  const block = (event: Event) => event.preventDefault();
  const blockKeys = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, [contenteditable]")) return;
    if (keys.has(event.key)) event.preventDefault();
  };
  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  window.addEventListener("keydown", blockKeys);
  return () => {
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", blockKeys);
  };
}

/** A canvas over the whole viewport, sized for the screen's pixel density (capped for speed). */
function overlayCanvas(className: string) {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  canvas.setAttribute("aria-hidden", "true");
  const ratio = dpr();
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  host().append(canvas);
  const context = canvas.getContext("2d")!;
  context.scale(ratio, ratio);
  return { canvas, context, width, height };
}

const BLOCKS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  "dt",
  "dd",
  "img",
  "svg",
  "video",
  "figure",
  "button",
  "a",
  "label",
  "input",
  "textarea",
  "table",
  "blockquote",
  ".ld-anno",
  ".ld-chip",
].join(",");

/**
 * The visible pieces of the page, largest whole pieces first: a paragraph moves as one, a section
 * does not. Anything inside a piece that is already taken is skipped.
 */
function pickBlocks(limit: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const roots = document.querySelectorAll<HTMLElement>(".ld-top, #ld-main, .ld-footer");
  const kept: HTMLElement[] = [];
  for (const root of roots) {
    for (const el of root.querySelectorAll<HTMLElement>(BLOCKS)) {
      if (kept.length >= limit * 3) break;
      const box = el.getBoundingClientRect();
      if (box.width < 6 || box.height < 6) continue;
      if (box.bottom <= 0 || box.top >= vh || box.right <= 0 || box.left >= vw) continue;
      if (box.width * box.height > vw * vh * 0.22 || box.height > vh * 0.6) continue;
      if (kept.some((parent) => parent.contains(el))) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || Number(style.opacity) < 0.05) continue;
      kept.push(el);
    }
  }
  return kept.slice(0, limit);
}

function shuffle<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/* ---------- Gravity and Zero-G ---------- */

/**
 * A copy of an element that looks the same anywhere: every computed style is written inline, so
 * it no longer depends on where it sat in the page.
 */
function freeze(el: HTMLElement) {
  const clone = el.cloneNode(true) as HTMLElement;
  const copy = (source: Element, target: Element) => {
    const style = getComputedStyle(source);
    let css = "";
    for (let i = 0; i < style.length; i++) {
      const name = style[i];
      if (!name.startsWith("--")) css += `${name}:${style.getPropertyValue(name)};`;
    }
    (target as HTMLElement).style.cssText =
      `${css}animation:none;transition:none;content-visibility:visible;pointer-events:none;`;
    target.removeAttribute("id");
    if (target.matches("a, button, input, textarea, select, [tabindex]"))
      target.setAttribute("tabindex", "-1");
    for (let i = 0; i < source.children.length; i++) copy(source.children[i], target.children[i]);
  };
  copy(el, clone);
  return clone;
}

type Body = {
  source: HTMLElement;
  el: HTMLElement;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  a: number;
  va: number;
  inverseMass: number;
  held: boolean;
};

async function physics(mode: "gravity" | "float") {
  const blocks = pickBlocks(mode === "gravity" ? 90 : 70);
  if (!blocks.length) return;
  const floating = mode === "float";
  const stage = document.createElement("div");
  stage.className = "ldp-stage";
  stage.setAttribute("aria-hidden", "true");

  const bodies: Body[] = blocks.map((source) => {
    const box = source.getBoundingClientRect();
    const el = freeze(source);
    Object.assign(el.style, {
      position: "absolute",
      inset: "auto",
      left: "0px",
      top: "0px",
      margin: "0px",
      width: `${box.width}px`,
      height: `${box.height}px`,
      maxWidth: "none",
      boxSizing: "border-box",
      translate: "none",
      rotate: "none",
      scale: "none",
      transformOrigin: "50% 50%",
      transform: `translate3d(${box.left}px, ${box.top}px, 0)`,
      pointerEvents: "auto",
      cursor: "grab",
      touchAction: "none",
      zIndex: "auto",
    });
    stage.append(el);
    const speed = floating ? rand(50, 150) : 0;
    const angle = rand(0, Math.PI * 2);
    return {
      source,
      el,
      homeX: box.left,
      homeY: box.top,
      x: box.left,
      y: box.top,
      w: box.width,
      h: box.height,
      vx: floating ? Math.cos(angle) * speed : rand(-30, 30),
      vy: floating ? Math.sin(angle) * speed : rand(-60, 0),
      a: 0,
      va: floating ? rand(-0.5, 0.5) : rand(-0.6, 0.6),
      inverseMass: 1 / Math.max(1, (box.width * box.height) / 4000),
      held: false,
    };
  });

  host().append(stage);
  for (const body of bodies) body.source.style.visibility = "hidden";
  const unlock = lockScroll();

  const gravity = floating ? 0 : 2600;
  const bounce = floating ? 0.92 : 0.18;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let frame = 0;
  let last = performance.now();
  let still = 0;

  const draw = (body: Body) => {
    body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.a}rad)`;
  };

  const collide = (a: Body, b: Body) => {
    const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    if (ox <= 0) return;
    const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (oy <= 0) return;
    const ia = a.held ? 0 : a.inverseMass;
    const ib = b.held ? 0 : b.inverseMass;
    const total = ia + ib;
    if (!total) return;
    const alongX = ox < oy;
    const sign = alongX
      ? a.x + a.w / 2 < b.x + b.w / 2
        ? 1
        : -1
      : a.y + a.h / 2 < b.y + b.h / 2
        ? 1
        : -1;
    const overlap = alongX ? ox : oy;
    const relative = alongX ? (b.vx - a.vx) * sign : (b.vy - a.vy) * sign;
    if (alongX) {
      a.x -= (sign * overlap * ia) / total;
      b.x += (sign * overlap * ib) / total;
    } else {
      a.y -= (sign * overlap * ia) / total;
      b.y += (sign * overlap * ib) / total;
    }
    if (relative < 0) {
      const impulse = (-(1 + bounce) * relative) / total;
      if (alongX) {
        a.vx -= impulse * ia * sign;
        b.vx += impulse * ib * sign;
      } else {
        a.vy -= impulse * ia * sign;
        b.vy += impulse * ib * sign;
      }
      if (!floating && -relative > 500) {
        a.va += rand(-1, 1) * ia;
        b.va += rand(-1, 1) * ib;
      }
    }
  };

  const step = (dt: number) => {
    for (const body of bodies) {
      if (body.held) continue;
      body.vy += gravity * dt;
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      body.a += body.va * dt;
      body.va *= floating ? 0.999 : 0.97;
      if (!floating) body.a *= 0.985;
      body.a = Math.max(-0.7, Math.min(0.7, body.a));
      if (body.y + body.h > height) {
        body.y = height - body.h;
        if (body.vy > 0) body.vy = Math.abs(body.vy) < 90 ? 0 : -body.vy * bounce;
        if (!floating) body.vx *= 0.9;
      }
      if (body.y < 0) {
        body.y = 0;
        if (body.vy < 0) body.vy = -body.vy * bounce;
      }
      if (body.x < 0) {
        body.x = 0;
        if (body.vx < 0) body.vx = -body.vx * bounce;
      }
      if (body.x + body.w > width) {
        body.x = Math.max(0, width - body.w);
        if (body.vx > 0) body.vx = -body.vx * bounce;
      }
    }
    for (let pass = 0; pass < 3; pass++)
      for (let i = 0; i < bodies.length; i++)
        for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
  };

  const tick = (now: number) => {
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    for (let i = 0; i < 3; i++) step(dt / 3);
    let moving = false;
    for (const body of bodies) {
      draw(body);
      if (body.held || Math.abs(body.vx) + Math.abs(body.vy) > 12 || Math.abs(body.va) > 0.02)
        moving = true;
    }
    still = moving || floating ? 0 : still + 1;
    // Settled: stop the loop until someone picks a block up again.
    frame = still > 45 ? 0 : requestAnimationFrame(tick);
  };
  const wake = () => {
    if (frame) return;
    still = 0;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    wake();
  };
  window.addEventListener("resize", onResize);

  // Picking up and throwing: the block stays exactly where it was grabbed, with no easing.
  let grab: {
    body: Body;
    id: number;
    dx: number;
    dy: number;
    t: number;
    px: number;
    py: number;
  } | null = null;
  stage.addEventListener("click", (event) => event.preventDefault(), true);
  stage.addEventListener("pointerdown", (event) => {
    const el = (event.target as HTMLElement).closest<HTMLElement>(".ldp-stage > *");
    const body = bodies.find((item) => item.el === el);
    if (!body) return;
    event.preventDefault();
    stage.setPointerCapture(event.pointerId);
    body.held = true;
    body.vx = body.vy = body.va = 0;
    body.el.style.cursor = "grabbing";
    body.el.style.zIndex = "1";
    grab = {
      body,
      id: event.pointerId,
      dx: event.clientX - body.x,
      dy: event.clientY - body.y,
      t: event.timeStamp,
      px: event.clientX,
      py: event.clientY,
    };
    wake();
  });
  stage.addEventListener("pointermove", (event) => {
    if (!grab || grab.id !== event.pointerId) return;
    const { body } = grab;
    body.x = event.clientX - grab.dx;
    body.y = event.clientY - grab.dy;
    const dt = Math.max(1, event.timeStamp - grab.t) / 1000;
    body.vx = body.vx * 0.4 + ((event.clientX - grab.px) / dt) * 0.6;
    body.vy = body.vy * 0.4 + ((event.clientY - grab.py) / dt) * 0.6;
    grab.t = event.timeStamp;
    grab.px = event.clientX;
    grab.py = event.clientY;
    draw(body);
  });
  const release = (event: PointerEvent) => {
    if (!grab || grab.id !== event.pointerId) return;
    const { body } = grab;
    body.held = false;
    body.el.style.cursor = "grab";
    body.el.style.zIndex = "auto";
    const limit = 3200;
    body.vx = Math.max(-limit, Math.min(limit, body.vx));
    body.vy = Math.max(-limit, Math.min(limit, body.vy));
    body.va = body.vx / 900;
    grab = null;
    wake();
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  frame = requestAnimationFrame(tick);
  haptic(floating ? 8 : [10, 30, 16]);

  active = {
    async stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("resize", onResize);
      stage.style.pointerEvents = "none";
      for (const body of bodies) {
        body.el.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s";
        if (body.source.isConnected) {
          const box = body.source.getBoundingClientRect();
          body.el.style.transform = `translate3d(${box.left}px, ${box.top}px, 0)`;
        } else body.el.style.opacity = "0";
      }
      await wait(620);
      for (const body of bodies) body.source.style.visibility = "";
      stage.remove();
      unlock();
    },
  };
  showPill("Put it back");
}

/* ---------- Snap ---------- */

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4.5 0 0 0 -1.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Dust, drawn on one canvas: small flat squares that drift right and up, then fade. */
class Dust {
  private max = 5000;
  private x = new Float32Array(this.max);
  private y = new Float32Array(this.max);
  private vx = new Float32Array(this.max);
  private vy = new Float32Array(this.max);
  private life = new Float32Array(this.max);
  private span = new Float32Array(this.max);
  private size = new Float32Array(this.max);
  private colour = new Uint16Array(this.max);
  private colours: string[] = [];
  private count = 0;
  private layer = overlayCanvas("ldp-canvas");

  tone(value: string) {
    let index = this.colours.indexOf(value);
    if (index < 0) index = this.colours.push(value) - 1;
    return index;
  }

  add(x: number, y: number, tone: number) {
    if (this.count >= this.max) return;
    const i = this.count++;
    this.x[i] = x;
    this.y[i] = y;
    this.vx[i] = rand(25, 95);
    this.vy[i] = rand(-50, 6);
    this.life[i] = 0;
    this.span[i] = rand(1.1, 2.4);
    this.size[i] = rand(1.2, 2.8);
    this.colour[i] = tone;
  }

  get alive() {
    return this.count;
  }

  step(dt: number, time: number) {
    const { context, width, height } = this.layer;
    context.clearRect(0, 0, width, height);
    let i = 0;
    while (i < this.count) {
      this.life[i] += dt;
      if (this.life[i] >= this.span[i]) {
        const last = --this.count;
        this.x[i] = this.x[last];
        this.y[i] = this.y[last];
        this.vx[i] = this.vx[last];
        this.vy[i] = this.vy[last];
        this.life[i] = this.life[last];
        this.span[i] = this.span[last];
        this.size[i] = this.size[last];
        this.colour[i] = this.colour[last];
        continue;
      }
      this.vx[i] += 55 * dt;
      this.vy[i] += (-22 + Math.sin(time * 3 + i) * 40) * dt;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;
      context.globalAlpha = 1 - this.life[i] / this.span[i];
      context.fillStyle = this.colours[this.colour[i]];
      context.fillRect(this.x[i], this.y[i], this.size[i], this.size[i]);
      i++;
    }
    context.globalAlpha = 1;
  }

  remove() {
    this.layer.canvas.remove();
  }
}

function tonesOf(el: HTMLElement) {
  const style = getComputedStyle(el);
  const tones = [style.color];
  const background = style.backgroundColor;
  if (background && !/rgba?\(0, 0, 0, 0\)|transparent/.test(background)) tones.push(background);
  if (el.matches("img, svg, video, figure")) {
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--ld-signal");
    tones.push("#8a8d84", "#4b4e46", "#c9ccc2", accent.trim() || "#7fe3b4");
  }
  return tones;
}

async function snap() {
  const victims = shuffle(pickBlocks(80));
  victims.length = Math.ceil(victims.length / 2);
  if (!victims.length) return;
  const unlock = lockScroll();
  const dust = new Dust();
  const duration = 1500;
  const spread = 1700;
  const start = performance.now();
  const runs = victims.map((el, index) => ({
    el,
    box: el.getBoundingClientRect(),
    tones: tonesOf(el).map((tone) => dust.tone(tone)),
    at: (index / victims.length) * spread + rand(0, 160),
    done: false,
  }));
  for (const run of runs) {
    run.el.classList.add("ldp-dusting");
    run.el.style.setProperty("--ldp-noise", NOISE);
    run.el.style.setProperty("--ldp-p", "0");
  }
  haptic([6, 40, 6, 40, 6]);

  let frame = 0;
  let last = start;
  let stopped = false;
  const tick = (now: number) => {
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    let running = false;
    for (const run of runs) {
      if (run.done) continue;
      const t = (now - start - run.at) / duration;
      if (t < 0) {
        running = true;
        continue;
      }
      const p = Math.min(1, t * t * (3 - 2 * t));
      run.el.style.setProperty("--ldp-p", p.toFixed(4));
      const edge = run.box.left + run.box.width * Math.min(1, p * 1.2 - 0.05);
      const emit = Math.min(26, Math.ceil(run.box.height / 7));
      for (let i = 0; i < emit && p < 1; i++)
        dust.add(
          edge + rand(-14, 4),
          run.box.top + rand(0, run.box.height),
          run.tones[Math.floor(Math.random() * run.tones.length)],
        );
      if (t >= 1) {
        run.done = true;
        run.el.style.visibility = "hidden";
      } else running = true;
    }
    dust.step(dt, now / 1000);
    if (!stopped && (running || dust.alive)) frame = requestAnimationFrame(tick);
    else {
      dust.remove();
      unlock();
    }
  };
  frame = requestAnimationFrame(tick);

  active = {
    async stop() {
      stopped = true;
      cancelAnimationFrame(frame);
      dust.remove();
      unlock();
      // They come back the way they left, in reverse.
      const back = performance.now();
      await new Promise<void>((resolve) => {
        const rewind = (now: number) => {
          const t = Math.min(1, (now - back) / 700);
          const p = 1 - t * t * (3 - 2 * t);
          for (const run of runs) {
            run.el.style.visibility = "";
            run.el.style.setProperty(
              "--ldp-p",
              Math.min(Number(run.el.style.getPropertyValue("--ldp-p")) || 0, p).toFixed(4),
            );
          }
          if (t < 1) requestAnimationFrame(rewind);
          else resolve();
        };
        requestAnimationFrame(rewind);
      });
      for (const run of runs) {
        run.el.classList.remove("ldp-dusting");
        run.el.style.removeProperty("--ldp-p");
        run.el.style.removeProperty("--ldp-noise");
      }
    },
  };
  showPill("Put it back");
}

/* ---------- Burn it ---------- */

function ashPattern(context: CanvasRenderingContext2D) {
  const tile = document.createElement("canvas");
  tile.width = tile.height = 160;
  const g = tile.getContext("2d")!;
  g.fillStyle = "#1b1815";
  g.fillRect(0, 0, 160, 160);
  for (let i = 0; i < 1100; i++) {
    const light = Math.random() < 0.6;
    g.fillStyle = light
      ? `rgba(235, 225, 210, ${rand(0.03, 0.1).toFixed(3)})`
      : `rgba(0, 0, 0, ${rand(0.15, 0.35).toFixed(3)})`;
    g.fillRect(Math.random() * 160, Math.random() * 160, rand(0.6, 2), rand(0.6, 2));
  }
  for (let i = 0; i < 10; i++) {
    g.fillStyle = `rgba(255, 120, 40, ${rand(0.05, 0.14).toFixed(3)})`;
    g.fillRect(Math.random() * 160, Math.random() * 160, 1.2, 1.2);
  }
  return context.createPattern(tile, "repeat")!;
}

async function burn() {
  const { canvas, context, width, height } = overlayCanvas("ldp-canvas ldp-burn");
  const ash = ashPattern(context);
  const fires = [0.18, 0.52, 0.86].map((fx, index) => ({
    x: width * fx + rand(-40, 40),
    y: height + 12,
    delay: index === 1 ? 0 : rand(0.25, 0.7),
    phase: [rand(0, 6.3), rand(0, 6.3), rand(0, 6.3)],
  }));
  // How far the fires must reach before no corner of the screen is left.
  const points: [number, number][] = [];
  for (let gx = 0; gx <= 6; gx++)
    for (let gy = 0; gy <= 6; gy++) points.push([(gx / 6) * width, (gy / 6) * height]);
  const reach =
    Math.max(
      ...points.map(([px, py]) =>
        Math.min(...fires.map((fire) => Math.hypot(px - fire.x, py - fire.y))),
      ),
    ) / 0.72;
  const speed = Math.max(150, reach / 5.6);
  // A fixed, ragged nick for every point on the edge, so the burn front never looks drawn.
  const angles = 260;
  const ragged = fires.map(() => {
    const raw = Array.from(
      { length: angles },
      () => rand(-1, 1) * (Math.random() < 0.12 ? 2.4 : 1),
    );
    return raw.map(
      (value, i) => (value * 2 + raw[(i + 1) % angles] + raw[(i + angles - 1) % angles]) / 4,
    );
  });

  const embers: { x: number; y: number; vx: number; vy: number; life: number; span: number }[] = [];
  const radius = (fire: (typeof fires)[number], r: number, theta: number, time: number) =>
    r *
    (1 +
      0.13 * Math.sin(3 * theta + fire.phase[0]) +
      0.07 * Math.sin(7 * theta + fire.phase[1] + time * 0.5) +
      0.04 * Math.sin(19 * theta + fire.phase[2] - time * 1.3) +
      0.02 * Math.sin(41 * theta + fire.phase[0] * 3 + time * 2.1));
  // Each band ahead of the flame takes its own shape (a later moment of the noise), so the scorch
  // spreads unevenly instead of in parallel stripes.
  const outline = (fire: (typeof fires)[number], r: number, offset: number, time: number) => {
    const nicks = ragged[fires.indexOf(fire)];
    const shift = time + offset * 0.02;
    for (let i = 0; i <= angles; i++) {
      const theta = (i / angles) * Math.PI * 2;
      const nick = nicks[i % angles] * Math.min(16, r * 0.03);
      const reachAt =
        radius(fire, r, theta, shift) +
        offset * (1 + 0.5 * Math.sin(5 * theta + fire.phase[1] + offset)) +
        nick;
      const x = fire.x + Math.cos(theta) * reachAt;
      const y = fire.y + Math.sin(theta) * reachAt;
      if (i) context.lineTo(x, y);
      else context.moveTo(x, y);
    }
    context.closePath();
  };

  const start = performance.now();
  let last = start;
  let frame = 0;
  let covered = false;
  let caption: HTMLParagraphElement | null = null;
  haptic([20, 60, 30]);

  const tick = (now: number) => {
    const time = (now - start) / 1000;
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    const radii = fires.map((fire) => Math.max(0, time - fire.delay) * speed * (1 + time * 0.08));
    covered = covered || Math.min(...radii) > reach * 1.05;
    context.clearRect(0, 0, width, height);
    if (covered) {
      context.fillStyle = ash;
      context.fillRect(0, 0, width, height);
    } else {
      const layer = (offset: number, fill: string | CanvasPattern) => {
        context.beginPath();
        fires.forEach(
          (fire, index) => radii[index] > 0 && outline(fire, radii[index], offset, time),
        );
        context.fillStyle = fill;
        context.fill();
      };
      // Heat and scorch ahead of the flame, then the burning edge, then ash behind it.
      layer(110, "rgba(255, 150, 60, 0.05)");
      layer(64, "rgba(140, 70, 20, 0.12)");
      layer(34, "rgba(80, 36, 10, 0.3)");
      layer(16, "rgba(36, 16, 5, 0.6)");
      context.beginPath();
      fires.forEach((fire, index) => radii[index] > 0 && outline(fire, radii[index], 6, time));
      context.lineJoin = "round";
      for (const [line, colour] of [
        [14, "rgba(255, 80, 12, 0.22)"],
        [7, "rgba(255, 130, 30, 0.7)"],
        [3, "rgba(255, 196, 90, 0.95)"],
        [1, "rgba(255, 244, 200, 1)"],
      ] as const) {
        context.lineWidth = line;
        context.strokeStyle = colour;
        context.stroke();
      }
      layer(0, ash);
      for (let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * fires.length);
        if (!radii[index]) continue;
        const fire = fires[index];
        const theta = rand(Math.PI, Math.PI * 2);
        const r = radius(fire, radii[index], theta, time) + 4;
        const x = fire.x + Math.cos(theta) * r;
        const y = fire.y + Math.sin(theta) * r;
        if (x > 0 && x < width && y > 0 && y < height)
          embers.push({
            x,
            y,
            vx: rand(-30, 30),
            vy: rand(-170, -60),
            life: 0,
            span: rand(0.6, 1.5),
          });
      }
    }
    for (let i = embers.length - 1; i >= 0; i--) {
      const ember = embers[i];
      ember.life += dt;
      if (ember.life > ember.span) {
        embers.splice(i, 1);
        continue;
      }
      ember.vx += Math.sin(now / 200 + i) * 60 * dt;
      ember.x += ember.vx * dt;
      ember.y += ember.vy * dt;
      const k = 1 - ember.life / ember.span;
      context.fillStyle = `rgba(255, ${Math.round(110 + 120 * k)}, ${Math.round(40 * k)}, ${k.toFixed(3)})`;
      context.fillRect(ember.x, ember.y, 2, 2);
    }
    if (covered && !caption) {
      caption = document.createElement("p");
      caption.className = "ldp-caption";
      caption.textContent = "Well. That was the whole portfolio.";
      host().append(caption);
    }
    frame = covered && !embers.length ? 0 : requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  active = {
    async stop() {
      cancelAnimationFrame(frame);
      canvas.classList.add("is-leaving");
      caption?.classList.add("is-leaving");
      await wait(520);
      canvas.remove();
      caption?.remove();
    },
  };
  showPill("Put it back");
}

/* ---------- Earthquake and Party ---------- */

async function quake() {
  const root = document.documentElement;
  root.classList.remove("ldp-quake");
  void root.offsetWidth;
  root.classList.add("ldp-quake");
  haptic([60, 30, 90, 30, 50, 30, 30]);
  await wait(1300);
  root.classList.remove("ldp-quake");
}

function hslHex(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return `#${[f(0), f(8), f(4)]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

async function party() {
  const root = document.documentElement;
  const names = ["--ldt-accent", "--ldt-accent-ink", "--ldt-on-accent"];
  const saved = names.map((name) => root.style.getPropertyValue(name));
  let hue = Math.random() * 360;
  let frame = 0;
  let last = 0;
  const cycle = (now: number) => {
    // A dozen colour changes a second: enough to party, few enough to keep the page smooth.
    if (now - last > 80) {
      last = now;
      hue = (hue + 9) % 360;
      const hex = hslHex(hue, 0.85, 0.68);
      root.style.setProperty(names[0], hex);
      root.style.setProperty(names[1], accentInk(hex));
      root.style.setProperty(names[2], onAccent(hex));
    }
    frame = requestAnimationFrame(cycle);
  };
  frame = requestAnimationFrame(cycle);

  // One burst of confetti.
  const { canvas, context, width, height } = overlayCanvas("ldp-canvas");
  const bits = Array.from({ length: 220 }, () => ({
    x: rand(0, width),
    y: rand(-height * 0.6, -10),
    vx: rand(-60, 60),
    vy: rand(80, 260),
    a: rand(0, 6.3),
    va: rand(-8, 8),
    w: rand(5, 10),
    h: rand(3, 6),
    colour: hslHex(rand(0, 360), 0.85, 0.62),
  }));
  let confetti = 0;
  let previous = performance.now();
  const fall = (now: number) => {
    const dt = Math.min(1 / 30, (now - previous) / 1000);
    previous = now;
    context.clearRect(0, 0, width, height);
    let visible = false;
    for (const bit of bits) {
      bit.vy += 240 * dt;
      bit.vx += Math.sin(now / 300 + bit.a) * 30 * dt;
      bit.x += bit.vx * dt;
      bit.y += bit.vy * dt;
      bit.a += bit.va * dt;
      if (bit.y > height + 20) continue;
      visible = true;
      context.save();
      context.translate(bit.x, bit.y);
      context.rotate(bit.a);
      context.scale(1, Math.abs(Math.cos(bit.a * 1.7)) + 0.1);
      context.fillStyle = bit.colour;
      context.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h);
      context.restore();
    }
    if (visible) confetti = requestAnimationFrame(fall);
    else canvas.remove();
  };
  confetti = requestAnimationFrame(fall);
  haptic([10, 40, 10, 40, 10]);

  active = {
    stop() {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(confetti);
      canvas.remove();
      names.forEach((name, index) => {
        if (saved[index]) root.style.setProperty(name, saved[index]);
        else root.style.removeProperty(name);
      });
    },
  };
  showPill("Stop the party");
}

/* ---------- Entry points ---------- */

export async function putBack() {
  const current = active;
  active = null;
  hidePill();
  if (current) await current.stop();
}

export async function play(name: string) {
  await putBack();
  if (name === "gravity" || name === "float") await physics(name);
  else if (name === "snap") await snap();
  else if (name === "burn") await burn();
  else if (name === "quake") await quake();
  else if (name === "party") await party();
  pill?.focus({ preventScroll: true });
}
