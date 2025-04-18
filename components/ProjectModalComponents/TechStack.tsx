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

  const setupHover = contextSafe((item: HTMLDivElement) => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        backgroundColor: "var(--color-primary)",
        color: "var(--color-dark)",
        borderColor: "var(--color-primary)",
        duration: ANIMATION_CONFIG.HOVER_DURATION,
        ease: ANIMATION_CONFIG.HOVER_EASE,
      });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        backgroundColor: "rgba(0, 255, 159, 0.1)",
        color: "var(--color-primary)",
        borderColor: "rgba(0, 255, 159, 0.2)",
        duration: ANIMATION_CONFIG.HOVER_DURATION,
        ease: ANIMATION_CONFIG.HOVER_EASE,
      });
    });
  });

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLDivElement>(
      containerRef.current?.children || [],
    );
    items.forEach(setupHover);
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
              backgroundColor: "rgba(0, 255, 159, 0.1)",
              borderColor: "rgba(0, 255, 159, 0.2)",
              color: "var(--color-primary)",
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};
