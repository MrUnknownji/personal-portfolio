"use client";
import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./AboutMeSectionComponents/Title";

const ANIMATION_CONFIG = {
  SECTION: {
    DURATION: 0.5,
    EASE: "power3.out"
  },
  CONTENT: {
    STAGGER: 0.2,
    DURATION: 0.8,
    Y_OFFSET: 30,
    EASE: "power3.out"
  }
} as const;

const AboutMe = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const contentElements = contentRef.current.children;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: ANIMATION_CONFIG.SECTION.DURATION,
        ease: ANIMATION_CONFIG.SECTION.EASE,
        clearProps: "opacity"
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
        clearProps: "all"
      }
    );
  }, []);

  useGSAP(() => {
    setupAnimations();
  }, [setupAnimations]);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-32 about-me relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-accent/30 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="space-y-12 lg:space-y-20">
          <Title />
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
            <div className="w-full lg:w-2/5 lg:sticky lg:top-24">
              <ImageSection />
            </div>
            <div className="w-full lg:w-3/5 space-y-12 lg:space-y-20">
              <JourneySection />
              <SkillsSection />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
