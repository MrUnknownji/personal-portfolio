import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  },
  HOVER: {
    SCALE: 1.02,
    DURATION: 0.3,
    EASE: "power2.out"
  }
} as const;

const journeyData = [
  {
    year: "2020",
    title: "Started Programming Journey",
    description: "Began learning web development with a focus on modern JavaScript and React."
  },
  {
    year: "2023",
    title: "Completed Graduation",
    description: "Successfully completed my graduation in BSc with Computer Science."
  },
  {
    year: "2024",
    title: "Joined TCS",
    description: "Started working as a Analyst in TCS."
  },
  {
    year: "2025",
    title: "Working and Learning",
    description: "Working as a Analyst in TCS and learning new technologies."
  }
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current || !itemsRef.current || !lineRef.current) return;

    const items = Array.from(itemsRef.current.children);
    const circles = Array.from(document.querySelectorAll('.journey-circle'));

    // Main animation timeline with single trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false,
        onUpdate: (self) => {
          gsap.to(lineRef.current, {
            opacity: 0.5 + (Math.sin(self.progress * Math.PI) * 0.5),
            duration: 0.1,
            ease: "none",
            overwrite: "auto"
          });
        }
      }
    });

    // Title animation
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

    // Line animation
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

    // Journey items animations
    items.forEach((item, index) => {
      // Staggered entrance animation
      tl.fromTo(
        item,
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
          ease: ANIMATION_CONFIG.ITEMS.EASE
        },
        `-=${index === 0 ? 0.8 : 0.4}`
      );
      
      // Circle animation
      tl.fromTo(
        circles[index],
        {
          backgroundColor: "transparent",
          scale: 1
        },
        {
          backgroundColor: "rgba(0, 255, 159, 0.8)",
          scale: 1.2,
          duration: 0.4,
          ease: "back.out(1.7)"
        },
        "-=0.3"
      );
      
      // Hover animations for each item
      if (itemRefs.current[index]) {
        const itemEl = itemRefs.current[index];
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl.to(itemEl, {
          scale: ANIMATION_CONFIG.HOVER.SCALE,
          x: 5,
          boxShadow: "0 10px 25px -5px rgba(0, 255, 159, 0.1)",
          borderColor: "rgba(0, 255, 159, 0.3)",
          duration: ANIMATION_CONFIG.HOVER.DURATION,
          ease: ANIMATION_CONFIG.HOVER.EASE
        });
        
        if (itemEl) {
          itemEl.addEventListener("mouseenter", () => hoverTl.play());
          itemEl.addEventListener("mouseleave", () => hoverTl.reverse());
        }
      }
    });

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
        className="absolute left-[7px] top-[4.5rem] bottom-4 w-[2px] bg-gradient-to-b from-primary/50 via-primary/30 to-transparent origin-top"
        style={{ willChange: "transform, opacity" }}
      />

      <div 
        ref={itemsRef}
        className="relative space-y-8 pl-8"
      >
        {journeyData.map((item, index) => (
          <div 
            key={item.year}
            ref={(el: HTMLDivElement | null) => { itemRefs.current[index] = el; }}
            className="relative cursor-pointer"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="journey-circle absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-transparent" />
            
            <div className="space-y-1 p-4 rounded-xl bg-gray-900/30 border border-primary/10">
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
