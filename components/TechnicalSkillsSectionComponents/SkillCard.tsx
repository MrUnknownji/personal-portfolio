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
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.15,
        ease: "power3.out",
      },
    );
  }, [index]);

  useGSAP(() => {
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.2,
          delay: 0.5 + index * 0.15,
          ease: "power2.inOut",
        },
      );
    }
  }, [index]);

  const handleMouseEnter = () => {
    if (!cardRef.current || !iconRef.current) return;
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(iconRef.current, {
      x: 5,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !iconRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "none",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(iconRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group skill-card relative bg-secondary rounded-lg p-5 border border-primary/20"
    >
      <div className="relative z-10 h-full flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">{skill}</h3>
          <span ref={iconRef} className="text-primary">
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
        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-md" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr-md" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl-md" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-md" />
    </div>
  );
};

export default SkillCard;
