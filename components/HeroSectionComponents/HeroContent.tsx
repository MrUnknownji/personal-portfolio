"use client";
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
    OPACITY: 0,
  },
  DURATIONS: {
    BADGE: 0.6,
    TEXT: 0.8,
    SKILLS_CONTAINER: 0.7,
    SKILL_CARD: 0.5,
    ACTIONS: 0.6,
  },
  DELAYS: {
    BADGE: 0.2,
    TEXT: 0.4,
    SKILLS_CONTAINER: 0.6,
    SKILL_CARD_START: 0.7,
    ACTIONS: 0.9,
  },
  STAGGER: {
    SKILLS: 0.1,
  },
  EASE: "power3.out",
} as const;

const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const badgeElements =
        containerRef.current?.querySelectorAll(".hire-badge");
      const textElements = containerRef.current?.querySelectorAll(".hero-text");
      const skillsContainerElements =
        containerRef.current?.querySelectorAll(".skills-container");
      const skillCards = containerRef.current?.querySelectorAll(".skill-card");
      const actionElements =
        containerRef.current?.querySelectorAll(".actions-section");

      if (
        !badgeElements?.length ||
        !textElements?.length ||
        !skillsContainerElements?.length ||
        !skillCards?.length ||
        !actionElements?.length
      ) {
        console.warn("HeroContent elements not found for animation.");
        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONFIG.EASE,
          clearProps: "opacity,y",
        },
      });

      tl.fromTo(
        badgeElements,
        {
          y: ANIMATION_CONFIG.INITIAL.Y,
          opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        },
        {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.DURATIONS.BADGE,
        },
        ANIMATION_CONFIG.DELAYS.BADGE,
      )
        .fromTo(
          textElements,
          {
            y: ANIMATION_CONFIG.INITIAL.Y,
            opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
          },
          {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.DURATIONS.TEXT,
          },
          ANIMATION_CONFIG.DELAYS.TEXT,
        )
        .fromTo(
          skillsContainerElements,
          {
            y: ANIMATION_CONFIG.INITIAL.Y,
            opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
          },
          {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.DURATIONS.SKILLS_CONTAINER,
          },
          ANIMATION_CONFIG.DELAYS.SKILLS_CONTAINER,
        )
        .fromTo(
          skillCards,
          {
            y: ANIMATION_CONFIG.INITIAL.Y,
            opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
          },
          {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.DURATIONS.SKILL_CARD,
            stagger: ANIMATION_CONFIG.STAGGER.SKILLS,
          },
          ANIMATION_CONFIG.DELAYS.SKILL_CARD_START,
        )
        .fromTo(
          actionElements,
          {
            y: ANIMATION_CONFIG.INITIAL.Y,
            opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
          },
          {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.DURATIONS.ACTIONS,
          },
          ANIMATION_CONFIG.DELAYS.ACTIONS,
        );
    },
    { scope: containerRef },
  );

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

      <div className="skills-container space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            I specialize in:
          </h3>
          <TypedText />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
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
