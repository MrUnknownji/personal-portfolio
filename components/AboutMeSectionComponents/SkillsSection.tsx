import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkillsData, HeroSectionSkills } from "@/data/data";
import Title from "@/components/ui/Title";

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreSkillsRef = useRef<HTMLDivElement>(null);
  const techSkillsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !coreSkillsRef.current ||
        !techSkillsRef.current
      )
        return;

      const coreSkillCards = gsap.utils.toArray<HTMLDivElement>(
        ".core-skill-card",
        coreSkillsRef.current
      );
      const categories = gsap.utils.toArray<HTMLDivElement>(
        ".tech-category",
        techSkillsRef.current
      );

      // Initial States
      gsap.set(coreSkillCards, { opacity: 0, y: 30 });
      gsap.set(categories, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        coreSkillCards,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.2
      ).to(
        categories,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="space-y-16 relative py-10">
      {/* Section Title */}
      <Title
        title="Skills & Technologies"
        subtitle="A blend of technical expertise and core competencies that define my professional journey."
      />

      {/* Core Competencies */}
      <div ref={coreSkillsRef} className="space-y-6">
        <h4 className="text-lg font-medium text-muted-foreground text-center uppercase tracking-wider flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-border"></span>
          Core Competencies
          <span className="w-8 h-px bg-border"></span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto px-4">
          {HeroSectionSkills.map((skill, index) => (
            <div
              key={index}
              className="core-skill-card group relative rounded-xl p-4 overflow-hidden
                         bg-card border border-border/50
                         hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                         dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)]
                         hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div className="flex flex-col items-center gap-3 text-center relative z-10">
                <div className="p-3 rounded-lg bg-primary/5 text-muted-foreground
                                group-hover:bg-primary/10 group-hover:text-primary
                                group-hover:scale-110 group-hover:rotate-3
                                transition-all duration-300 ease-out">
                  {skill.icon}
                </div>
                <span className="text-sm font-medium text-foreground/80
                                 group-hover:text-foreground
                                 transition-colors duration-300">
                  {skill.text}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0
                              group-hover:opacity-100 transition-opacity duration-300 ease-out" />
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div ref={techSkillsRef} className="space-y-6">
        <h4 className="text-lg font-medium text-muted-foreground text-center uppercase tracking-wider flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-border"></span>
          Technical Stack
          <span className="w-8 h-px bg-border"></span>
        </h4>
        <div className="grid gap-5 sm:grid-cols-2 max-w-5xl mx-auto px-4">
          {Object.entries(SkillsData).map(([category, skills]) => (
            <div
              key={category}
              className="tech-category relative bg-card/95 border border-border rounded-xl p-6 overflow-hidden"
            >
              {/* Subtle top accent */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              <h5 className="text-base font-semibold capitalize text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full"></span>
                {category.replace(/([A-Z])/g, " $1").trim()}
              </h5>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="skill-chip group/chip relative px-3 py-1.5 text-sm font-medium rounded-md
                               bg-foreground/5 text-foreground/70 border border-border
                               hover:text-primary hover:border-primary/50
                               transition-colors duration-200 cursor-default overflow-hidden"
                  >
                    <span className="relative z-10">{skill}</span>
                    {/* Shine sweep effect */}
                    <div
                      className="absolute inset-0 -translate-x-full group-hover/chip:translate-x-full 
                                 transition-transform duration-700 ease-in-out
                                 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
