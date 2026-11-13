"use client";

import { useSyncExternalStore } from "react";
import Toggle from "./Toggle";

const THEME_KEY = "ld-theme";
const subscribeTheme = (listener: () => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, { attributeFilter: ["data-ld-theme"] });
  media.addEventListener("change", listener);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", listener);
  };
};
const isNight = () => {
  const theme = document.documentElement.dataset.ldTheme;
  return theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const Moon = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="M8.9 7.6A3.9 3.9 0 0 1 4.4 3.1a3.9 3.9 0 1 0 4.5 4.5z" />
  </svg>
);
/** Night draft, as a droplet switch in the header. */
export default function DisplaySwitches() {
  const night = useSyncExternalStore(subscribeTheme, isNight, () => false);
  return (
    <div className="ld-switches" role="group" aria-label="Display">
      <Toggle
        label="Night"
        checked={night}
        icon={<Moon />}
        onChange={(next) => {
          document.documentElement.dataset.ldTheme = next ? "dark" : "light";
          try {
            localStorage.setItem(THEME_KEY, next ? "dark" : "light");
          } catch {
            /* Storage can be disabled. */
          }
        }}
      />
    </div>
  );
}
