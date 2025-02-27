import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface TechStackProps {
  technologies: string[];
}

export const TechStack = ({ technologies }: TechStackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current?.children || [],
      { 
        opacity: 0,
        scale: 0.8,
        y: 10
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)",
      }
    );
  }, { scope: containerRef });

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Technologies Used</h3>
      <div 
        ref={containerRef}
        className="flex flex-wrap gap-2"
      >
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="px-3 py-1.5 rounded-lg bg-gray-700/50 text-primary border border-primary/20
              hover:border-primary/40 hover:bg-gray-700/70 transition-all duration-300
              text-sm font-medium backdrop-blur-sm shadow-lg relative group overflow-hidden"
          >
            <div className="relative z-10">
              {tech}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0
              transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform
              duration-1000 ease-in-out" />
          </div>
        ))}
      </div>
    </div>
  );
};
