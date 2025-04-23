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
} as const;

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20"
    >
      <div className="w-full max-w-7xl mx-auto relative">
        <div
          ref={cardRef}
          className="relative rounded-3xl p-6 md:p-8 lg:p-12
          bg-secondary/80 backdrop-blur-sm border border-neutral/30 z-10
          shadow-xl shadow-gray-950/20 transform-gpu"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-70 pointer-events-none -z-1" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 h-full justify-center items-center">
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
