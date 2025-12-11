import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface TechStackProps {
  technologies: string[];
}

const ANIMATION_CONFIG = {
  STAGGER: 0.05,
  DURATION: 0.4,
  EASE: "back.out(1.7)",
  HOVER_DURATION: 0.2,
  HOVER_EASE: "power1.out",
} as const;

export const TechStack = ({ technologies }: TechStackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    gsap.from(containerRef.current?.children || [], {
      opacity: 0,
      scale: 0.8,
      y: 10,
      duration: ANIMATION_CONFIG.DURATION,
      stagger: ANIMATION_CONFIG.STAGGER,
      ease: ANIMATION_CONFIG.EASE,
      clearProps: "transform, opacity",
    });
  }, []);

  const handleMouseEnter = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, {
      y: -3,
      scale: 1.05,
      backgroundColor: "rgba(0, 255, 159, 0.1)",
      borderColor: "rgba(0, 255, 159, 0.4)",
      color: "#00ff9f",
      boxShadow: "0 4px 12px rgba(0, 255, 159, 0.1)",
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
    });
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, {
      y: 0,
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.8)",
      boxShadow: "none",
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
    });
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-light/90 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary rounded-full inline-block"></span>
        Technologies Used
      </h3>
      <div ref={containerRef} className="flex flex-wrap gap-2.5">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="relative px-4 py-2 rounded-full text-sm font-medium bg-white/[0.03] border border-white/10 text-white/80 cursor-default transition-colors"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              {tech}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
