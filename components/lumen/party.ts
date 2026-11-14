/**
 * Party: the site becomes a club at closing time. The lights go down, beams sweep, a mirror ball
 * turns, a crowd bounces along the bottom, and an original late-night groove plays, synthesized
 * live with Web Audio (no audio files).
 *
 * Built to stay smooth: every moving light is a compositor animation (transform and opacity only),
 * all of them locked to one beat clock, and the music follows the same clock. The page underneath
 * changes once a bar (the accent colour), never every frame.
 */
import { takeAudio } from "./audioPrime";
import { host, overlayCanvas, rand, reducedMotion } from "./play";
import { accentInk, onAccent } from "./tweaks";
import "./party.css";

const BPM = 102;
const BEAT = 60 / BPM;
const STEP = BEAT / 4;
const BAR = BEAT * 4;
const BEAT_MS = BEAT * 1000;
/** Bars heard through the door, muffled, before it opens. */
const INTRO = 1;

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/* ---------- The music: F minor, one chord a bar, a dembow-style bounce ---------- */

const CHORDS = [
  [65, 68, 72], // F minor
  [65, 68, 73], // D-flat
  [63, 68, 72], // A-flat
  [63, 67, 70], // E-flat
];
const ROOTS = [41, 37, 44, 39];
/** 808 notes in a bar: [step, length in steps, jumps an octave on odd bars]. */
const BASS: [number, number, boolean][] = [
  [0, 5, false],
  [7, 2, false],
  [10, 3, false],
  [14, 2, true],
];
/** The hook, two bars of sixteenths (0 is a rest). */
const HOOK = [
  [77, 0, 80, 0, 82, 0, 80, 77, 0, 75, 0, 77, 0, 0, 72, 0],
  [77, 0, 80, 0, 84, 0, 82, 80, 0, 77, 0, 80, 82, 0, 80, 0],
];
const ARP = [0, 1, 2, 1, 0, 2, 1, 2];
const SNARES = new Set([3, 6, 11, 14]);

class Groove {
  private ctx: AudioContext;
  private sum: GainNode;
  private door: BiquadFilterNode;
  private out: GainNode;
  private drums: GainNode;
  private pump: GainNode;
  private verb: GainNode;
  private echo: GainNode;
  private noise: AudioBuffer;
  private shape: Float32Array<ArrayBuffer>;
  private timer = 0;
  private step = 0;
  private offset = Number.NaN;
  private open = false;
  private lastBass = 0;
  on = true;

