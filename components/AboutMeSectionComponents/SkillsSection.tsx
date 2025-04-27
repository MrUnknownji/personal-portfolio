import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkillsData } from "@/data/data";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  TITLE_DURATION: 0.8,
  TITLE_EASE: "power3.out",
  TITLE_Y_OFFSET: 30,
  CATEGORY_STAGGER: 0.15,
  CATEGORY_DURATION: 0.6,
  CATEGORY_Y_OFFSET: 40,
  CATEGORY_EASE: "power2.out",
  SKILL_STAGGER: 0.05,
  SKILL_DURATION: 0.4,
  SKILL_SCALE_START: 0.8,
  SKILL_EASE: "back.out(1.4)",
  HOVER_DURATION: 0.2,
  HOVER_EASE: "power1.out",
} as const;

const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !titleRef.current || !skillsGridRef.current)
        return;

      const categories = gsap.utils.toArray<HTMLDivElement>(
        skillsGridRef.current.children,
      );
      const allSkillItems = gsap.utils.toArray<HTMLSpanElement>(
        ".skill-item",
        skillsGridRef.current,
      );

      gsap.set(titleRef.current, {
        opacity: 0,
        y: ANIMATION_CONFIG.TITLE_Y_OFFSET,
      });
      gsap.set(categories, {
        opacity: 0,
        y: ANIMATION_CONFIG.CATEGORY_Y_OFFSET,
      });
      gsap.set(allSkillItems, {
        opacity: 0,
        scale: ANIMATION_CONFIG.SKILL_SCALE_START,
      });

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      });

      mainTl
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.TITLE_DURATION,
          ease: ANIMATION_CONFIG.TITLE_EASE,
        })
        .to(
          categories,
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.CATEGORY_DURATION,
            stagger: ANIMATION_CONFIG.CATEGORY_STAGGER,
            ease: ANIMATION_CONFIG.CATEGORY_EASE,
          },
          "-=0.5",
        )
        .to(
          allSkillItems,
          {
            opacity: 1,
            scale: 1,
            duration: ANIMATION_CONFIG.SKILL_DURATION,
            stagger: ANIMATION_CONFIG.SKILL_STAGGER,
            ease: ANIMATION_CONFIG.SKILL_EASE,
          },
          "-=0.6",
        );

      return () => {
        gsap.killTweensOf([titleRef.current, categories, allSkillItems]);
        if (mainTl.scrollTrigger) {
          mainTl.scrollTrigger.kill();
        }
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="space-y-10">
      <h3
        ref={titleRef}
        className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center"
      >
        Skills & Technologies
      </h3>

      <div
        ref={skillsGridRef}
        className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Object.entries(SkillsData).map(([category, skills]) => (
          <div
            key={category}
            className="bg-frosted-dark rounded-lg p-5 space-y-4 flex flex-col"
            style={{ willChange: "transform, opacity" }}
          >
            <h4 className="text-xl font-medium capitalize text-light/90 border-b border-neutral/30 pb-2 mb-3">
              {" "}
              {category.replace(/([A-Z])/g, " $1").trim()}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="skill-item skill-chip"
                  style={{
                    willChange:
                      "transform, opacity, background-color, color, border-color",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
