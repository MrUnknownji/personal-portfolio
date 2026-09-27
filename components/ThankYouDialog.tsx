"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { FiArrowRight, FiCheck, FiCopy, FiX } from "react-icons/fi";
import Link from "next/link";
import { Dialog } from "@/components/ui/Dialog";

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const ThankYouDialog = ({
  isOpen,
  onClose,
  email = "your@email.com",
}: ThankYouDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsEmailCopied(true);
      if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
      copyResetTimerRef.current = setTimeout(() => {
        setIsEmailCopied(false);
        copyResetTimerRef.current = null;
      }, 2_000);
    } catch {
      setIsEmailCopied(false);
    }
  }, [email]);

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    };
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy={titleId}
      ariaDescribedBy={descriptionId}
      className="w-full max-w-lg px-4 sm:px-0"
    >
      <button
        type="button"
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Close confirmation dialog"
        tabIndex={-1}
      />

      <div className="relative z-[101] w-full overflow-hidden border border-[#19191b] bg-[#f3f0eb] text-[#19191b]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[var(--offset-orange)]" />

        <div className="space-y-8 p-8 text-center sm:p-10">
          <div className="relative mx-auto mb-6 flex size-16 items-center justify-center border border-[#19191b] bg-[var(--offset-orange)]">
            <FiCheck className="size-9 text-[#19191b]" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            <h2 id={titleId} className="font-[family-name:var(--font-display)] text-5xl font-extrabold uppercase leading-none">
              Message transmitted.
            </h2>
            <p id={descriptionId} className="text-lg leading-relaxed">
              I&apos;ll take it from here. Thanks for reaching out.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 border border-[#19191b] p-4">
            <span className="truncate font-mono text-sm">
              {email}
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="min-h-11 min-w-11 p-2 text-[var(--primary)] transition-colors hover:bg-[#e9e4dd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              aria-label="Copy email address"
            >
              {isEmailCopied ? <FiCheck /> : <FiCopy />}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {isEmailCopied ? "Email address copied" : ""}
            </span>
          </div>

          <Link
            href="/my-projects"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 bg-[var(--offset-orange)] px-6 py-3 font-bold text-[#19191b] transition-[filter] hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]"
          >
            View Work
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          data-autofocus
          onClick={onClose}
          className="absolute right-4 top-4 min-h-11 min-w-11 p-2 transition-colors hover:bg-[#e9e4dd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          aria-label="Close dialog"
        >
          <FiX className="size-5" />
        </button>
      </div>
    </Dialog>
  );
};

export default ThankYouDialog;
