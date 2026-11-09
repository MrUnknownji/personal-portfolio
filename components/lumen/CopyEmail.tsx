"use client";

import { useEffect, useState } from "react";
import { SoftLayers, softStyle } from "./Soft";
import { haptic, tone } from "./feedback";

/** Copies the address; mailto links do nothing on machines without a mail client. */
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
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className="ld-key ld-soft"
      style={softStyle("putty")}
      aria-live="polite"
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
      <span>{copied ? "Email copied ✓" : label}</span>
    </button>
  );
}
