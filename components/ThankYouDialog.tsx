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
        className="fixed inset-0 bg-black/90"
        onClick={onClose}
        aria-label="Close confirmation dialog"
        tabIndex={-1}
      />

      <div className="relative z-[101] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="space-y-8 p-8 text-center sm:p-10">
          <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
            <FiCheck className="size-10 text-primary" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            <h2 id={titleId} className="text-3xl font-bold tracking-tight text-white">
              Message Sent
            </h2>
            <p id={descriptionId} className="text-lg leading-relaxed text-neutral-300">
              Thanks for reaching out. I&apos;ll review your message and get
              back to you as soon as possible.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="truncate font-mono text-sm text-neutral-200">
              {email}
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="min-h-11 min-w-11 rounded-lg p-2 text-primary transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-black transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            View Work
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          data-autofocus
          onClick={onClose}
          className="absolute right-4 top-4 min-h-11 min-w-11 rounded-full p-2 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Close dialog"
        >
          <FiX className="size-5" />
        </button>
      </div>
    </Dialog>
  );
};

export default ThankYouDialog;
