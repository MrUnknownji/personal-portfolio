"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TechnicalSectionSkills } from "@/data/data";
import CategoryButton from "./TechnicalSkillsSectionComponents/CategoryButton";
import SkillsGrid from "./TechnicalSkillsSectionComponents/SkillsGrid";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TITLE_ANIMATION_DURATION = 0.8;
const CATEGORIES_ANIMATION_DURATION = 0.6;
const CONTENT_ANIMATION_DURATION = 0.6;
const ANIMATION_EASE_TITLE = "power3.out";
const ANIMATION_EASE_CATEGORIES = "power2.out";
const ANIMATION_EASE_CONTENT = "power2.out";
const TITLE_INITIAL_Y = 30;
const CATEGORIES_INITIAL_Y = 20;
const CONTENT_INITIAL_Y = 20;
const TITLE_INITIAL_SCALE = 0.9;
const ANIMATION_TRIGGER_START = "top 60%";
const ANIMATION_TRIGGER_END = "center center";

const TechnicalSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(
    TechnicalSectionSkills[0].category,
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: ANIMATION_TRIGGER_START,
        end: ANIMATION_TRIGGER_END,
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: TITLE_INITIAL_Y,
        scale: TITLE_INITIAL_SCALE,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: TITLE_ANIMATION_DURATION,
        ease: ANIMATION_EASE_TITLE,
      },
    )
      .fromTo(
        categoriesRef.current,
        {
          opacity: 0,
          y: CATEGORIES_INITIAL_Y,
        },
        {
          opacity: 1,
          y: 0,
          duration: CATEGORIES_ANIMATION_DURATION,
          ease: ANIMATION_EASE_CATEGORIES,
        },
        "-=0.4",
      )
      .fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: CONTENT_INITIAL_Y,
        },
        {
          opacity: 1,
          y: 0,
          duration: CONTENT_ANIMATION_DURATION,
          ease: ANIMATION_EASE_CONTENT,
        },
        "-=0.3",
      );
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        <div
          ref={categoriesRef}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {TechnicalSectionSkills.map((skillSet) => (
            <CategoryButton
              key={skillSet.category}
              skillSet={skillSet}
              isActive={activeCategory === skillSet.category}
              onClick={() => setActiveCategory(skillSet.category)}
            />
          ))}
        </div>

        <div ref={contentRef}>
          <SkillsGrid
            activeCategory={activeCategory}
            skills={
              TechnicalSectionSkills.find(
                (set) => set.category === activeCategory,
              )?.items || []
            }
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
};

export default TechnicalSkills;
