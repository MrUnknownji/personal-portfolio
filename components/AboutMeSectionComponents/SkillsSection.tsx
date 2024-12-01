"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { AboutMeSkills } from "@/data/data";

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = () => {
  const [activeSkill, setActiveSkill] = useState(0);
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillContentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % AboutMeSkills.length);
    }, 5000);

    gsap.fromTo(
      skillsRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
    );

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: "100%",
        duration: 5,
        ease: "none",
      },
    );

    gsap.fromTo(
      skillContentRef.current,
      {
        opacity: 0,
        scale: 0.95,
        y: 10,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
    );
  }, [activeSkill]);

  return (
    <div
      ref={skillsRef}
      className="relative bg-secondary p-6 sm:p-8 rounded-lg
        [@media(hover:hover)]:hover:scale-[1.02]
        [transition:transform_0.3s_ease-out]
        border border-primary/20"
    >
      <div className="relative">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-primary tracking-wide">
            Core Skills
          </h3>
          <span className="text-accent text-sm">
            {activeSkill + 1}/{AboutMeSkills.length}
          </span>
        </div>

        <div
          ref={skillContentRef}
          className="text-center py-6 sm:py-8 px-3 sm:px-4"
        >
          <span className="text-4xl sm:text-5xl mb-4 block [@media(hover:hover)]:hover:scale-110 transition-transform duration-300">
            {AboutMeSkills[activeSkill].icon}
          </span>
          <h4 className="text-xl sm:text-2xl font-semibold text-primary mb-3">
            {AboutMeSkills[activeSkill].name}
          </h4>
          <p className="text-gray-200 leading-relaxed">
            {AboutMeSkills[activeSkill].description}
          </p>
        </div>

        <div className="mt-6">
          <div className="h-[2px] w-full bg-primary/20 rounded-full mt-4">
            <div ref={progressRef} className="h-full bg-primary rounded-full" />
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {AboutMeSkills.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                  ${
                    index === activeSkill
                      ? "bg-primary w-6"
                      : "bg-primary/30 hover:bg-primary/50"
                  }`}
                onClick={() => setActiveSkill(index)}
                aria-label={`Skill ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
    </div>
  );
};

export default SkillsSection;
