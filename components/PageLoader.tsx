"use client";
import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  CIRCLE: {
    ROTATION_DURATION: 4,
    SIZE: 20,
    BORDER_WIDTH: 2
  },
  PARTICLES: {
    COUNT: 6,
    RADIUS: 60,
    DURATION_RANGE: [1.5, 2.5],
    SCALE_RANGE: [0.5, 1.5],
    DELAY_INCREMENT: 0.2,
    OPACITY: 0.3
  },
  TEXT: {
    DURATION: 0.8,
    OPACITY: 0.5
  }
} as const;

export default function PageLoader() {
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const setupAnimations = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    timelineRef.current = gsap.timeline();

    if (timelineRef.current) {
      timelineRef.current.to(circleRef.current, {
        duration: ANIMATION_CONFIG.CIRCLE.ROTATION_DURATION,
        rotate: 360,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });

      particlesRef.current.forEach((particle, i) => {
        const angle = (i / ANIMATION_CONFIG.PARTICLES.COUNT) * Math.PI * 2;
        const radius = ANIMATION_CONFIG.PARTICLES.RADIUS;

        gsap.set(particle, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          transformOrigin: "center center"
        });

        timelineRef.current?.to(particle, {
          duration: gsap.utils.random(
            ANIMATION_CONFIG.PARTICLES.DURATION_RANGE[0],
            ANIMATION_CONFIG.PARTICLES.DURATION_RANGE[1]
          ),
          scale: gsap.utils.random(
            ANIMATION_CONFIG.PARTICLES.SCALE_RANGE[0],
            ANIMATION_CONFIG.PARTICLES.SCALE_RANGE[1]
          ),
          opacity: ANIMATION_CONFIG.PARTICLES.OPACITY,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: i * ANIMATION_CONFIG.PARTICLES.DELAY_INCREMENT
        }, 0);
      });
      
      timelineRef.current.to(textRef.current, {
        duration: ANIMATION_CONFIG.TEXT.DURATION,
        opacity: ANIMATION_CONFIG.TEXT.OPACITY,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut"
      }, 0);
    }
  }, [circleRef, textRef, particlesRef]);

  useGSAP(() => {
    setupAnimations();
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [setupAnimations]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950">
      <div className="relative w-32 h-32 transform-gpu">
        {Array.from({ length: ANIMATION_CONFIG.PARTICLES.COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) particlesRef.current[i] = el;
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-gradient-to-r from-primary to-accent rounded-full transform-gpu"
            style={{ backfaceVisibility: "hidden" }}
          />
        ))}

        <div
          ref={circleRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="rounded-full border-2 border-primary"
            style={{
              width: `${ANIMATION_CONFIG.CIRCLE.SIZE * 2}px`,
              height: `${ANIMATION_CONFIG.CIRCLE.SIZE * 2}px`,
              borderWidth: ANIMATION_CONFIG.CIRCLE.BORDER_WIDTH,
              borderStyle: "dashed",
              strokeDasharray: "31.4 31.4",
              background: "radial-gradient(circle, rgba(79, 209, 197, 0.1) 0%, transparent 70%)",
              boxShadow: "0 0 15px rgba(79, 209, 197, 0.2)",
              backfaceVisibility: "hidden"
            }}
          />
        </div>
      </div>

      <div
        ref={textRef}
        className="mt-12 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-sm font-light tracking-[0.2em] uppercase transform-gpu"
        style={{ backfaceVisibility: "hidden" }}
      >
        Loading...
      </div>
    </div>
  );
}
