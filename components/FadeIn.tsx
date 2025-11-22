"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  delay?: number;
  start?: string;
  className?: string;
  stagger?: number;
}

export default function FadeIn({
  children,
  direction = "up",
  distance = 50,
  duration = 0.8,
  delay = 0,
  start = "top 85%",
  className = "",
  stagger = 0,
}: FadeInProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = elementRef.current;
      if (!el) return;

      let x = 0;
      let y = 0;

      switch (direction) {
        case "up":
          y = distance;
          break;
        case "down":
          y = -distance;
          break;
        case "left":
          x = distance;
          break;
        case "right":
          x = -distance;
          break;
        case "none":
          break;
      }

      gsap.fromTo(
        el.children,
        {
          opacity: 0,
          x,
          y,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none reverse", // Reverse on scroll up for better feel? Or "play none none none" for once? User said "reverse scroll" handling.
            // "play none none reverse" means:
            // onEnter: play
            // onLeave: none
            // onEnterBack: none
            // onLeaveBack: reverse (fade out when scrolling back up past the start)
          },
        }
      );
    },
    { scope: elementRef }
  );

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
