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
  BUTTONS: {
    DURATION: 0.4,
    STAGGER: 0.1,
    DELAY: 0.2,
    Y_OFFSET: 20,
    SCALE: {
      START: 0.95,
      END: 1
    },
    EASE: "power2.out"
  },
  HOVER: {
    DURATION: 0.2,
    SCALE: 1.02,
    EASE: "power2.out"
  }
} as const;

const DialogActions = ({ onClose, isEmailCopied }: DialogActionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsButtonRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current || !projectsButtonRef.current || !closeButtonRef.current) return;

    // Initial setup
    gsap.set([projectsButtonRef.current, closeButtonRef.current], {
      opacity: 0,
      y: ANIMATION_CONFIG.BUTTONS.Y_OFFSET,
      scale: ANIMATION_CONFIG.BUTTONS.SCALE.START
    });

    gsap.to([projectsButtonRef.current, closeButtonRef.current], {
      opacity: 1,
      y: 0,
      scale: ANIMATION_CONFIG.BUTTONS.SCALE.END,
      duration: ANIMATION_CONFIG.BUTTONS.DURATION,
      stagger: ANIMATION_CONFIG.BUTTONS.STAGGER,
      delay: ANIMATION_CONFIG.BUTTONS.DELAY,
      ease: ANIMATION_CONFIG.BUTTONS.EASE,
      clearProps: "transform"
    });
  }, []);

  const handleButtonHover = (element: HTMLElement, isEntering: boolean) => {
    gsap.to(element, {
      scale: isEntering ? ANIMATION_CONFIG.HOVER.SCALE : 1,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE
    });
  };

  return (
    <div
      ref={containerRef}
      className="px-6 py-4 sm:px-8 bg-gray-900/30 backdrop-blur-sm border-t border-primary/20
        flex flex-col sm:flex-row-reverse gap-3 sm:gap-4"
      style={{ willChange: "transform" }}
    >
      <Link
        ref={projectsButtonRef}
        href="#projects"
        className="inline-flex justify-center items-center px-6 py-3 rounded-xl
          bg-primary text-secondary font-medium shadow-lg
          hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
          transition-all duration-300 group relative overflow-hidden"
        onClick={onClose}
        onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
        onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
        style={{ willChange: "transform" }}
      >
        <span className="relative z-10">View Projects</span>
        <FiChevronRight 
          className="w-5 h-5 ml-2 transform transition-transform duration-300 
            group-hover:translate-x-1"
          style={{ willChange: "transform" }}
        />
        
        {/* Shine effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          style={{ 
            transform: "translateX(-100%)",
            willChange: "transform",
            transition: "transform 700ms ease"
          }}
        />
      </Link>

      <button
        ref={closeButtonRef}
        type="button"
        className="inline-flex justify-center items-center px-6 py-3 rounded-xl
          border border-primary/20 text-gray-300 font-medium shadow-lg
          hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50
          transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
        onClick={onClose}
        onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
        onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
        style={{ willChange: "transform" }}
      >
        {isEmailCopied ? (
          <>
            <FiCheck 
              className="w-5 h-5 mr-2 text-primary"
              style={{ willChange: "transform" }}
            />
            <span className="relative z-10">Copied!</span>
          </>
        ) : (
          <>
            <span className="relative z-10">Close</span>
            <FiX 
              className="w-5 h-5 ml-2 transform transition-transform duration-300 
                group-hover:rotate-90"
              style={{ willChange: "transform" }}
            />
          </>
        )}
        
        {/* Hover gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0"
          style={{ 
            opacity: 0,
            willChange: "opacity",
            transition: "opacity 300ms ease"
          }}
        />
      </button>
    </div>
  );
};

export default DialogActions;
