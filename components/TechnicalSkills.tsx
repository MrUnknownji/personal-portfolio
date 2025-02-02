"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TechnicalSectionSkills } from "@/data/data";
import CategoryButton from "./TechnicalSkillsSectionComponents/CategoryButton";
import SkillsGrid from "./TechnicalSkillsSectionComponents/SkillsGrid";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TechnicalSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(TechnicalSectionSkills[0].category);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "center center",
        toggleActions: "play none none reverse",
      },
    });
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }
    )
      .fromTo(
        categoriesRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        <div ref={categoriesRef} className="flex flex-wrap justify-center gap-4 mb-16">
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
              TechnicalSectionSkills.find((set) => set.category === activeCategory)?.items || []
            }
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
};

export default TechnicalSkills;
