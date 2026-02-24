"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollMandala() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerStarRef = useRef<SVGGElement>(null);
  const middleLotusRef = useRef<SVGGElement>(null);
  const outerRingRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SVGGElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const setupTimeout = setTimeout(() => {
        gsap.set(containerRef.current, { x: "-5vw", y: "5vh" });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        tl.to(containerRef.current, {
          x: "80vw",
          y: "45vh",
          scale: 1.3,
          rotation: 45,
          ease: "sine.inOut",
          duration: 1,
        }).to(containerRef.current, {
          x: "5vw",
          y: "85vh",
          scale: 0.9,
          rotation: 90,
          ease: "sine.inOut",
          duration: 1,
        });

        const scrubConfig = {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        };

        gsap.to(innerStarRef.current, {
          rotation: 360,
          transformOrigin: "center center",
          scrollTrigger: scrubConfig,
        });

        gsap.to(middleLotusRef.current, {
          rotation: -180,
          transformOrigin: "center center",
          scrollTrigger: scrubConfig,
        });

        gsap.to(outerRingRef.current, {
          rotation: 360,
          transformOrigin: "center center",
          scrollTrigger: scrubConfig,
        });

        gsap.to(particlesRef.current, {
          rotation: -360,
          transformOrigin: "center center",
          scrollTrigger: scrubConfig,
        });
      }, 250);

      const breathe = gsap.to(containerRef.current, {
        opacity: 0.15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      return () => {
        clearTimeout(setupTimeout);
        breathe.kill();
      };
    },
    { scope: containerRef, dependencies: [pathname] },
  );

  return (
    <div
      ref={containerRef}
      className="fixed left-0 top-0 z-[-5] pointer-events-none mix-blend-screen"
      style={{
        width: "28vw",
        minWidth: "250px",
        height: "28vw",
        minHeight: "250px",
        transformOrigin: "center",
        opacity: 0.08,
      }}
    >
      <svg
        viewBox="-150 -150 300 300"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="mandala-grad-1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff5500" />
            <stop offset="50%" stopColor="#ff8c00" />
            <stop offset="100%" stopColor="#ffcc00" />
          </linearGradient>
          <linearGradient
            id="mandala-grad-2"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffcc00" />
            <stop offset="100%" stopColor="#ff0055" />
          </linearGradient>
          <filter id="clean-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#clean-glow)">
          <g ref={outerRingRef}>
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={`outer-${i}`} transform={`rotate(${i * 30})`}>
                <circle
                  cx="0"
                  cy="-100"
                  r="6"
                  fill="none"
                  stroke="url(#mandala-grad-1)"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
                <path
                  d="M -10 -100 L 0 -125 L 10 -100 Z"
                  fill="none"
                  stroke="url(#mandala-grad-2)"
                  strokeWidth="1"
                  opacity="0.7"
                />
                <line
                  x1="0"
                  y1="-85"
                  x2="0"
                  y2="-112"
                  stroke="url(#mandala-grad-1)"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </g>
            ))}
            <circle
              cx="0"
              cy="0"
              r="90"
              fill="none"
              stroke="url(#mandala-grad-1)"
              strokeWidth="0.75"
              strokeDasharray="3 6"
              opacity="0.7"
            />
            <circle
              cx="0"
              cy="0"
              r="130"
              fill="none"
              stroke="url(#mandala-grad-2)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </g>

          <g ref={particlesRef}>
            {Array.from({ length: 24 }).map((_, i) => (
              <circle
                key={`particle-${i}`}
                cx="0"
                cy={i % 2 === 0 ? "-120" : "-70"}
                r={i % 2 === 0 ? "1.5" : "2"}
                fill="#ffcc00"
                transform={`rotate(${i * 15})`}
                opacity="0.9"
              />
            ))}
          </g>

          <g ref={middleLotusRef}>
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={`middle-${i}`}
                transform={`rotate(${i * 45})`}
                d="M 0 0 C 20 -35, 30 -70, 0 -110 C -30 -70, -20 -35, 0 0 Z"
                fill="none"
                opacity="0.6"
                stroke="url(#mandala-grad-1)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={`middle-sub-${i}`}
                transform={`rotate(${i * 45 + 22.5})`}
                d="M 0 0 C 12 -25, 18 -50, 0 -80 C -18 -50, -12 -25, 0 0 Z"
                fill="none"
                opacity="0.8"
                stroke="#ffcc00"
                strokeWidth="0.75"
              />
            ))}
          </g>

          <g ref={innerStarRef}>
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={`inner-${i}`}
                transform={`rotate(${i * 30})`}
                d="M 0 -8 L 6 -35 L 0 -50 L -6 -35 Z"
                fill="none"
                stroke="url(#mandala-grad-2)"
                strokeWidth="1"
                opacity="0.9"
              />
            ))}
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="none"
              stroke="#ffcc00"
              strokeWidth="1"
              opacity="0.9"
            />
            <circle cx="0" cy="0" r="4" fill="#ffcc00" opacity="1" />
          </g>
        </g>
      </svg>
    </div>
  );
}