  constructor(
    ctx: AudioContext,
    private origin: number,
    private onBar: (bar: number) => void,
  ) {
    this.ctx = ctx;
    this.sum = ctx.createGain();
    this.door = ctx.createBiquadFilter();
    this.door.type = "lowpass";
    this.door.frequency.value = 280;
    this.door.Q.value = 0.8;
    const squash = ctx.createDynamicsCompressor();
    squash.threshold.value = -16;
    squash.ratio.value = 4;
    squash.attack.value = 0.004;
    squash.release.value = 0.18;
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.sum.connect(this.door).connect(squash).connect(this.out).connect(ctx.destination);

    this.drums = ctx.createGain();
    this.drums.gain.value = 0.8;
    this.drums.connect(this.sum);
    this.pump = ctx.createGain();
    this.pump.connect(this.sum);

    // A room: two seconds of decaying noise as a reverb.
    const length = Math.floor(ctx.sampleRate * 2);
    const room = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = room.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = room;
    const wet = ctx.createGain();
    wet.gain.value = 0.22;
    this.verb = ctx.createGain();
    this.verb.connect(convolver).connect(wet).connect(this.sum);

    // A dotted-eighth echo on the lead.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = STEP * 3;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2800;
    this.echo = ctx.createGain();
    const echoOut = ctx.createGain();
    echoOut.gain.value = 0.45;
    this.echo.connect(delay);
    delay.connect(tone).connect(feedback).connect(delay);
    tone.connect(echoOut).connect(this.sum);

    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.shape = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      this.shape[i] = Math.tanh(x * 2.6) / Math.tanh(2.6);
    }
  }

  start() {
    const now = this.ctx.currentTime;
    this.out.gain.setValueAtTime(0, now);
    this.out.gain.linearRampToValueAtTime(this.on ? 0.7 : 0, now + 0.8);
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 25);
  }

  setOn(on: boolean) {
    this.on = on;
    if (on) void this.ctx.resume().catch(() => undefined);
    this.out.gain.setTargetAtTime(on ? 0.7 : 0, this.ctx.currentTime, 0.06);
  }

  async stop() {
    window.clearInterval(this.timer);
    const now = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(now);
    this.out.gain.setTargetAtTime(0, now, 0.08);
    await new Promise((resolve) => window.setTimeout(resolve, 380));
    await this.ctx.close().catch(() => undefined);
  }

  /** Audio clock minus page clock (seconds), for sound heard at a page time, smoothed. */
  private measure() {
    const stamp = this.ctx.getOutputTimestamp?.();
    const measured =
      stamp?.performanceTime && stamp.contextTime
        ? stamp.contextTime - stamp.performanceTime / 1000
        : this.ctx.currentTime -
          performance.now() / 1000 -
          Math.max(this.ctx.outputLatency || 0, this.ctx.baseLatency || 0);
    if (Number.isNaN(this.offset) || Math.abs(measured - this.offset) > 0.05)
      this.offset = measured;
    else this.offset += (measured - this.offset) * 0.05;
  }

  /**
   * Looks ahead and books every sixteenth that falls inside it. "Ahead" includes the output
   * latency (often 0.1-0.3 s): a note is booked that long before it is heard, so it lands on
   * the beat the lights are showing.
   */
  private tick() {
    const running = this.on && this.ctx.state === "running";
    let lead = 0;
    if (running) {
      this.measure();
      lead = Math.max(0, this.ctx.currentTime - (performance.now() / 1000 + this.offset));
    }
    const horizon = performance.now() + 140 + lead * 1000;
    for (;;) {
      const at = this.origin + this.step * STEP * 1000;
      if (at >= horizon) break;
      const step = this.step++;
      if (step % 16 === 0) {
        const bar = step / 16 - INTRO;
        window.setTimeout(() => this.onBar(bar), Math.max(0, at - performance.now()));
      }
      if (!running) continue;
      const time = at / 1000 + this.offset;
      if (time < this.ctx.currentTime - 0.02) continue;
      this.play(step, Math.max(time, this.ctx.currentTime));
    }
  }

  private play(step: number, t: number) {
    const bar = Math.floor(step / 16) - INTRO;
    const k = step % 16;
    const chord = ((bar % 4) + 4) % 4;
    if (k === 0) this.pad(t, CHORDS[chord]);
    for (const [at, length, jump] of BASS)
      if (k === at) this.bass(t, ROOTS[chord] + (jump && bar % 2 ? 12 : 0), length * STEP);

    if (bar < 0) {
      // Outside: the kick through the wall, then a riser and a roll as the door opens.
      if (k % 4 === 0) this.kick(t, 0.9);
      if (k === 8) this.riser(t, BEAT * 2);
      if (k >= 12) this.snare(t, 0.3 + (k - 12) * 0.14);
      return;
    }
    if (!this.open) {
      this.open = true;
      this.door.frequency.setValueAtTime(18000, t);
      this.crash(t, 1);
    }
    const phrase = bar % 8;
    const hook = phrase >= 4;
    const drop = phrase === 7 && Math.floor(bar / 8) % 2 === 1 && k >= 8;
    if (bar > 0 && phrase === 0 && k === 0) this.crash(t, 0.55);

    if (k % 4 === 0 && !drop) this.kick(t, 1);
    if (SNARES.has(k) && !drop) this.snare(t, k === 6 || k === 14 ? 0.9 : 0.7);
    if (drop) this.snare(t, 0.3 + (k - 8) * 0.08);
    if (k % 2 === 0) this.hat(t, k % 4 === 2 ? 0.9 : 0.5, k === 14 && phrase % 2 === 1);
    else if ((phrase === 3 || phrase === 7) && k >= 9) this.hat(t, 0.4, false);

    if (hook) {
      const note = HOOK[bar % 2][k];
      if (note) this.pluck(t, note, 0.9);
    } else if (k % 2 === 0) this.pluck(t, CHORDS[chord][ARP[k / 2]] + 12, 0.35);
  }

  /* Instruments. Every one is a few nodes that start, decay and stop on their own. */

  private envelope(t: number, peak: number, decay: number, attack = 0.003) {
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + attack + decay);
    return gain;
  }

  private burst(t: number, length: number) {
    const source = this.ctx.createBufferSource();
    source.buffer = this.noise;
    source.start(t, Math.random() * 0.5);
    source.stop(t + length);
    return source;
  }

  private filter(type: BiquadFilterType, frequency: number, q = 0.7) {
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    return filter;
  }

  private kick(t: number, velocity: number) {
    const body = this.ctx.createOscillator();
    body.frequency.setValueAtTime(155, t);
    body.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    body.connect(this.envelope(t, velocity, 0.42)).connect(this.drums);
    body.start(t);
    body.stop(t + 0.5);
    this.burst(t, 0.02)
      .connect(this.filter("highpass", 3000))
      .connect(this.envelope(t, 0.18 * velocity, 0.012))
      .connect(this.drums);
    // Everything melodic ducks under the kick: the pump.
    this.pump.gain.cancelScheduledValues(t);
    this.pump.gain.setValueAtTime(0.35, t);
    this.pump.gain.linearRampToValueAtTime(1, t + BEAT * 0.55);
  }

  private snare(t: number, velocity: number) {
    const crack = this.envelope(t, 0.5 * velocity, 0.17);
    this.burst(t, 0.22)
      .connect(this.filter("bandpass", 1900, 0.9))
      .connect(crack);
    crack.connect(this.drums);
    crack.connect(this.verb);
    const body = this.ctx.createOscillator();
    body.type = "triangle";
    body.frequency.setValueAtTime(190, t);
    body.frequency.exponentialRampToValueAtTime(150, t + 0.08);
    body.connect(this.envelope(t, 0.28 * velocity, 0.08)).connect(this.drums);
    body.start(t);
    body.stop(t + 0.12);
  }

  private hat(t: number, velocity: number, open: boolean) {
    const decay = open ? 0.22 : 0.04;
    this.burst(t, decay + 0.02)
      .connect(this.filter("highpass", 7500))
      .connect(this.envelope(t, 0.16 * velocity, decay))
      .connect(this.drums);
  }

  private crash(t: number, velocity: number) {
    const tail = this.envelope(t, 0.2 * velocity, 1.6);
    const source = this.ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    source.connect(this.filter("highpass", 4200)).connect(tail);
    tail.connect(this.drums);
    tail.connect(this.verb);
    source.start(t);
    source.stop(t + 1.7);
  }

  private riser(t: number, length: number) {
    const source = this.ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    const sweep = this.filter("bandpass", 400, 4);
    sweep.frequency.setValueAtTime(400, t);
    sweep.frequency.exponentialRampToValueAtTime(7000, t + length);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + length);
    gain.gain.linearRampToValueAtTime(0.0001, t + length + 0.05);
    // Not behind the door: the build is what you hear as it opens.
    source.connect(sweep).connect(gain).connect(this.out);
    source.start(t);
    source.stop(t + length + 0.06);
  }

  private bass(t: number, midi: number, length: number) {
    const tone = this.ctx.createOscillator();
    const frequency = hz(midi);
    tone.frequency.setValueAtTime(this.lastBass || frequency, t);
    tone.frequency.exponentialRampToValueAtTime(frequency, t + 0.05);
    this.lastBass = frequency;
    const drive = this.ctx.createWaveShaper();
    drive.curve = this.shape;
    tone
      .connect(drive)
      .connect(this.filter("lowpass", 900))
      .connect(this.envelope(t, 0.5, length + 0.12, 0.006))
      .connect(this.sum);
    tone.start(t);
    tone.stop(t + length + 0.2);
  }

  private pad(t: number, chord: number[]) {
    const tone = this.filter("lowpass", 1300, 0.5);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.12);
    gain.gain.setValueAtTime(0.05, t + BAR - 0.1);
    gain.gain.linearRampToValueAtTime(0.0001, t + BAR + 0.15);
    tone.connect(gain);
    gain.connect(this.pump);
    gain.connect(this.verb);
    for (const note of chord)
      for (const cents of [-8, 8]) {
        const voice = this.ctx.createOscillator();
        voice.type = "sawtooth";
        voice.frequency.value = hz(note);
        voice.detune.value = cents;
        voice.connect(tone);
        voice.start(t);
        voice.stop(t + BAR + 0.2);
      }
  }

  private pluck(t: number, midi: number, velocity: number) {
    const tone = this.ctx.createOscillator();
    tone.type = "square";
    tone.frequency.value = hz(midi);
    const filter = this.filter("lowpass", 4200, 2);
    filter.frequency.setValueAtTime(4200, t);
    filter.frequency.exponentialRampToValueAtTime(700, t + 0.2);
    const gain = this.envelope(t, 0.085 * velocity, 0.28);
    tone.connect(filter).connect(gain);
    gain.connect(this.pump);
    gain.connect(this.echo);
    tone.start(t);
    tone.stop(t + 0.32);
  }
}

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

