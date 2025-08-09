"use client";
import { useRef } from "react";
import gsap from "gsap";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";
import { useGSAP } from "@gsap/react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const card = cardRef.current;
      if (!section || !card) return;

      gsap.from(card, {
        scale: 0.9,
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      const xTo = gsap.quickTo(card, "x", { duration: 0.8, ease: "power3" });
      const yTo = gsap.quickTo(card, "y", { duration: 0.8, ease: "power3" });
      const rotateXTo = gsap.quickTo(card, "rotationX", {
        duration: 0.8,
        ease: "power3",
      });
      const rotateYTo = gsap.quickTo(card, "rotationY", {
        duration: 0.8,
        ease: "power3",
      });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = section.getBoundingClientRect();

        const x = clientX - left;
        const y = clientY - top;

        const xPercent = x / width - 0.5;
        const yPercent = y / height - 0.5;

        xTo(xPercent * 30);
        yTo(yPercent * 20);
        rotateXTo(yPercent * -10);
        rotateYTo(xPercent * 10);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
        rotateXTo(0);
        rotateYTo(0);
      };

      section.addEventListener("mousemove", handleMouseMove);
      section.addEventListener("mouseleave", handleMouseLeave);
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20"
      style={{ perspective: "2000px" }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-7xl mx-auto relative rounded-3xl p-6 md:p-8 lg:p-12
                   bg-secondary/80 backdrop-blur-md border border-neutral/30 z-10
                   shadow-2xl shadow-black/40 transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-70 pointer-events-none -z-1 rounded-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 h-full justify-center items-center">
          <div className="z-10 w-full h-full">
            <HeroContent />
          </div>
          <div className="z-1 w-full lg:block hidden">
            <CodeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
