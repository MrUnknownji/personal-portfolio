import type { CSSProperties } from "react";

export type Body = "putty" | "clay" | "sage" | "peach" | "sheet" | "signal" | "paper";

/**
 * The layers every Lumen Draft surface is made of. Place inside an element with `ld-soft`:
 * a cast shadow (moved by the light), the skin (body colour and rim), and a sheen on the skin.
 * Content beside these layers must be wrapped in elements so it paints above the skin.
 */
export function SoftLayers({ z = 6, sheen = true }: { z?: 6 | 12 | 20; sheen?: boolean }) {
  return (
    <>
      <span className="ld-cast" data-z={z} aria-hidden="true" />
      <span className="ld-skin" aria-hidden="true">
        {sheen && <span className="ld-sheen" />}
      </span>
    </>
  );
}

export function softStyle(body: Body, z: 6 | 12 | 20 = 6, extra?: CSSProperties) {
  return { "--ld-body": `var(--ld-${body})`, "--z": z, ...extra } as CSSProperties;
}

/** Attributes that make a surface inspectable with press and hold. */
export function inspectable(name: string, base: string) {
  return { "data-ld-inspect": "", "data-ld-name": name, "data-ld-base": base };
}
