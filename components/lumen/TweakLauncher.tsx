"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import { CHANGE_EVENT, STORE_KEY } from "./tweakKeys";

// The panel, its styles and the toys behind it load only when a visitor first opens it.
const loadPanel = () => import("./TweakPanel");
const TweakPanel = lazy(loadPanel);

const savedCount = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? "null");
    return saved?.s && typeof saved.s === "object" ? Object.keys(saved.s).length : 0;
  } catch {
    return 0;
  }
};

/** The lower-right button. Opens the tweak panel on click or Shift+T. */
export default function TweakLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(savedCount());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.shiftKey && !event.metaKey && !event.ctrlKey && event.key.toLowerCase() === "t") {
        setMounted(true);
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className="ldt-launch"
        aria-expanded={open}
        aria-controls="ldt-panel"
        onPointerEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        onClick={() => {
          setMounted(true);
          setOpen((current) => !current);
        }}
        title="Tweaks and toys (Shift+T)"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 5h8M15 5h2M3 10h2M9 10h8M3 15h10M17 15h0" />
          <circle cx="13" cy="5" r="2" />
          <circle cx="7" cy="10" r="2" />
          <circle cx="15" cy="15" r="2" />
        </svg>
        <span>Tweaks</span>
        {count > 0 && <b aria-label={`${count} changed`}>{count}</b>}
      </button>
      {mounted && (
        <Suspense fallback={null}>
          <TweakPanel open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
