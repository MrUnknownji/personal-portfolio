// The single Lumen Draft light. It orbits above the sheet; shadows fall away from it.
export const ORBIT_SECONDS = 48;
export const START_ANGLE = 225;
const STEPS = 24;

/** Light position for an orbit angle in degrees. The orbit centre sits above the top edge. */
export function lightVector(angle: number): [number, number] {
  const r = (angle * Math.PI) / 180;
  return [Math.cos(r), -0.55 + 0.45 * Math.sin(r)];
}

const DIRECTIONS = [
  "right",
  "lower right",
  "below",
  "lower left",
  "left",
  "upper left",
  "above",
  "upper right",
];

export function describeLight(angle: number) {
  const [x, y] = lightVector(angle);
  const azimuth = Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);
  return { azimuth, direction: DIRECTIONS[Math.round(azimuth / 45) % 8] };
}

/** Keyframes for a cast shadow at elevation z: it moves opposite the light, plus a little gravity. */
export function castKeyframes(z: number): Keyframe[] {
  return Array.from({ length: STEPS + 1 }, (_, i) => {
    const [x, y] = lightVector(START_ANGLE + (360 * i) / STEPS);
    return {
      offset: i / STEPS,
      transform: `translate(${(-x * z).toFixed(2)}px, ${(-y * z + z * 0.35).toFixed(2)}px)`,
    };
  });
}

/** Keyframes for the sheen inside a surface: it slides toward the light. */
export function sheenKeyframes(): Keyframe[] {
  return Array.from({ length: STEPS + 1 }, (_, i) => {
    const [x, y] = lightVector(START_ANGLE + (360 * i) / STEPS);
    return {
      offset: i / STEPS,
      transform: `translate(${(x * 22).toFixed(2)}%, ${(y * 22).toFixed(2)}%)`,
    };
  });
}
