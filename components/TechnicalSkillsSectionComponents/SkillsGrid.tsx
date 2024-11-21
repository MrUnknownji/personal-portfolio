import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SkillCard from "./SkillCard";

interface SkillsGridProps {
  activeCategory: string;
  skills: string[];
}

const SkillsGrid: React.FC<SkillsGridProps> = ({ activeCategory, skills }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-card",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <div ref={gridRef} className="relative">
      <div
        ref={containerRef}
        className="relative bg-secondary/95 rounded-xl p-8
          border border-primary/20 backdrop-blur-md"
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(79,209,197,0.05)_50%,transparent_75%)]
          bg-[length:250px_250px] animate-[border-flow_16s_linear_infinite]"
        />

        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <SkillCard
              key={`${activeCategory}-${skill}`}
              skill={skill}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-xl" />
    </div>
  );
};

export default SkillsGrid;
