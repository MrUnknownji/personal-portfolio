"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { HyperText } from "@/components/ui/HyperText";

export const Title = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      // Entrance Animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Continuous Gradient Animation
      gsap.to(titleRef.current, {
        backgroundPosition: "200% center",
        duration: 8,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="overflow-visible py-2 cursor-default">
      <h1
        ref={titleRef}
        className="hero-title font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight
                   bg-[size:200%_auto] bg-clip-text text-transparent
                   bg-gradient-to-r from-primary via-accent to-primary"
      >
        <HyperText
          duration={1200}
          delay={500}
          animateOnHover={true}
          startOnView={false}
          className="bg-[size:200%_auto] bg-clip-text text-transparent
                     bg-gradient-to-r from-primary via-accent to-primary"
        >
          Sandeep Kumar
        </HyperText>
      </h1>
    </div>
  );
};
