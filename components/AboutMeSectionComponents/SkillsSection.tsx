import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  CONTAINER: {
    DURATION: 0.8,
    EASE: "power3.out"
  },
  SKILLS: {
    STAGGER: 0.05,
    DURATION: 0.4,
    SCALE: {
      START: 0.8,
      END: 1
    },
    EASE: "back.out(1.7)"
  }
} as const;

const skillsData = {
  frontend: [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"
  ],
  backend: [
    "Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL", "REST APIs"
  ],
  tools: [
    "Git", "Docker", "AWS", "Vercel", "Jest", "Cypress"
  ],
  other: [
    "UI/UX Design", "Performance Optimization", "SEO", "Responsive Design", "Agile", "CI/CD"
  ]
} as const;

const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current || !skillsRef.current) return;

    const skillItems = skillsRef.current.querySelectorAll('.skill-item');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        once: true
      }
    });

    tl.fromTo(
      titleRef.current,
      { 
        opacity: 0,
        y: 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.CONTAINER.DURATION,
        ease: ANIMATION_CONFIG.CONTAINER.EASE
      }
    );

    tl.fromTo(
      skillItems,
      {
        opacity: 0,
        scale: ANIMATION_CONFIG.SKILLS.SCALE.START,
      },
      {
        opacity: 1,
        scale: ANIMATION_CONFIG.SKILLS.SCALE.END,
        duration: ANIMATION_CONFIG.SKILLS.DURATION,
        stagger: ANIMATION_CONFIG.SKILLS.STAGGER,
        ease: ANIMATION_CONFIG.SKILLS.EASE,
        clearProps: "transform"
      },
      "-=0.4"
    );

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="space-y-8"
      style={{ willChange: "transform" }}
    >
      <h3 
        ref={titleRef}
        className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
      >
        Skills & Technologies
      </h3>

      <div 
        ref={skillsRef}
        className="grid gap-6 sm:grid-cols-2"
      >
        {Object.entries(skillsData).map(([category, skills]) => (
          <div 
            key={category}
            className="p-4 rounded-xl bg-gray-900/30 border border-primary/10 space-y-3"
          >
            <h4 className="text-lg font-medium capitalize text-gray-200">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="skill-item px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm
                    hover:bg-primary/20 transition-colors duration-300"
                  style={{ willChange: "transform, opacity" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