/** A dancer, drawn in a 60 x 130 box. Arms: none, left up, right up, both, or a fist pump. */
function dancer(arms: number) {
  const lines = [
    "",
    "M15 52 L6 6",
    "M45 52 L54 6",
    "M15 52 L5 8 M45 52 L55 8",
    "M45 52 L58 32 L51 4",
  ][arms];
  return `<svg viewBox="0 0 60 130" preserveAspectRatio="xMidYMax meet"><circle cx="30" cy="21" r="12.5"/><rect x="25" y="28" width="10" height="16"/><path d="M4 130C4 74 12 42 30 42s26 32 26 88z"/>${
    lines
      ? `<path d="${lines}" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`
      : ""
  }</svg>`;
}

function crowd(width: number) {
  const rows = [
    { count: Math.min(22, Math.ceil(width / 66)), min: 84, max: 108, className: "is-back" },
    { count: Math.min(15, Math.ceil(width / 96)), min: 112, max: 148, className: "is-front" },
  ];
  const wrap = document.createElement("div");
  wrap.className = "ldp-crowd";
  const people: HTMLElement[] = [];
  for (const row of rows)
    for (let i = 0; i < row.count; i++) {
      const person = document.createElement("span");
      person.className = `ldp-dancer ${row.className}`;
      const size = rand(row.min, row.max);
      person.style.cssText = `left:${((i + rand(-0.3, 0.3)) / row.count) * 104 - 2}%;height:${size.toFixed(0)}px;width:${(size * 0.46).toFixed(0)}px`;
      person.innerHTML = dancer(Math.random() < 0.55 ? Math.floor(rand(1, 5)) : 0);
      wrap.append(person);
      people.push(person);
    }
  return { wrap, people };
}

