"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronRight, FiX, FiCheck } from "react-icons/fi";
import gsap from "gsap";

interface DialogActionsProps {
  onClose: () => void;
  isEmailCopied?: boolean;
}

const ANIMATION_CONFIG = {
  BUTTONS_ENTRANCE: {
    DURATION: 0.4,
    STAGGER: 0.1,
    DELAY: 0.2,
    Y_OFFSET: 20,
    SCALE: 0.95,
    EASE: "power2.out",
  },
} as const;

const DialogActions = ({ onClose, isEmailCopied }: DialogActionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsButtonRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const buttons = [projectsButtonRef.current, closeButtonRef.current].filter(
      Boolean,
    ) as HTMLElement[];
    if (buttons.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(buttons, {
        opacity: 0,
        y: ANIMATION_CONFIG.BUTTONS_ENTRANCE.Y_OFFSET,
        scale: ANIMATION_CONFIG.BUTTONS_ENTRANCE.SCALE,
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.to(buttons, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.BUTTONS_ENTRANCE.DURATION,
        stagger: ANIMATION_CONFIG.BUTTONS_ENTRANCE.STAGGER,
        delay: ANIMATION_CONFIG.BUTTONS_ENTRANCE.DELAY,
        ease: ANIMATION_CONFIG.BUTTONS_ENTRANCE.EASE,
        clearProps: "all",
        force3D: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="px-6 py-4 sm:px-8 bg-secondary/50 backdrop-blur-sm border-t border-primary/20
        flex flex-col sm:flex-row-reverse gap-3 sm:gap-4"
    >
      {/* View Projects Button */}
      <Link
        ref={projectsButtonRef}
        href="#projects"
        className="group inline-flex justify-center items-center px-6 py-3 rounded-xl
          bg-primary text-secondary font-medium shadow-lg focus:outline-none focus:ring-2
          focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary/50
          relative overflow-hidden transform-gpu transition-all duration-300 ease-out
          hover:scale-[1.03] hover:shadow-primary/30 hover:bg-opacity-90"
        onClick={onClose}
      >
        <span className="relative z-10">View Projects</span>
        <FiChevronRight
          className="w-5 h-5 ml-2 transition-transform duration-300 ease-out
                             group-hover:translate-x-1"
        />
        {/* Subtle shine effect with pseudo-element */}
        <span
          className="absolute inset-0 block w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out
                   transform -translate-x-full group-hover:translate-x-full"
          aria-hidden="true"
        />
      </Link>

      {/* Close Button */}
      <button
        ref={closeButtonRef}
        type="button"
        className="group inline-flex justify-center items-center px-6 py-3 rounded-xl
          border border-primary/20 text-light font-medium shadow-sm focus:outline-none
          focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary/50
          bg-neutral/30 backdrop-blur-sm transform-gpu transition-all duration-300 ease-out
          hover:scale-[1.03] hover:border-primary/40 hover:bg-neutral/50"
        onClick={onClose}
      >
        {isEmailCopied ? (
          <>
            <FiCheck className="w-5 h-5 mr-2 text-primary" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <span>Close</span>
            <FiX
              className={`w-5 h-5 ml-2 transition-transform duration-300 ease-out
                      ${isEmailCopied ? "" : "group-hover:rotate-90"}`}
            />
          </>
        )}
      </button>
    </div>
  );
};

export default DialogActions;
