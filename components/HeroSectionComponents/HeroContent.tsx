import { useEffect, useRef } from "react";
import gsap from "gsap";
import TypedText from "./TypedText";
import SkillCard from "./SkillCard";
import SocialLinks from "./SocialLinks";
import { HeroSectionSkills as skills } from "@/data/data";
import HireBadge from "./HireBadge";
import HeroText from "./HeroText";
import ViewProjectsButton from "./ViewProjectsButton";

const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = {
        badge: ".hire-badge",
        skills: ".skills-section",
        actions: ".actions-section",
      };

      const elementsToAnimate = [
        elements.badge,
        elements.skills,
        elements.actions,
      ];

      gsap.set(elementsToAnimate, {
        opacity: 0,
        y: 20,
      });

      gsap.to(elementsToAnimate, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 space-y-6">
      <div className="space-y-4">
        <div className="hire-badge">
          <HireBadge />
        </div>
        <HeroText />
      </div>

      <div className="skills-section space-y-2">
        <h3 className="text-white font-semibold text-xl">I specialize in:</h3>
        <TypedText />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill, index) => (
            <SkillCard key={index} {...skill} />
          ))}
        </div>
      </div>

      <div className="actions-section flex flex-col sm:flex-row gap-4 items-center">
        <ViewProjectsButton />
        <div className="relative">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
