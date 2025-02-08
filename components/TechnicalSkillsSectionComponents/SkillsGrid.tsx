import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SkillCard from "./SkillCard";

interface SkillsGridProps {
  activeCategory: string;
  skills: string[];
}

const SkillsGrid: React.FC<SkillsGridProps> = ({ activeCategory, skills }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;
    const skillCards = gridRef.current.querySelectorAll(".skill-card");
    gsap.set(skillCards, { opacity: 0, y: 30, scale: 0.8 });
  }, []);

  useGSAP(() => {
    if (!gridRef.current) return;
    const skillCards = gridRef.current.querySelectorAll(".skill-card");

    gsap.to(skillCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      immediateRender: true,
    });
  }, [skills]);

  return (
    <div ref={gridRef} className="relative">
      <div
        ref={containerRef}
        className="relative bg-gradient-to-br from-[#1E1E1E] via-[#2E2E2E] to-[#1E1E1E] rounded-xl p-8 border border-primary/20"
      >
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
