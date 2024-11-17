import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SkillCard from "./SkillCard";

interface SkillsGridProps {
  activeCategory: string;
  skills: string[];
}

const SkillsGrid: React.FC<SkillsGridProps> = ({ activeCategory, skills }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
      );
    }, gridRef);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <div ref={gridRef} className="bg-gray-800 rounded-lg p-8 shadow-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <SkillCard key={skill} skill={skill} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SkillsGrid;
