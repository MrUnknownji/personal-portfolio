"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GlobalBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    const animation = gsap.to(bgRef.current, {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-background">
      <div
        ref={bgRef}
        className="absolute top-[-20%] left-[-10%] w-[120%] h-[150%] opacity-[0.07]"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="premium-jaali"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* Outer Star/Diamond */}
              <path
                d="M40 0 L80 40 L40 80 L0 40 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              {/* Inner Diamond */}
              <path
                d="M40 15 L65 40 L40 65 L15 40 Z"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1"
                opacity="0.8"
              />
              {/* Center Dot */}
              <circle
                cx="40"
                cy="40"
                r="3"
                fill="var(--primary)"
                opacity="0.8"
              />
              {/* Corner Accents */}
              <path
                d="M0 0 L15 15 M80 0 L65 15 M0 80 L15 65 M80 80 L65 65"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#premium-jaali)"
          />
        </svg>
      </div>

      {/* Subtle vignettes to focus content */}
      <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-background to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-[10vw] h-full bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[10vw] h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}
