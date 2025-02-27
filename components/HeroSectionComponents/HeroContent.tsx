import { useRef } from "react";
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

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial animations
      gsap.from(".hire-badge", {
        y: ANIMATION_CONFIG.INITIAL.Y,
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        duration: ANIMATION_CONFIG.DURATIONS.BADGE,
        delay: ANIMATION_CONFIG.DELAYS.BADGE,
        ease: ANIMATION_CONFIG.EASE
      });

      gsap.from(".hero-text", {
        y: ANIMATION_CONFIG.INITIAL.Y,
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        duration: ANIMATION_CONFIG.DURATIONS.TEXT,
        delay: ANIMATION_CONFIG.DELAYS.TEXT,
        ease: ANIMATION_CONFIG.EASE
      });

      // Skills section animation
      gsap.from(".skills-section", {
        y: ANIMATION_CONFIG.INITIAL.Y,
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        duration: ANIMATION_CONFIG.DURATIONS.SKILLS,
        delay: ANIMATION_CONFIG.DELAYS.SKILLS,
        ease: ANIMATION_CONFIG.EASE
      });

      // Staggered skill cards animation
      gsap.from(".skill-card", {
        y: ANIMATION_CONFIG.INITIAL.Y,
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        duration: ANIMATION_CONFIG.DURATIONS.SKILLS,
        stagger: ANIMATION_CONFIG.STAGGER.SKILLS,
        delay: ANIMATION_CONFIG.DELAYS.SKILLS,
        ease: ANIMATION_CONFIG.EASE
      });

      // Actions section animation
      gsap.from(".actions-section", {
        y: ANIMATION_CONFIG.INITIAL.Y,
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        duration: ANIMATION_CONFIG.DURATIONS.ACTIONS,
        delay: ANIMATION_CONFIG.DELAYS.ACTIONS,
        ease: ANIMATION_CONFIG.EASE
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 space-y-8">
      {/* Hero header section */}
      <div className="space-y-6">
        <div className="hire-badge">
          <HireBadge />
        </div>
        <div className="hero-text">
          <HeroText />
        </div>
      </div>

      {/* Skills section */}
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

      {/* Actions section */}
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
