import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_ITEMS = [
  {
    year: "2023",
    title: "Senior Full Stack Developer",
    company: "Tech Innovators Inc.",
    description: "Leading development of enterprise-scale applications, mentoring junior developers, and implementing cutting-edge technologies."
  },
  {
    year: "2021",
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    description: "Developed and maintained multiple client projects, focusing on performance optimization and user experience."
  },
  {
    year: "2019",
    title: "Frontend Developer",
    company: "Creative Web Agency",
    description: "Created responsive web applications and implemented modern UI/UX designs using React and Next.js."
  }
] as const;

const ANIMATION_CONFIG = {
  CONTAINER: {
    DURATION: 0.8,
    EASE: "power3.out",
    Y_OFFSET: 50,
    OPACITY: 0
  },
  ITEMS: {
    DURATION: 0.6,
    STAGGER: 0.2,
    Y_OFFSET: 30,
    OPACITY: 0,
    SCALE: 0.95,
    EASE: "power2.out"
  },
  LINE: {
    DURATION: 1.5,
    EASE: "power2.inOut",
    SCALE_Y: 0
  }
} as const;

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

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
      lineRef.current,
      { scaleY: ANIMATION_CONFIG.LINE.SCALE_Y },
      {
        scaleY: 1,
        duration: ANIMATION_CONFIG.LINE.DURATION,
        ease: ANIMATION_CONFIG.LINE.EASE
      },
      "-=0.4"
    )
    .fromTo(
      itemsRef.current,
      {
        y: ANIMATION_CONFIG.ITEMS.Y_OFFSET,
        opacity: ANIMATION_CONFIG.ITEMS.OPACITY,
        scale: ANIMATION_CONFIG.ITEMS.SCALE
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.ITEMS.DURATION,
        stagger: ANIMATION_CONFIG.ITEMS.STAGGER,
        ease: ANIMATION_CONFIG.ITEMS.EASE,
        clearProps: "all"
      },
      "-=1"
    );
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-8">Professional Journey</h3>
      
      {/* Timeline line */}
      <div
        ref={lineRef}
        className="absolute left-[21px] top-[4.5rem] bottom-4 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent origin-top"
      />

      {/* Journey items */}
      <div className="space-y-8">
        {JOURNEY_ITEMS.map((item, index) => (
          <div
            key={item.year}
            ref={el => {
              if (el) itemsRef.current[index] = el;
            }}
            className="relative pl-12 transform-gpu"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-[11px] h-[11px] rounded-full bg-primary border-2 border-primary/30 shadow-glow" />
            
            {/* Content */}
            <div className="bg-secondary/40 rounded-lg p-6 backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:border-primary/20 hover:bg-secondary/60">
              <div className="text-sm text-primary mb-2">{item.year}</div>
              <h4 className="text-xl font-semibold text-gray-200 mb-1">{item.title}</h4>
              <div className="text-accent mb-3">{item.company}</div>
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneySection;
