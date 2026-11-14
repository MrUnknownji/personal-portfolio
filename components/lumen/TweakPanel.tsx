"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CHANGE_EVENT,
  CONTROLS,
  DEFAULTS,
  GROUPS,
  PRESETS,
  STORE_KEY,
  compile,
  sanitize,
  type ChoiceControl,
  type ColorControl,
  type Control,
  type RangeControl,
  type Settings,
} from "./tweaks";
import { primeAudio } from "./audioPrime";
import "./tweak-panel.css";

/* ---------- Settings store: one snapshot shared by every subscriber ---------- */
const listeners = new Set<() => void>();
let settings: Settings = DEFAULTS;
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? "null");
    if (saved?.s) settings = { ...DEFAULTS, ...sanitize(saved.s) };
  } catch {
    /* Storage can be disabled or hold something old. */
  }
}

const changedFrom = (values: Settings) =>
  Object.fromEntries(
    Object.entries(values).filter(([key, value]) => key !== "theme" && value !== DEFAULTS[key]),
  );

function apply(next: Settings) {
  const root = document.documentElement;
  const out = compile(next);
  for (const name of root.getAttributeNames())
    if (name.startsWith("data-ldt-") && !(name in out.a)) root.removeAttribute(name);
  for (const [name, value] of Object.entries(out.a)) root.setAttribute(name, value);
  for (const prop of Array.from(root.style))
    if (prop.startsWith("--ldt-") && !(prop in out.v)) root.style.removeProperty(prop);
  for (const [prop, value] of Object.entries(out.v)) root.style.setProperty(prop, value);
  const changed = changedFrom(next);
  try {
    if (Object.keys(changed).length)
      localStorage.setItem(STORE_KEY, JSON.stringify({ s: changed, out }));
    else localStorage.removeItem(STORE_KEY);
  } catch {
    /* Storage can be disabled; the look still applies for this visit. */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const store = {
  get: () => {
    load();
    return settings;
  },
  server: () => DEFAULTS,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  set(next: Settings) {
    settings = next;
    apply(next);
    listeners.forEach((listener) => listener());
  },
};

/* ---------- Theme lives in the same place the header's Night switch keeps it ---------- */
const subscribeTheme = (listener: () => void) => {
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, { attributeFilter: ["data-ld-theme"] });
  return () => observer.disconnect();
};
const readTheme = () => document.documentElement.dataset.ldTheme ?? "system";
const setTheme = (theme: string) => {
  const root = document.documentElement;
  try {
    if (theme === "system") {
      delete root.dataset.ldTheme;
      localStorage.removeItem("ld-theme");
    } else {
      root.dataset.ldTheme = theme;
      localStorage.setItem("ld-theme", theme);
    }
  } catch {
    /* Storage can be disabled. */
  }
};

const isChanged = (control: Control, values: Settings) =>
  control.key !== "theme" && values[control.key] !== DEFAULTS[control.key];

const format = (control: RangeControl, value: number) =>
  control.unit === "" && control.def === 1
    ? `${Math.round(value * 100)}%`
    : `${Number.isInteger(value) ? value : value.toFixed(control.step < 0.01 ? 3 : 2)}${control.unit}`;

function Reset({ control, onReset }: { control: Control; onReset: () => void }) {
  return (
    <button
      type="button"
      className="ldt-reset"
      onClick={onReset}
      aria-label={`Reset ${control.label}`}
      title="Back to the site's look"
    >
      ↺
    </button>
  );
}

function Field({
  control,
  value,
  set,
}: {
  control: Control;
  value: string | number | boolean;
  set: (value: string | number | boolean) => void;
}) {
  const initial = DEFAULTS[control.key];
  const changed = control.key !== "theme" && value !== initial;
  const reset = changed ? <Reset control={control} onReset={() => set(initial)} /> : null;
  const id = `ldt-${control.key}`;

  if (control.type === "toggle")
    return (
      <div className="ldt-field ldt-row" data-changed={changed || undefined}>
        <label htmlFor={id}>{control.label}</label>
        {reset}
        <input
          id={id}
          type="checkbox"
          role="switch"
          className="ldt-switch"
          checked={Boolean(value)}
          onChange={(event) => set(event.target.checked)}
        />
      </div>
    );

  if (control.type === "range")
    return (
      <div className="ldt-field" data-changed={changed || undefined}>
        <div className="ldt-row">
          <label htmlFor={id}>{control.label}</label>
          {reset}
          <output htmlFor={id}>{format(control, Number(value))}</output>
        </div>
        <input
          id={id}
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={Number(value)}
          onChange={(event) => set(Number(event.target.value))}
          onDoubleClick={() => set(initial)}
        />
        {control.hint && <p className="ldt-hint">{control.hint}</p>}
      </div>
    );

  if (control.type === "color")
    return <ColorField control={control} value={String(value)} set={set} reset={reset} />;

  return <ChoiceField control={control} value={String(value)} set={set} reset={reset} />;
}

function ChoiceField({
  control,
  value,
  set,
  reset,
}: {
  control: ChoiceControl;
  value: string;
  set: (value: string) => void;
  reset: React.ReactNode;
}) {
  return (
    <fieldset className="ldt-field" data-changed={reset ? true : undefined}>
      <div className="ldt-row">
        <legend>{control.label}</legend>
        {reset}
      </div>
      <div className="ldt-seg" data-count={control.options.length}>
        {control.options.map(([option, label]) => (
          <label key={option}>
            <input
              type="radio"
              name={`ldt-${control.key}`}
              value={option}
              checked={value === option}
              onChange={() => set(option)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {control.hint && <p className="ldt-hint">{control.hint}</p>}
    </fieldset>
  );
}

/* ---------- Colour: an inline picker, so nothing opens outside the panel ---------- */
type Hsv = { h: number; s: number; v: number };

function hexToHsv(hex: string): Hsv {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}

function hsvToHex({ h, s, v }: Hsv) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return `#${[f(5), f(3), f(1)]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function ColorPicker({ value, set }: { value: string; set: (hex: string) => void }) {
  // Hue and saturation are kept here, so dragging through grey or black doesn't lose them.
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
  const [draft, setDraft] = useState(value);
  const [synced, setSynced] = useState(value);
  const area = useRef<HTMLDivElement>(null);

  // Opened near the bottom of the panel: bring the whole picker into view inside the panel.
  useEffect(() => {
    area.current?.parentElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  // A swatch, preset or reset changed the colour from outside: follow it.
  if (value !== synced) {
    setSynced(value);
    if (value.toLowerCase() !== hsvToHex(hsv)) setHsv(hexToHsv(value));
    setDraft(value);
  }

  const commit = (next: Hsv) => {
    const hex = hsvToHex(next);
    setHsv(next);
    setSynced(hex);
    setDraft(hex);
    set(hex);
  };
  const fromPointer = (event: React.PointerEvent) => {
    const box = area.current!.getBoundingClientRect();
    commit({
      ...hsv,
      s: clamp01((event.clientX - box.left) / box.width),
      v: 1 - clamp01((event.clientY - box.top) / box.height),
    });
  };
  const EyeDropper =
    typeof window !== "undefined"
      ? (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper
      : undefined;

  return (
    <div className="ldt-picker" style={{ "--hue": hsv.h } as React.CSSProperties}>
      <div
        ref={area}
        className="ldt-sv"
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s * 100)}
        aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
        }}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 0.1 : 0.01;
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, step],
            ArrowDown: [0, -step],
          };
          const move = moves[event.key];
          if (!move) return;
          event.preventDefault();
          commit({ ...hsv, s: clamp01(hsv.s + move[0]), v: clamp01(hsv.v + move[1]) });
        }}
      >
        <span
          className="ldt-sv-thumb"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: value }}
        />
      </div>
      <input
        type="range"
        className="ldt-hue"
        min={0}
        max={359}
        step={1}
        value={Math.round(hsv.h)}
        aria-label="Hue"
        onChange={(event) => commit({ ...hsv, h: Number(event.target.value) })}
      />
      <div className="ldt-row">
        <label className="ldt-hex">
          <span className="ld-sr-only">Hex colour</span>
          <input
            value={draft}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => {
              const next = event.target.value.trim();
              setDraft(next);
              const hex = (next.startsWith("#") ? next : `#${next}`).toLowerCase();
              if (/^#[0-9a-f]{6}$/.test(hex)) {
                setHsv(hexToHsv(hex));
                setSynced(hex);
                set(hex);
              }
            }}
            onBlur={() => setDraft(value)}
          />
        </label>
        {EyeDropper && (
          <button
            type="button"
            className="ldt-dropper"
            onClick={async () => {
              try {
                const { sRGBHex } = await new EyeDropper().open();
                if (/^#[0-9a-f]{6}$/i.test(sRGBHex)) set(sRGBHex.toLowerCase());
              } catch {
                /* Cancelled. */
              }
            }}
          >
            Pick from page
          </button>
        )}
      </div>
    </div>
  );
}

function ColorField({
  control,
  value,
  set,
  reset,
}: {
  control: ColorControl;
  value: string;
  set: (value: string) => void;
  reset: React.ReactNode;
}) {
  const [custom, setCustom] = useState(false);
  const isSwatch = control.swatches.some(([hex]) => hex === value.toLowerCase());
  return (
    <fieldset className="ldt-field" data-changed={reset ? true : undefined}>
      <div className="ldt-row">
        <legend>{control.label}</legend>
        {reset}
        <code>{value}</code>
      </div>
      <div className="ldt-swatches">
        {control.swatches.map(([hex, name]) => (
          <label key={hex} title={name} style={{ "--sw": hex } as React.CSSProperties}>
            <input
              type="radio"
              name={`ldt-${control.key}`}
              value={hex}
              checked={value.toLowerCase() === hex}
              onChange={() => set(hex)}
            />
            <span className="ld-sr-only">{name}</span>
          </label>
        ))}
        <button
          type="button"
          className="ldt-custom"
          data-active={!isSwatch || undefined}
          aria-expanded={custom}
          aria-label="Any colour"
          title="Any colour"
          onClick={() => setCustom((current) => !current)}
        />
      </div>
      {custom && <ColorPicker value={value} set={set} />}
      {control.hint && <p className="ldt-hint">{control.hint}</p>}
    </fieldset>
  );
}

/* ---------- Play: toys that act on the page, loaded on first use ---------- */
const TOYS = [
  { id: "gravity", label: "Gravity", note: "Every section drops to its floor. Throw things." },
  { id: "float", label: "Zero-G", note: "The whole site floats, and still works." },
  { id: "snap", label: "Snap", note: "Half the site, perfectly balanced." },
  { id: "burn", label: "Burn it", note: "Fire, from the bottom up." },
  { id: "quake", label: "Earthquake", note: "A short, sharp shake." },
  { id: "party", label: "Party", note: "Lights down, music up. Sound on." },
] as const;

function Play({ onStart }: { onStart: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <section className="ldt-play" aria-labelledby="ldt-play-title">
      <h2 id="ldt-play-title">Play</h2>
      <div className="ldt-toys">
        {TOYS.map((toy) => (
          <button
            key={toy.id}
            type="button"
            className="ldt-toy"
            data-toy={toy.id}
            disabled={busy}
            onClick={async () => {
              // Sound has to start inside the click itself; the party's code arrives after it.
              if (toy.id === "party") primeAudio();
              setBusy(true);
              try {
                const { play } = await import("./play");
                onStart();
                await play(toy.id);
              } finally {
                setBusy(false);
              }
            }}
          >
            <strong>{toy.label}</strong>
            <span>{toy.note}</span>
          </button>
        ))}
      </div>
      <p className="ldt-hint">Nothing breaks. “Put it back” undoes it, and so does Escape.</p>
    </section>
  );
}

/**
 * The tweak panel: every token the design is built on, live, saved in this browser and shareable
 * as JSON, plus a few toys. Opened by the launcher (lower right) or Shift+T.
 */
export default function TweakPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [importing, setImporting] = useState(false);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const values = useSyncExternalStore(store.subscribe, store.get, store.server);
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "system");
  const changedCount = CONTROLS.filter((control) => isChanged(control, values)).length;
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!note) return;
    const timer = window.setTimeout(() => setNote(""), 2200);
    return () => window.clearTimeout(timer);
  }, [note]);

  const setValue = (key: string, value: string | number | boolean) => {
    if (key === "theme") setTheme(String(value));
    else store.set({ ...values, [key]: value });
  };

  return (
    <aside
      ref={panel}
      id="ldt-panel"
      className="ldt-panel"
      hidden={!open}
      aria-label="Tweaks and toys"
      tabIndex={-1}
    >
      <header className="ldt-head">
        <div>
          <strong>Make it yours</strong>
          <span>
            {changedCount ? `${changedCount} changed` : "The site's look"} · kept in this browser
          </span>
        </div>
        <button type="button" className="ldt-close" onClick={onClose} aria-label="Close tweaks">
          ×
        </button>
      </header>

      <div className="ldt-presets" role="group" aria-label="Presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => store.set({ ...DEFAULTS, ...preset.settings })}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="ldt-scroll">
        <Play onStart={onClose} />
        {GROUPS.map((group) => {
          const groupChanged = group.controls.filter((control) =>
            isChanged(control, values),
          ).length;
          return (
            <details key={group.id} className="ldt-group" open={group.id === "colour"}>
              <summary>
                {group.title}
                {groupChanged > 0 && <b>{groupChanged}</b>}
                {groupChanged > 0 && (
                  <button
                    type="button"
                    className="ldt-group-reset"
                    onClick={(event) => {
                      event.preventDefault();
                      const next = { ...values };
                      for (const control of group.controls)
                        if (control.key !== "theme") next[control.key] = DEFAULTS[control.key];
                      store.set(next);
                    }}
                  >
                    Reset
                  </button>
                )}
              </summary>
              <div className="ldt-fields">
                {group.controls.map((control) => (
                  <Field
                    key={control.key}
                    control={control}
                    value={
                      control.key === "theme"
                        ? theme
                        : (values[control.key] ?? DEFAULTS[control.key])
                    }
                    set={(value) => setValue(control.key, value)}
                  />
                ))}
              </div>
            </details>
          );
        })}
      </div>

      {importing && (
        <div className="ldt-import">
          <label htmlFor="ldt-import">Paste settings JSON</label>
          <textarea
            id="ldt-import"
            rows={4}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            maxLength={8000}
          />
          <div className="ldt-row">
            <button
              type="button"
              onClick={() => {
                try {
                  store.set({ ...DEFAULTS, ...sanitize(JSON.parse(draft)) });
                  setImporting(false);
                  setDraft("");
                  setNote("Settings applied");
                } catch {
                  setNote("That isn't valid JSON");
                }
              }}
            >
              Apply
            </button>
            <button type="button" onClick={() => setImporting(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <footer className="ldt-foot">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(JSON.stringify(changedFrom(values), null, 2));
              setNote("Copied settings JSON");
            } catch {
              setNote("Clipboard is blocked here");
            }
          }}
        >
          Copy
        </button>
        <button type="button" onClick={() => setImporting((current) => !current)}>
          Paste
        </button>
        <button type="button" disabled={!changedCount} onClick={() => store.set({ ...DEFAULTS })}>
          Reset all
        </button>
        <span className="ldt-note" aria-live="polite">
          {note}
        </span>
      </footer>
    </aside>
  );
}
