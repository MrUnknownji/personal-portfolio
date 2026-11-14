/**
 * Party: the site becomes a club at closing time. The lights go down, a mirror ball throws spots
 * around the room, beams sweep, lasers fan out in the chorus and a crowd dances along the bottom,
 * all to a real track ("Calor de Madrugada", 105 BPM) that streams in when the party starts.
 *
 * Built to stay smooth: every moving light is a compositor animation (transform and opacity only),
 * all of them locked to one beat clock, and that clock is read from the music itself. The page
 * underneath changes at most once every two bars (the accent colour), never every frame.
 */
import { takeAudio } from "./audioPrime";
import { host, overlayCanvas, rand, reducedMotion } from "./play";
import { accentInk, onAccent } from "./tweaks";
import "./party.css";

/* ---------- The track ---------- */

const BPM = 105;
const BEAT_MS = 60_000 / BPM;
const BAR_MS = BEAT_MS * 4;
/** Where bar 0, beat 1 falls in the file, in seconds (measured from the waveform). */
const FIRST = 0.184;
/**
 * The song stops dead at bar 74. Rather than play its tail and the quiet intro again, the party
 * jumps from there straight back into the groove at bar 4, on the beat.
 */
const LOOP_START = 4;
const LOOP_END = 74;
const songBar = (count: number) =>
  count < LOOP_END ? count : LOOP_START + ((count - LOOP_START) % (LOOP_END - LOOP_START));

type Scene = "intro" | "verse" | "lift" | "break" | "build" | "drop" | "outro";

/**
 * The song, bar by bar, from listening to it (Gemini's notes) and from its measured energy, which
 * changes on these bars. Intro: guitar and keys, no drums. Verse: the four-on-the-floor kick and
 * dembow snare come in; halfway, open hats and plucks lift it. Break: drums filtered out. Build:
 * a snare roll and a riser, with a one-beat cut before each drop. Drop: the hook, full bass.
 */
const SONG: [bar: number, scene: Scene][] = [
  [0, "intro"],
  [4, "verse"],
  [12, "lift"],
  [20, "break"],
  [24, "build"],
  [28, "drop"],
  [44, "verse"],
  [52, "break"],
  [55, "build"],
  [58, "drop"],
  [74, "outro"],
];
const sceneAt = (bar: number) => {
  let scene = SONG[0][1];
  for (const [start, part] of SONG) if (start <= bar) scene = part;
  return scene;
};

/** How bright the mirror ball's spots are in each part: they carry the quiet parts. */
const BALL_LEVEL: Record<Scene, number> = {
  intro: 1,
  verse: 0.55,
  lift: 0.5,
  break: 1,
  build: 0.75,
  drop: 0.7,
  outro: 0.9,
};

/* ---------- The room ---------- */

const PALETTE = ["#ff4fd8", "#3ee8ff", "#a98bff", "#7fe3b4", "#ffb547"];
const BEAMS = ["#ff4fd8", "#3ee8ff", "#a98bff", "#ffb547"];

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

/* ---------- The party ---------- */

