"use client";
import React, { useRef, useCallback } from "react";
import { FiMail, FiCopy, FiCheck } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface DialogContentProps {
  email: string;
  onCopy: () => void;
  isCopied: boolean;
}

const ANIMATION_CONFIG = {
  ENTRANCE_ICON: {
    DURATION: 0.6,
    EASE: "back.out(1.7)",
    SCALE: 0,
    ROTATE: -180,
  },
  ENTRANCE_CONTENT: {
    DURATION: 0.5,
    STAGGER: 0.08,
    Y_OFFSET: 20,
    EASE: "power2.out",
  },
} as const;

const DialogContent = ({ email, onCopy, isCopied }: DialogContentProps) => {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const mailIconRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        onCopy(); // Notify parent
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        try {
          const tempInput = document.createElement("input");
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          onCopy();
        } catch (copyErr) {
          console.error("Fallback copy failed: ", copyErr);
        }
      });
  }, [email, onCopy]);

  useGSAP(
    () => {
      if (
        !iconWrapperRef.current ||
        !contentWrapperRef.current ||
        !buttonRef.current
      )
        return;

      const contentElements = gsap.utils.toArray<HTMLElement>(
        contentWrapperRef.current.querySelectorAll(".animate-content"),
      );

      gsap.set(iconWrapperRef.current, {
        opacity: 0,
        scale: ANIMATION_CONFIG.ENTRANCE_ICON.SCALE,
        rotate: ANIMATION_CONFIG.ENTRANCE_ICON.ROTATE,
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.set([contentElements, buttonRef.current], {
        opacity: 0,
        y: ANIMATION_CONFIG.ENTRANCE_CONTENT.Y_OFFSET,
        force3D: true,
        willChange: "transform, opacity",
      });

      const timeline = gsap.timeline({ defaults: { force3D: true } });

      timeline
        .to(iconWrapperRef.current, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: ANIMATION_CONFIG.ENTRANCE_ICON.DURATION,
          ease: ANIMATION_CONFIG.ENTRANCE_ICON.EASE,
          clearProps: "all",
        })
        .to(
          contentElements,
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.ENTRANCE_CONTENT.DURATION,
            stagger: ANIMATION_CONFIG.ENTRANCE_CONTENT.STAGGER,
            ease: ANIMATION_CONFIG.ENTRANCE_CONTENT.EASE,
            clearProps: "transform, opacity, willChange",
          },
          "-=0.3",
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.ENTRANCE_CONTENT.DURATION,
            ease: ANIMATION_CONFIG.ENTRANCE_CONTENT.EASE,
            clearProps: "all",
          },
          "-=0.2",
        );
    },
    { scope: contentWrapperRef },
  );

  return (
    <div ref={contentWrapperRef} className="p-6 sm:p-8 space-y-6">
      {/* Icon */}
      <div className="flex items-center justify-center">
        <div
          ref={iconWrapperRef}
          className="group p-4 bg-primary/10 rounded-2xl inline-block"
        >
          <div
            ref={mailIconRef}
            className="inline-flex transform-gpu transition-transform duration-300 ease-out
                                 group-hover:rotate-12"
          >
            <FiMail className="w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-3 text-center">
        <h3 className="animate-content text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Thank You for Reaching Out!
        </h3>
        <p className="animate-content text-muted">
          Your message is on its way. You can also copy my email address below:
        </p>
      </div>

      {/* Email Display */}
      <div className="animate-content bg-neutral/30 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-center text-primary font-medium break-all select-all">
          {email}
        </p>
      </div>

      {/* Copy Button */}
      <button
        ref={buttonRef}
        onClick={handleCopyClick}
        disabled={isCopied}
        className="group w-full py-3 px-4 bg-primary text-secondary rounded-xl relative overflow-hidden transform-gpu
                 flex items-center justify-center gap-2 transition-all duration-300 ease-out focus:outline-none
                 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary/50
                 hover:scale-[1.02] hover:bg-opacity-90 hover:shadow-md hover:shadow-primary/20
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
      >
        {isCopied ? (
          <>
            <FiCheck className="w-5 h-5" />
            <span className="font-medium">Copied!</span>
          </>
        ) : (
          <>
            <span className="font-medium">Copy to Clipboard</span>
            <FiCopy
              className="w-4 h-4 transition-transform duration-300 ease-out
                                   group-hover:rotate-12"
            />
          </>
        )}
      </button>
    </div>
  );
};

export default DialogContent;
