/**
 * The site's tweak settings, which visitors can play with. Each control maps to a CSS custom
 * property (--ldt-*) or a data attribute (data-ldt-*) on <html>, and lumen.css reads them.
 *
 * A control's `def` is what the stylesheet draws with nothing applied. The site's own look
 * (SITE_LOOK) differs from that in a few places, so the server writes those values on <html>, and
 * a visitor's changes are saved relative to the site's look.
 */

import { STORE_KEY } from "./tweakKeys";

type Base = { key: string; label: string; hint?: string };
export type ChoiceControl = Base & {
  type: "choice";
  def: string;
  options: [value: string, label: string][];
};
export type RangeControl = Base & {
  type: "range";
  def: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  css: string;
};
export type ToggleControl = Base & { type: "toggle"; def: boolean };
export type ColorControl = Base & { type: "color"; def: string; swatches: [string, string][] };
export type Control = ChoiceControl | RangeControl | ToggleControl | ColorControl;
export type Group = { id: string; title: string; controls: Control[] };
export type Settings = Record<string, string | number | boolean>;

export const ACCENT = "#cdf23c";

/** The look the site ships with, where it differs from the stylesheet's own values. */
export const SITE_LOOK: Settings = {
  accent: "#7fe3b4",
  surface: "flat",
  lines: "ruled",
  cursor: "dot",
};

