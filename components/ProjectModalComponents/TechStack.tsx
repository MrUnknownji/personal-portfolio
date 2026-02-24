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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground/90 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-primary rounded-full inline-block"></span>
        Technologies Used
      </h3>
      <div ref={containerRef} className="flex flex-wrap gap-2.5">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="relative px-4 py-2 rounded-full text-sm font-medium bg-card border border-border text-foreground/80 cursor-default transition-colors duration-200 hover:bg-primary/5 hover:border-primary/40 hover:text-primary"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-80" />
              {tech}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
