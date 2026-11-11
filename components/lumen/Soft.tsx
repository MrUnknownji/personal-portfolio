import type { CSSProperties } from "react";

/** Clean hues, used only on small objects such as storyboard beats. They always carry dark text. */
export type Hue = "sky" | "coral" | "violet" | "mint" | "amber" | "pink";
const HUES = new Set<string>(["sky", "coral", "violet", "mint", "amber", "pink"]);
/** Large surfaces are neutral (key, sheet, paper); colour comes from signal and the hues. */
export type Body = "key" | "sheet" | "signal" | "paper" | Hue;

/**
 * The layers every Lumen Draft surface is made of. Place inside an element with `ld-soft`:
 * a soft ambient shadow, the skin (body colour and rim), and a sheen that follows the light.
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
  return {
    "--ld-body": `var(--ld-${body})`,
    "--z": z,
    ...(HUES.has(body) ? { "--ld-graphite": "var(--ld-on-hue)" } : {}),
    ...extra,
  } as CSSProperties;
}