export const GROUPS: Group[] = [
  {
    id: "colour",
    title: "Colour",
    controls: [
      {
        type: "choice",
        key: "theme",
        label: "Theme",
        def: "system",
        options: [
          ["system", "System"],
          ["light", "Light"],
          ["dark", "Dark"],
        ],
      },
      {
        type: "color",
        key: "accent",
        label: "Accent",
        hint: "Buttons, highlights, measure lines and the stamp.",
        def: ACCENT,
        swatches: [
          ["#7fe3b4", "Mint"],
          [ACCENT, "Chartreuse"],
          ["#8ecbff", "Sky"],
          ["#ff9a7d", "Coral"],
          ["#bba8ff", "Violet"],
          ["#ffcf5c", "Amber"],
          ["#ffa6cf", "Pink"],
          ["#f2f2ee", "Chalk"],
        ],
      },
      {
        type: "choice",
        key: "paper",
        label: "Paper",
        hint: "The page, sheet and ink tones, in both themes.",
        def: "sage",
        options: [
          ["sage", "Sage"],
          ["warm", "Warm"],
          ["cool", "Cool"],
          ["stone", "Stone"],
          ["white", "White"],
        ],
      },
      {
        type: "choice",
        key: "band",
        label: "Work and footer band",
        def: "dark",
        options: [
          ["dark", "Dark band"],
          ["page", "Same as page"],
        ],
      },
    ],
  },
  {
    id: "type",
    title: "Typography",
    controls: [
      {
        type: "choice",
        key: "display",
        label: "Display font",
        def: "fredoka",
        options: [
          ["fredoka", "Fredoka"],
          ["bricolage", "Bricolage"],
          ["fraunces", "Fraunces"],
          ["space", "Space Grotesk"],
          ["unbounded", "Unbounded"],
        ],
      },
      {
        type: "choice",
        key: "text",
        label: "Text font",
        def: "instrument",
        options: [
          ["instrument", "Instrument Sans"],
          ["dm", "DM Sans"],
          ["plex", "IBM Plex Sans"],
          ["figtree", "Figtree"],
        ],
      },
      {
        type: "choice",
        key: "anno",
        label: "Labels",
        def: "condensed",
        options: [
          ["condensed", "Condensed caps"],
          ["mono", "Mono"],
          ["plain", "Plain"],
        ],
      },
      {
        type: "range",
        key: "textSize",
        label: "Body size",
        def: 16,
        min: 14,
        max: 19,
        step: 0.5,
        unit: "px",
        css: "--ldt-text-size",
      },
      {
        type: "range",
        key: "name",
        label: "Name size",
        def: 1,
        min: 0.7,
        max: 1.25,
        step: 0.01,
        unit: "",
        css: "--ldt-name",
      },
      {
        type: "range",
        key: "head",
        label: "Section title size",
        def: 1,
        min: 0.75,
        max: 1.4,
        step: 0.01,
        unit: "",
        css: "--ldt-head",
      },
      {
        type: "range",
        key: "weight",
        label: "Display weight",
        def: 600,
        min: 400,
        max: 700,
        step: 10,
        unit: "",
        css: "--ldt-weight",
      },
      {
        type: "range",
        key: "track",
        label: "Heading tracking",
        def: -0.01,
        min: -0.05,
        max: 0.03,
        step: 0.005,
        unit: "em",
        css: "--ldt-track",
      },
    ],
  },
  {
    id: "layout",
    title: "Layout",
    controls: [
      {
        type: "range",
        key: "max",
        label: "Content width",
        hint: "The widest the page measure gets.",
        def: 1440,
        min: 1080,
        max: 1760,
        step: 20,
        unit: "px",
        css: "--ldt-max",
      },
      {
        type: "range",
        key: "gutter",
        label: "Side gutter",
        def: 56,
        min: 16,
        max: 128,
        step: 4,
        unit: "px",
        css: "--ldt-gutter",
      },
      {
        type: "range",
        key: "space",
        label: "Section spacing",
        def: 1,
        min: 0.5,
        max: 1.6,
        step: 0.05,
        unit: "",
        css: "--ldt-space",
      },
      {
        type: "choice",
        key: "hero",
        label: "Hero layout",
        def: "split",
        options: [
          ["split", "Split"],
          ["mirror", "Mirrored"],
          ["stacked", "Name across"],
        ],
      },
      {
        type: "range",
        key: "portrait",
        label: "Portrait size",
        def: 1,
        min: 0.7,
        max: 1.25,
        step: 0.01,
        unit: "",
        css: "--ldt-portrait",
      },
      { type: "toggle", key: "callouts", label: "Portrait callouts", def: true },
      { type: "toggle", key: "measure", label: "Measured name (px label)", def: true },
      { type: "toggle", key: "tblock", label: "Hero facts block", def: true },
    ],
  },
  {
    id: "surface",
    title: "Surfaces and controls",
    controls: [
      {
        type: "choice",
        key: "surface",
        label: "Surface style",
        def: "soft",
        options: [
          ["soft", "Soft matter"],
          ["flat", "Flat"],
          ["outline", "Outline"],
        ],
      },
      {
        type: "range",
        key: "shadow",
        label: "Shadow strength",
        def: 1,
        min: 0,
        max: 1.15,
        step: 0.05,
        unit: "",
        css: "--ldt-shadow",
      },
      {
        type: "range",
        key: "radius",
        label: "Corner radius",
        def: 1,
        min: 0,
        max: 1.8,
        step: 0.05,
        unit: "",
        css: "--ldt-radius",
      },
      {
        type: "choice",
        key: "buttons",
        label: "Button shape",
        def: "pill",
        options: [
          ["pill", "Pill"],
          ["rounded", "Rounded"],
          ["square", "Square"],
        ],
      },
      {
        type: "choice",
        key: "chips",
        label: "Stack tags",
        def: "outline",
        options: [
          ["outline", "Outline"],
          ["filled", "Filled"],
          ["plain", "Plain text"],
        ],
      },
      {
        type: "choice",
        key: "links",
        label: "Text links",
        def: "underline",
        options: [
          ["underline", "Underline"],
          ["marker", "Marker"],
          ["plain", "Bold only"],
        ],
      },
    ],
  },
  {
    id: "work",
    title: "Work",
    controls: [
      {
        type: "choice",
        key: "work",
        label: "Layout",
        def: "stack",
        options: [
          ["stack", "Stacking sheets"],
          ["list", "Plain list"],
          ["grid", "Two-up grid"],
        ],
      },
      { type: "toggle", key: "pinHead", label: "Pin the title row", def: true },
      { type: "toggle", key: "rail", label: "Project index rail", def: true },
      { type: "toggle", key: "summary", label: "Totals beside the title", def: true },
      {
        type: "choice",
        key: "screen",
        label: "Screen side",
        def: "alternate",
        options: [
          ["alternate", "Alternate"],
          ["left", "Left"],
          ["right", "Right"],
        ],
      },
      {
        type: "choice",
        key: "num",
        label: "Sheet numbers",
        def: "outline",
        options: [
          ["outline", "Outline"],
          ["solid", "Solid"],
          ["hidden", "Hidden"],
        ],
      },
      { type: "toggle", key: "facts", label: "Measured facts", def: true },
      { type: "toggle", key: "stack", label: "Stack tags", def: true },
      { type: "toggle", key: "caption", label: "Screen captions", def: true },
    ],
  },
  {
    id: "letter",
    title: "Letter and contact",
    controls: [
      {
        type: "choice",
        key: "letter",
        label: "Letter",
        def: "contact",
        options: [
          ["contact", "In Contact"],
          ["off", "Off"],
        ],
      },
      {
        type: "choice",
        key: "letterMotion",
        label: "Envelope",
        def: "scroll",
        options: [
          ["scroll", "Opens on scroll"],
          ["static", "Resting"],
        ],
      },
      {
        type: "choice",
        key: "lines",
        label: "Letter paper",
        def: "grid",
        options: [
          ["grid", "Grid"],
          ["ruled", "Ruled"],
          ["plain", "Plain"],
        ],
      },
      { type: "toggle", key: "slip", label: "Scissor reply slip", def: true },
      { type: "toggle", key: "form", label: "Note form", def: true },
      {
        type: "choice",
        key: "formStyle",
        label: "Form fields",
        def: "letter",
        options: [
          ["letter", "Written lines"],
          ["boxed", "Boxes"],
        ],
      },
    ],
  },
  {
    id: "sections",
    title: "Sections",
    controls: [
      { type: "toggle", key: "lab", label: "Lab", def: true },
      { type: "toggle", key: "about", label: "About", def: true },
      { type: "toggle", key: "build", label: "Process", def: true },
    ],
  },
  {
    id: "motion",
    title: "Motion and cursor",
    controls: [
      {
        type: "choice",
        key: "motion",
        label: "Motion",
        hint: "Calm keeps hover feedback but stops scroll effects. Off stops everything.",
        def: "full",
        options: [
          ["full", "Full"],
          ["calm", "Calm"],
          ["off", "Off"],
        ],
      },
      {
        type: "choice",
        key: "cursor",
        label: "Cursor",
        hint: "Drawn by the system, so it is exactly where the pointer is.",
        def: "system",
        options: [
          ["system", "System"],
          ["dot", "Dot"],
          ["cross", "Crosshair"],
        ],
      },
    ],
  },
];

