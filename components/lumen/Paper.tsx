/**
 * Paper with torn, slightly rough edges. The edge is a clip-path polygon from a seeded generator,
 * so it is the same on the server and the client and never changes between visits. The paper is
 * three flat layers behind the content: a hard offset shadow (no blur), a pale fringe where the
 * fibres show, and the face with its grain. The content itself is never clipped.
 */

type Edges = { top?: number; right?: number; bottom?: number; left?: number };

function random(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const px = (value: number) => `${value.toFixed(1)}px`;
const pct = (value: number) => `${value.toFixed(2)}%`;

/** An amplitude for one point: mostly small nicks, now and then a deeper tear. */
function bite(next: () => number, amplitude: number) {
  const r = next();
  return amplitude * (r > 0.93 ? 1.6 + next() : r * r * 1.15);
}

export function tornPolygon(seed: number, { top = 0, right = 0, bottom = 0, left = 0 }: Edges) {
  const next = random(seed);
  const points: string[] = [];
  const along = (amplitude: number, count: number) =>
    amplitude ? Array.from({ length: count + 1 }, (_, i) => i / count) : [0, 1];

  for (const t of along(top, 64)) points.push(`${pct(t * 100)} ${px(bite(next, top))}`);
  for (const t of along(right, 28))
    points.push(`calc(100% - ${px(bite(next, right))}) ${pct(t * 100)}`);
  for (const t of along(bottom, 64))
    points.push(`${pct(100 - t * 100)} calc(100% - ${px(bite(next, bottom))})`);
  for (const t of along(left, 28)) points.push(`${px(bite(next, left))} ${pct(100 - t * 100)}`);
  return `polygon(${points.join(", ")})`;
}

export function PaperLayers({ seed, edges }: { seed: number; edges: Edges }) {
  const fringe = tornPolygon(seed + 101, edges);
  return (
    <>
      <span className="ld-paper-shadow" style={{ clipPath: fringe }} aria-hidden="true" />
      <span className="ld-paper-fringe" style={{ clipPath: fringe }} aria-hidden="true" />
      <span
        className="ld-paper-face"
        style={{ clipPath: tornPolygon(seed, edges) }}
        aria-hidden="true"
      />
    </>
  );
}
