"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import HireBadge from "./HireBadge";
import HeroText from "./HeroText";
import ViewProjectsButton from "./ViewProjectsButton";
import SocialLinks from "./SocialLinks";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  INITIAL: {
    Y: 30,
    OPACITY: 0,
  },
  DURATIONS: {
    BADGE: 0.8,
    TEXT: 1.0,
    ACTIONS: 0.8,
  },
  DELAYS: {
    BADGE: 0.2,
    TEXT: 0.3,
    ACTIONS: 0.6,
  },
  EASE: "power3.out",
} as const;

const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const badgeElements = containerRef.current?.querySelectorAll(".hire-badge");
      const textElements = containerRef.current?.querySelectorAll(".hero-text");
      const actionElements = containerRef.current?.querySelectorAll(".actions-section");

      if (!badgeElements?.length || !textElements?.length || !actionElements?.length) {
        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONFIG.EASE,
          clearProps: "opacity,y,transform", // Ensure props are cleared to avoid conflict with CSS
        },
      });

      tl.fromTo(
        badgeElements,
        { y: ANIMATION_CONFIG.INITIAL.Y, opacity: 0 },
        { y: 0, opacity: 1, duration: ANIMATION_CONFIG.DURATIONS.BADGE },
        ANIMATION_CONFIG.DELAYS.BADGE
      )
        .fromTo(
          textElements,
          { y: ANIMATION_CONFIG.INITIAL.Y, opacity: 0 },
          { y: 0, opacity: 1, duration: ANIMATION_CONFIG.DURATIONS.TEXT },
          ANIMATION_CONFIG.DELAYS.TEXT
        )
        .fromTo(
          actionElements,
          { y: ANIMATION_CONFIG.INITIAL.Y, opacity: 0 },
          { y: 0, opacity: 1, duration: ANIMATION_CONFIG.DURATIONS.ACTIONS },
          ANIMATION_CONFIG.DELAYS.ACTIONS
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex-1 flex flex-col justify-center space-y-10 py-8 sm:py-12">
      <div className="space-y-8">
        <div className="hire-badge" style={{ opacity: 0 }}> {/* Initial opacity 0 to prevent flash */}
          <HireBadge />
        </div>
        <div className="hero-text" style={{ opacity: 0 }}>
          <HeroText />
        </div>
      </div>

      <div className="actions-section flex flex-col sm:flex-row gap-6 items-center" style={{ opacity: 0 }}>
        <ViewProjectsButton />
        <div className="relative">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
