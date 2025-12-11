"use client";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgGlow1Ref = useRef<HTMLDivElement>(null);
  const bgGlow2Ref = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bgGlow1Ref.current || !bgGlow2Ref.current) return;

    // Parallax effect on background glows (Scroll based)
    gsap.to(bgGlow1Ref.current, {
      y: 150,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(bgGlow2Ref.current, {
      y: -100,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5
      }
    });
  }, { scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !bgGlow1Ref.current || !bgGlow2Ref.current || !contentWrapperRef.current) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPos = (clientX / innerWidth - 0.5);
    const yPos = (clientY / innerHeight - 0.5);

    // Animate Background Glows
    gsap.to(bgGlow1Ref.current, {
      x: xPos * 50,
      y: yPos * 50,
      duration: 2,
      ease: "power2.out",
    });

    gsap.to(bgGlow2Ref.current, {
      x: -xPos * 50,
      y: -yPos * 50,
      duration: 2,
      ease: "power2.out",
    });

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
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20 overflow-hidden bg-[#050505]"
      style={{ perspective: "2000px" }}
      onMouseMove={handleMouseMove}
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-0 pointer-events-none" />

      {/* Animated Background Glows */}
      <div ref={bgGlow1Ref} className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-pulse-slow" />
      <div ref={bgGlow2Ref} className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-pulse-slow delay-1000" />

      {/* Main Content Card */}
      <div
        ref={contentWrapperRef}
        className="w-full max-w-7xl mx-auto relative rounded-3xl p-8 md:p-10 lg:p-16
                   bg-white/[0.01] backdrop-blur-2xl z-10
                   shadow-[0_0_100px_-30px_rgba(0,0,0,0.5)] border border-white/[0.05]
                   transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glass Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none rounded-3xl" />

        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-30 pointer-events-none rounded-3xl" />

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
