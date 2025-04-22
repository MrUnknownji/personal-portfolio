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

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-light/90">Technologies Used</h3>
      <div ref={containerRef} className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="skill-chip"
            style={{
              willChange: "background-color, border-color, color",
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};
