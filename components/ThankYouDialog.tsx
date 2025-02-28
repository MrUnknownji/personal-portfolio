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
    OPACITY: {
      OPEN: 0.75,
      CLOSE: 0
    },
    DURATION: {
      OPEN: 0.4,
      CLOSE: 0.3
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
      OPEN: 0.5,
      CLOSE: 0.3
    }
  },
  EASE: {
    OPEN: "power3.out",
    CLOSE: "power2.inOut"
  },
  COPY: {
    DURATION: 2000
  },
  BUTTON: {
    DURATION: 0.2,
    EASE: "power2.out",
    SCALE: 0.95,
    OPACITY: {
      HOVER: 0.9,
      ACTIVE: 0.8
    }
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

  const handleClose = useCallback(() => {
    if (!overlayRef.current || !dialogRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onClose
      });

      tl.to(dialogRef.current, {
        opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
        scale: ANIMATION_CONFIG.DIALOG.SCALE.CLOSE,
        y: ANIMATION_CONFIG.DIALOG.Y.CLOSE,
        duration: ANIMATION_CONFIG.DIALOG.DURATION.CLOSE,
        ease: ANIMATION_CONFIG.EASE.CLOSE,
        force3D: true
      })
      .to(overlayRef.current, {
        opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
        backdropFilter: ANIMATION_CONFIG.OVERLAY.BLUR.CLOSE,
        duration: ANIMATION_CONFIG.OVERLAY.DURATION.CLOSE,
        ease: ANIMATION_CONFIG.EASE.CLOSE
      }, "<");
    });

    return () => ctx.revert();
  }, [onClose]);

  useGSAP(() => {
    if (isOpen && overlayRef.current && dialogRef.current) {
      document.body.style.overflow = "hidden";

      const ctx = gsap.context(() => {
        gsap.set([overlayRef.current, dialogRef.current], {
          opacity: 0,
          force3D: true
        });
        
        gsap.set(dialogRef.current, {
          scale: ANIMATION_CONFIG.DIALOG.SCALE.CLOSE,
          y: ANIMATION_CONFIG.DIALOG.Y.CLOSE,
          force3D: true
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
          force3D: true
        }, "-=0.2");
      });

      return () => {
        ctx.revert();
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const setupButtonHover = useCallback((button: HTMLButtonElement) => {
    const ctx = gsap.context(() => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1,
          opacity: ANIMATION_CONFIG.BUTTON.OPACITY.HOVER,
          duration: ANIMATION_CONFIG.BUTTON.DURATION,
          ease: ANIMATION_CONFIG.BUTTON.EASE,
          force3D: true
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          opacity: 1,
          duration: ANIMATION_CONFIG.BUTTON.DURATION,
          ease: ANIMATION_CONFIG.BUTTON.EASE,
          force3D: true
        });
      });

      button.addEventListener("mousedown", () => {
        gsap.to(button, {
          scale: ANIMATION_CONFIG.BUTTON.SCALE,
          opacity: ANIMATION_CONFIG.BUTTON.OPACITY.ACTIVE,
          duration: ANIMATION_CONFIG.BUTTON.DURATION,
          ease: ANIMATION_CONFIG.BUTTON.EASE,
          force3D: true
        });
      });

      button.addEventListener("mouseup", () => {
        gsap.to(button, {
          scale: 1,
          opacity: ANIMATION_CONFIG.BUTTON.OPACITY.HOVER,
          duration: ANIMATION_CONFIG.BUTTON.DURATION,
          ease: ANIMATION_CONFIG.BUTTON.EASE,
          force3D: true
        });
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const buttons = document.querySelectorAll('button');
    const cleanups = Array.from(buttons).map(button => setupButtonHover(button as HTMLButtonElement));

    return () => cleanups.forEach(cleanup => cleanup());
  }, [setupButtonHover]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div
          ref={overlayRef}
          className="fixed inset-0"
          onClick={handleClose}
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
            sm:align-middle"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r 
            from-transparent via-primary to-transparent opacity-50" />

          <DialogContent email={email ?? ""} onCopy={handleCopyEmail} />
          <DialogActions onClose={handleClose} isEmailCopied={isEmailCopied} />

          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 
            border-primary/30 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 
            border-primary/30 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 
            border-primary/30 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 
            border-primary/30 rounded-br-xl" />

          <div className="absolute -inset-px bg-primary/5 rounded-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default ThankYouDialog;
