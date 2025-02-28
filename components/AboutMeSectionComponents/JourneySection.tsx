import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  CONTAINER: {
    DURATION: 0.8,
    EASE: "power3.out"
  },
  ITEMS: {
    STAGGER: 0.15,
    DURATION: 0.6,
    Y_OFFSET: 30,
    EASE: "power2.out"
  },
  LINE: {
    DURATION: 1.2,
    EASE: "power2.inOut",
    SCALE_Y: 0
  }
} as const;

const journeyData = [
  {
    year: "2020",
    title: "Started Programming Journey",
    description: "Began learning web development with a focus on modern JavaScript and React."
  },
  {
    year: "2021",
    title: "First Professional Project",
    description: "Successfully delivered my first commercial web application using Next.js and TypeScript."
  },
  {
    year: "2022",
    title: "Expanded Skill Set",
    description: "Mastered full-stack development with Node.js, Express, and MongoDB."
  },
  {
    year: "2023",
    title: "Senior Developer",
    description: "Led multiple successful projects and mentored junior developers."
  }
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current || !itemsRef.current || !lineRef.current) return;

    const items = itemsRef.current.children;

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
        y: ANIMATION_CONFIG.ITEMS.Y_OFFSET 
      },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.CONTAINER.DURATION,
        ease: ANIMATION_CONFIG.CONTAINER.EASE
      }
    );

    tl.fromTo(
      lineRef.current,
      { scaleY: ANIMATION_CONFIG.LINE.SCALE_Y },
      {
        scaleY: 1,
        duration: ANIMATION_CONFIG.LINE.DURATION,
        ease: ANIMATION_CONFIG.LINE.EASE
      },
      "-=0.4"
    );

    tl.fromTo(
      items,
      { 
        opacity: 0,
        x: -20,
        y: ANIMATION_CONFIG.ITEMS.Y_OFFSET 
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: ANIMATION_CONFIG.ITEMS.DURATION,
        stagger: ANIMATION_CONFIG.ITEMS.STAGGER,
        ease: ANIMATION_CONFIG.ITEMS.EASE
      },
      "-=0.8"
    );

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="relative space-y-8"
      style={{ willChange: "transform" }}
    >
      <h3 
        ref={titleRef}
        className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
      >
        My Journey
      </h3>

      <div 
        ref={lineRef}
        className="absolute left-[7px] top-[5.5rem] bottom-4 w-[2px] bg-gradient-to-b from-primary/50 via-primary/30 to-transparent origin-top"
        style={{ willChange: "transform" }}
      />

      <div 
        ref={itemsRef}
        className="relative space-y-8 pl-8"
      >
        {journeyData.map((item, index) => (
          <div 
            key={item.year}
            className="relative"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-background" />
            
            <div className="space-y-1 p-4 rounded-xl bg-gray-900/30 border border-primary/10 hover:border-primary/20 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2 py-0.5 text-sm rounded bg-primary/10 text-primary font-medium">
                  {item.year}
                </span>
                <h4 className="font-medium text-lg text-gray-200">
                  {item.title}
                </h4>
              </div>
              <p className="text-gray-400 text-sm sm:text-base pl-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneySection;
