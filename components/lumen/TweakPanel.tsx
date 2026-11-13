"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CONTROLS,
  DEFAULTS,
  GROUPS,
  PRESETS,
  STORE_KEY,
  compile,
  type ChoiceControl,
  type ColorControl,
  type Control,
  type RangeControl,
  type Settings,
} from "./tweaks";

/* ---------- Settings store: one snapshot shared by every subscriber ---------- */
const listeners = new Set<() => void>();
let settings: Settings = DEFAULTS;
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? "null");
    if (saved?.s) settings = { ...DEFAULTS, ...saved.s };
  } catch {
    /* Storage can be disabled or hold something old. */
  }
}

function apply(next: Settings) {
  const root = document.documentElement;
  const out = compile(next);
  for (const name of root.getAttributeNames())
    if (name.startsWith("data-ldt-") && !(name in out.a)) root.removeAttribute(name);
  for (const [name, value] of Object.entries(out.a)) root.setAttribute(name, value);
  for (const prop of Array.from(root.style))
    if (prop.startsWith("--ldt-") && !(prop in out.v)) root.style.removeProperty(prop);
  for (const [prop, value] of Object.entries(out.v)) root.style.setProperty(prop, value);
  const changed = Object.fromEntries(
    Object.entries(next).filter(([key, value]) => key !== "theme" && value !== DEFAULTS[key]),
  );
  try {
    if (Object.keys(changed).length)
      localStorage.setItem(STORE_KEY, JSON.stringify({ s: changed, out }));
    else localStorage.removeItem(STORE_KEY);
  } catch {
    /* Storage can be disabled; the look still applies for this visit. */
  }
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
  control.key !== "theme" && values[control.key] !== control.def;

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
      title="Reset to default"
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
  const changed = control.key !== "theme" && value !== control.def;
  const reset = changed ? <Reset control={control} onReset={() => set(control.def)} /> : null;
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
          onDoubleClick={() => set(control.def)}
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
        <label className="ldt-custom" title="Any colour">
          <input type="color" value={value} onChange={(event) => set(event.target.value)} />
          <span className="ld-sr-only">Custom colour</span>
        </label>
      </div>
      {control.hint && <p className="ldt-hint">{control.hint}</p>}
    </fieldset>
  );
}

/**
 * The review build's tweak panel: every token the design is built on, live, saved in this
 * browser, and exportable as JSON. Opens from the button at the lower right or Shift+T.
 */
export default function TweakPanel() {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const values = useSyncExternalStore(store.subscribe, store.get, store.server);
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "system");
  const changedCount = CONTROLS.filter((control) => isChanged(control, values)).length;

  // Re-apply once on mount, so a look saved by an older version of the schema is rewritten.
  useEffect(() => {
    if (localStorage.getItem(STORE_KEY)) apply(store.get());
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.shiftKey && !event.metaKey && !event.ctrlKey && event.key.toLowerCase() === "t")
        setOpen((current) => !current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!note) return;
    const timer = window.setTimeout(() => setNote(""), 2200);
    return () => window.clearTimeout(timer);
  }, [note]);

  const setValue = (key: string, value: string | number | boolean) => {
    if (key === "theme") setTheme(String(value));
    else store.set({ ...values, [key]: value });
  };
  const changedOnly = () =>
    Object.fromEntries(
      Object.entries(values).filter(([key, value]) => key !== "theme" && value !== DEFAULTS[key]),
    );

  return (
    <>
      <button
        type="button"
        className="ldt-launch"
        aria-expanded={open}
        aria-controls="ldt-panel"
        onClick={() => setOpen((current) => !current)}
        title="Tweaks (Shift+T)"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 5h8M15 5h2M3 10h2M9 10h8M3 15h10M17 15h0" />
          <circle cx="13" cy="5" r="2" />
          <circle cx="7" cy="10" r="2" />
          <circle cx="15" cy="15" r="2" />
        </svg>
        <span>Tweaks</span>
        {changedCount > 0 && <b>{changedCount}</b>}
      </button>

      <aside id="ldt-panel" className="ldt-panel" hidden={!open} aria-label="Design tweaks">
        <header className="ldt-head">
          <div>
            <strong>Tweaks</strong>
            <span>
              {changedCount ? `${changedCount} changed` : "All defaults"} · saved in this browser
            </span>
          </div>
          <button
            type="button"
            className="ldt-close"
            onClick={() => setOpen(false)}
            aria-label="Close tweaks"
          >
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
                          if (control.key !== "theme") next[control.key] = control.def;
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
                      value={control.key === "theme" ? theme : (values[control.key] ?? control.def)}
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
            />
            <div className="ldt-row">
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(draft) as Settings;
                    const known = Object.fromEntries(
                      Object.entries(parsed).filter(([key]) => key in DEFAULTS && key !== "theme"),
                    );
                    store.set({ ...DEFAULTS, ...known });
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
                await navigator.clipboard.writeText(JSON.stringify(changedOnly(), null, 2));
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
    </>
  );
}
