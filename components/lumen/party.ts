/**
 * Party: the site becomes a club in a neon city at night. The lights go down, a mirror ball
 * throws spots around the room, beams sweep, lasers fan out, rain falls past the skyline in the
 * quiet parts, a crowd dances along the bottom and a neon sign buzzes, all to the music: one of a
 * few tracks the visitor can switch between, streamed in when the party starts.
 *
 * Built to stay smooth: every moving light is a compositor animation (transform and opacity only),
 * all of them locked to one beat clock, and that clock is read from the music itself. The page
 * underneath only changes colour (the accent), on the beat, and backs off if that gets slow.
 */
import { takeAudio } from "./audioPrime";
import { type Scene, type Track, TRACKS, saveTrack, trackSource } from "./partyTracks";
import { host, overlayCanvas, rand, reducedMotion } from "./play";
import { accentInk, onAccent } from "./tweaks";
import "./party.css";

const sceneAt = (track: Track, bar: number) => {
  let scene = track.song[0][1];
  for (const [start, part] of track.song) if (start <= bar) scene = part;
  return scene;
};

/** Bars count on past the end of a track; this folds them back into its loop. */
const songBar = (track: Track, count: number) => {
  const [start, end] = track.loop;
  return count < end ? count : start + ((count - start) % (end - start));
};

/** How bright the mirror ball's spots are in each part: they carry the quiet parts. */
const BALL_LEVEL: Record<Scene, number> = {
  intro: 1,
  verse: 0.6,
  lift: 0.55,
  break: 1,
  build: 0.8,
  drop: 0.75,
  outro: 0.9,
};

/** Rain over the city in the quiet parts; none once the drums are going. */
const RAIN_LEVEL: Record<Scene, number> = {
  intro: 1,
  verse: 0.25,
  lift: 0,
  break: 1,
  build: 0.5,
  drop: 0,
  outro: 1,
};

/**
 * How often the page's accent changes, in beats: every other beat in a drop, never in the quiet
 * parts. (Each change restyles the whole page, so this backs off on a slow device.)
 */
const ACCENT_EVERY: Record<Scene, number> = {
  intro: 0,
  verse: 8,
  lift: 4,
  break: 0,
  build: 4,
  drop: 2,
  outro: 0,
};

/* ---------- The room ---------- */

/**
 * A beam is a cone drawn once as SVG and then only turned. (A clip-path here would make the
 * browser re-mask the layer on every frame.)
 */
function cone(colour: string, index: number) {
  const id = `ldp-cone-${index}`;
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="${id}" x2="0" y2="1"><stop offset="0" stop-color="${colour}" stop-opacity=".7"/><stop offset=".45" stop-color="${colour}" stop-opacity=".22"/><stop offset=".9" stop-color="${colour}" stop-opacity="0"/></linearGradient></defs><polygon points="47,0 53,0 100,100 0,100" fill="url(#${id})"/></svg>`;
}

const BALL = 72;
const BALL_FRAMES = 16;

/**
 * The mirror ball, painted once at startup as a strip of frames of a faceted sphere turning.
 * A stepped compositor animation slides the strip, so it costs nothing per frame. Each facet's
 * shade depends on where it faces, so after a cycle (four facet columns) the strip matches its
 * first frame and the turn loops without a seam.
 */
function paintBall(ratio: number) {
  const size = Math.round(BALL * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = size * BALL_FRAMES;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (!g) return "";
  const rows = 16;
  const cols = 34;
  const loop = 4;
  const radius = size / 2 - ratio;
  const dLat = Math.PI / rows;
  const dLon = (Math.PI * 2) / cols;
  const unit = (x: number, y: number, z: number) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l];
  };
  // A white pin spot from the upper left, and the room's colours from the sides.
  const lights = [
    { dir: unit(-0.45, -0.6, 0.66), colour: [255, 255, 255], power: 34 },
    { dir: unit(0.75, -0.1, 0.65), colour: [255, 79, 216], power: 18 },
    { dir: unit(-0.65, 0.55, 0.55), colour: [62, 232, 255], power: 18 },
  ];
  const shade = (row: number, col: number) => {
    const n = Math.sin(row * 12.9898 + (col % loop) * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };
  for (let frame = 0; frame < BALL_FRAMES; frame++) {
    const cx = frame * size + size / 2;
    const cy = size / 2;
    g.save();
    g.beginPath();
    g.arc(cx, cy, radius, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = "#16161d";
    g.fillRect(cx - size / 2, 0, size, size);
    const turn = (frame / BALL_FRAMES) * loop * dLon;
    for (let row = 0; row < rows; row++) {
      const lat = -Math.PI / 2 + (row + 0.5) * dLat;
      for (let col = 0; col < cols; col++) {
        const lon = (col + 0.5) * dLon + turn;
        const nx = Math.cos(lat) * Math.sin(lon);
        const ny = Math.sin(lat);
        const nz = Math.cos(lat) * Math.cos(lon);
        if (nz < 0.04) continue;
        // A facet mirrors the room: reflect the eye's ray off it and see which light it meets.
        const rx = 2 * nz * nx;
        const ry = 2 * nz * ny;
        const rz = 2 * nz * nz - 1;
        let [r, gr, b] = [30 + 70 * nz, 30 + 70 * nz, 38 + 74 * nz].map(
          (v) => v + shade(row, col) * 46,
        );
        for (const { dir, colour, power } of lights) {
          const hit = Math.max(0, rx * dir[0] + ry * dir[1] + rz * dir[2]) ** power;
          r += colour[0] * hit;
          gr += colour[1] * hit;
          b += colour[2] * hit;
        }
        g.fillStyle = `rgb(${Math.min(255, r) | 0},${Math.min(255, gr) | 0},${Math.min(255, b) | 0})`;
        g.beginPath();
        for (const [a, o] of [
          [-0.42, -0.42],
          [0.42, -0.42],
          [0.42, 0.42],
          [-0.42, 0.42],
        ]) {
          const la = lat + a * dLat;
          const lo = lon + o * dLon;
          g.lineTo(cx + radius * Math.cos(la) * Math.sin(lo), cy + radius * Math.sin(la));
        }
        g.fill();
      }
    }
    // Round it off: darker towards the rim.
    const rim = g.createRadialGradient(
      cx - radius * 0.2,
      cy - radius * 0.25,
      radius * 0.3,
      cx,
      cy,
      radius,
    );
    rim.addColorStop(0, "#0000");
    rim.addColorStop(1, "#000a");
    g.fillStyle = rim;
    g.fillRect(cx - size / 2, 0, size, size);
    g.restore();
  }
  return canvas.toDataURL();
}

/** A soft round spot of light, drawn once and stamped many times. */
function spotSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const g = canvas.getContext("2d")!;
  const glow = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, "#fff");
  glow.addColorStop(0.3, "#ffffffc0");
  glow.addColorStop(0.55, "#ffffff30");
  glow.addColorStop(1, "#fff0");
  g.fillStyle = glow;
  g.fillRect(0, 0, 32, 32);
  return canvas;
}

/** A shaft of light through haze, from the ball outwards, fading along its length. */
function raySprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 8;
  const g = canvas.getContext("2d")!;
  const fade = g.createLinearGradient(0, 0, 256, 0);
  fade.addColorStop(0, "#fff0");
  fade.addColorStop(0.08, "#ffffffb0");
  fade.addColorStop(1, "#fff0");
  g.fillStyle = fade;
  g.beginPath();
  g.moveTo(0, 4);
  g.lineTo(256, 0);
  g.lineTo(256, 8);
  g.fill();
  return canvas;
}

/* ---------- The crowd ---------- */

const HAIR = [
  "",
  '<circle cx="30" cy="27" r="6.5"/>',
  '<path d="M37 34C50 38 52 56 45 67C45 54 42 46 35 42Z"/>',
  '<path d="M19.5 40C19 50 18.5 57 18 63C22 65 26 63 27 59H33C34 63 38 65 42 63C41.5 57 41 50 40.5 40C40.5 26 19.5 26 19.5 40Z"/>',
  '<path d="M19 40C19 27 41 27 41 40H52V43.5H19Z"/>',
  '<circle cx="30" cy="38" r="15.5"/>',
];

/**
 * A dancer in a 60 x 150 box: head, hair, shoulders. An arm can be up holding a phone, whose
 * screen glows. Everything is drawn twice: once in the stage colour, a little higher, so the
 * lights behind the crowd catch the edges of heads and shoulders.
 */
function figure(width: number, hair: number, phone: "left" | "right" | null) {
  const left = 30 - width;
  const right = 30 + width;
  let shape = `<ellipse cx="30" cy="42" rx="10.5" ry="12"/><rect x="25.5" y="50" width="9" height="14" rx="3"/><path d="M${left} 150C${left} 112 ${left + 1} 88 ${left + 4} 77C${left + 6} 68 22 65 30 65C38 65 ${right - 6} 68 ${right - 4} 77C${right - 1} 88 ${right} 112 ${right} 150Z"/>${HAIR[hair]}`;
  let screen = "";
  if (phone) {
    const flip = (x: number) => (phone === "right" ? x : 60 - x);
    shape += `<path d="M${flip(right - 5)} 80L${flip(right + 3)} 56L${flip(right - 2)} 32" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const x = flip(right - 2);
    screen = `<circle cx="${x}" cy="25" r="14" fill="#d9f1ff" opacity=".13"/><rect x="${x - 5}" y="16" width="10" height="17" rx="2" fill="#d9f1ff"/>`;
  }
  return `<svg viewBox="0 0 60 150" preserveAspectRatio="xMidYMax meet"><g class="ldp-rim">${shape}</g><g>${shape}</g>${screen}</svg>`;
}