export async function startParty() {
  const calm = reducedMotion();
  const root = document.documentElement;
  const names = ["--ldt-accent", "--ldt-accent-ink", "--ldt-on-accent"];
  const saved = names.map((name) => root.style.getPropertyValue(name));
  const prime = takeAudio();
  const audio = prime?.audio ?? null;
  const context = prime?.context ?? null;

  /* The sound: the track comes in muffled, as if through the club's door, which opens in the
     intro. Without Web Audio the element plays straight out. */
  let out: GainNode | null = null;
  let door: BiquadFilterNode | null = null;
  if (context && prime?.source) {
    try {
      door = context.createBiquadFilter();
      door.type = "lowpass";
      door.frequency.value = 340;
      door.Q.value = 0.9;
      out = context.createGain();
      prime.source.connect(door).connect(out).connect(context.destination);
    } catch {
      out = null;
    }
  }
  let doorOpen = false;
  const openDoor = () => {
    if (doorOpen || !door || !context || !audio) return;
    doorOpen = true;
    // Fully open just before the verse (bar 4).
    const until = Math.max(0.4, FIRST + (3.5 * BAR_MS) / 1000 - audio.currentTime);
    const now = context.currentTime;
    door.frequency.cancelScheduledValues(now);
    door.frequency.setValueAtTime(door.frequency.value, now);
    door.frequency.exponentialRampToValueAtTime(20_000, now + until);
  };

  const club = document.createElement("div");
  club.className = "ldp-club";
  club.setAttribute("aria-hidden", "true");
  const reel = calm ? "" : paintBall(Math.min(2, window.devicePixelRatio || 1));
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
    <p class="ldp-sign">After hours</p>`;
  const { wrap, people, lines } = crowd(window.innerWidth);
  club.append(wrap);
  host().append(club);

  /* One clock. Until the music plays it runs on its own; then it is read from the music. */
  let origin = performance.now() + 250;
  type Synced = { animation: Animation; shift: number };
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
      duration: beats * BEAT_MS,
      iterations: Infinity,
      ...rest,
    });
    animation.startTime = origin + shift * BEAT_MS;
    list.push({ animation, shift });
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

  /* Mirror-ball spots and confetti share one canvas at screen resolution. The spots sit on a
     sphere around the ball and turn with it, so they cross the room, faster and longer at the
     sides, the way light from a real ball moves over walls. */
  const sky = calm ? null : overlayCanvas("ldp-canvas ldp-sky", 1);
  const spot = sky ? spotSprite() : null;
  const ray = sky ? raySprite() : null;
  const specks = Array.from({ length: 160 }, (_, i) => ({
    turn: rand(0, Math.PI * 2),
    tilt: rand(-0.35, 0.95),
    size: rand(11, 25),
    phase: rand(0, Math.PI * 2),
    tint: Math.random() < 0.3 ? PALETTE[Math.floor(rand(0, PALETTE.length))] : "#ffffff",
    ray: i % 11 === 0,
  }));
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
  let frame = 0;
  let previous = performance.now();
  const draw = (now: number) => {
    if (!sky || !spot || !ray) return;
    const { context: g, width, height, ratio: r } = sky;
    const dt = Math.min(1 / 30, (now - previous) / 1000);
    previous = now;
    level += (target - level) * Math.min(1, dt * 3);
    g.setTransform(r, 0, 0, r, 0, 0);
    g.clearRect(0, 0, width, height);
    // One turn every 8 bars, on the music's clock.
    const turn = ((now - origin) / (BAR_MS * 8)) * Math.PI * 2;
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
        g.globalAlpha = alpha * 0.11;
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
      g.globalAlpha = alpha * 0.9;
      g.drawImage(spot, x - w / 2, y - h / 2, w, h);
      if (speck.tint !== "#ffffff") {
        g.globalAlpha = alpha * 0.5;
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
    frame = requestAnimationFrame(draw);
  };
  if (sky) frame = requestAnimationFrame(draw);

  /* The show follows the song: each part of it has its own lights. */
  const sign = club.querySelector<HTMLElement>(".ldp-sign")!;
  const beams = club.querySelector<HTMLElement>(".ldp-beams")!;
  const dim = club.querySelector<HTMLElement>(".ldp-dim")!;
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
    if (scene === "verse" || scene === "lift" || scene === "drop")
      // Light on the kick: while the drums play, the room brightens on every beat, then settles.
      groove(
        dim,
        [{ opacity: 0.72, easing: "ease-out" }, { opacity: 0.86, offset: 0.4 }, { opacity: 0.86 }],
        1,
        {},
        sceneOnly,
      );
    if (scene === "drop") {
      flash(0.3);
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
  let cutTimer = 0;
  const cut = (at: number) => {
    if (calm) return;
    window.clearTimeout(cutTimer);
    cutTimer = window.setTimeout(() => {
      const dark = document.createElement("div");
      dark.className = "ldp-cut";
      club.insertBefore(dark, wrap);
      window.setTimeout(() => dark.remove(), BEAT_MS);
    }, at - performance.now());
  };

  let stopped = false;
  let scene: Scene | null = null;
  let lastBar = Number.NaN;
  let passes = 0;
  const onBar = (count: number) => {
    if (stopped) return;
    const bar = songBar(count);
    if (bar === lastBar) return;
    if (bar < lastBar) passes++;
    lastBar = bar;
    if (!club.classList.contains("is-on")) club.classList.add("is-on");
    const next = sceneAt(bar);
    if (next !== scene) {
      scene = next;
      enter(next, passes === 0);
    } else if (scene === "drop" && bar % 8 === 0) confetti(80);
    if (scene === "build" && sceneAt(bar + 1) === "drop") cut(origin + (count * 4 + 3) * BEAT_MS);
    // The colour moves on every two bars; the intro is warm amber and the break holds a cool violet.
    if (bar % 2 === 0 || scene === "break" || scene === "intro") {
      const hex =
        scene === "intro"
          ? "#ffb547"
          : scene === "break"
            ? "#a98bff"
            : PALETTE[(bar / 2) % PALETTE.length | 0];
      club.style.setProperty("--ldp-glow", hex);
      // Recolouring the page restyles all of it (about 50-250 ms on a slow phone), so it happens
      // at most every other bar, never per frame. The lights run on the compositor and don't
      // wait for it.
      if (root.style.getPropertyValue(names[0]) !== hex) {
        root.style.setProperty(names[0], hex);
        root.style.setProperty(names[1], accentInk(hex));
        root.style.setProperty(names[2], onAccent(hex));
      }
    }
    if (!calm && bar % 4 === 0)
      sign.animate(
        [{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }],
        { duration: 260, easing: "steps(5)" },
      );
  };

  let barTimer = 0;
  const tick = () => {
    window.clearTimeout(barTimer);
    if (stopped) return;
    const count = Math.floor((performance.now() - origin) / BAR_MS + 0.01);
    if (count >= 0) onBar(count);
    barTimer = window.setTimeout(tick, origin + (count + 1) * BAR_MS - performance.now() + 4);
  };
  barTimer = window.setTimeout(tick, origin - performance.now());

  /** Move the whole show onto a new clock: every light, and the bar counter. */
  const retime = (next: number) => {
    origin = next;
    for (const { animation, shift } of [...synced, ...sceneOnly])
      animation.startTime = origin + shift * BEAT_MS;
    tick();
  };

  /* Read the clock from the music a few times a second. Small wobbles are ignored; a real
     difference (a stall on a slow connection, the loop back to the start) moves the show. */
  const lead = context
    ? Math.min(0.5, Math.max(context.outputLatency || 0, context.baseLatency || 0)) * 1000
    : 0;
  let strikes = 0;
  let loopTimer = 0;
  const end = FIRST + (LOOP_END * BAR_MS) / 1000;
  const listen = () => {
    if (!audio || audio.paused || audio.readyState < 3) return;
    openDoor();
    if (!loopTimer && audio.currentTime > end - 0.3)
      loopTimer = window.setTimeout(
        () => {
          loopTimer = 0;
          // Carry any overshoot across, so the jump lands on the same beat.
          const over = Math.max(0, audio.currentTime - end);
          audio.currentTime = FIRST + (LOOP_START * BAR_MS) / 1000 + over;
        },
        Math.max(0, (end - audio.currentTime) * 1000),
      );
    const heard = performance.now() - (audio.currentTime - FIRST) * 1000 + lead;
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

  let soundOn = true;
  const hidden = () => {
    if (!audio || stopped) return;
    if (document.hidden) audio.pause();
    else void audio.play().catch(() => undefined);
  };
  document.addEventListener("visibilitychange", hidden);

  return {
    sound: Boolean(audio),
    setSound(on: boolean) {
      soundOn = on;
      if (!audio) return;
      if (out && context) out.gain.setTargetAtTime(on ? 1 : 0, context.currentTime, 0.06);
      else audio.muted = !on;
    },
    async stop() {
      stopped = true;
      window.clearTimeout(barTimer);
      window.clearInterval(listener);
      window.clearTimeout(loopTimer);
      window.clearTimeout(cutTimer);
      window.removeEventListener("resize", findBall);
      document.removeEventListener("visibilitychange", hidden);
      audio?.removeEventListener("playing", listen);
      club.classList.add("is-leaving");
      sky?.canvas.classList.add("is-leaving");
      if (out && context && soundOn) out.gain.setTargetAtTime(0, context.currentTime, 0.08);
      names.forEach((name, index) => {
        if (saved[index]) root.style.setProperty(name, saved[index]);
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