export async function startParty() {
  const calm = reducedMotion();
  const root = document.documentElement;
  const names = ["--ldt-accent", "--ldt-accent-ink", "--ldt-on-accent"];
  const saved = names.map((name) => root.style.getPropertyValue(name));
  // One clock for everything: the first beat, a moment from now, on the page's own timeline.
  const context = takeAudio();
  // The first beat comes once the sound can be there in time: after the output latency.
  const latency = context ? Math.max(context.outputLatency || 0, context.baseLatency || 0) : 0;
  const origin = performance.now() + 220 + Math.min(latency, 0.5) * 1000;
  const dropAt = origin + INTRO * BAR * 1000;

  const club = document.createElement("div");
  club.className = "ldp-club";
  club.setAttribute("aria-hidden", "true");
  club.innerHTML = `
    <div class="ldp-dim"></div>
    <div class="ldp-lights">
      ${BEAMS.map((colour, i) => `<div class="ldp-beam" style="left:${12.5 + i * 25}%">${cone(colour, i)}</div>`).join("")}
      <div class="ldp-fan is-left"><div class="ldp-fan-lines">${'<i class="ldp-laser"></i>'.repeat(6)}</div></div>
      <div class="ldp-fan is-right"><div class="ldp-fan-lines">${'<i class="ldp-laser"></i>'.repeat(6)}</div></div>
    </div>
    <div class="ldp-ball"><div class="ldp-ball-sphere"><div class="ldp-ball-facets"></div></div></div>
    <p class="ldp-sign">After hours</p>`;
  const { wrap, people } = crowd(window.innerWidth);
  club.append(wrap);
  host().append(club);

  const synced: Animation[] = [];
  const groove = (
    el: Element,
    frames: Keyframe[],
    beats: number,
    options: KeyframeAnimationOptions & { shift?: number } = {},
  ) => {
    if (calm) return;
    const { shift = 0, ...rest } = options;
    const animation = el.animate(frames, {
      duration: beats * BEAT_MS,
      iterations: Infinity,
      ...rest,
    });
    animation.startTime = origin + shift * BEAT_MS;
    synced.push(animation);
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
  club.querySelectorAll(".ldp-fan-lines").forEach((lines) =>
    groove(
      lines,
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.42 },
        { opacity: 0.12, offset: 0.5 },
        { opacity: 0.12, offset: 1 },
      ],
      1,
    ),
  );
  // Light on the kick: the room brightens on every beat, then settles.
  groove(
    club.querySelector(".ldp-dim")!,
    [{ opacity: 0.72, easing: "ease-out" }, { opacity: 0.86, offset: 0.4 }, { opacity: 0.86 }],
    1,
  );
  for (const person of people) {
    const lean = rand(2, 5);
    const hop = rand(4, 9);
    groove(
      person,
      [
        { transform: `translateY(${hop}px) rotate(${-lean}deg)`, easing: "ease-out" },
        { transform: "translateY(-3px) rotate(0deg)", offset: 0.25, easing: "ease-in" },
        { transform: `translateY(${hop}px) rotate(${lean}deg)`, offset: 0.5, easing: "ease-out" },
        { transform: "translateY(-3px) rotate(0deg)", offset: 0.75, easing: "ease-in" },
        { transform: `translateY(${hop}px) rotate(${-lean}deg)` },
      ],
      Math.random() < 0.2 ? 4 : 2,
      { shift: rand(-0.08, 0.08) },
    );
  }

  /* Mirror-ball specks and confetti share one canvas at screen resolution. */
  const sky = calm ? null : overlayCanvas("ldp-canvas ldp-sky", 1);
  const specks = Array.from({ length: 72 }, () => ({
    y: rand(0.04, 0.8),
    phase: rand(0, Math.PI * 2),
    size: rand(2.5, 5),
    tint: Math.random() < 0.3 ? PALETTE[Math.floor(rand(0, PALETTE.length))] : "#ffffff",
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
  let frame = 0;
  let previous = performance.now();
  const draw = (now: number) => {
    if (!sky) return;
    const { context, width, height } = sky;
    const dt = Math.min(1 / 30, (now - previous) / 1000);
    previous = now;
    context.setTransform(sky.ratio, 0, 0, sky.ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    if (now >= dropAt) {
      const turn = (now / 1000) * ((Math.PI * 2) / 7);
      for (const speck of specks) {
        const angle = (speck.phase + turn) % (Math.PI * 2);
        const x = (angle / (Math.PI * 2)) * (width + 80) - 40;
        context.globalAlpha = 0.35 + 0.3 * Math.sin(now / 240 + speck.phase * 3) ** 2;
        context.fillStyle = speck.tint;
        context.fillRect(x, speck.y * height, speck.size, speck.size);
      }
      context.globalAlpha = 1;
    }
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
      context.setTransform(
        c * sky.ratio,
        s * sky.ratio,
        -s * squash * sky.ratio,
        c * squash * sky.ratio,
        bit.x * sky.ratio,
        bit.y * sky.ratio,
      );
      context.fillStyle = bit.colour;
      context.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h);
    }
    frame = requestAnimationFrame(draw);
  };
  if (sky) frame = requestAnimationFrame(draw);

  /* Once a bar: the accent changes with the music, and the room changes with the song. */
  const sign = club.querySelector<HTMLElement>(".ldp-sign")!;
  let stopped = false;
  const onBar = (bar: number) => {
    if (bar < 0 || stopped) return;
    if (bar === 0) {
      club.classList.add("is-on");
      confetti(170);
      if (!calm) {
        // One white flash as the door opens; the layer exists only while it shows.
        const flash = document.createElement("div");
        flash.className = "ldp-flash";
        club.append(flash);
        flash
          .animate([{ opacity: 0 }, { opacity: 0.28, offset: 0.15 }, { opacity: 0 }], 520)
          .finished.then(
            () => flash.remove(),
            () => flash.remove(),
          );
      }
    } else if (bar % 8 === 0) confetti(90);
    const hex = PALETTE[Math.floor(bar / 2) % PALETTE.length];
    club.style.setProperty("--ldp-glow", hex);
    // Recolouring the page restyles all of it (about 50-250 ms on a slow phone), so it happens
    // every other bar, never per frame. The lights run on the compositor and don't wait for it.
    if (bar % 2 === 0) {
      root.style.setProperty(names[0], hex);
      root.style.setProperty(names[1], accentInk(hex));
      root.style.setProperty(names[2], onAccent(hex));
    }
    club.dataset.part = bar % 8 >= 4 ? "hook" : "verse";
    if (!calm && bar % 4 === 0)
      sign.animate(
        [{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }],
        { duration: 260, easing: "steps(5)" },
      );
  };

  /* The music, if this browser will play it. Without it the lights still keep time. */
  let music: Groove | null = null;
  let barTimer = 0;
  if (context) {
    try {
      music = new Groove(context, origin, onBar);
      music.start();
    } catch {
      music = null;
    }
  }
  if (!music) {
    let bar = -INTRO;
    const next = () => {
      onBar(bar);
      bar++;
      barTimer = window.setTimeout(next, origin + (bar + INTRO) * BAR * 1000 - performance.now());
    };
    barTimer = window.setTimeout(next, origin - performance.now());
  }

  const hidden = () => {
    if (!music || !context) return;
    if (document.hidden) void context.suspend().catch(() => undefined);
    else if (music.on) void context.resume().catch(() => undefined);
  };
  document.addEventListener("visibilitychange", hidden);

  return {
    sound: Boolean(music),
    setSound(on: boolean) {
      music?.setOn(on);
    },
    async stop() {
      stopped = true;
      document.removeEventListener("visibilitychange", hidden);
      window.clearTimeout(barTimer);
      club.classList.add("is-leaving");
      sky?.canvas.classList.add("is-leaving");
      const quiet = music?.stop();
      names.forEach((name, index) => {
        if (saved[index]) root.style.setProperty(name, saved[index]);
        else root.style.removeProperty(name);
      });
      await Promise.all([quiet, new Promise((resolve) => window.setTimeout(resolve, 380))]);
      cancelAnimationFrame(frame);
      synced.forEach((animation) => animation.cancel());
      club.remove();
      sky?.canvas.remove();
    },
  };
}
