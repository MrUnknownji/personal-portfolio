"use client";
import React, { useRef } from "react";
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
      SCALE: 1.02
    }
  }
} as const;

const DialogContent = ({ email, onCopy }: DialogContentProps) => {
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!iconWrapperRef.current || !contentRef.current || !buttonRef.current) return;

    // Initial setup
    gsap.set([iconWrapperRef.current, contentRef.current.querySelectorAll(".animate-content"), buttonRef.current], {
      opacity: 0
    });
    gsap.set(iconWrapperRef.current, {
      scale: ANIMATION_CONFIG.ICON.SCALE.START,
      rotate: ANIMATION_CONFIG.ICON.ROTATE.START
    });
    gsap.set([contentRef.current.querySelectorAll(".animate-content"), buttonRef.current], {
      y: ANIMATION_CONFIG.CONTENT.Y_OFFSET
    });

    const timeline = gsap.timeline();

    timeline
      .to(iconWrapperRef.current, {
        scale: ANIMATION_CONFIG.ICON.SCALE.END,
        rotate: ANIMATION_CONFIG.ICON.ROTATE.END,
        opacity: 1,
        duration: ANIMATION_CONFIG.ICON.DURATION,
        ease: ANIMATION_CONFIG.ICON.EASE,
        clearProps: "transform"
      })
      .to(contentRef.current.querySelectorAll(".animate-content"), {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.CONTENT.DURATION,
        stagger: ANIMATION_CONFIG.CONTENT.STAGGER,
        ease: ANIMATION_CONFIG.CONTENT.EASE,
        clearProps: "transform"
      }, "-=0.2")
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.BUTTON.DURATION,
        ease: ANIMATION_CONFIG.BUTTON.EASE,
        clearProps: "transform"
      }, "-=0.2");

    return () => timeline.kill();
  }, { scope: contentRef });

  const handleButtonHover = (isEntering: boolean) => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      scale: isEntering ? ANIMATION_CONFIG.BUTTON.HOVER.SCALE : 1,
      duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
      ease: ANIMATION_CONFIG.BUTTON.EASE
    });
  };

  return (
    <div 
      ref={contentRef} 
      className="p-6 sm:p-8 space-y-6"
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center justify-center">
        <div 
          ref={iconWrapperRef}
          className="p-4 bg-primary/10 rounded-2xl group transition-transform duration-300"
          style={{ willChange: "transform" }}
        >
          <FiMail 
            className="w-12 h-12 text-primary transform transition-transform duration-300 group-hover:rotate-12"
            style={{ willChange: "transform" }}
          />
        </div>
      </div>

      <div className="space-y-3 text-center">
        <h3 
          className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-content"
          style={{ willChange: "transform" }}
        >
          Thank You for Reaching Out!
        </h3>
        <p 
          className="text-gray-400 animate-content"
          style={{ willChange: "transform" }}
        >
          I'll get back to you as soon as possible. In the meantime, you can copy my email address below:
        </p>
      </div>

      <div 
        className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm animate-content"
        style={{ willChange: "transform" }}
      >
        <p className="text-center text-primary font-medium break-all">
          {email}
        </p>
      </div>

      <button
        ref={buttonRef}
        onClick={onCopy}
        onMouseEnter={() => handleButtonHover(true)}
        onMouseLeave={() => handleButtonHover(false)}
        className="w-full py-3 px-4 bg-primary text-secondary rounded-xl hover:bg-primary/90 
          transition-colors flex items-center justify-center gap-2 group relative overflow-hidden"
        style={{ willChange: "transform" }}
      >
        <span className="font-medium relative z-10">Copy to Clipboard</span>
        <FiCopy 
          className="w-4 h-4 transform transition-transform duration-300 group-hover:rotate-12"
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
      </button>
    </div>
  );
};

export default DialogContent;
