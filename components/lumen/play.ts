/**
 * Toys from the tweak panel. Loaded the first time a visitor presses one, never before.
 *
 * Every toy works on the whole site, not just the part on screen, and can be undone: "Put it
 * back" (or Escape, or leaving the page) restores it exactly. The page keeps scrolling throughout.
 * Nothing here uses blur, and a block held in Gravity is written straight to its transform on every
 * pointer event, so it never trails the cursor.
 */
import { dropAudio } from "./audioPrime";
import { haptic } from "./feedback";
import "./play.css";

type Stop = () => void | Promise<void>;
type Extra = { label: string; pressed?: boolean; onToggle: (pressed: boolean) => void };

let active: { stop: Stop } | null = null;
let pills: HTMLDivElement | null = null;
let watch = 0;

export const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
export const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
/** Overlays live inside the site root, so they share its fonts and colour tokens. */
export const host = () => document.querySelector<HTMLElement>(".ld") ?? document.body;
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Shared pieces ---------- */

function onEscape(event: KeyboardEvent) {
  if (event.key === "Escape" && active) void putBack();
}

/** The "Put it back" pill, plus an optional toggle beside it (Party's sound switch). */
function showPill(label: string, extra?: Extra) {
  pills?.remove();
  pills = document.createElement("div");
  pills.className = "ldp-pills";
  const main = document.createElement("button");
  main.type = "button";
  main.className = "ldp-pill";
  main.textContent = label;
  main.addEventListener("click", () => void putBack());
  pills.append(main);
  if (extra) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "ldp-pill ldp-pill-quiet";
    toggle.textContent = extra.label;
    toggle.setAttribute("aria-pressed", String(extra.pressed ?? true));
    toggle.addEventListener("click", () => {
      const pressed = toggle.getAttribute("aria-pressed") !== "true";
      toggle.setAttribute("aria-pressed", String(pressed));
      extra.onToggle(pressed);
    });
    pills.append(toggle);
  }
  host().append(pills);
  window.addEventListener("keydown", onEscape);
  // Following a link swaps the page underneath; a toy never outlives the page it was played on.
  const path = location.pathname;
  window.clearInterval(watch);
  watch = window.setInterval(() => {
    if (location.pathname !== path) void putBack();
  }, 300);
  return main;
}

function hidePill() {
  pills?.remove();
  pills = null;
  window.clearInterval(watch);
  window.removeEventListener("keydown", onEscape);
}

/** A canvas over the whole viewport, sized for the screen's pixel density (capped for speed). */
export function overlayCanvas(className: string, maxRatio = 1.5) {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  canvas.setAttribute("aria-hidden", "true");
  const ratio = Math.min(window.devicePixelRatio || 1, maxRatio);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  host().append(canvas);
  const context = canvas.getContext("2d")!;
  context.scale(ratio, ratio);
  return { canvas, context, width, height, ratio };
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

const ROOTS = ".ld-top, #ld-main, .ld-footer";

/**
 * The pieces of the whole site, largest whole pieces first: a paragraph moves as one, a section
 * does not. Anything inside a piece that is already taken is skipped. `accept` can turn a piece
 * down, in which case the pieces inside it are considered instead.
 */
function pickBlocks(
  roots = ROOTS,
  accept: (el: HTMLElement, style: CSSStyleDeclaration) => boolean = () => true,
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const kept: HTMLElement[] = [];
  let last: HTMLElement | null = null;
  for (const root of document.querySelectorAll<HTMLElement>(roots)) {
    for (const el of root.querySelectorAll<HTMLElement>(BLOCKS)) {
      // In document order, everything inside a kept piece comes straight after it.
      if (last?.contains(el)) continue;
      const box = el.getBoundingClientRect();
      if (box.width < 6 || box.height < 6) continue;
      if (box.width * box.height > vw * vh * 0.22 || box.height > vh * 0.6) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || Number(style.opacity) < 0.05) continue;
      if (!accept(el, style)) continue;
      kept.push(el);
      last = el;
    }
  }
  return kept;
}

