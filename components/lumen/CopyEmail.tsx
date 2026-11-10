"use client";

import { useEffect, useState } from "react";
import { SoftLayers, softStyle } from "./Soft";
import { haptic, tone } from "./feedback";

/**
 * Copies the address; mailto links do nothing on machines without a mail client. Both labels
 * share one grid cell, so the key keeps its width while one label rolls out and the other in.
 */
export default function CopyEmail({
  email,
  label = "Copy email",
}: {
  email: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        className="ld-key ld-soft ld-copy"
        data-copied={copied}
        style={softStyle(copied ? "signal" : "putty")}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            tone("snap", 0.6);
            haptic(8);
          } catch {
            window.location.href = `mailto:${email}`;
          }
        }}
      >
        <SoftLayers />
        <span className="ld-copy-labels">
          <span className="ld-copy-label" aria-hidden={copied}>
            {label}
          </span>
          <span className="ld-copy-label ld-copy-done" aria-hidden={!copied}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3 8.5l3.2 3L13 4.5" />
            </svg>
            Copied
          </span>
        </span>
      </button>
      <span className="ld-sr-only" aria-live="polite">
        {copied ? "Email copied" : ""}
      </span>
    </>
  );
}
