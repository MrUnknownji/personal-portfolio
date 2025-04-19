"use client";
import { useRef } from "react";
import gsap from "gsap";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  HERO: {
    INITIAL_SCALE: 0.95,
    INITIAL_Y: 30,
    DURATION: 1,
    EASE: "power3.out",
  },
  BORDER: {
    DURATION: 3,
    GRADIENT_POSITIONS: {
      START: "0%",
      PEAK: "50%",
      END: "100%",
    },
  },
} as const;

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        cardRef.current,
        {
          scale: ANIMATION_CONFIG.HERO.INITIAL_SCALE,
          opacity: 0,
          y: ANIMATION_CONFIG.HERO.INITIAL_Y,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.HERO.DURATION,
          ease: ANIMATION_CONFIG.HERO.EASE,
          clearProps: "scale,opacity,y,transform",
          force3D: true,
        },
      );

      gsap.to(borderRef.current, {
        backgroundPosition: "200% 0",
        duration: ANIMATION_CONFIG.BORDER.DURATION,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20"
    >
      <div className="w-full max-w-7xl mx-auto relative">
        <div className="absolute -inset-[1px] rounded-3xl overflow-hidden z-1">
          <div
            ref={borderRef}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                  90deg,
                  transparent ${ANIMATION_CONFIG.BORDER.GRADIENT_POSITIONS.START},
                  rgba(79, 209, 197, 0.2) 25%,
                  rgba(79, 209, 197, 0.5) ${ANIMATION_CONFIG.BORDER.GRADIENT_POSITIONS.PEAK},
                  rgba(79, 209, 197, 0.2) 75%,
                  transparent ${ANIMATION_CONFIG.BORDER.GRADIENT_POSITIONS.END}
                )`,
              backgroundSize: "200% 100%",
              willChange: "background-position", // Hint for background animation
            }}
          />
        </div>

        <div
          ref={cardRef}
          className="relative rounded-3xl p-6 md:p-8 lg:p-12
              bg-gray-900/85 border border-gray-800/50 z-10
              shadow-xl shadow-gray-950/20 transform-gpu"
        >
          <div className="relative flex flex-col lg:flex-row gap-8 h-full justify-center items-center">
            <div className="z-10 w-full h-full">
              <HeroContent />
            </div>
            <div className="z-1 w-full lg:block hidden">
              <CodeDisplay />
            </div>
          </div>

          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