const onScreen = (box: DOMRect) =>
  box.bottom > 0 && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth;

function shuffle<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Inline styles a toy writes, remembered so they can be put back exactly as they were. */
const TOUCHED = [
  "transform",
  "transform-origin",
  "transition",
  "will-change",
  "display",
  "cursor",
  "user-select",
  "visibility",
] as const;
type Saved = [string, string, string][];
const remember = (el: HTMLElement): Saved =>
  TOUCHED.map((name) => [
    name,
    el.style.getPropertyValue(name),
    el.style.getPropertyPriority(name),
  ]);
function restore(el: HTMLElement, saved: Saved) {
  for (const [name, value, priority] of saved)
    if (value) el.style.setProperty(name, value, priority);
    else el.style.removeProperty(name);
}
/** A transform does nothing to a plain inline box, so a lone link becomes an inline block. */
function transformable(el: HTMLElement) {
  if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";
}

/* ---------- Gravity ---------- */

type Body = {
  el: HTMLElement;
  group: Group;
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

/** One floor: a section, a pinned card, or one screen-high slice of a very tall section. */
type Group = {
  room: HTMLElement;
  top: number;
  bottom: number;
  width: number;
  bodies: Body[];
  state: "waiting" | "awake" | "asleep";
  still: number;
};

/**
 * Everything falls, but not into one heap at the foot of the site: every section has its own floor,
 * and a section only lets go when you scroll to it. Pinned cards (the work sheets, the portrait)
 * are rooms of their own, so what is inside them falls to their own bottom edge.
 */
async function gravity() {
  const pinned = new Map<Element, boolean>();
  const isPinned = (node: Element) => {
    let value = pinned.get(node);
    if (value === undefined) {
      const position = getComputedStyle(node).position;
      value = position === "sticky" || position === "fixed";
      pinned.set(node, value);
    }
    return value;
  };
  const roomOf = (el: HTMLElement) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      if (node.id === "ld-main") return node;
      if (isPinned(node) || node.parentElement?.id === "ld-main" || node.matches(".ld-footer"))
        return node;
    }
    return null;
  };

  const blocks = pickBlocks(
    "#ld-main, .ld-footer",
    // A pinned piece becomes a room instead; a piece the page itself animates keeps still.
    (el) => !isPinned(el) && !el.getAnimations().length,
  );
  if (!blocks.length) return;
  const saved = new Map(blocks.map((el) => [el, remember(el)]));
  for (const el of blocks) transformable(el);

  // Rooms and their floors, measured once, all at the same moment.
  const vh = window.innerHeight;
  const groups: Group[] = [];
  const bodies = new Map<HTMLElement, Body>();
  const byRoom = new Map<HTMLElement, HTMLElement[]>();
  for (const el of blocks) {
    const room = roomOf(el);
    if (!room) continue;
    byRoom.set(room, [...(byRoom.get(room) ?? []), el]);
  }
  for (const [room, members] of byRoom) {
    const box = room.getBoundingClientRect();
    const slices = box.height > vh * 1.5 ? Math.round(box.height / (vh * 0.95)) : 1;
    const slice = box.height / slices;
    const own = Array.from({ length: slices }, (_, index) => {
      const group: Group = {
        room,
        top: index * slice,
        bottom: (index + 1) * slice,
        width: box.width,
        bodies: [],
        state: "waiting",
        still: 0,
      };
      groups.push(group);
      return group;
    });
    for (const el of members) {
      const rect = el.getBoundingClientRect();
      const middle = rect.top + rect.height / 2 - box.top;
      const group = own[clamp(Math.floor(middle / slice), 0, slices - 1)];
      const body: Body = {
        el,
        group,
        homeX: 0,
        homeY: 0,
        x: 0,
        y: 0,
        w: rect.width,
        h: rect.height,
        vx: 0,
        vy: 0,
        a: 0,
        va: 0,
        inverseMass: 1 / Math.max(1, (rect.width * rect.height) / 4000),
        held: false,
      };
      group.bodies.push(body);
      bodies.set(el, body);
    }
  }

  const fall = 2600;
  const bounce = 0.18;
  let frame = 0;
  let last = performance.now();

  const draw = (body: Body) => {
    body.el.style.transform = `translate(${body.x - body.homeX}px, ${body.y - body.homeY}px) rotate(${body.a}rad)`;
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
      if (-relative > 500) {
        a.va += rand(-1, 1) * ia;
        b.va += rand(-1, 1) * ib;
      }
    }
  };

  const step = (group: Group, dt: number) => {
    const floor = group.bottom - 2;
    for (const body of group.bodies) {
      if (body.held) continue;
      body.vy += fall * dt;
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      body.a += body.va * dt;
      body.va *= 0.97;
      body.a = clamp(body.a * 0.985, -0.7, 0.7);
      if (body.y < group.top) {
        body.y = group.top;
        if (body.vy < 0) body.vy = -body.vy * bounce;
      }
      if (body.y + body.h > floor) {
        body.y = floor - body.h;
        if (body.vy > 0) body.vy = Math.abs(body.vy) < 90 ? 0 : -body.vy * bounce;
        body.vx *= 0.9;
      }
      if (body.x < 0) {
        body.x = 0;
        if (body.vx < 0) body.vx = -body.vx * bounce;
      }
      if (body.x + body.w > group.width) {
        body.x = Math.max(0, group.width - body.w);
        if (body.vx > 0) body.vx = -body.vx * bounce;
      }
    }
    const list = group.bodies;
    for (let pass = 0; pass < 3; pass++)
      for (let i = 0; i < list.length; i++)
        for (let j = i + 1; j < list.length; j++) collide(list[i], list[j]);
  };

  const tick = (now: number) => {
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    let running = false;
    for (const group of groups) {
      if (group.state !== "awake") continue;
      for (let i = 0; i < 3; i++) step(group, dt / 3);
      let moving = false;
      for (const body of group.bodies) {
        draw(body);
        if (body.held || Math.abs(body.vx) + Math.abs(body.vy) > 12 || Math.abs(body.va) > 0.02)
          moving = true;
      }
      group.still = moving ? 0 : group.still + 1;
      // Settled: this floor stops costing anything until someone picks a block up again.
      if (group.still > 45) {
        group.state = "asleep";
        for (const body of group.bodies) body.el.style.removeProperty("will-change");
      } else running = true;
    }
    frame = running ? requestAnimationFrame(tick) : 0;
  };
  const wake = (group: Group) => {
    if (group.state === "asleep")
      for (const body of group.bodies) body.el.style.willChange = "transform";
    if (group.state !== "waiting") group.state = "awake";
    group.still = 0;
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  // A floor lets go once it is on screen; its pieces are measured at that moment.
  const release = (group: Group) => {
    const box = group.room.getBoundingClientRect();
    group.width = box.width;
    for (const body of group.bodies) {
      const rect = body.el.getBoundingClientRect();
      body.homeX = body.x = rect.left - box.left;
      body.homeY = body.y = rect.top - box.top;
      body.w = rect.width;
      body.h = rect.height;
      body.vx = rand(-30, 30);
      body.vy = rand(-80, 0);
      body.va = rand(-0.6, 0.6);
      Object.assign(body.el.style, {
        transition: "none",
        transformOrigin: "50% 50%",
        willChange: "transform",
        cursor: "grab",
        userSelect: "none",
      });
    }
    group.state = "asleep";
    wake(group);
  };
  let checking = 0;
  const check = () => {
    checking = 0;
    const view = window.innerHeight;
    for (const group of groups) {
      if (group.state !== "waiting") continue;
      const box = group.room.getBoundingClientRect();
      if (box.top + group.top < view * 0.82 && box.top + group.bottom > view * 0.12) release(group);
    }
  };
  const onScroll = () => {
    if (!checking) checking = requestAnimationFrame(check);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Throw with a mouse or pen; tap (or click) to kick a piece back up. Touch still scrolls.
  const bodyAt = (target: EventTarget | null) => {
    for (let node = target as HTMLElement | null; node; node = node.parentElement) {
      const body = bodies.get(node);
      if (body) return body.group.state === "waiting" ? null : body;
    }
    return null;
  };
  const kick = (body: Body) => {
    body.vy = -rand(950, 1350);
    body.vx = rand(-380, 380);
    body.va = rand(-4, 4);
    wake(body.group);
    haptic(8);
  };
  const local = (body: Body, event: PointerEvent) => {
    const box = body.group.room.getBoundingClientRect();
    return [event.clientX - box.left, event.clientY - box.top] as const;
  };
  type Grab = {
    body: Body;
    id: number;
    dx: number;
    dy: number;
    t: number;
    px: number;
    py: number;
    sx: number;
    sy: number;
    moved: boolean;
    touch: boolean;
  };
  let grab: Grab | null = null;
  const onDown = (event: PointerEvent) => {
    const body = bodyAt(event.target);
    if (!body || grab || event.button !== 0) return;
    const touch = event.pointerType === "touch";
    const [px, py] = local(body, event);
    grab = {
      body,
      id: event.pointerId,
      dx: px - body.x,
      dy: py - body.y,
      t: event.timeStamp,
      px: event.clientX,
      py: event.clientY,
      sx: event.clientX,
      sy: event.clientY,
      moved: false,
      touch,
    };
    if (touch) return;
    event.preventDefault();
    body.el.setPointerCapture(event.pointerId);
    body.held = true;
    body.vx = body.vy = body.va = 0;
    body.el.style.cursor = "grabbing";
    wake(body.group);
  };
  const onMove = (event: PointerEvent) => {
    if (!grab || grab.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - grab.sx, event.clientY - grab.sy) > 6) grab.moved = true;
    if (grab.touch) return;
    const { body } = grab;
    const { group } = body;
    const [px, py] = local(body, event);
    body.x = clamp(px - grab.dx, 0, Math.max(0, group.width - body.w));
    body.y = clamp(py - grab.dy, group.top, group.bottom - 2 - body.h);
    const dt = Math.max(1, event.timeStamp - grab.t) / 1000;
    body.vx = body.vx * 0.4 + ((event.clientX - grab.px) / dt) * 0.6;
    body.vy = body.vy * 0.4 + ((event.clientY - grab.py) / dt) * 0.6;
    grab.t = event.timeStamp;
    grab.px = event.clientX;
    grab.py = event.clientY;
    draw(body);
  };
  const onUp = (event: PointerEvent) => {
    if (!grab || grab.id !== event.pointerId) return;
    const { body, moved, touch } = grab;
    grab = null;
    if (touch) {
      if (event.type === "pointerup" && !moved) kick(body);
      return;
    }
    body.held = false;
    body.el.style.cursor = "grab";
    if (!moved) return kick(body);
    const limit = 3200;
    body.vx = clamp(body.vx, -limit, limit);
    body.vy = clamp(body.vy, -limit, limit);
    body.va = body.vx / 900;
    wake(body.group);
  };
  // A fallen link is a toy, not a way off the page (keyboard activation still works).
  const onClick = (event: MouseEvent) => {
    if (event.detail && bodyAt(event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  document.addEventListener("pointerdown", onDown, true);
  document.addEventListener("pointermove", onMove, true);
  document.addEventListener("pointerup", onUp, true);
  document.addEventListener("pointercancel", onUp, true);
  document.addEventListener("click", onClick, true);

  check();
  haptic([10, 30, 16]);

  active = {
    async stop() {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(checking);
      frame = 0;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("pointercancel", onUp, true);
      document.removeEventListener("click", onClick, true);
      let moved = false;
      for (const group of groups) {
        if (group.state === "waiting") continue;
        moved = true;
        for (const body of group.bodies) {
          body.el.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
          body.el.style.transform = "translate(0px, 0px) rotate(0rad)";
        }
      }
      if (moved) await wait(620);
      for (const [el, styles] of saved) restore(el, styles);
    },
  };
  showPill("Put it back");
}

/* ---------- Zero-G ---------- */

/**
 * The whole site floats: every piece drifts slowly around where it belongs, turning a little, and
 * still works (links, buttons and the form included). The drift is a compositor animation, and only
 * pieces near the screen run one, so a long page costs no more than a short one.
 */
async function zeroG() {
  const blocks = pickBlocks(ROOTS, (el) => !el.getAnimations().length);
  if (!blocks.length) return;
  const saved = new Map(blocks.map((el) => [el, remember(el)]));
  for (const el of blocks) transformable(el);
  const calm = reducedMotion();
  const drifting = new Map<HTMLElement, Animation[]>();

  const drift = (el: HTMLElement, box: DOMRectReadOnly) => {
    const size = Math.sqrt(box.width * box.height);
    const reach = calm ? 3 : clamp(26 - size / 16, 6, 22);
    const turn = calm ? 0.3 : clamp(4 - size / 110, 0.6, 3.2);
    // A slow loop through four points near home, starting and ending at the first.
    const points = Array.from({ length: 4 }, () => {
      const x = rand(-reach, reach);
      const y = rand(-reach, reach * 0.6) - reach * 0.25;
      return {
        transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rand(-turn, turn).toFixed(2)}deg)`,
        easing: "ease-in-out",
      };
    });
    const lift = rand(900, 1600);
    const intro = el.animate(
      [{ transform: "translate(0px, 0px) rotate(0deg)", easing: "ease-out" }, points[0]],
      { duration: lift, fill: "forwards" },
    );
    const loop = el.animate([...points, points[0]], {
      duration: rand(9000, 15000),
      delay: lift,
      iterations: Infinity,
    });
    return [intro, loop];
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          if (!drifting.has(el)) drifting.set(el, drift(el, entry.boundingClientRect));
        } else {
          // Off screen: back home with nothing running, so it costs nothing.
          drifting.get(el)?.forEach((animation) => animation.cancel());
          drifting.delete(el);
        }
      }
    },
    { rootMargin: "35% 0px" },
  );
  for (const el of blocks) observer.observe(el);
  haptic(8);

  active = {
    async stop() {
      observer.disconnect();
      // Each piece glides home from wherever it is right now.
      const landing: Animation[] = [];
      for (const [el, animations] of drifting) {
        const now = getComputedStyle(el).transform;
        animations.forEach((animation) => animation.cancel());
        if (now && now !== "none" && onScreen(el.getBoundingClientRect()))
          landing.push(
            el.animate([{ transform: now }, { transform: "none" }], {
              duration: 600,
              easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            }),
          );
      }
      drifting.clear();
      await Promise.all(landing.map((animation) => animation.finished.catch(() => undefined)));
      for (const [el, styles] of saved) restore(el, styles);
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

const setProgress = (el: HTMLElement, p: number) => el.style.setProperty("--ldp-p", p.toFixed(4));

/**
 * Half of every piece on the site, chosen at random. What is on screen turns to dust in front of
 * you; the rest is already gone when you scroll to it.
 */
async function snap() {
  const victims = shuffle(pickBlocks());
  victims.length = Math.ceil(victims.length / 2);
  if (!victims.length) return;
  const saved = new Map(victims.map((el) => [el, remember(el)]));
  const dust = new Dust();
  const duration = 1500;
  const visible = victims.filter((el) => onScreen(el.getBoundingClientRect()));
  const spread = Math.min(1700, visible.length * 55);
  const start = performance.now();
  const runs = visible.map((el, index) => ({
    el,
    tones: tonesOf(el).map((tone) => dust.tone(tone)),
    at: (index / Math.max(1, visible.length)) * spread + rand(0, 160),
    done: false,
  }));
  for (const el of victims) {
    el.classList.add("ldp-dusting");
    el.style.setProperty("--ldp-noise", NOISE);
    setProgress(el, 0);
    if (!visible.includes(el)) el.style.visibility = "hidden";
  }
  haptic([6, 40, 6, 40, 6]);

  let frame = 0;
  let last = start;
  const tick = (now: number) => {
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    let running = false;
    // Read every box first, then write, so the page lays out once a frame however far it scrolls.
    const live = runs.filter((run) => !run.done && now - start >= run.at);
    const boxes = live.map((run) => run.el.getBoundingClientRect());
    live.forEach((run, index) => {
      const box = boxes[index];
      const t = (now - start - run.at) / duration;
      const p = Math.min(1, t * t * (3 - 2 * t));
      setProgress(run.el, p);
      const edge = box.left + box.width * Math.min(1, p * 1.2 - 0.05);
      const emit = Math.min(26, Math.ceil(box.height / 7));
      for (let i = 0; i < emit && p < 1; i++)
        dust.add(
          edge + rand(-14, 4),
          box.top + rand(0, box.height),
          run.tones[Math.floor(Math.random() * run.tones.length)],
        );
      if (t >= 1) {
        run.done = true;
        run.el.style.visibility = "hidden";
      }
    });
    running = runs.some((run) => !run.done);
    dust.step(dt, now / 1000);
    frame = running || dust.alive ? requestAnimationFrame(tick) : 0;
    if (!frame) dust.remove();
  };
  frame = requestAnimationFrame(tick);

  active = {
    async stop() {
      cancelAnimationFrame(frame);
      dust.remove();
      // What is on screen comes back the way it left, in reverse; the rest simply returns.
      const back = victims.filter((el) => onScreen(el.getBoundingClientRect()));
      const from = new Map(
        back.map((el) => [
          el,
          el.style.visibility === "hidden" ? 1 : Number(el.style.getPropertyValue("--ldp-p")) || 0,
        ]),
      );
      for (const el of back) {
        setProgress(el, from.get(el)!);
        el.style.visibility = "";
      }
      const begin = performance.now();
      await new Promise<void>((resolve) => {
        const rewind = (now: number) => {
          const t = Math.min(1, (now - begin) / 700);
          const k = 1 - t * t * (3 - 2 * t);
          for (const el of back) setProgress(el, from.get(el)! * k);
          if (t < 1) requestAnimationFrame(rewind);
          else resolve();
        };
        requestAnimationFrame(rewind);
      });
      for (const [el, styles] of saved) {
        el.classList.remove("ldp-dusting");
        el.style.removeProperty("--ldp-p");
        el.style.removeProperty("--ldp-noise");
        restore(el, styles);
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

async function party() {
  let club: Awaited<ReturnType<typeof import("./party").startParty>>;
  try {
    const { startParty } = await import("./party");
    club = await startParty();
  } catch (error) {
    // The track was started in the click; don't leave it streaming with no party around it.
    dropAudio();
    throw error;
  }
  active = { stop: club.stop };
  showPill("Stop the party", { label: "Sound", pressed: club.sound, onToggle: club.setSound });
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
  if (name === "gravity") await gravity();
  else if (name === "float") await zeroG();
  else if (name === "snap") await snap();
  else if (name === "burn") await burn();
  else if (name === "quake") await quake();
  else if (name === "party") await party();
  pills?.querySelector<HTMLButtonElement>(".ldp-pill")?.focus({ preventScroll: true });
}
