"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import DialogContent from "./ContactSectionComponents/DialogContent";
import DialogActions from "./ContactSectionComponents/DialogActions";

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string; // Optional email prop.
}

const ThankYouDialog: React.FC<ThankYouDialogProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setIsEmailCopied(true);

      setTimeout(() => {
        setIsEmailCopied(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const dialog = dialogRef.current;

    if (isOpen && overlay && dialog) {
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline();

      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 }).fromTo(
        dialog,
        {
          opacity: 0,
          scale: 0.95,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.1",
      );
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = async () => {
    const tl = gsap.timeline();

    await tl
      .to(dialogRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.3,
        ease: "power3.in",
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
      });

    onClose();
  };

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
