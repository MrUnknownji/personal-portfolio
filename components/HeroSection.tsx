"use client";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);



  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20 overflow-hidden"
      style={{ perspective: "2000px" }}
    >
      {/* Ambient Background Effects (Synced with Projects Page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-60 right-1/3 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-1/3 w-[300px] h-[300px] bg-accent/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Main Content Card */}
      <div
        ref={contentWrapperRef}
        className="w-full max-w-7xl mx-auto relative rounded-3xl p-8 md:p-10 lg:p-16
                   bg-card/95 z-10
                   border border-border
                   transform-gpu"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 h-full justify-center items-center">
          <div className="z-10 w-full h-full lg:w-1/2">
            <HeroContent />
          </div>
          <div className="z-1 w-full lg:w-1/2 lg:block hidden" style={{ transform: "translateZ(50px)" }}>
            <CodeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
