"use client";
import React, { useRef, useState, useCallback } from "react";
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
    OPACITY: {
      OPEN: 0.75,
      CLOSE: 0
    },
    DURATION: {
      OPEN: 0.3,
      CLOSE: 0.2
    },
    BLUR: {
      OPEN: "8px",
      CLOSE: "0px"
    }
  },
  DIALOG: {
    SCALE: {
      OPEN: 1,
      CLOSE: 0.95
    },
    Y: {
      OPEN: 0,
      CLOSE: 20
    },
    DURATION: {
      OPEN: 0.4,
      CLOSE: 0.3
    }
  },
  EASE: {
    OPEN: "power3.out",
    CLOSE: "power2.in"
  },
  COPY: {
    DURATION: 2000
  }
} as const;

const ThankYouDialog = ({ isOpen, onClose, email }: ThankYouDialogProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleCopyEmail = useCallback(() => {
    if (email) {
      navigator.clipboard.writeText(email);
      setIsEmailCopied(true);

      gsap.delayedCall(ANIMATION_CONFIG.COPY.DURATION / 1000, () => {
        setIsEmailCopied(false);
      });
    }
  }, [email]);

  const handleClose = useCallback(async () => {
    if (!overlayRef.current || !dialogRef.current) return;

    const tl = gsap.timeline({
      onComplete: onClose
    });

    tl.to(dialogRef.current, {
      opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
      scale: ANIMATION_CONFIG.DIALOG.SCALE.CLOSE,
      y: ANIMATION_CONFIG.DIALOG.Y.CLOSE,
      duration: ANIMATION_CONFIG.DIALOG.DURATION.CLOSE,
      ease: ANIMATION_CONFIG.EASE.CLOSE,
      clearProps: "transform"
    })
    .to(overlayRef.current, {
      opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
      backdropFilter: ANIMATION_CONFIG.OVERLAY.BLUR.CLOSE,
      duration: ANIMATION_CONFIG.OVERLAY.DURATION.CLOSE,
      ease: ANIMATION_CONFIG.EASE.CLOSE
    }, "<");
  }, [onClose]);

  useGSAP(() => {
    if (isOpen && overlayRef.current && dialogRef.current) {
      document.body.style.overflow = "hidden";

      // Initial setup
      gsap.set([overlayRef.current, dialogRef.current], {
        opacity: 0
      });
      gsap.set(dialogRef.current, {
        scale: ANIMATION_CONFIG.DIALOG.SCALE.CLOSE,
        y: ANIMATION_CONFIG.DIALOG.Y.CLOSE
      });
      gsap.set(overlayRef.current, {
        backdropFilter: ANIMATION_CONFIG.OVERLAY.BLUR.CLOSE
      });

      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.OPEN,
        backdropFilter: ANIMATION_CONFIG.OVERLAY.BLUR.OPEN,
        duration: ANIMATION_CONFIG.OVERLAY.DURATION.OPEN,
        ease: ANIMATION_CONFIG.EASE.OPEN
      })
      .to(dialogRef.current, {
        opacity: 1,
        scale: ANIMATION_CONFIG.DIALOG.SCALE.OPEN,
        y: ANIMATION_CONFIG.DIALOG.Y.OPEN,
        duration: ANIMATION_CONFIG.DIALOG.DURATION.OPEN,
        ease: ANIMATION_CONFIG.EASE.OPEN,
        clearProps: "transform"
      }, "-=0.2");
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div
          ref={overlayRef}
          className="fixed inset-0 transition-[opacity,backdrop-filter]"
          onClick={handleClose}
          style={{ willChange: "backdrop-filter" }}
        >
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div
          ref={dialogRef}
          className="relative inline-block w-full sm:max-w-lg bg-gray-800/95 backdrop-blur-sm
            rounded-2xl overflow-hidden shadow-2xl border border-primary/20 text-left
            transform transition-all sm:align-middle"
          style={{ willChange: "transform" }}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r 
            from-transparent via-primary to-transparent opacity-50" />

          <DialogContent email={email ?? ""} onCopy={handleCopyEmail} />
          <DialogActions onClose={handleClose} isEmailCopied={isEmailCopied} />

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 
            border-primary/30 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 
            border-primary/30 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 
            border-primary/30 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 
            border-primary/30 rounded-br-xl" />

          {/* Glow effect */}
          <div 
            className="absolute -inset-px bg-primary/5 rounded-2xl pointer-events-none"
            style={{ 
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              willChange: "opacity" 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouDialog;
