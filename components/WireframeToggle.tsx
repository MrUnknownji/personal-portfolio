"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function WireframeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.wireframe = enabled ? "true" : "false";
    return () => { delete document.documentElement.dataset.wireframe; };
  }, [enabled]);

  return <>
    <button className="offset-wireframe-trigger" type="button" aria-pressed={enabled} onClick={() => setEnabled(!enabled)}>{enabled ? "Close build file ×" : "Open build file ↗"}</button>
    {enabled && createPortal(<button className="offset-wireframe-exit" type="button" onClick={() => setEnabled(false)}>Close build file ×</button>, document.body)}
  </>;
}
