import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface SkillCardProps {
  skill: string;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const underline = underlineRef.current;

    gsap.fromTo(
      card,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
      },
    );

    gsap.fromTo(
      underline,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.5,
        delay: 0.2 + index * 0.1,
      },
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative bg-gray-700 rounded-lg p-4 overflow-hidden"
    >
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">{skill}</h3>
        <div ref={underlineRef} className="w-12 h-1 bg-accent" />
      </div>
      <div className="absolute bottom-0 right-0">
        <svg
          className="w-16 h-16 text-primary opacity-10"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default SkillCard;
