import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const journeyData = [
  {
    year: "2020",
    title: "Started Programming Journey",
    description:
      "Began learning web development with a focus on modern JavaScript and React. Built my first few projects and fell in love with coding.",
  },
  {
    year: "2023",
    title: "Completed Graduation",
    description:
      "Successfully completed my graduation in BSc with Computer Science, building a strong foundation in algorithms and data structures.",
  },
  {
    year: "2024",
    title: "Joined TCS",
    description:
      "Started working as an Analyst in TCS. Gained professional experience in large-scale enterprise applications and agile workflows.",
  },
  {
    year: "2025",
    title: "Working and Learning",
    description:
      "Continuing to grow as a developer, exploring advanced backend architectures, cloud technologies, and contributing to open source.",
  },
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !lineRef.current || !progressLineRef.current)
        return;

      const items = gsap.utils.toArray(".journey-item") as HTMLElement[];
      const dots = gsap.utils.toArray(".journey-dot") as HTMLElement[];

      gsap.set(items, { opacity: 0, x: 50 });
      gsap.set(dots, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      items.forEach((item, index) => {
        const dot = dots[index];

        tl.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }).to(
          item,
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2",
        );
      });

      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: 1,
          },
        },
      );

      items.forEach((item) => {
        const card = item.querySelector(".journey-card") as HTMLElement;
        if (!card) return;
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="relative py-10">
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-12 text-left pb-2">
        My Journey
      </h3>

      <div className="relative pl-6 md:pl-10">
        {/* Base Line */}
        <div
          ref={lineRef}
          className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-[2px] bg-white/10 rounded-full"
        />

        {/* Progress Line */}
        <div
          ref={progressLineRef}
          className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-accent to-primary rounded-full origin-top"
        />

        <div className="flex flex-col gap-12">
          {journeyData.map((item, index) => (
            <div
              key={index}
              className="journey-item relative pl-8 md:pl-12 group"
            >
              {/* Dot */}
              <div className="journey-dot absolute left-0 md:left-2 top-6 w-6 h-6 rounded-full border-2 border-primary bg-[#0a0a0a] z-10 flex items-center justify-center shadow-none">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>

              {/* Card */}
              <div
                className="journey-card relative bg-card border border-border/50 rounded-xl p-6 md:p-8 transition-all duration-300 overflow-hidden transform-gpu group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:bg-accent/10 z-10"
                style={{
                  // @ts-ignore
                  "--mouse-x": "0px",
                  "--mouse-y": "0px",
                }}
              >
                {/* Mouse Glow Gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.06), transparent 40%)",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                    <h4 className="text-xl md:text-2xl font-bold text-foreground tracking-wide group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h4>
                    <span className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-mono font-bold rounded-lg bg-primary/5 text-primary border border-primary/20 group-hover:bg-primary/10 transition-all duration-300">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed group-hover:text-foreground/90 transition-colors duration-300 font-light">
                    {item.description}
                  </p>
                </div>

                {/* Decorative corner gradient */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneySection;
