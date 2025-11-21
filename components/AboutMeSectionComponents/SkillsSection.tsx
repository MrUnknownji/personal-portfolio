import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkillsData, HeroSectionSkills } from "@/data/data";
import SkillCard from "../HeroSectionComponents/SkillCard";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  TITLE_DURATION: 0.8,
  TITLE_EASE: "power3.out",
  TITLE_Y_OFFSET: 30,
  CATEGORY_STAGGER: 0.1,
  CATEGORY_DURATION: 0.6,
  CATEGORY_Y_OFFSET: 40,
  CATEGORY_EASE: "power2.out",
  SKILL_STAGGER: 0.05,
  SKILL_DURATION: 0.4,
  SKILL_SCALE_START: 0.8,
  SKILL_EASE: "back.out(1.4)",
} as const;

const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const coreSkillsRef = useRef<HTMLDivElement>(null);
  const techSkillsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !titleRef.current || !coreSkillsRef.current || !techSkillsRef.current)
        return;

      // Selectors
      const coreSkillCards = gsap.utils.toArray<HTMLDivElement>(".core-skill-card", coreSkillsRef.current);
      const categories = gsap.utils.toArray<HTMLDivElement>(".tech-category", techSkillsRef.current);

      // Initial States
      gsap.set(titleRef.current, { opacity: 0, y: ANIMATION_CONFIG.TITLE_Y_OFFSET });
      gsap.set(coreSkillCards, { opacity: 0, y: 20 });
      gsap.set(categories, { opacity: 0, y: ANIMATION_CONFIG.CATEGORY_Y_OFFSET });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.TITLE_DURATION,
        ease: ANIMATION_CONFIG.TITLE_EASE,
      })
      .to(coreSkillCards, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      }, "-=0.4")
      .to(categories, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.CATEGORY_DURATION,
        stagger: ANIMATION_CONFIG.CATEGORY_STAGGER,
        ease: ANIMATION_CONFIG.CATEGORY_EASE,
      }, "-=0.2");

    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="space-y-16">
      <div className="space-y-4 text-center">
        <h3
          ref={titleRef}
          className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Skills & Technologies
        </h3>
        <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
           A blend of technical expertise and core competencies that define my professional journey.
        </p>
      </div>

      {/* Core Competencies (Moved from Hero) */}
      <div ref={coreSkillsRef} className="space-y-6">
        <h4 className="text-xl font-medium text-white/90 text-center mb-6">
            Core Competencies
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {HeroSectionSkills.map((skill, index) => (
            <div key={index} className="core-skill-card">
                <SkillCard {...skill} />
            </div>
            ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div ref={techSkillsRef} className="space-y-6">
         <h4 className="text-xl font-medium text-white/90 text-center mb-6">
            Technical Stack
        </h4>
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(SkillsData).map(([category, skills]) => (
            <div
                key={category}
                className="tech-category bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-xl p-6 space-y-4 flex flex-col
                           hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors duration-300"
            >
                <h4 className="text-lg font-medium capitalize text-gray-200 border-b border-white/10 pb-3">
                {category.replace(/([A-Z])/g, " $1").trim()}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                    <span
                    key={skill}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full
                               bg-white/5 text-neutral-300 border border-white/5
                               hover:text-primary hover:border-primary/30 hover:bg-primary/5
                               transition-all duration-300 cursor-default"
                    >
                    {skill}
                    </span>
                ))}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
