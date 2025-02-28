"use client";
import React, { useRef, useCallback } from "react";
import { FiMail, FiCopy } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface DialogContentProps {
  email: string;
  onCopy: () => void;
}

const ANIMATION_CONFIG = {
  ICON: {
    DURATION: 0.5,
    EASE: "back.out(1.7)",
    SCALE: {
      START: 0,
      END: 1
    },
    ROTATE: {
      START: -180,
      END: 0
    },
    HOVER: {
      DURATION: 0.3,
      ROTATE: 12,
      EASE: "power2.out"
    }
  },
  CONTENT: {
    DURATION: 0.4,
    STAGGER: 0.08,
    Y_OFFSET: 20,
    EASE: "power2.out"
  },
  BUTTON: {
    DURATION: 0.4,
    EASE: "power2.out",
    HOVER: {
      DURATION: 0.2,
      SCALE: 1.02,
      OPACITY: 0.9
    }
  },
  SHINE: {
    DURATION: 0.7,
    EASE: "power2.inOut"
  }
} as const;

const DialogContent = ({ email, onCopy }: DialogContentProps) => {
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const mailIconWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const copyIconWrapperRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!iconWrapperRef.current || !contentRef.current || !buttonRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([iconWrapperRef.current, contentRef.current.querySelectorAll(".animate-content"), buttonRef.current], {
        opacity: 0,
        force3D: true
      });
      
      gsap.set(iconWrapperRef.current, {
        scale: ANIMATION_CONFIG.ICON.SCALE.START,
        rotate: ANIMATION_CONFIG.ICON.ROTATE.START,
        force3D: true
      });
      
      gsap.set([contentRef.current.querySelectorAll(".animate-content"), buttonRef.current], {
        y: ANIMATION_CONFIG.CONTENT.Y_OFFSET,
        force3D: true
      });

      const timeline = gsap.timeline();

      timeline
        .to(iconWrapperRef.current, {
          scale: ANIMATION_CONFIG.ICON.SCALE.END,
          rotate: ANIMATION_CONFIG.ICON.ROTATE.END,
          opacity: 1,
          duration: ANIMATION_CONFIG.ICON.DURATION,
          ease: ANIMATION_CONFIG.ICON.EASE,
          force3D: true
        })
        .to(contentRef.current.querySelectorAll(".animate-content"), {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.CONTENT.DURATION,
          stagger: ANIMATION_CONFIG.CONTENT.STAGGER,
          ease: ANIMATION_CONFIG.CONTENT.EASE,
          force3D: true
        }, "-=0.2")
        .to(buttonRef.current, {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.BUTTON.DURATION,
          ease: ANIMATION_CONFIG.BUTTON.EASE,
          force3D: true
        }, "-=0.2");
    });

    return () => ctx.revert();
  }, []);

  const handleIconHover = useCallback((isEntering: boolean) => {
    if (!mailIconWrapperRef.current) return;

    gsap.to(mailIconWrapperRef.current, {
      rotate: isEntering ? ANIMATION_CONFIG.ICON.HOVER.ROTATE : 0,
      duration: ANIMATION_CONFIG.ICON.HOVER.DURATION,
      ease: ANIMATION_CONFIG.ICON.HOVER.EASE
    });
  }, []);

  const handleButtonHover = useCallback((isEntering: boolean) => {
    if (!buttonRef.current || !copyIconWrapperRef.current || !shineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(buttonRef.current, {
        scale: isEntering ? ANIMATION_CONFIG.BUTTON.HOVER.SCALE : 1,
        opacity: isEntering ? ANIMATION_CONFIG.BUTTON.HOVER.OPACITY : 1,
        duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
        ease: ANIMATION_CONFIG.BUTTON.EASE,
        force3D: true
      });

      gsap.to(copyIconWrapperRef.current, {
        rotate: isEntering ? ANIMATION_CONFIG.ICON.HOVER.ROTATE : 0,
        duration: ANIMATION_CONFIG.ICON.HOVER.DURATION,
        ease: ANIMATION_CONFIG.ICON.HOVER.EASE
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
  }, []);

  return (
    <div ref={contentRef} className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-center">
        <div 
          ref={iconWrapperRef}
          className="p-4 bg-primary/10 rounded-2xl"
          onMouseEnter={() => handleIconHover(true)}
          onMouseLeave={() => handleIconHover(false)}
        >
          <div ref={mailIconWrapperRef} className="inline-flex">
            <FiMail className="w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      <div className="space-y-3 text-center">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-content">
          Thank You for Reaching Out!
        </h3>
        <p className="text-gray-400 animate-content">
          I'll get back to you as soon as possible. In the meantime, you can copy my email address below:
        </p>
      </div>

      <div className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm animate-content">
        <p className="text-center text-primary font-medium break-all">
          {email}
        </p>
      </div>

      <button
        ref={buttonRef}
        onClick={onCopy}
        onMouseEnter={() => handleButtonHover(true)}
        onMouseLeave={() => handleButtonHover(false)}
        className="w-full py-3 px-4 bg-primary text-secondary rounded-xl relative overflow-hidden"
      >
        <span className="font-medium relative z-10">Copy to Clipboard</span>
        <div ref={copyIconWrapperRef} className="inline-flex ml-2">
          <FiCopy className="w-4 h-4" />
        </div>
        
        <div 
          ref={shineRef}
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        />
      </button>
    </div>
  );
};

export default DialogContent;
