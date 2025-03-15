import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import TypedText from "./TypedText";
import SkillCard from "./SkillCard";
import SocialLinks from "./SocialLinks";
import { HeroSectionSkills as skills } from "@/data/data";
import HireBadge from "./HireBadge";
import HeroText from "./HeroText";
import ViewProjectsButton from "./ViewProjectsButton";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  INITIAL: {
    Y: 20,
    OPACITY: 0
  },
  DURATIONS: {
    BADGE: 0.6,
    TEXT: 0.8,
    SKILLS: 0.7,
    ACTIONS: 0.6
  },
  DELAYS: {
    BADGE: 0.2,
    TEXT: 0.4,
    SKILLS: 0.6,
    ACTIONS: 0.8
  },
  STAGGER: {
    SKILLS: 0.1
  },
  EASE: "power3.out"
} as const;

const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Use a cleanup effect to kill animations when component unmounts
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Create a single timeline for all animations
    // This is more efficient than multiple separate animations
    const tl = gsap.timeline({
      defaults: { 
        ease: ANIMATION_CONFIG.EASE,
        force3D: true // Force GPU acceleration
      }
    });
    
    // Store the timeline for cleanup
    timelineRef.current = tl;

    // Group elements for better performance
    const badgeElements = containerRef.current.querySelectorAll('.hire-badge');
    const textElements = containerRef.current.querySelectorAll('.hero-text');
    const skillsElements = containerRef.current.querySelectorAll('.skills-section');
    const skillCards = containerRef.current.querySelectorAll('.skill-card');
    const actionElements = containerRef.current.querySelectorAll('.actions-section');

    // Build the timeline sequentially
    tl.fromTo(
      badgeElements,
      { y: ANIMATION_CONFIG.INITIAL.Y, opacity: ANIMATION_CONFIG.INITIAL.OPACITY },
      { 
        y: 0, 
        opacity: 1, 
        duration: ANIMATION_CONFIG.DURATIONS.BADGE,
        clearProps: "transform" // Clean up transform property after animation completes
      },
      ANIMATION_CONFIG.DELAYS.BADGE
    )
    .fromTo(
      textElements,
      { y: ANIMATION_CONFIG.INITIAL.Y, opacity: ANIMATION_CONFIG.INITIAL.OPACITY },
      { 
        y: 0, 
        opacity: 1, 
        duration: ANIMATION_CONFIG.DURATIONS.TEXT,
        clearProps: "transform"
      },
      ANIMATION_CONFIG.DELAYS.TEXT
    )
    .fromTo(
      skillsElements,
      { y: ANIMATION_CONFIG.INITIAL.Y, opacity: ANIMATION_CONFIG.INITIAL.OPACITY },
      { 
        y: 0, 
        opacity: 1, 
        duration: ANIMATION_CONFIG.DURATIONS.SKILLS,
        clearProps: "transform"
      },
      ANIMATION_CONFIG.DELAYS.SKILLS
    )
    .fromTo(
      skillCards,
      { y: ANIMATION_CONFIG.INITIAL.Y, opacity: ANIMATION_CONFIG.INITIAL.OPACITY },
      { 
        y: 0, 
        opacity: 1, 
        duration: ANIMATION_CONFIG.DURATIONS.SKILLS,
        stagger: ANIMATION_CONFIG.STAGGER.SKILLS,
        clearProps: "transform"
      },
      ANIMATION_CONFIG.DELAYS.SKILLS
    )
    .fromTo(
      actionElements,
      { y: ANIMATION_CONFIG.INITIAL.Y, opacity: ANIMATION_CONFIG.INITIAL.OPACITY },
      { 
        y: 0, 
        opacity: 1, 
        duration: ANIMATION_CONFIG.DURATIONS.ACTIONS,
        clearProps: "transform"
      },
      ANIMATION_CONFIG.DELAYS.ACTIONS
    );

    // Return cleanup function
    return () => {
      if (tl) {
        tl.kill();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="flex-1 space-y-8">
      <div className="space-y-6">
        <div className="hire-badge">
          <HireBadge />
        </div>
        <div className="hero-text">
          <HeroText />
        </div>
      </div>

      <div ref={skillsRef} className="skills-section space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            I specialize in:
          </h3>
          <TypedText />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card transform-gpu">
              <SkillCard {...skill} />
            </div>
          ))}
        </div>
      </div>

      <div className="actions-section flex flex-col sm:flex-row gap-6 items-center">
        <ViewProjectsButton />
        <div className="relative">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
