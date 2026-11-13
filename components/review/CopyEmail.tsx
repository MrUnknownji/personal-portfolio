"use client";

import { useEffect, useState } from "react";

/** Copies the address, and falls back to opening the mail app when the clipboard is blocked. */
export default function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return (
    <button
      type="button"
      className={className}
      data-copied={copied}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
    >
      <span aria-live="polite">{copied ? "Copied to clipboard" : "Copy email"}</span>
    </button>
  );
}