/** An arm that moves on its own, pinned at the shoulder (5, 56 in its 24 x 60 box). */
const ARM = (() => {
  const arm = `<path d="M5 56L15 32L9 8" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="5.5"/>`;
  return `<svg viewBox="0 0 24 60"><g class="ldp-rim">${arm}</g><g>${arm}</g></svg>`;
})();

type Person = { el: HTMLElement; arm: HTMLElement | null; row: number };

function crowd(width: number) {
  const rows = [
    { count: Math.min(18, Math.ceil(width / 72)), min: 104, max: 132, className: "is-back" },
    { count: Math.min(12, Math.ceil(width / 104)), min: 140, max: 182, className: "is-front" },
  ];
  const wrap = document.createElement("div");
  wrap.className = "ldp-crowd";
  const people: Person[] = [];
  const lines: HTMLElement[] = [];
  rows.forEach((row, index) => {
    const line = document.createElement("div");
    line.className = `ldp-row ${row.className}`;
    for (let i = 0; i < row.count; i++) {
      const el = document.createElement("span");
      el.className = "ldp-dancer";
      const size = rand(row.min, row.max);
      el.style.cssText = `left:${((i + rand(-0.3, 0.3)) / row.count) * 104 - 2}%;height:${size.toFixed(0)}px;width:${(size * 0.4).toFixed(0)}px`;
      const shoulders = rand(19, 25);
      const roll = Math.random();
      const phone = roll < 0.2 ? (Math.random() < 0.5 ? "left" : "right") : null;
      el.innerHTML = figure(shoulders, Math.floor(rand(0, HAIR.length)), phone);
      let arm: HTMLElement | null = null;
      if (!phone && roll < (index ? 0.55 : 0.4)) {
        arm = document.createElement("span");
        const side = Math.random() < 0.5 ? "left" : "right";
        arm.className = `ldp-arm is-${side}`;
        const shoulder = side === "right" ? 30 + shoulders - 5 : 30 - shoulders + 5;
        arm.style.left = `${((shoulder - 5) / 60) * 100}%`;
        arm.innerHTML = ARM;
        el.append(arm);
      }
      line.append(el);
      people.push({ el, arm, row: index });
    }
    wrap.append(line);
    lines.push(line);
  });
  return { wrap, people, lines };
}

/* ---------- The city ---------- */

/**
 * The skyline behind the crowd. The far row is one SVG, drawn once. The near row is a set of
 * towers, each its own element, so each can rise with its own slice of the music (a transform)
 * and its windows can flash (opacity); their colours come from the party's palette.
 */
