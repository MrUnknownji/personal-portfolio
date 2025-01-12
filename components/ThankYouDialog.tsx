"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import DialogContent from "./ContactSectionComponents/DialogContent";
import DialogActions from "./ContactSectionComponents/DialogActions";
import { useGSAP } from "@gsap/react";

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const OVERLAY_OPACITY_OPEN = 1;
const OVERLAY_OPACITY_CLOSE = 0;
const DIALOG_SCALE_OPEN = 1;
const DIALOG_SCALE_CLOSE = 0.95;
const DIALOG_Y_OPEN = 0;
const DIALOG_Y_CLOSE = 20;
const ANIMATION_DURATION_OPEN_OVERLAY = 0.3;
const ANIMATION_DURATION_OPEN_DIALOG = 0.4;
const ANIMATION_DURATION_CLOSE_DIALOG = 0.3;
const ANIMATION_DURATION_CLOSE_OVERLAY = 0.2;
const EASE_TYPE_OPEN = "power3.out";
const EASE_TYPE_CLOSE = "power3.in";
const COPY_MESSAGE_DURATION = 3000;

const ThankYouDialog: React.FC<ThankYouDialogProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleCopyEmail = useCallback(() => {
    if (email) {
      navigator.clipboard.writeText(email);
      setIsEmailCopied(true);

      setTimeout(() => {
        setIsEmailCopied(false);
      }, COPY_MESSAGE_DURATION);
    }
  }, [email]);

  useGSAP(() => {
    const overlay = overlayRef.current;
    const dialog = dialogRef.current;

    if (isOpen && overlay && dialog) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline();

      tl.fromTo(
        overlay,
        { opacity: OVERLAY_OPACITY_CLOSE },
        {
          opacity: OVERLAY_OPACITY_OPEN,
          duration: ANIMATION_DURATION_OPEN_OVERLAY,
        },
      ).fromTo(
        dialog,
        {
          opacity: OVERLAY_OPACITY_CLOSE,
          scale: DIALOG_SCALE_CLOSE,
          y: DIALOG_Y_CLOSE,
        },
        {
          opacity: OVERLAY_OPACITY_OPEN,
          scale: DIALOG_SCALE_OPEN,
          y: DIALOG_Y_OPEN,
          duration: ANIMATION_DURATION_OPEN_DIALOG,
          ease: EASE_TYPE_OPEN,
        },
        "-=0.1",
      );
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(async () => {
    const tl = gsap.timeline();

    await tl
      .to(dialogRef.current, {
        opacity: OVERLAY_OPACITY_CLOSE,
        scale: DIALOG_SCALE_CLOSE,
        y: DIALOG_Y_CLOSE,
        duration: ANIMATION_DURATION_CLOSE_DIALOG,
        ease: EASE_TYPE_CLOSE,
      })
      .to(overlayRef.current, {
        opacity: OVERLAY_OPACITY_CLOSE,
        duration: ANIMATION_DURATION_CLOSE_OVERLAY,
      });

    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div
          ref={overlayRef}
          className="fixed inset-0 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div
          ref={dialogRef}
          className="relative inline-block bg-secondary rounded-xl
            overflow-hidden shadow-2xl sm:max-w-lg w-full text-left
            border border-primary/20"
        >
          <div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r
            from-transparent via-primary to-transparent"
          />

          <DialogContent email={email ?? " "} onCopy={handleCopyEmail} />
          <DialogActions onClose={handleClose} isEmailCopied={isEmailCopied} />

          <div
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2
            border-primary rounded-tl-xl"
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2
            border-primary rounded-tr-xl"
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2
            border-primary rounded-bl-xl"
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2
            border-primary rounded-br-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouDialog;
