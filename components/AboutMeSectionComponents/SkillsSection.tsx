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
        ".core-skill-card-wrapper",
        coreSkillsRef.current,
      );
      const categories = gsap.utils.toArray<HTMLDivElement>(
        ".tech-category-wrapper",
        techSkillsRef.current,
      );

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
        0.2,
      ).to(categories, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="space-y-16 relative py-10">
      {/* Section Title */}
      <Title
        title="Skills & Technologies"
        subtitle="A blend of technical expertise and core competencies that define my professional journey."
        showGlowBar={true}
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
            <div key={index} className="core-skill-card-wrapper">
              <div
                className="core-skill-card group relative h-full rounded-2xl p-5 overflow-hidden
                           bg-[#0f0f0f] border border-white/5 shadow-md
                           hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]
                           hover:-translate-y-2 transition-all duration-500 ease-out z-10"
              >
                {/* Background Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Animated shimmer sweep */}
                <div
                  className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_2s_infinite]
                             bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                  style={{ width: "200%" }}
                />

                <div className="flex flex-col items-center gap-5 text-center relative z-10">
                  <div
                    className="p-4 rounded-full bg-white/5 text-muted-foreground border border-white/10
                                  group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/40
                                  group-hover:scale-110 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]
                                  transition-all duration-500 ease-out flex items-center justify-center"
                  >
                    {skill.icon}
                  </div>
                  <span
                    className="text-sm font-bold tracking-wide text-foreground/80
                                   group-hover:text-white group-hover:tracking-[0.05em]
                                   transition-all duration-300"
                  >
                    {skill.text}
                  </span>
                </div>
              </div>
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
        <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto px-4">
          {Object.entries(SkillsData).map(([category, skills]) => (
            <div key={category} className="tech-category-wrapper">
              <div className="tech-category group/cat relative h-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-7 shadow-lg overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.2)] hover:-translate-y-1">
                {/* Subtle top sweeping accent */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover/cat:opacity-100 transition-all duration-700 ease-out group-hover/cat:scale-x-100 scale-x-0 origin-left" />

                <h5 className="text-xl font-bold capitalize text-foreground/90 mb-6 flex items-center gap-3 group-hover/cat:text-white transition-colors duration-300">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/40 rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.5)]"></span>
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h5>

                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="skill-chip group/chip relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg
                                 bg-white/5 text-foreground/70 border border-white/5
                                 hover:scale-105 hover:bg-primary/20 hover:text-white hover:border-primary/50 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]
                                 transition-all duration-300 cursor-default overflow-hidden"
                    >
                      <span className="relative z-10">{skill}</span>
                      {/* Inner Shine sweep effect */}
                      <div
                        className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover/chip:animate-[shimmer_1.5s_infinite]
                                   bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    </div>
                  ))}
                </div>

                {/* Background decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover/cat:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
