import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkillsData, HeroSectionSkills } from "@/data/data";

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const coreSkillsRef = useRef<HTMLDivElement>(null);
  const techSkillsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !titleRef.current ||
        !coreSkillsRef.current ||
        !techSkillsRef.current
      )
        return;

      // Selectors
      const coreSkillCards = gsap.utils.toArray<HTMLDivElement>(
        ".core-skill-card",
        coreSkillsRef.current
      );
      const categories = gsap.utils.toArray<HTMLDivElement>(
        ".tech-category",
        techSkillsRef.current
      );

      // Initial States
      gsap.set(titleRef.current, { opacity: 0, y: 30 });
      gsap.set(coreSkillCards, { opacity: 0, y: 30 });
      gsap.set(categories, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          coreSkillCards,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
          "-=0.4"
        )
        .to(
          categories,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.2"
        );

      // Mouse Move Glow Effect for Core Skills
      coreSkillCards.forEach((card) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        });
      });

      // Mouse Move Glow Effect for Tech Categories
      categories.forEach((card) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="space-y-20 relative py-10">
      {/* Section Title */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h3
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight"
        >
          Skills & Technologies
        </h3>
        <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
          A blend of technical expertise and core competencies that define my
          professional journey.
        </p>
      </div>

      {/* Core Competencies */}
      <div ref={coreSkillsRef} className="space-y-8">
        <h4 className="text-2xl font-semibold text-white/90 text-center mb-8 flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-primary/50"></span>
          Core Competencies
          <span className="w-8 h-[1px] bg-primary/50"></span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {HeroSectionSkills.map((skill, index) => (
            <div
              key={index}
              className="core-skill-card group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              style={
                {
                  "--mouse-x": "0px",
                  "--mouse-y": "0px",
                } as React.CSSProperties
              }
            >
              {/* Mouse Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 159, 0.1), transparent 40%)",
                }}
              />

              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <span className="text-lg font-medium text-neutral-200 group-hover:text-white transition-colors">
                  {skill.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div ref={techSkillsRef} className="space-y-8">
        <h4 className="text-2xl font-semibold text-white/90 text-center mb-8 flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-accent/50"></span>
          Technical Stack
          <span className="w-8 h-[1px] bg-accent/50"></span>
        </h4>
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto px-4">
          {Object.entries(SkillsData).map(([category, skills]) => (
            <div
              key={category}
              className="tech-category group relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-8 flex flex-col gap-6 overflow-hidden"
              style={
                {
                  "--mouse-x": "0px",
                  "--mouse-y": "0px",
                } as React.CSSProperties
              }
            >
              {/* Mouse Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 159, 0.05), transparent 40%)",
                }}
              />

              <h4 className="text-xl font-semibold capitalize text-gray-100 border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></span>
                {category.replace(/([A-Z])/g, " $1").trim()}
              </h4>

              <div className="flex flex-wrap gap-3 relative z-10">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="group/skill relative px-4 py-2 text-sm sm:text-base font-medium rounded-lg
                               bg-white/5 text-neutral-300 border border-white/5
                               hover:text-primary hover:border-primary/30 hover:bg-primary/10
                               transition-all duration-300 cursor-default overflow-hidden"
                  >
                    <span className="relative z-10">{skill}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover/skill:translate-x-[100%] transition-transform duration-700 ease-in-out" />
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
