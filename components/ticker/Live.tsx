"use client";

import { useState, useSyncExternalStore } from "react";

const subscribeSecond = (listener: () => void) => {
  const id = window.setInterval(listener, 1000);
  return () => window.clearInterval(id);
};
const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const readTime = () => format.format(Date.now());

/** Local time where Sandeep works, ticking each second. The server renders a placeholder. */
export function Clock() {
  const time = useSyncExternalStore(subscribeSecond, readTime, () => "--:--:--");
  return (
    <span className="tk-clock">
      <span className="tk-dim">IST</span> <time suppressHydrationWarning>{time}</time>
    </span>
  );
}

/** The scrolling tape of counted facts, with a control to stop it. It also stops on hover. */
export function Tape({ items }: { items: { sym: string; value: string; label: string }[] }) {
  const [paused, setPaused] = useState(false);
  const run = (copy: number) =>
    items.map((item, i) => (
      <li key={`${copy}-${i}`} aria-hidden={copy > 0 || undefined}>
        <b>{item.sym}</b> <span className="tk-up">▲ {item.value}</span> {item.label}
      </li>
    ));
  return (
    <div className="tk-tape" data-paused={paused || undefined}>
      <button
        type="button"
        className="tk-tape-toggle"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? "Play tape" : "Pause tape"}
      </button>
      <div className="tk-tape-window">
        <ul className="tk-tape-run" aria-label="Facts counted from project repositories">
          {run(0)}
          {run(1)}
        </ul>
      </div>
    </div>
  );
}