export const CONTROLS = GROUPS.flatMap((group) => group.controls);
/** The site's look: every control, with SITE_LOOK over the stylesheet's own values. */
export const DEFAULTS: Settings = {
  ...Object.fromEntries(CONTROLS.map((control) => [control.key, control.def])),
  ...SITE_LOOK,
};

/**
 * Keeps only known keys with values a control accepts: choices from its options, ranges clamped,
 * colours as #rrggbb. Anything pasted or stored is passed through this before it is applied.
 */
export function sanitize(input: unknown): Settings {
  const out: Settings = {};
  if (!input || typeof input !== "object") return out;
  const source = input as Record<string, unknown>;
  for (const control of CONTROLS) {
    const value = source[control.key];
    if (value === undefined || control.key === "theme") continue;
    if (control.type === "toggle" && typeof value === "boolean") out[control.key] = value;
    else if (control.type === "range" && typeof value === "number" && Number.isFinite(value))
      out[control.key] = Math.min(control.max, Math.max(control.min, value));
    else if (control.type === "choice" && control.options.some(([option]) => option === value))
      out[control.key] = value as string;
    else if (control.type === "color" && typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value))
      out[control.key] = value.toLowerCase();
  }
  return out;
}

export const PRESETS: { name: string; settings: Settings }[] = [
  { name: "Site", settings: {} },
  { name: "Original", settings: Object.fromEntries(CONTROLS.map((c) => [c.key, c.def])) },
  { name: "Wide", settings: { max: 1640, gutter: 72, name: 1.12, portrait: 1.12, head: 1.1 } },
  {
    name: "Compact",
    settings: { max: 1200, space: 0.7, textSize: 15, head: 0.88, name: 0.86, work: "list" },
  },
  {
    name: "Editorial",
    settings: {
      display: "fraunces",
      weight: 500,
      track: -0.02,
      paper: "warm",
      accent: "#ff9a7d",
      surface: "flat",
      buttons: "rounded",
      chips: "plain",
      links: "marker",
      lines: "ruled",
    },
  },
  {
    name: "Blueprint",
    settings: {
      display: "space",
      text: "plex",
      anno: "mono",
      paper: "cool",
      accent: "#8ecbff",
      surface: "outline",
      radius: 0.45,
      buttons: "square",
      num: "solid",
      cursor: "cross",
    },
  },
];

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const rgb = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const luminance = ([r, g, b]: number[]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const toHex = (values: number[]) =>
  `#${values.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

/** The accent darkened (same hue) until it reads as text on light paper, about 5.5:1. */
export function accentInk(hex: string) {
  const base = rgb(hex);
  let k = 1;
  while (k > 0.05 && luminance(base.map((v) => v * k)) > 0.11) k -= 0.01;
  return toHex(base.map((v) => v * k));
}
/** Dark text on a light accent, light text on a dark one. */
export const onAccent = (hex: string) => (luminance(rgb(hex)) > 0.36 ? "#15170f" : "#fbfcf7");

export type Compiled = { v: Record<string, string>; a: Record<string, string> };

/**
 * Settings to the variables and attributes written on <html>, for every value that differs from
 * what the stylesheet draws by itself. Theme is handled separately.
 */
export function compile(settings: Settings): Compiled {
  const v: Record<string, string> = {};
  const a: Record<string, string> = {};
  for (const control of CONTROLS) {
    const value = settings[control.key] ?? control.def;
    if (value === control.def || control.key === "theme") continue;
    const attr = `data-ldt-${control.key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
    if (control.type === "range") v[control.css] = `${value}${control.unit}`;
    else if (control.type === "toggle") a[attr] = value ? "on" : "off";
    else if (control.type === "choice") a[attr] = String(value);
    else if (control.type === "color" && /^#[0-9a-f]{6}$/i.test(String(value))) {
      const hex = String(value);
      v["--ldt-accent"] = hex;
      v["--ldt-accent-ink"] = accentInk(hex);
      v["--ldt-on-accent"] = onAccent(hex);
    }
  }
  return { v, a };
}

export { CHANGE_EVENT, STORE_KEY } from "./tweakKeys";

/**
 * Runs before first paint (inlined in the root layout), so a saved look never flashes the site's
 * look first. It swaps what the server wrote on <html> for the compiled form saved with the look,
 * which needs no schema, and only accepts safe names and values.
 */
export const EARLY_SCRIPT = `try{var d=JSON.parse(localStorage.getItem("${STORE_KEY}")||"null");if(d&&d.out){var r=document.documentElement,i,n;for(i=r.attributes.length-1;i>=0;i--){n=r.attributes[i].name;if(n.indexOf("data-ldt-")===0)r.removeAttribute(n)}for(i=r.style.length-1;i>=0;i--){n=r.style[i];if(n.indexOf("--ldt-")===0)r.style.removeProperty(n)}for(n in d.out.v)if(/^--ldt-[a-z-]+$/.test(n)&&/^[#\\w.-]+$/.test(d.out.v[n]))r.style.setProperty(n,d.out.v[n]);for(n in d.out.a)if(/^data-ldt-[a-z-]+$/.test(n)&&/^[a-z]+$/.test(d.out.a[n]))r.setAttribute(n,d.out.a[n])}}catch(e){}`;
