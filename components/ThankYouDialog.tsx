"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import DialogContent from "./ContactSectionComponents/DialogContent";
import DialogActions from "./ContactSectionComponents/DialogActions";
import { useGSAP } from "@gsap/react";

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const ANIMATION_CONFIG = {
  OVERLAY: {
    OPACITY: { OPEN: 0.85, CLOSE: 0 },
    DURATION: { OPEN: 0.4, CLOSE: 0.3 },
  },
  DIALOG: {
    SCALE: { OPEN: 1, CLOSE: 0.95 },
    Y: { OPEN: 0, CLOSE: 20 },
    DURATION: { OPEN: 0.5, CLOSE: 0.3 },
  },
  EASE: {
    OPEN: "power3.out",
    CLOSE: "power2.in",
  },
  COPY_TIMEOUT: 2000,
} as const;

const ThankYouDialog = ({
  isOpen,
  onClose,
  email = "your@email.com",
}: ThankYouDialogProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setIsEmailCopied(true);
        const timer = setTimeout(() => {
          setIsEmailCopied(false);
        }, ANIMATION_CONFIG.COPY_TIMEOUT);
        return () => clearTimeout(timer);
      })
      .catch((err) => {
        console.error("Failed to copy email: ", err);
      });
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
      scale: ANIMATION_CONFIG.DIALOG.SCALE.CLOSE,
      y: ANIMATION_CONFIG.DIALOG.Y.CLOSE,
      duration: ANIMATION_CONFIG.DIALOG.DURATION.CLOSE,
      ease: ANIMATION_CONFIG.EASE.CLOSE,
      force3D: true,
    }).to(
      overlayRef.current,
      {
        opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
        duration: ANIMATION_CONFIG.OVERLAY.DURATION.CLOSE,
        ease: ANIMATION_CONFIG.EASE.CLOSE,
      },
      "<",
    );
  }, [onClose, isVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        startCloseProcess();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, startCloseProcess]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else if (isVisible) {
      startCloseProcess();
    }
  }, [isOpen, isVisible, startCloseProcess]);

  useGSAP(() => {
    if (!isVisible || !overlayRef.current || !dialogRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, {
        opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
        willChange: "opacity",
        force3D: true,
      });
      gsap.set(dialogRef.current, {
        opacity: 0,
        scale: ANIMATION_CONFIG.DIALOG.SCALE.CLOSE,
        y: ANIMATION_CONFIG.DIALOG.Y.CLOSE,
        willChange: "transform, opacity",
        force3D: true,
      });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.OPEN,
        duration: ANIMATION_CONFIG.OVERLAY.DURATION.OPEN,
        ease: ANIMATION_CONFIG.EASE.OPEN,
      }).to(
        dialogRef.current,
        {
          opacity: 1,
          scale: ANIMATION_CONFIG.DIALOG.SCALE.OPEN,
          y: ANIMATION_CONFIG.DIALOG.Y.OPEN,
          duration: ANIMATION_CONFIG.DIALOG.DURATION.OPEN,
          ease: ANIMATION_CONFIG.EASE.OPEN,
        },
        "-=0.2",
      );
    }, dialogRef);

    return () => {
      ctx.revert();
    };
  }, [isVisible]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center transition-opacity duration-300 ${
        isVisible && isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/85"
        onClick={startCloseProcess}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative w-full max-w-md m-4 bg-secondary
                     rounded-2xl overflow-hidden shadow-2xl border border-primary/20 text-left
                     transform-gpu will-change-transform"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -inset-px bg-primary/5 rounded-2xl pointer-events-none -z-10" />

        <DialogContent
          email={email}
          onCopy={handleCopyEmail}
          isCopied={isEmailCopied}
        />
        <DialogActions
          onClose={startCloseProcess}
          isEmailCopied={isEmailCopied}
        />
      </div>
    </div>
  );
};

export default ThankYouDialog;
