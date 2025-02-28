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
    EASE: "power2.out",
    OPACITY: {
      NORMAL: 1,
      HOVER: 0.9
    }
  },
  ICON: {
    DURATION: 0.3,
    EASE: "power2.inOut"
  },
  SHINE: {
    DURATION: 0.7,
    EASE: "power2.inOut"
  }
} as const;

const DialogActions = ({ onClose, isEmailCopied }: DialogActionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsButtonRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const hoverGradientRef = useRef<HTMLDivElement>(null);
  const chevronIconWrapperRef = useRef<HTMLDivElement>(null);
  const closeIconWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !projectsButtonRef.current || !closeButtonRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([projectsButtonRef.current, closeButtonRef.current], {
        opacity: 0,
        y: ANIMATION_CONFIG.BUTTONS.Y_OFFSET,
        scale: ANIMATION_CONFIG.BUTTONS.SCALE.START,
        force3D: true
      });

      gsap.to([projectsButtonRef.current, closeButtonRef.current], {
        opacity: 1,
        y: 0,
        scale: ANIMATION_CONFIG.BUTTONS.SCALE.END,
        duration: ANIMATION_CONFIG.BUTTONS.DURATION,
        stagger: ANIMATION_CONFIG.BUTTONS.STAGGER,
        delay: ANIMATION_CONFIG.BUTTONS.DELAY,
        ease: ANIMATION_CONFIG.BUTTONS.EASE,
        force3D: true
      });
    });

    return () => ctx.revert();
  }, []);

  const handleProjectsButtonHover = (isEntering: boolean) => {
    if (!projectsButtonRef.current || !shineRef.current || !chevronIconWrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(projectsButtonRef.current, {
        scale: isEntering ? ANIMATION_CONFIG.HOVER.SCALE : 1,
        opacity: isEntering ? ANIMATION_CONFIG.HOVER.OPACITY.HOVER : ANIMATION_CONFIG.HOVER.OPACITY.NORMAL,
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE,
        force3D: true
      });

      gsap.to(chevronIconWrapperRef.current, {
        x: isEntering ? 4 : 0,
        duration: ANIMATION_CONFIG.ICON.DURATION,
        ease: ANIMATION_CONFIG.ICON.EASE
      });

      if (isEntering) {
        gsap.fromTo(shineRef.current,
          { x: "-100%" },
          {
            x: "100%",
            duration: ANIMATION_CONFIG.SHINE.DURATION,
            ease: ANIMATION_CONFIG.SHINE.EASE
          }
        );
      }
    });

    return () => ctx.revert();
  };

  const handleCloseButtonHover = (isEntering: boolean) => {
    if (!closeButtonRef.current || !hoverGradientRef.current || !closeIconWrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(closeButtonRef.current, {
        scale: isEntering ? ANIMATION_CONFIG.HOVER.SCALE : 1,
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE,
        force3D: true
      });

      gsap.to(hoverGradientRef.current, {
        opacity: isEntering ? 1 : 0,
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE
      });

      if (!isEmailCopied) {
        gsap.to(closeIconWrapperRef.current, {
          rotation: isEntering ? 90 : 0,
          duration: ANIMATION_CONFIG.ICON.DURATION,
          ease: ANIMATION_CONFIG.ICON.EASE
        });
      }
    });

    return () => ctx.revert();
  };

  return (
    <div
      ref={containerRef}
      className="px-6 py-4 sm:px-8 bg-gray-900/30 backdrop-blur-sm border-t border-primary/20
        flex flex-col sm:flex-row-reverse gap-3 sm:gap-4"
    >
      <Link
        ref={projectsButtonRef}
        href="#projects"
        className="inline-flex justify-center items-center px-6 py-3 rounded-xl
          bg-primary text-secondary font-medium shadow-lg focus:outline-none focus:ring-2 
          focus:ring-primary/50 relative overflow-hidden"
        onClick={onClose}
        onMouseEnter={() => handleProjectsButtonHover(true)}
        onMouseLeave={() => handleProjectsButtonHover(false)}
      >
        <span className="relative z-10">View Projects</span>
        <div ref={chevronIconWrapperRef} className="inline-flex ml-2">
          <FiChevronRight className="w-5 h-5" />
        </div>
        
        <div 
          ref={shineRef}
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        />
      </Link>

      <button
        ref={closeButtonRef}
        type="button"
        className="inline-flex justify-center items-center px-6 py-3 rounded-xl
          border border-primary/20 text-gray-300 font-medium shadow-lg focus:outline-none 
          focus:ring-2 focus:ring-primary/50 relative overflow-hidden backdrop-blur-sm"
        onClick={onClose}
        onMouseEnter={() => handleCloseButtonHover(true)}
        onMouseLeave={() => handleCloseButtonHover(false)}
      >
        {isEmailCopied ? (
          <>
            <FiCheck className="w-5 h-5 mr-2 text-primary" />
            <span className="relative z-10">Copied!</span>
          </>
        ) : (
          <>
            <span className="relative z-10">Close</span>
            <div ref={closeIconWrapperRef} className="inline-flex ml-2">
              <FiX className="w-5 h-5" />
            </div>
          </>
        )}
        
        <div 
          ref={hoverGradientRef}
          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0"
        />
      </button>
    </div>
  );
};

export default DialogActions;
