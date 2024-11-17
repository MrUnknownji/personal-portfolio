import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AboutMeSkills } from "@/data/data";

const SkillsSection = () => {
  const [activeSkill, setActiveSkill] = useState(0);
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % AboutMeSkills.length);
    }, 5000);

    gsap.fromTo(
      skillsRef.current,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
    );

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      skillContentRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
    );
  }, [activeSkill]);

  return (
    <div ref={skillsRef} className="bg-gray-800 p-6 rounded-lg shadow-inner">
      <h3 className="text-2xl font-semibold text-primary mb-4">Core Skills</h3>
      <div ref={skillContentRef} className="text-center">
        <span className="text-4xl mb-2 block">
          {AboutMeSkills[activeSkill].icon}
        </span>
        <h4 className="text-xl font-semibold text-accent mb-2">
          {AboutMeSkills[activeSkill].name}
        </h4>
        <p className="text-gray-300">
          {AboutMeSkills[activeSkill].description}
        </p>
      </div>
      <div className="flex justify-center mt-4">
        {AboutMeSkills.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-1 ${
              index === activeSkill ? "bg-primary" : "bg-gray-600"
            }`}
            onClick={() => setActiveSkill(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
