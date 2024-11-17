import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TechnicalSectionSkills } from "@/data/data";
import CategoryButton from "./TechnicalSkillsSectionComponents/CategoryButton";
import SkillsGrid from "./TechnicalSkillsSectionComponents/SkillsGrid";

gsap.registerPlugin(ScrollTrigger);

const TechnicalSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(
    TechnicalSectionSkills[0].category,
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const categories = categoriesRef.current;

    gsap.fromTo(
      title,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      categories,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          ref={titleRef}
          className="text-4xl font-bold text-primary mb-12 text-center"
        >
          Technical Skills
        </h2>

        <div
          ref={categoriesRef}
          className="flex flex-wrap justify-center gap-4 mb-12"
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

        <SkillsGrid
          activeCategory={activeCategory}
          skills={
            TechnicalSectionSkills.find(
              (set) => set.category === activeCategory,
            )?.items || []
          }
        />
      </div>
    </section>
  );
};

export default TechnicalSkills;
