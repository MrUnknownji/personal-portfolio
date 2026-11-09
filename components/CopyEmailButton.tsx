"use client";

import { useEffect, useState } from "react";

/** Copies the email address; mailto links often do nothing on machines without a mail client. */
export default function CopyEmailButton({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {copied ? "Email copied ✓" : "Copy email"}
    </button>
  );
}
