"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Toggles build-file mode, which annotates sections with the file and reasoning behind them.
 * `floatingExit` adds a fixed close button for long pages where the toggle scrolls away.
 */
export default function WireframeToggle({ floatingExit = true }: { floatingExit?: boolean }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.wireframe = enabled ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.wireframe;
    };
  }, [enabled]);

  return (
    <>
      <button
        className="offset-wireframe-trigger"
        type="button"
        aria-pressed={enabled}
        onClick={() => setEnabled(!enabled)}
      >
        {enabled ? "Close build file ×" : "Open build file ↗"}
      </button>
      {enabled &&
        floatingExit &&
        createPortal(
          <button className="offset-wireframe-exit" type="button" onClick={() => setEnabled(false)}>
            Close build file ×
          </button>,
          document.body,
        )}
    </>
  );
}
