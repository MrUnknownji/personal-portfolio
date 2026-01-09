"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { FiCheck, FiCopy, FiX, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

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
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setIsEmailCopied(true);
        setTimeout(() => setIsEmailCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy email: ", err));
  }, [email]);

  const startCloseProcess = useCallback(() => {
    if (!overlayRef.current || !dialogRef.current || !isVisible) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onClose();
      },
    });

    tl.to(dialogRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "<"
    );
  }, [onClose, isVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) startCloseProcess();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, startCloseProcess]);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else if (isVisible) startCloseProcess();
  }, [isOpen, isVisible, startCloseProcess]);

  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (isVisible) {
      if (smoother) {
        smoother.paused(true);
      }
    } else {
      if (smoother) {
        smoother.paused(false);
      }
    }
    return () => {
      if (smoother) {
        smoother.paused(false);
      }
    };
  }, [isVisible]);

  useGSAP(() => {
    if (!isVisible || !overlayRef.current || !dialogRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(dialogRef.current, { opacity: 0, scale: 0.9, y: 20 });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      }).to(
        dialogRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.2)",
        },
        "-=0.2"
      );
    }, dialogRef);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible && !isOpen) return null;
  if (!mounted) return null;

  const dialogContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/90"
        onClick={startCloseProcess}
      />

      <div
        ref={dialogRef}
        className="relative z-[101] w-full max-w-lg bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="p-8 sm:p-10 text-center space-y-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
            <FiCheck className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Message Sent!
            </h3>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Thanks for reaching out. I&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5 hover:border-white/10 transition-colors">
            <span className="text-neutral-300 font-mono text-sm truncate">
              {email}
            </span>
            <button
              onClick={handleCopyEmail}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary relative group"
              title="Copy Email"
            >
              {isEmailCopied ? <FiCheck /> : <FiCopy />}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isEmailCopied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>

          <div className="pt-2">
            <Link
              href="#projects"
              onClick={startCloseProcess}
              className="w-full px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              View Work
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <button
          onClick={startCloseProcess}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
};

export default ThankYouDialog;
