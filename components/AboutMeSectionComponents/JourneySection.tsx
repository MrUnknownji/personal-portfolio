import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  CONTAINER: {
    DURATION: 0.8,
    EASE: "power3.out",
  },
  ITEMS: {
    STAGGER: 0.15,
    DURATION: 0.6,
    Y_OFFSET: 30,
    EASE: "power2.out",
  },
  LINE: {
    DURATION: 1.2,
    EASE: "power2.inOut",
    SCALE_Y: 0,
  },
} as const;

const journeyData = [
  {
    year: "2020",
    title: "Started Programming Journey",
    description:
      "Began learning web development with a focus on modern JavaScript and React.",
  },
  {
    year: "2023",
    title: "Completed Graduation",
    description:
      "Successfully completed my graduation in BSc with Computer Science.",
  },
  {
    year: "2024",
    title: "Joined TCS",
    description: "Started working as an Analyst in TCS.",
  },
  {
    year: "2025",
    title: "Working and Learning",
    description: "Working as an Analyst in TCS and learning new technologies.",
  },
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !titleRef.current ||
        !itemsContainerRef.current ||
        !lineRef.current
      )
        return;

      const items = Array.from(itemsContainerRef.current.children);
      const circles = Array.from(
        containerRef.current.querySelectorAll(".journey-circle"),
      );

      gsap.set(titleRef.current, {
        opacity: 0,
        y: ANIMATION_CONFIG.ITEMS.Y_OFFSET,
      });
      gsap.set(itemsContainerRef.current.children, { opacity: 0, x: -20 });
      gsap.set(lineRef.current, { scaleY: 0, opacity: 0 });
      gsap.set(circles, {
        scale: 0,
        backgroundColor: "var(--color-secondary)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play pause resume reverse",
          markers: false,
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.CONTAINER.DURATION,
        ease: ANIMATION_CONFIG.CONTAINER.EASE,
      });

      tl.to(
        lineRef.current,
        {
          scaleY: 1,
          opacity: 1,
          duration: ANIMATION_CONFIG.LINE.DURATION,
          ease: ANIMATION_CONFIG.LINE.EASE,
        },
        "-=0.4",
      );

      items.forEach((item, index) => {
        tl.to(
          item,
          {
            opacity: 1,
            x: 0,
            duration: ANIMATION_CONFIG.ITEMS.DURATION,
            ease: ANIMATION_CONFIG.ITEMS.EASE,
            clearProps: "transform",
          },
          `-=${ANIMATION_CONFIG.LINE.DURATION - 0.4 - index * ANIMATION_CONFIG.ITEMS.STAGGER}`,
        );

        if (circles[index]) {
          tl.to(
            circles[index],
            {
              scale: 1,
              backgroundColor: "var(--color-primary)",
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            "-=0.3",
          );
        }
      });

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        gsap.killTweensOf([titleRef.current, lineRef.current, items, circles]);
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="relative">
      <h3
        ref={titleRef}
        className="text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-12 text-left"
      >
        My Journey
      </h3>

      <div className="relative pl-8 pr-4">
        <div
          ref={lineRef}
          className="absolute left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary/40 via-primary/20 to-transparent origin-top"
          style={{ willChange: "transform, opacity" }}
        />

        <div ref={itemsContainerRef} className="relative flex flex-col gap-y-10">
          {journeyData.map((item) => (
            <div
              key={item.year}
              className="relative group pl-6"
              style={{ willChange: "opacity, transform" }}
            >
              <div
                className="journey-circle absolute top-4 w-3 h-3 rounded-full border border-primary/50 bg-[#0a0a0a] shadow-[0_0_10px_rgba(0,255,159,0.3)] z-10"
                style={{
                  left: "-1.325rem",
                  willChange: "background-color, transform",
                }}
              />

              {/* Card Style */}
              <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-xl p-6
                              transition-all duration-300 ease-out
                              hover:bg-white/[0.04] hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5
                              group-hover:-translate-y-1">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                   <h4 className="font-medium text-lg text-gray-100 tracking-wide">
                    {item.title}
                  </h4>
                  <span className="journey-year inline-block px-3 py-1 text-xs font-mono rounded-full
                                   bg-primary/10 text-primary border border-primary/20">
                    {item.year}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneySection;