function farRow(width: number, height: number) {
  let out = "";
  let lit = "";
  let x = -10;
  while (x < width) {
    const w = rand(34, 80);
    const h = height * rand(0.36, 0.8);
    const top = height - h;
    out += `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}"/>`;
    for (let wx = x + 6; wx < x + w - 8; wx += 9)
      for (let wy = top + 10; wy < height - 8; wy += 13)
        if (Math.random() < 0.09)
          lit += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="4" height="6" opacity="${rand(0.25, 0.5).toFixed(2)}"/>`;
    x += w + rand(-4, 6);
  }
  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" width="100%" height="100%"><g fill="#1b1233">${out}</g><g fill="#c7a6ff">${lit}</g></svg>`;
}

type Tower = { el: HTMLElement; lit: HTMLElement; bin: number; scale: number; glow: number };

/** One near tower: a dark body, and its windows, roof strip and antenna in the tower's colour. */
function tower(x: number, w: number, h: number, hue: number, seek = false) {
  const el = document.createElement("div");
  el.className = seek ? "ldp-tower is-seek" : "ldp-tower";
  el.style.cssText = `left:${x.toFixed(0)}px;width:${w.toFixed(0)}px;height:${h.toFixed(0)}px;color:var(--ldp-c${hue})`;
  let windows = "";
  for (let wx = 6; wx < w - 8; wx += 9)
    for (let wy = 10; wy < h - 8; wy += 13)
      if (Math.random() < 0.16)
        windows += `<rect x="${wx}" y="${wy}" width="4" height="6" opacity="${rand(0.5, 1).toFixed(2)}"/>`;
  // The seek tower's roof is the seek bar itself, drawn by the control on top of it.
  const roof = seek
    ? ""
    : Math.random() < 0.5
      ? `<rect x="4" y="0" width="${(w - 8).toFixed(0)}" height="2"/>`
      : "";
  const antenna =
    !seek && Math.random() < 0.3
      ? `<rect x="${(w / 2).toFixed(0)}" y="-26" width="2" height="26" fill="#3a2d58"/><rect x="${(w / 2 - 1).toFixed(0)}" y="-28" width="4" height="4" fill="#ff3d5a"/>`
      : "";
  el.innerHTML = `<svg class="ldp-tower-lit" viewBox="0 0 ${w.toFixed(0)} ${h.toFixed(0)}" width="100%" height="100%" fill="currentColor">${roof}${windows}</svg>${antenna ? `<svg class="ldp-tower-top" viewBox="0 -28 ${w.toFixed(0)} 28" width="100%" height="28">${antenna}</svg>` : ""}`;
  return { el, lit: el.querySelector<HTMLElement>(".ldp-tower-lit")! };
}

function city(width: number, height: number) {
  const wrap = document.createElement("div");
  wrap.className = "ldp-city";
  wrap.innerHTML = farRow(width, height);
  const towers: Tower[] = [];
  let x = -10;
  let i = 0;
  while (x < width) {
    const w = rand(46, 110);
    const { el, lit } = tower(x, w, height * rand(0.2, 0.62), (i % 3) + 1);
    wrap.append(el);
    // Each tower listens to its own slice of the spectrum, low to high, in no order.
    towers.push({ el, lit, bin: Math.round(1.5 * 28 ** Math.random()), scale: 1, glow: 1 });
    x += w + rand(-4, 6);
    i++;
  }
  // One tower stands still and tall enough to clear the crowd: its roof is the seek bar.
  const seekWidth = Math.min(220, Math.max(110, width * 0.2));
  const seek = tower(width * 0.17, seekWidth, height * 0.8, 2, true);
  wrap.append(seek.el);
  towers.push({ el: seek.el, lit: seek.lit, bin: 6, scale: 1, glow: 1 });
  return { wrap, towers, seekTower: seek.el };
}

/* ---------- The party ---------- */

const PALETTE = ["#ff3dd8", "#1ff4ff", "#b46bff", "#3dffa2", "#ffcf3d"];
/** Drops swing between hard opposites. */
const DROP = ["#ff2bd6", "#00f0ff", "#ffe600", "#8f5bff", "#3dff8a"];
const BEAMS = ["#ff3dd8", "#1ff4ff", "#b46bff", "#ffcf3d"];

/**
 * Electric arcs along a sign's frame: three sets of jagged lines, shown one after another in
 * quick steps by the stylesheet, so the edges crackle. Drawn on a 1000 x 300 box that stretches
 * with the sign; the strokes keep their width.
 */
function bolts() {
  const arc = (x1: number, y1: number, x2: number, y2: number) => {
    const steps = 7;
    let d = `M${x1} ${y1}`;
    for (let i = 1; i < steps; i++) {
      const k = i / steps;
      const jitter = rand(-14, 14);
      // Off to the side of the edge it runs along.
      const x = x1 + (x2 - x1) * k + (y1 === y2 ? 0 : jitter);
      const y = y1 + (y2 - y1) * k + (y1 === y2 ? jitter : 0);
      d += `L${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    return `${d}L${x2} ${y2}`;
  };
  const set = () => {
    let paths = "";
    for (let i = 0; i < 5; i++) {
      const edge = Math.floor(rand(0, 4));
      const from = rand(0, 0.7);
      const to = from + rand(0.12, 0.3);
      paths +=
        edge === 0
          ? arc(from * 1000, 0, to * 1000, 0)
          : edge === 1
            ? arc(from * 1000, 300, to * 1000, 300)
            : arc(edge === 2 ? 0 : 1000, from * 300, edge === 2 ? 0 : 1000, Math.min(1, to) * 300);
    }
    return `<g><path class="is-halo" d="${paths}"/><path d="${paths}"/></g>`;
  };
  return `<svg class="ldp-bolts" viewBox="0 0 1000 300" preserveAspectRatio="none">${set()}${set()}${set()}</svg>`;
}

/** Neon letters: each is its own element, so a single letter can buzz like a failing tube. */
const neon = (word: string) => [...word].map((letter) => `<i>${letter}</i>`).join("");

export async function startParty() {
  const calm = reducedMotion();
  const root = document.documentElement;
  const names = ["--ldt-accent", "--ldt-accent-ink", "--ldt-on-accent"];
  const saved = names.map((name) => root.style.getPropertyValue(name));
  const prime = takeAudio();
  const audio = prime?.audio ?? null;
  const context = prime?.context ?? null;
  let index = prime?.track ?? 0;
  let track = TRACKS[index];
  let beatMs = 60_000 / track.bpm;
  let barMs = beatMs * 4;

  /* The sound: the first track comes in muffled, as if through the club's door, which opens in
     the intro. Without Web Audio the element plays straight out. */
  let out: GainNode | null = null;
  let analyser: AnalyserNode | null = null;
  let door: BiquadFilterNode | null = null;
  if (context && prime?.source) {
    try {
      door = context.createBiquadFilter();
      door.type = "lowpass";
      door.frequency.value = 340;
      door.Q.value = 0.9;
      // A club system: more low end, and a limiter so the extra bass never clips.
      const bass = context.createBiquadFilter();
      bass.type = "lowshelf";
      bass.frequency.value = 95;
      bass.gain.value = 4;
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -3;
      limiter.knee.value = 2;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.002;
      limiter.release.value = 0.12;
      out = context.createGain();
      prime.source
        .connect(door)
        .connect(bass)
        .connect(limiter)
        .connect(out)
        .connect(context.destination);
      // The towers listen here, before the volume, so they keep dancing with the sound off.
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      limiter.connect(analyser);
    } catch {
      out = null;
    }
  }
  let doorOpen = false;
  const openDoor = (now = false) => {
    if (doorOpen || !door || !context || !audio) return;
    doorOpen = true;
    // Fully open half a bar before the drums come in.
    const firstGroove = track.song.find(([, scene]) => scene !== "intro")?.[0] ?? 4;
    const until = now
      ? 0.3
      : Math.max(0.4, track.first + ((firstGroove - 0.5) * barMs) / 1000 - audio.currentTime);
    const at = context.currentTime;
    door.frequency.cancelScheduledValues(at);
    door.frequency.setValueAtTime(door.frequency.value, at);
    door.frequency.exponentialRampToValueAtTime(20_000, at + until);
  };

  const club = document.createElement("div");
  club.className = "ldp-club";
  club.setAttribute("aria-hidden", "true");
  const reel = calm ? "" : paintBall(Math.min(2, window.devicePixelRatio || 1));
  const skyline = Math.round(window.innerHeight * 0.36);
  club.innerHTML = `
    <div class="ldp-dim"></div>
    <div class="ldp-lights">
      <div class="ldp-beams">${BEAMS.map((colour, i) => `<div class="ldp-beam" style="left:${12.5 + i * 25}%">${cone(colour, i)}</div>`).join("")}</div>
      <div class="ldp-fan is-left"><div class="ldp-fan-lines">${'<i class="ldp-laser"></i>'.repeat(6)}</div></div>
      <div class="ldp-fan is-right"><div class="ldp-fan-lines">${'<i class="ldp-laser"></i>'.repeat(6)}</div></div>
    </div>
    <div class="ldp-ball">
      <div class="ldp-ball-halo"></div>
      <div class="ldp-ball-sphere">${reel ? `<div class="ldp-ball-reel" style="background-image:url(${reel})"></div>` : ""}</div>
      <i class="ldp-glint" style="--x:-14px;--y:-12px"></i>
      <i class="ldp-glint" style="--x:16px;--y:4px"></i>
      <i class="ldp-glint" style="--x:-4px;--y:18px"></i>
    </div>
    <div class="ldp-sign">
      <p class="ldp-sign-name"><span class="is-a">${neon("After")}</span> <span class="is-b">${neon("Hours")}</span></p>
      <p class="ldp-sign-track"></p>
    </div>`;
  const town = city(window.innerWidth, skyline);
  club.querySelector(".ldp-dim")!.after(town.wrap);
  const { wrap, people, lines } = crowd(window.innerWidth);
  club.append(wrap);
  host().append(club);
  const sign = club.querySelector<HTMLElement>(".ldp-sign")!;
  const nowPlaying = club.querySelector<HTMLElement>(".ldp-sign-track")!;
  const letters = [...sign.querySelectorAll<HTMLElement>(".ldp-sign-name i")];
  const beams = club.querySelector<HTMLElement>(".ldp-beams")!;
  const dim = club.querySelector<HTMLElement>(".ldp-dim")!;

  /* One clock. Until the music plays it runs on its own; then it is read from the music. */
  let origin = performance.now() + 250;
  type Synced = { animation: Animation; beats: number; shift: number };
  const synced: Synced[] = [];
  let sceneOnly: Synced[] = [];
  const groove = (
    el: Element,
    frames: Keyframe[],
    beats: number,
    options: KeyframeAnimationOptions & { shift?: number } = {},
    list: Synced[] = synced,
  ) => {
    if (calm) return;
    const { shift = 0, ...rest } = options;
    const animation = el.animate(frames, {
      duration: beats * beatMs,
      iterations: Infinity,
      ...rest,
    });
    animation.startTime = origin + shift * beatMs;
    list.push({ animation, beats, shift });
  };

  club.querySelectorAll(".ldp-beam").forEach((beam, i) => {
    const swing = 18 + i * 3;
    groove(beam, [{ transform: `rotate(${-swing}deg)` }, { transform: `rotate(${swing}deg)` }], 8, {
      direction: "alternate",
      easing: "ease-in-out",
      shift: i % 2 ? 0 : 8,
    });
  });
  club.querySelectorAll(".ldp-fan").forEach((fan, i) =>
    groove(fan, [{ transform: "rotate(-14deg)" }, { transform: "rotate(10deg)" }], 4, {
      direction: "alternate",
      easing: "ease-in-out",
      shift: i * 2,
    }),
  );
  club.querySelectorAll(".ldp-fan-lines").forEach((fan) =>
    groove(
      fan,
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.42 },
        { opacity: 0.12, offset: 0.5 },
        { opacity: 0.12, offset: 1 },
      ],
      1,
    ),
  );
  // The ball: its halo breathes on the beat and its facets catch the light, one after another.
  groove(
    club.querySelector(".ldp-ball-halo")!,
    [{ opacity: 1, easing: "ease-out" }, { opacity: 0.55, offset: 0.6 }, { opacity: 0.55 }],
    1,
  );
  club.querySelectorAll(".ldp-glint").forEach((glint, i) =>
    groove(
      glint,
      [
        { opacity: 0, transform: "scale(0.2) rotate(0deg)" },
        { opacity: 1, transform: "scale(1) rotate(20deg)", offset: 0.12 },
        { opacity: 0, transform: "scale(0.3) rotate(45deg)", offset: 0.4 },
        { opacity: 0, transform: "scale(0.2) rotate(45deg)" },
      ],
      3,
      { shift: i * 1.25 },
    ),
  );
  // The sign hums on the beat.
  groove(
    sign,
    [{ opacity: 1, easing: "ease-out" }, { opacity: 0.78, offset: 0.5 }, { opacity: 0.86 }],
    1,
  );
  for (const { el, arm } of people) {
    const lean = rand(2, 5);
    const hop = rand(3, 8);
    const sway = Math.random() < 0.3;
    groove(
      el,
      sway
        ? [
            { transform: `rotate(${-lean - 2}deg)`, easing: "ease-in-out" },
            {
              transform: `translateY(${hop / 2}px) rotate(0deg)`,
              offset: 0.25,
              easing: "ease-in-out",
            },
            { transform: `rotate(${lean + 2}deg)`, offset: 0.5, easing: "ease-in-out" },
            {
              transform: `translateY(${hop / 2}px) rotate(0deg)`,
              offset: 0.75,
              easing: "ease-in-out",
            },
            { transform: `rotate(${-lean - 2}deg)` },
          ]
        : [
            { transform: `translateY(${hop}px) rotate(${-lean}deg)`, easing: "ease-out" },
            { transform: "translateY(-3px) rotate(0deg)", offset: 0.25, easing: "ease-in" },
            {
              transform: `translateY(${hop}px) rotate(${lean}deg)`,
              offset: 0.5,
              easing: "ease-out",
            },
            { transform: "translateY(-3px) rotate(0deg)", offset: 0.75, easing: "ease-in" },
            { transform: `translateY(${hop}px) rotate(${-lean}deg)` },
          ],
      sway ? 4 : 2,
      { shift: rand(-0.06, 0.06) },
    );
    if (arm) {
      const pump = Math.random() < 0.6;
      groove(
        arm,
        pump
          ? [
              { transform: "rotate(-30deg)", easing: "ease-out" },
              { transform: "rotate(8deg)", offset: 0.3, easing: "ease-in" },
              { transform: "rotate(-30deg)" },
            ]
          : [
              { transform: "rotate(-34deg)", easing: "ease-in-out" },
              { transform: "rotate(26deg)", offset: 0.5, easing: "ease-in-out" },
              { transform: "rotate(-34deg)" },
            ],
        pump ? 1 : 2,
        { shift: rand(-0.05, 0.05) },
      );
    }
  }

  /* A failing tube: now and then one letter of the sign stutters out and back. */
  let buzzTimer = 0;
  const buzz = () => {
    if (calm) return;
    const letter = letters[Math.floor(rand(0, letters.length))];
    letter.animate(
      [
        { opacity: 1 },
        { opacity: 0.08 },
        { opacity: 0.9 },
        { opacity: 0.15 },
        { opacity: 1 },
        { opacity: 0.4 },
        { opacity: 1 },
      ],
      { duration: rand(260, 520), easing: "steps(7)" },
    );
    buzzTimer = window.setTimeout(buzz, rand(600, 2400));
  };
  buzzTimer = window.setTimeout(buzz, 900);

  /* Mirror-ball spots, rain and confetti share one canvas at screen resolution. The spots sit on
     a sphere around the ball and turn with it, so they cross the room, faster and longer at the
     sides, the way light from a real ball moves over walls. */
  const sky = calm ? null : overlayCanvas("ldp-canvas ldp-sky", 1);
  const spot = sky ? spotSprite() : null;
  const ray = sky ? raySprite() : null;
  const specks = Array.from({ length: 160 }, (_, i) => ({
    turn: rand(0, Math.PI * 2),
    tilt: rand(-0.35, 0.95),
    size: rand(11, 25),
    phase: rand(0, Math.PI * 2),
    tint: Math.random() < 0.35 ? PALETTE[Math.floor(rand(0, PALETTE.length))] : "#ffffff",
    ray: i % 11 === 0,
  }));
  const drops = sky
    ? Array.from({ length: 150 }, () => ({
        x: rand(0, sky.width + 120),
        y: rand(0, sky.height),
        length: rand(10, 22),
        speed: rand(700, 1100),
      }))
    : [];
  type Bit = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    a: number;
    va: number;
    w: number;
    h: number;
    colour: string;
  };
  let bits: Bit[] = [];
  const confetti = (count: number) => {
    if (!sky) return;
    for (let i = 0; i < count; i++)
      bits.push({
        x: rand(0, sky.width),
        y: rand(-sky.height * 0.5, -10),
        vx: rand(-60, 60),
        vy: rand(80, 260),
        a: rand(0, 6.3),
        va: rand(-8, 8),
        w: rand(5, 10),
        h: rand(3, 6),
        colour: PALETTE[Math.floor(rand(0, PALETTE.length))],
      });
  };
  const ballEl = club.querySelector<HTMLElement>(".ldp-ball-sphere")!;
  let ballX = 0;
  let ballY = 0;
  const findBall = () => {
    const box = ballEl.getBoundingClientRect();
    ballX = box.left + box.width / 2;
    ballY = box.top + box.height / 2;
  };
  findBall();
  window.addEventListener("resize", findBall);
  let level = 1;
  let target = 1;
  let rain = 1;
  let rainTarget = 1;
  let frame = 0;
  const paint = (now: number, dt: number) => {
    if (!sky || !spot || !ray) return;
    const { context: g, width, height, ratio: r } = sky;
    level += (target - level) * Math.min(1, dt * 3);
    rain += (rainTarget - rain) * Math.min(1, dt * 1.5);
    g.setTransform(r, 0, 0, r, 0, 0);
    g.clearRect(0, 0, width, height);
    if (rain > 0.02) {
      // All the rain is one path, stroked once.
      g.globalAlpha = rain * 0.32;
      g.strokeStyle = "#b9c8ff";
      g.lineWidth = 1;
      g.beginPath();
      for (const drop of drops) {
        drop.y += drop.speed * dt;
        drop.x -= drop.speed * 0.18 * dt;
        if (drop.y > height) {
          drop.y = rand(-40, 0);
          drop.x = rand(0, width + 120);
        }
        g.moveTo(drop.x, drop.y);
        g.lineTo(drop.x + drop.length * 0.18, drop.y - drop.length);
      }
      g.stroke();
    }
    // One turn every 8 bars, on the music's clock.
    const turn = ((now - origin) / (barMs * 8)) * Math.PI * 2;
    const reach = Math.max(width, height) * 0.42;
    g.globalCompositeOperation = "lighter";
    for (const speck of specks) {
      const angle = speck.turn + turn;
      const facing = Math.cos(angle);
      if (facing < 0.18) continue;
      const x = ballX + (Math.sin(angle) / facing) * reach;
      const y = ballY + (Math.tan(speck.tilt) / facing) * reach * 0.62 + reach * 0.1;
      if (x < -40 || x > width + 40 || y < -40 || y > height + 40) continue;
      const fade = Math.min(1, (facing - 0.18) * 5);
      const twinkle = 0.55 + 0.45 * Math.sin(now / 260 + speck.phase * 3) ** 2;
      const alpha = level * fade * twinkle;
      if (speck.ray) {
        g.globalAlpha = alpha * 0.12;
        const dx = x - ballX;
        const dy = y - ballY;
        const length = Math.hypot(dx, dy);
        const c = dx / length;
        const s = dy / length;
        g.setTransform(
          (c * length * r) / 256,
          (s * length * r) / 256,
          -s * 2.2 * r,
          c * 2.2 * r,
          ballX * r,
          ballY * r,
        );
        g.drawImage(ray, 0, -4);
        g.setTransform(r, 0, 0, r, 0, 0);
      }
      const h = speck.size;
      const w = h / facing;
      g.globalAlpha = Math.min(1, alpha);
      g.drawImage(spot, x - w / 2, y - h / 2, w, h);
      if (speck.tint !== "#ffffff") {
        g.globalAlpha = alpha * 0.6;
        g.fillStyle = speck.tint;
        g.fillRect(x - w / 4, y - h / 4, w / 2, h / 2);
      }
    }
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
    bits = bits.filter((bit) => bit.y < height + 20);
    for (const bit of bits) {
      bit.vy += 240 * dt;
      bit.vx += Math.sin(now / 300 + bit.a) * 30 * dt;
      bit.x += bit.vx * dt;
      bit.y += bit.vy * dt;
      bit.a += bit.va * dt;
      const c = Math.cos(bit.a);
      const s = Math.sin(bit.a);
      const squash = Math.abs(Math.cos(bit.a * 1.7)) + 0.1;
      g.setTransform(c * r, s * r, -s * squash * r, c * squash * r, bit.x * r, bit.y * r);
      g.fillStyle = bit.colour;
      g.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h);
    }
  };

  /* The show follows the song: each part of it has its own lights. */
  const flash = (strength: number) => {
    if (calm) return;
    // The layer exists only while it shows.
    const white = document.createElement("div");
    white.className = "ldp-flash";
    club.append(white);
    white
      .animate([{ opacity: 0 }, { opacity: strength, offset: 0.15 }, { opacity: 0 }], 520)
      .finished.then(
        () => white.remove(),
        () => white.remove(),
      );
  };
  const enter = (scene: Scene, first: boolean) => {
    for (const { animation } of sceneOnly) animation.cancel();
    sceneOnly = [];
    club.dataset.scene = scene;
    target = BALL_LEVEL[scene];
    rainTarget = RAIN_LEVEL[scene];
    if (scene === "verse" || scene === "lift" || scene === "drop")
      // Light on the kick: while the drums play, the room brightens on every beat, then settles.
      // Harder in the drop.
      groove(
        dim,
        [
          { opacity: scene === "drop" ? 0.56 : 0.7, easing: "ease-out" },
          { opacity: 0.86, offset: 0.45 },
          { opacity: 0.86 },
        ],
        1,
        {},
        sceneOnly,
      );
    if (scene === "drop") {
      flash(0.32);
      confetti(first ? 170 : 120);
      // The whole crowd jumps on the beat.
      lines.forEach((line, i) =>
        groove(
          line,
          [
            { transform: "translateY(2px)", easing: "ease-out" },
            { transform: `translateY(${i ? -10 : -7}px)`, offset: 0.45, easing: "ease-in" },
            { transform: "translateY(2px)" },
          ],
          1,
          { shift: i * 0.04 },
          sceneOnly,
        ),
      );
      // The sign goes wild for the first bar of the drop.
      if (!calm)
        sign.animate(
          [{ opacity: 1 }, { opacity: 0.1 }, { opacity: 1 }, { opacity: 0.1 }, { opacity: 1 }],
          { duration: barMs, easing: `steps(${8})`, composite: "replace" },
        );
    }
    if (scene === "build")
      // The beams cut in and out on every beat with the snare roll.
      groove(
        beams,
        [
          { opacity: 1, offset: 0 },
          { opacity: 1, offset: 0.35 },
          { opacity: 0.15, offset: 0.4 },
          { opacity: 0.15, offset: 1 },
        ],
        1,
        {},
        sceneOnly,
      );
  };
  // The breath before a drop: one beat of dark, on the last beat of the build.
  const cut = () => {
    if (calm) return;
    const dark = document.createElement("div");
    dark.className = "ldp-cut";
    club.insertBefore(dark, wrap);
    window.setTimeout(() => dark.remove(), beatMs);
  };

  /* The page's accent follows the music. Each change restyles the whole page, so if a change
     makes a frame slow, changes come half as often (down to once every 4 bars), and speed back
     up once they're quick again. */
  let slow = 1;
  let shade = 0;
  let chase = ["#ff3dd8", "#1ff4ff", "#ffcf3d"];
  const recolour = (hex: string) => {
    club.style.setProperty("--ldp-glow", hex);
    // The towers' windows take the new colour in turn, so it runs across the skyline.
    if (hex !== chase[0]) {
      chase = [hex, chase[0], chase[1]];
      chase.forEach((colour, i) => club.style.setProperty(`--ldp-c${i + 1}`, colour));
    }
    if (root.style.getPropertyValue(names[0]) === hex) return;
    const before = performance.now();
    root.style.setProperty(names[0], hex);
    root.style.setProperty(names[1], accentInk(hex));
    root.style.setProperty(names[2], onAccent(hex));
    requestAnimationFrame(() =>
      requestAnimationFrame((now) => {
        const took = now - before;
        if (took > 75) slow = Math.min(8, slow * 2);
        else if (took < 45) slow = Math.max(1, slow / 2);
      }),
    );
  };

  let stopped = false;
  let scene: Scene | null = null;
  let lastBar = Number.NaN;
  let passes = 0;
  const onBar = (count: number) => {
    const bar = songBar(track, count);
    if (bar === lastBar) return;
    if (bar < lastBar) passes++;
    lastBar = bar;
    if (!club.classList.contains("is-on")) club.classList.add("is-on");
    const next = sceneAt(track, bar);
    if (next !== scene) {
      scene = next;
      enter(next, passes === 0);
      if (next === "intro") recolour("#ffb547");
      if (next === "break") recolour("#b46bff");
    } else if (scene === "drop" && bar % 8 === 0) confetti(80);
    if (!calm && bar % 4 === 0 && scene !== "drop")
      sign.animate(
        [{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }],
        { duration: 260, easing: "steps(5)" },
      );
  };
  const onBeat = (beats: number) => {
    if (stopped) return;
    const count = Math.floor(beats / 4);
    onBar(count);
    if (!scene) return;
    if (
      beats % 4 === 3 &&
      scene === "build" &&
      sceneAt(track, songBar(track, count) + 1) === "drop"
    )
      cut();
    const every = ACCENT_EVERY[scene] * slow;
    if (!every || beats % every !== 0) return;
    const colours = scene === "drop" ? DROP : PALETTE;
    shade = (shade + 1) % colours.length;
    recolour(colours[shade]);
  };

  let beatTimer = 0;
  let lastBeat = Number.NaN;
  const tick = () => {
    window.clearTimeout(beatTimer);
    if (stopped) return;
    const beats = Math.floor((performance.now() - origin) / beatMs + 0.01);
    if (beats >= 0 && beats !== lastBeat) {
      lastBeat = beats;
      onBeat(beats);
    }
    beatTimer = window.setTimeout(tick, origin + (beats + 1) * beatMs - performance.now() + 4);
  };
  beatTimer = window.setTimeout(tick, origin - performance.now());

  /** Move the whole show onto a new clock: every light, and the beat counter. */
  const retime = (next: number) => {
    origin = next;
    for (const { animation, shift } of [...synced, ...sceneOnly])
      animation.startTime = origin + shift * beatMs;
    lastBeat = Number.NaN;
    tick();
  };

  /* Read the clock from the music a few times a second. Small wobbles are ignored; a real
     difference (a stall on a slow connection, the loop, a new track) moves the show. */
  // What the speakers are behind the music's clock. Read each time: it settles after start.
  const lead = () =>
    context
      ? Math.min(0.5, Math.max(context.outputLatency || 0, context.baseLatency || 0)) * 1000
      : 0;
  let strikes = 0;
  let loopTimer = 0;
  const listen = () => {
    if (!audio || audio.paused || audio.readyState < 3) return;
    openDoor();
    const end = track.first + (track.loop[1] * barMs) / 1000;
    if (!loopTimer && audio.currentTime > end - 0.3 && audio.currentTime < end + 0.25)
      loopTimer = window.setTimeout(
        () => {
          loopTimer = 0;
          // Carry any overshoot across, so the jump lands on the same beat.
          const over = Math.max(0, audio.currentTime - end);
          audio.currentTime = track.first + (track.loop[0] * barMs) / 1000 + over;
        },
        Math.max(0, (end - audio.currentTime) * 1000),
      );
    const heard = performance.now() - (audio.currentTime - track.first) * 1000 + lead();
    const off = heard - origin;
    if (Math.abs(off) > 400) retime(heard);
    else if (Math.abs(off) > 30) {
      if (++strikes >= 2) {
        strikes = 0;
        retime(heard);
      }
    } else strikes = 0;
  };
  const listener = window.setInterval(listen, 200);
  audio?.addEventListener("playing", listen);

  /* Switching tracks: the new one starts where its groove does, and every light takes its tempo. */
  const trackButton = document.createElement("button");
  trackButton.type = "button";
  trackButton.className = "ldp-pill ldp-pill-quiet ldp-pill-track";
  const label = () => {
    trackButton.textContent = track.title;
    trackButton.setAttribute(
      "aria-label",
      `Now playing ${track.title}. Play the next track: ${TRACKS[(index + 1) % TRACKS.length].title}`,
    );
    nowPlaying.textContent = track.title;
  };
  label();
  if (TRACKS.length < 2) trackButton.hidden = true;
  trackButton.addEventListener("click", () => {
    index = (index + 1) % TRACKS.length;
    track = TRACKS[index];
    saveTrack(index);
    label();
    window.clearTimeout(loopTimer);
    loopTimer = 0;
    beatMs = 60_000 / track.bpm;
    barMs = beatMs * 4;
    for (const { animation, beats } of [...synced, ...sceneOnly])
      animation.effect?.updateTiming({ duration: beats * beatMs });
    const start = track.loop[0];
    scene = null;
    lastBar = Number.NaN;
    passes = 1;
    if (audio) {
      openDoor(true);
      audio.src = trackSource(track, audio);
      audio.currentTime = track.first + (start * barMs) / 1000;
      void audio.play().catch(() => undefined);
    }
    lineIndex = -2;
    lastHeard = Number.NEGATIVE_INFINITY;
    shouts.splice(0).forEach((el) => el.remove());
    // Until the new track is heard, keep time from now.
    retime(performance.now() + 300 - start * barMs);
  });

  /* ---------- Every frame: the towers, the subtitles, the hook word and the seek dot ---------- */

  /** Where in the file the listener is now: the music's clock minus what the speakers lag. */
  const heard = () => (audio && audio.readyState >= 2 ? audio.currentTime - lead() / 1000 : null);

  // Each tower rises with its own band of the spectrum, measured against that band's recent peak,
  // so quiet highs move as much as loud bass. Without Web Audio they bounce on the beat instead.
  const bins = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
  const peaks = town.towers.map(() => 60);
  const DRIVE: Record<Scene, number> = {
    intro: 0.25,
    verse: 0.65,
    lift: 0.8,
    break: 0.3,
    build: 0.6,
    drop: 1,
    outro: 0.25,
  };
  let towerFrame = 0;
  const moveTowers = (now: number) => {
    // Thirty times a second is plenty for a skyline, and halves the work.
    if (calm || ++towerFrame % 2) return;
    if (analyser && bins) analyser.getByteFrequencyData(bins);
    // Where we are in the beat (0 on the kick), and a bump that decays from it.
    const phase = ((((now - origin) / beatMs) % 1) + 1) % 1;
    const kick = Math.exp(-phase * 5) * DRIVE[scene ?? "intro"];
    town.towers.forEach((t, i) => {
      let v: number;
      if (bins) {
        const raw = bins[t.bin];
        peaks[i] = Math.max(peaks[i] * 0.997, raw, 60);
        v = Math.min(1, Math.max(0, (raw / peaks[i] - 0.55) / 0.45));
      } else v = kick * (0.55 + 0.45 * Math.abs(Math.sin(t.bin * 1.7)));
      const scale = t.el === town.seekTower ? 1 : 1 + v * v * 0.34;
      const glow = 0.28 + 0.72 * v;
      if (Math.abs(scale - t.scale) > 0.008) {
        t.scale = scale;
        t.el.style.transform = `scaleY(${scale.toFixed(3)})`;
      }
      if (Math.abs(glow - t.glow) > 0.05) {
        t.glow = glow;
        t.lit.style.opacity = glow.toFixed(2);
      }
    });
  };

  // Subtitles, for songs with words. On unless the visitor turns them off in the panel (the
  // stylesheet reads that from <html>), so they can come and go mid-song.
  const subs = document.createElement("p");
  subs.className = "ldp-subs";
  subs.setAttribute("aria-live", "off");
  host().append(subs);
  let lineIndex = -2;
  const caption = (t: number | null) => {
    const lyrics = track.lyrics;
    // The latest line that has begun, held a moment after it ends (a new line always wins).
    let i = -1;
    if (lyrics && t !== null) {
      for (let k = 0; k < lyrics.length && lyrics[k][0] - 0.05 <= t; k++) i = k;
      if (i >= 0 && t >= lyrics[i][1] + 0.35) i = -1;
    }
    if (i === lineIndex) return;
    lineIndex = i;
    subs.textContent = i < 0 ? "" : lyrics![i][2];
    if (i >= 0 && !calm)
      subs.animate(
        [
          { opacity: 0, transform: "translate(-50%, 6px)" },
          { opacity: 1, transform: "translate(-50%, 0)" },
        ],
        { duration: 180, easing: "ease-out" },
      );
  };

  // The hook: each time the song's word is sung, it slams onto the screen, scaled down from big,
  // glitching in two colours, and burns out. It peaks on the stressed syllable.
  const LEAD_IN = 0.19;
  let hookNext = 0;
  let lastHeard = Number.NEGATIVE_INFINITY;
  const shouts: HTMLElement[] = [];
  const shout = (word: string) => {
    // Quick repeats overlap: the last one flies out while the next one lands.
    while (shouts.length > 1) shouts.shift()!.remove();
    const el = document.createElement("div");
    el.className = "ldp-word";
    el.setAttribute("aria-hidden", "true");
    const text = word.toUpperCase();
    el.innerHTML = `<span class="ldp-word-text" data-word="${text}">${text}</span>${calm ? "" : bolts()}`;
    host().append(el);
    shouts.push(el);
    const at = (scale: number) => `translate(-50%, -50%) scale(${scale})`;
    // Out of nothing in the middle, full size on the sung beat, a tube flicker, then out past the
    // edges of the screen.
    const duration = 1000;
    const peak = (LEAD_IN * 1000) / duration;
    el.animate(
      calm
        ? [
            { opacity: 0 },
            { opacity: 1, offset: peak },
            { opacity: 1, offset: 0.65 },
            { opacity: 0 },
          ]
        : [
            { opacity: 0, transform: at(0.02), easing: "cubic-bezier(0.2, 1.25, 0.45, 1)" },
            { opacity: 1, transform: at(1), offset: peak },
            { opacity: 1, transform: at(1.02), offset: 0.34 },
            { opacity: 0.25, transform: at(1.03), offset: 0.38 },
            { opacity: 1, transform: at(1.04), offset: 0.42 },
            {
              opacity: 1,
              transform: at(1.12),
              offset: 0.6,
              easing: "cubic-bezier(0.55, 0, 0.85, 0.4)",
            },
            { opacity: 0, transform: at(3.4) },
          ],
      { duration },
    ).finished.then(
      () => el.remove(),
      () => el.remove(),
    );
    if (calm) return;
    // The room punches with it, and the colours jump.
    dim.animate([{ opacity: 0.45 }, { opacity: 0.86 }], { duration: 380, easing: "ease-out" });
    shade = (shade + 1) % DROP.length;
    recolour(DROP[shade]);
  };
  const hook = (t: number | null) => {
    const words = track.hook;
    if (!words || t === null) return;
    // A seek, a loop or a new track: find our place again.
    if (t < lastHeard - 0.3 || t > lastHeard + 1.5) {
      hookNext = words.at.findIndex((at) => at - LEAD_IN > t);
      if (hookNext < 0) hookNext = words.at.length;
    }
    lastHeard = t;
    while (hookNext < words.at.length && t >= words.at[hookNext] - LEAD_IN) {
      if (t - words.at[hookNext] < 0.3) shout(words.word);
      hookNext++;
    }
  };

  /* The seek bar is hidden in plain sight: the roof line of one tower. Only a tiny dark dot on it
     moves with the song. It is a real slider for keyboards and screen readers. */
  const seek = document.createElement("div");
  seek.className = "ldp-seek";
  seek.setAttribute("role", "slider");
  seek.setAttribute("aria-label", "Song position");
  seek.setAttribute("aria-valuemin", "0");
  seek.tabIndex = 0;
  seek.innerHTML = '<i class="ldp-seek-line"></i><i class="ldp-seek-dot"></i>';
  const dot = seek.querySelector<HTMLElement>(".ldp-seek-dot")!;
  if (audio) host().append(seek);
  let seekBox = { left: 0, width: 1 };
  const placeSeek = () => {
    const box = town.seekTower.getBoundingClientRect();
    seekBox = { left: box.left, width: box.width };
    seek.style.cssText = `left:${box.left}px;top:${box.top - 9}px;width:${box.width}px`;
  };
  placeSeek();
  window.addEventListener("resize", placeSeek);
  const clock = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  let shownAt = -1;
  let dragging = false;
  let dragAt = 0;
  const showSeek = (time: number) => {
    const duration = audio?.duration;
    if (!duration || !Number.isFinite(duration)) return;
    const fraction = Math.min(1, Math.max(0, time / duration));
    dot.style.transform = `translateX(${(fraction * seekBox.width).toFixed(1)}px)`;
    const second = Math.floor(time);
    if (second !== shownAt) {
      shownAt = second;
      seek.setAttribute("aria-valuemax", String(Math.round(duration)));
      seek.setAttribute("aria-valuenow", String(second));
      seek.setAttribute("aria-valuetext", `${clock(time)} of ${clock(duration)}`);
    }
  };
  const seekTo = (time: number) => {
    if (!audio?.duration || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(audio.duration - 0.5, Math.max(0, time));
    showSeek(audio.currentTime);
  };
  const timeAt = (x: number) =>
    (Math.min(1, Math.max(0, (x - seekBox.left) / seekBox.width)) || 0) * (audio?.duration || 0);
  let lastSeek = 0;
  seek.addEventListener("pointerdown", (event) => {
    if (!audio) return;
    dragging = true;
    seek.setPointerCapture(event.pointerId);
    dragAt = timeAt(event.clientX);
    seekTo(dragAt);
    lastSeek = performance.now();
  });
  seek.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    dragAt = timeAt(event.clientX);
    showSeek(dragAt);
    // Scrub, but not on every pixel: a seek every 150 ms is enough to hear where you are.
    if (performance.now() - lastSeek > 150) {
      lastSeek = performance.now();
      seekTo(dragAt);
    }
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    seekTo(dragAt);
  };
  seek.addEventListener("pointerup", release);
  seek.addEventListener("pointercancel", release);
  seek.addEventListener("keydown", (event) => {
    if (!audio) return;
    const step = {
      ArrowRight: 5,
      ArrowUp: 5,
      ArrowLeft: -5,
      ArrowDown: -5,
      PageUp: 15,
      PageDown: -15,
    }[event.key];
    if (step) seekTo(audio.currentTime + step);
    else if (event.key === "Home") seekTo(0);
    else if (event.key === "End") seekTo(audio.duration - 2);
    else return;
    event.preventDefault();
  });

  let previous = performance.now();
  const step = (now: number) => {
    const dt = Math.min(1 / 30, (now - previous) / 1000);
    previous = now;
    const t = heard();
    moveTowers(now);
    caption(t);
    hook(t);
    if (audio && !dragging && t !== null) showSeek(audio.currentTime);
    paint(now, dt);
    frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);

  let soundOn = true;
  const hidden = () => {
    if (!audio || stopped) return;
    if (document.hidden) audio.pause();
    else void audio.play().catch(() => undefined);
  };
  document.addEventListener("visibilitychange", hidden);

  return {
    sound: Boolean(audio),
    controls: [trackButton],
    setSound(on: boolean) {
      soundOn = on;
      if (!audio) return;
      if (out && context) out.gain.setTargetAtTime(on ? 1 : 0, context.currentTime, 0.06);
      else audio.muted = !on;
    },
    async stop() {
      stopped = true;
      window.clearTimeout(beatTimer);
      window.clearTimeout(buzzTimer);
      window.clearInterval(listener);
      window.clearTimeout(loopTimer);
      window.removeEventListener("resize", findBall);
      window.removeEventListener("resize", placeSeek);
      seek.remove();
      subs.remove();
      shouts.splice(0).forEach((el) => el.remove());
      document.removeEventListener("visibilitychange", hidden);
      audio?.removeEventListener("playing", listen);
      club.classList.add("is-leaving");
      sky?.canvas.classList.add("is-leaving");
      if (out && context && soundOn) out.gain.setTargetAtTime(0, context.currentTime, 0.08);
      names.forEach((name, i) => {
        if (saved[i]) root.style.setProperty(name, saved[i]);
        else root.style.removeProperty(name);
      });
      await new Promise((resolve) => window.setTimeout(resolve, 380));
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      context?.close().catch(() => undefined);
      cancelAnimationFrame(frame);
      for (const { animation } of [...synced, ...sceneOnly]) animation.cancel();
      club.remove();
      sky?.canvas.remove();
    },
  };
}
