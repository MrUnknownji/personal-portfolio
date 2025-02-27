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
  const bgBlobsRef = useRef<HTMLDivElement>(null);

  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !contentRef.current || !bgPatternRef.current || !bgBlobsRef.current) return;

    const contentElements = contentRef.current.children;
    const blobs = bgBlobsRef.current.children;

    // Create ScrollTrigger for the section
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: ANIMATION_CONFIG.SECTION.TRIGGER_START,
      end: ANIMATION_CONFIG.SECTION.TRIGGER_END,
      onEnter: () => {
        // Animate background elements
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
          blobs,
          { 
            opacity: 0,
            scale: 0.8
          },
          {
            opacity: ANIMATION_CONFIG.BACKGROUND.OPACITY.END,
            scale: 1,
            duration: ANIMATION_CONFIG.BACKGROUND.DURATION,
            stagger: 0.2,
            ease: ANIMATION_CONFIG.BACKGROUND.EASE
          }
        );

        // Animate content elements
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
      className="py-20 sm:py-24 lg:py-32 about-me relative overflow-hidden"
    >
      {/* Background pattern */}
      <div 
        ref={bgPatternRef}
        className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-0"
        style={{ willChange: "opacity" }}
      />

      {/* Background blobs */}
      <div ref={bgBlobsRef} className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-0"
          style={{ willChange: "transform, opacity" }}
        />
        <div 
          className="absolute bottom-0 -right-4 w-72 h-72 bg-accent/30 rounded-full filter blur-3xl opacity-0"
          style={{ willChange: "transform, opacity" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={contentRef} 
          className="space-y-12 lg:space-y-16"
          style={{ willChange: "transform" }}
        >
          <Title />
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            <div className="w-full lg:w-2/5">
              <div className="lg:sticky lg:top-24 lg:pt-2">
                <ImageSection />
              </div>
            </div>
            <div className="w-full lg:w-3/5 space-y-12 lg:space-y-16">
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
