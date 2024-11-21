import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface SkillCardProps {
  skill: string;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: "100%",
        duration: 0.6,
        delay: 0.2 + index * 0.1,
        ease: "power2.inOut",
      },
    );
  }, [index]);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="skill-card relative bg-secondary rounded-lg p-5
        border border-primary/20"
    >
      <div className="relative z-10 h-full flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <h3
            className="text-lg font-semibold text-gray-100 [transition:color_0.3s]
            group-hover:text-primary"
          >
            {skill}
          </h3>
          <span
            className="text-primary [transition:transform_0.3s,opacity_0.3s]
            opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </div>

        <div className="relative h-0.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5
        rounded-lg opacity-0 group-hover:opacity-100 [transition:opacity_0.3s]"
      />

      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-md" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr-md" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl-md" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-md" />
    </div>
  );
};

export default SkillCard;
