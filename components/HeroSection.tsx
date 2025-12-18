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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !contentWrapperRef.current) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPos = (clientX / innerWidth - 0.5);
    const yPos = (clientY / innerHeight - 0.5);

    // Subtle 3D Tilt for Content Wrapper
    gsap.to(contentWrapperRef.current, {
      rotateY: xPos * 2, // Very subtle rotation
      rotateX: -yPos * 2,
      duration: 1,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20 overflow-hidden"
      style={{ perspective: "2000px" }}
      onMouseMove={handleMouseMove}
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('/grid.svg')]" />

      {/* Radial Gradient Removed to prevent banding artifacts */}
      <div className="absolute inset-0 bg-background/50 z-0 pointer-events-none" />

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
