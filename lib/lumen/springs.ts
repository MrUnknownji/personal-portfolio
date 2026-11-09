// Lumen Draft motion: every duration and easing comes from these four springs (mass 1).
export const SPRINGS = {
  settle: { stiffness: 170, damping: 26, use: "Elevation, press release, arriving without fuss" },
  snap: { stiffness: 420, damping: 20, use: "Grid landing, toggles, squash recovery" },
  morph: { stiffness: 240, damping: 24, use: "Size and shape changes, the exploded view" },
  drift: { stiffness: 36, damping: 7, use: "Slow, heavy settling for large things" },
} as const;

export type SpringName = keyof typeof SPRINGS;
export const SPRING_NAMES = Object.keys(SPRINGS) as SpringName[];

export type SpringParams = { stiffness: number; damping: number };

/** Critically damped variant, used when the visitor prefers reduced motion. */
export function springParams(name: SpringName, reduced = false): SpringParams {
  const { stiffness, damping } = SPRINGS[name];
  return { stiffness, damping: reduced ? 2 * Math.sqrt(stiffness) : damping };
}

export type SpringResponse = {
  /** Position sampled every 1/60 s for a unit step from 0 to 1. */
  samples: number[];
  dampingRatio: number;
  overshoot: number;
  /** Seconds until the spring stays within 0.4% of its target. */
  settle: number;
  /** Pitch of the feedback tone, in Hz. */
  pitch: number;
};

export function simulateSpring({ stiffness, damping }: SpringParams, seconds = 3): SpringResponse {
  const h = 1 / 600;
  let x = 0;
  let v = 0;
  let peak = 0;
  let lastOutside = 0;
  const samples = [0];
  for (let frame = 1; frame <= seconds * 60; frame++) {
    for (let i = 0; i < 10; i++) {
      v += (-stiffness * (x - 1) - damping * v) * h;
      x += v * h;
    }
    samples.push(x);
    peak = Math.max(peak, x);
    if (Math.abs(x - 1) > 0.004 || Math.abs(v) > 0.02) lastOutside = frame / 60;
  }
  return {
    samples,
    dampingRatio: damping / (2 * Math.sqrt(stiffness)),
    overshoot: Math.max(0, peak - 1),
    settle: lastOutside,
    pitch: 220 * Math.sqrt(stiffness / 170),
  };
}

export function sampleAt(samples: number[], seconds: number) {
  const index = Math.min(samples.length - 1, Math.max(0, seconds * 60));
  const a = Math.floor(index);
  const b = Math.min(samples.length - 1, a + 1);
  return samples[a] + (samples[b] - samples[a]) * (index - a);
}

/** The spring as a CSS `linear()` easing, to be used with its settle time as the duration. */
export function toLinearEasing(response: SpringResponse, points = 32) {
  const values = Array.from({ length: points + 1 }, (_, i) =>
    i === points
      ? 1
      : Number(sampleAt(response.samples, (response.settle * i) / points).toFixed(4)),
  );
  return `linear(${values.join(", ")})`;
}

/** CSS custom properties for every spring: --ld-ease-{name} and --ld-dur-{name}. */
export function springCssVariables(reduced = false) {
  const variables: Record<string, string> = {};
  for (const name of SPRING_NAMES) {
    const response = simulateSpring(springParams(name, reduced));
    variables[`--ld-ease-${name}`] = toLinearEasing(response);
    variables[`--ld-dur-${name}`] = `${Math.round(response.settle * 1000)}ms`;
  }
  return variables;
}

/** A one-dimensional spring for pointer-driven motion. Step it from requestAnimationFrame. */
export class Spring {
  x: number;
  v = 0;
  target: number;
  constructor(
    value: number,
    public name: SpringName,
    private epsilon = 0.05,
  ) {
    this.x = value;
    this.target = value;
  }
  step(dt: number, reduced = false) {
    const { stiffness, damping } = springParams(this.name, reduced);
    const steps = Math.max(1, Math.ceil(dt * 480));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      this.v += (-stiffness * (this.x - this.target) - damping * this.v) * h;
      this.x += this.v * h;
    }
  }
  jump(value: number) {
    this.x = this.target = value;
    this.v = 0;
  }
  get resting() {
    return Math.abs(this.x - this.target) < this.epsilon && Math.abs(this.v) < this.epsilon * 4;
  }
}

// One animation-frame loop shared by every spring on the page; it stops when nothing moves.
type Actor = (dt: number) => boolean;
const actors = new Set<Actor>();
let frame = 0;
let last = 0;
function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  for (const actor of actors) if (!actor(dt)) actors.delete(actor);
  frame = actors.size ? requestAnimationFrame(loop) : 0;
}
export function animate(actor: Actor) {
  actors.add(actor);
  if (!frame) {
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }
  return () => {
    actors.delete(actor);
  };
}
