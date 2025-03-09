"use client";
import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./ui/Title";

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
  },
  PARALLAX: {
    SPEED: 0.1,
    EASE: "none"
  }
} as const;

const AboutMe = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const journeyContainerRef = useRef<HTMLDivElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);

  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !contentRef.current || !bgPatternRef.current) return;
    
    // Main section animation with reverse
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: ANIMATION_CONFIG.SECTION.TRIGGER_START,
        end: ANIMATION_CONFIG.SECTION.TRIGGER_END,
        toggleActions: "play pause reverse reset", // This enables reverse animation
        markers: false
      }
    });

    mainTl.fromTo(
      bgPatternRef.current,
      { opacity: 0 },
      { 
        opacity: ANIMATION_CONFIG.BACKGROUND.OPACITY.END, 
        duration: ANIMATION_CONFIG.BACKGROUND.DURATION,
        ease: ANIMATION_CONFIG.BACKGROUND.EASE
      }
    );

    // Staggered content animation
    if (titleRef.current) {
      mainTl.fromTo(
        titleRef.current,
        { 
          opacity: 0, 
          y: ANIMATION_CONFIG.CONTENT.Y_OFFSET 
        },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.CONTENT.DURATION,
          ease: ANIMATION_CONFIG.CONTENT.EASE
        },
        "-=0.5"
      );
    }

    // Create parallax effects for each section
    if (imageContainerRef.current) {
      ScrollTrigger.create({
        trigger: imageContainerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          gsap.to(imageContainerRef.current, {
            y: self.progress * -30, // Move up slightly as we scroll down
            duration: 0.1,
            ease: "none",
            overwrite: "auto"
          });
        }
      });
    }

    if (journeyContainerRef.current) {
      ScrollTrigger.create({
        trigger: journeyContainerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          gsap.to(journeyContainerRef.current, {
            y: self.progress * -40, // Move up slightly as we scroll down
            duration: 0.1,
            ease: "none",
            overwrite: "auto"
          });
        }
      });
    }

    if (skillsContainerRef.current) {
      ScrollTrigger.create({
        trigger: skillsContainerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          gsap.to(skillsContainerRef.current, {
            y: self.progress * -50, // Move up slightly as we scroll down
            duration: 0.1,
            ease: "none",
            overwrite: "auto"
          });
        }
      });
    }

    // Fade-in animation for each section with reverse
    const sections = [imageContainerRef.current, journeyContainerRef.current, skillsContainerRef.current];
    
    sections.forEach((section) => {
      if (!section) return;
      
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play pause reverse reset", // This enables reverse animation
        markers: false,
        onEnter: () => {
          gsap.fromTo(
            section,
            { 
              opacity: 0,
              y: 30
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto"
            }
          );
        },
        onLeaveBack: () => {
          gsap.to(
            section,
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: "power2.in",
              overwrite: "auto"
            }
          );
        }
      });
    });

    // Create a scroll-triggered rotation effect for background pattern
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        gsap.to(bgPatternRef.current, {
          rotation: self.progress * 5, // Subtle rotation as user scrolls
          duration: 0.1,
          ease: "none",
          overwrite: "auto"
        });
      }
    });

  }, []);

  useGSAP(() => {
    setupAnimations();
  }, [setupAnimations]);

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-12 lg:py-20 about-me relative"
    >
      <div 
        ref={bgPatternRef}
        className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-0"
        style={{ willChange: "opacity, transform" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={contentRef} 
          className="space-y-12 lg:space-y-16"
        >
          <div ref={titleRef}>
            <Title 
              title="About Me"
              subtitle={
                <>
                  <span className="inline-block">Passionate about creating seamless user experiences</span>{" "}
                  <span className="inline-block">and bringing innovative ideas to life through code.</span>
                </>
              }
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div ref={imageContainerRef} className="w-full md:w-2/5" style={{ willChange: "transform, opacity" }}>
              <ImageSection />
            </div>
            <div ref={journeyContainerRef} className="w-full md:w-3/5" style={{ willChange: "transform, opacity" }}>
              <JourneySection />
            </div>
          </div>
          
          <div ref={skillsContainerRef} className="w-full" style={{ willChange: "transform, opacity" }}>
            <SkillsSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
