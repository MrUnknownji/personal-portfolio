import React, { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS_DATA = {
  "Frontend": [
    { name: "React", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Tailwind CSS", level: 90 },
    { name: "GSAP", level: 80 }
  ],
  "Backend": [
    { name: "Node.js", level: 85 },
    { name: "Express", level: 80 },
    { name: "PostgreSQL", level: 75 },
    { name: "MongoDB", level: 80 },
    { name: "GraphQL", level: 70 }
  ],
  "Tools & Others": [
    { name: "Git", level: 90 },
    { name: "Docker", level: 75 },
    { name: "AWS", level: 70 },
    { name: "CI/CD", level: 80 },
    { name: "Testing", level: 85 }
  ]
} as const;

const ANIMATION_CONFIG = {
  CONTAINER: {
    DURATION: 0.8,
    EASE: "power3.out",
    Y_OFFSET: 50,
    OPACITY: 0
  },
  CATEGORIES: {
    DURATION: 0.6,
    STAGGER: 0.1,
    Y_OFFSET: 20,
    OPACITY: 0,
    SCALE: 0.95
  },
  SKILLS: {
    DURATION: 0.8,
    STAGGER: 0.1,
    X_OFFSET: -20,
    OPACITY: 0,
    BAR: {
      DURATION: 1.2,
      EASE: "power2.out",
      SCALE_X: 0
    }
  },
  HOVER: {
    DURATION: 0.3,
    SCALE: 1.02,
    EASE: "power2.out"
  }
} as const;

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof SKILLS_DATA>("Frontend");
  const containerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillItemsRef = useRef<HTMLDivElement[]>([]);

  const animateSkills = useCallback(() => {
    if (!skillsRef.current || !skillItemsRef.current.length) return;

    gsap.fromTo(
      skillItemsRef.current,
      {
        x: ANIMATION_CONFIG.SKILLS.X_OFFSET,
        opacity: ANIMATION_CONFIG.SKILLS.OPACITY
      },
      {
        x: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.SKILLS.DURATION,
        stagger: ANIMATION_CONFIG.SKILLS.STAGGER,
        ease: "power2.out",
        clearProps: "transform"
      }
    );

    skillItemsRef.current.forEach((item, index) => {
      const bar = item.querySelector(".skill-bar");
      const level = SKILLS_DATA[activeCategory][index].level;

      gsap.fromTo(
        bar,
        { scaleX: ANIMATION_CONFIG.SKILLS.BAR.SCALE_X },
        {
          scaleX: level / 100,
          duration: ANIMATION_CONFIG.SKILLS.BAR.DURATION,
          ease: ANIMATION_CONFIG.SKILLS.BAR.EASE
        }
      );
    });
  }, [activeCategory]);

  useGSAP(() => {
    if (!containerRef.current || !categoriesRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(
      containerRef.current,
      {
        y: ANIMATION_CONFIG.CONTAINER.Y_OFFSET,
        opacity: ANIMATION_CONFIG.CONTAINER.OPACITY
      },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.CONTAINER.DURATION,
        ease: ANIMATION_CONFIG.CONTAINER.EASE
      }
    )
    .fromTo(
      categoriesRef.current.children,
      {
        y: ANIMATION_CONFIG.CATEGORIES.Y_OFFSET,
        opacity: ANIMATION_CONFIG.CATEGORIES.OPACITY,
        scale: ANIMATION_CONFIG.CATEGORIES.SCALE
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.CATEGORIES.DURATION,
        stagger: ANIMATION_CONFIG.CATEGORIES.STAGGER,
        ease: "back.out(1.2)",
        clearProps: "all"
      }
    )
    .add(animateSkills);
  }, [animateSkills]);

  useGSAP(() => {
    animateSkills();
  }, [activeCategory, animateSkills]);

  return (
    <div ref={containerRef} className="relative">
      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-8">Technical Skills</h3>

      {/* Categories */}
      <div
        ref={categoriesRef}
        className="flex flex-wrap gap-4 mb-8"
      >
        {Object.keys(SKILLS_DATA).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category as keyof typeof SKILLS_DATA)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 transform-gpu ${
              activeCategory === category
                ? "bg-primary text-gray-900 shadow-lg shadow-primary/20"
                : "bg-secondary/40 text-gray-300 hover:bg-secondary/60"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skills */}
      <div ref={skillsRef} className="space-y-6">
        {SKILLS_DATA[activeCategory].map((skill, index) => (
          <div
            key={skill.name}
            ref={el => {
              if (el) skillItemsRef.current[index] = el;
            }}
            className="transform-gpu transition-all duration-300 hover:translate-x-1"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-200">{skill.name}</span>
              <span className="text-primary">{skill.level}%</span>
            </div>
            <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
              <div
                className="skill-bar h-full bg-gradient-to-r from-primary to-accent rounded-full origin-left"
                style={{ transform: `scaleX(${skill.level / 100})` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Background decorative elements */}
      <div className="absolute -right-4 -bottom-4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -left-4 -top-4 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
    </div>
  );
};

export default SkillsSection;
