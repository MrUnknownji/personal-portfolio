"use client";
import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./AboutMeSectionComponents/Title";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  SECTION: {
    DURATION: 0.6,
    EASE: "power2.out",
    TRIGGER_START: "top 80%",
    TRIGGER_END: "bottom 20%"
  },
  CONTENT: {
    STAGGER: 0.15,
    DURATION: 0.8,
    Y_OFFSET: 50,
    EASE: "power3.out"
  },
  BACKGROUND: {
    DURATION: 1,
    EASE: "power2.inOut",
    OPACITY: {
      START: 0,
      END: 0.2
    }
  }
} as const;

const AboutMe = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);

  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !contentRef.current || !bgPatternRef.current) return;

    const contentElements = contentRef.current.children;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: ANIMATION_CONFIG.SECTION.TRIGGER_START,
      end: ANIMATION_CONFIG.SECTION.TRIGGER_END,
      onEnter: () => {
        gsap.fromTo(
          bgPatternRef.current,
          { opacity: 0 },
          { 
            opacity: ANIMATION_CONFIG.BACKGROUND.OPACITY.END, 
            duration: ANIMATION_CONFIG.BACKGROUND.DURATION,
            ease: ANIMATION_CONFIG.BACKGROUND.EASE
          }
        );

        gsap.fromTo(
          contentElements,
          { 
            opacity: 0, 
            y: ANIMATION_CONFIG.CONTENT.Y_OFFSET 
          },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.CONTENT.DURATION,
            stagger: ANIMATION_CONFIG.CONTENT.STAGGER,
            ease: ANIMATION_CONFIG.CONTENT.EASE,
            clearProps: "transform"
          }
        );
      },
      once: true
    });
  }, []);

  useGSAP(() => {
    setupAnimations();
  }, [setupAnimations]);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-32 about-me relative"
    >
      <div 
        ref={bgPatternRef}
        className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-0"
        style={{ willChange: "opacity" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={contentRef} 
          className="space-y-12 lg:space-y-16"
          style={{ willChange: "transform" }}
        >
          <Title />
          
          {/* First row: Image and Journey side by side on medium/large screens */}
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="w-full md:w-2/5">
              <ImageSection />
            </div>
            <div className="w-full md:w-3/5">
              <JourneySection />
            </div>
          </div>
          
          {/* Second row: Skills section takes full width */}
          <div className="w-full">
            <SkillsSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
