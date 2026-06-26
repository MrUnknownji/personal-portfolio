"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollMandala() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerStarRef = useRef<SVGGElement>(null);
  const middleLotusRef = useRef<SVGGElement>(null);
  const outerRingRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SVGGElement>(null);
  const frameRef = useRef<number | null>(null);
  const maxScrollRef = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lerp = (start: number, end: number, amount: number) => {
      return start + (end - start) * amount;
    };

    const updateScrollBounds = () => {
      maxScrollRef.current = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
    };

    const update = () => {
      frameRef.current = null;

      if (reduceMotion) {
        container.style.transform = "translate3d(5vw, 80vh, 0) scale(0.9)";
        return;
      }

      const maxScroll = maxScrollRef.current;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const clamped = Math.max(0, Math.min(1, progress));
      const firstHalf = clamped <= 0.5;
      const t = firstHalf ? clamped * 2 : (clamped - 0.5) * 2;

      const x = firstHalf ? lerp(-5, 80, t) : lerp(80, 5, t);
      const y = firstHalf ? lerp(5, 45, t) : lerp(45, 85, t);
      const scale = firstHalf ? lerp(1, 1.3, t) : lerp(1.3, 0.9, t);
      const rotation = firstHalf ? lerp(0, 45, t) : lerp(45, 90, t);

      container.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale}) rotate(${rotation}deg)`;
      innerStarRef.current?.setAttribute("transform", `rotate(${clamped * 360})`);
      middleLotusRef.current?.setAttribute("transform", `rotate(${clamped * -180})`);
      outerRingRef.current?.setAttribute("transform", `rotate(${clamped * 360})`);
      particlesRef.current?.setAttribute("transform", `rotate(${clamped * -360})`);
    };

    const requestUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    const handleResize = () => {
      updateScrollBounds();
      requestUpdate();
    };

    updateScrollBounds();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleResize);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed left-0 top-0 z-[-5] pointer-events-none mix-blend-screen animate-mandala-breathe"
      style={{
        width: "28vw",
        minWidth: "250px",
        height: "28vw",
        minHeight: "250px",
        transformOrigin: "center",
        opacity: 0.08,
        willChange: "transform, opacity",
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
          <filter id="clean-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.1" result="blur" />
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
