import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FiChevronRight } from "react-icons/fi";

interface SkillCardProps {
  skill: string;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!progressRef.current) return;
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
    },
    { scope: progressRef },
  );

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.04,
      boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
      duration: 0.35,
      ease: "power3.out"
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
      duration: 0.35,
      ease: "power3.out"
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
            <FiChevronRight className="w-5 h-5" />
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
