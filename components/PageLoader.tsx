"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function PageLoader() {
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        duration: 5,
        rotate: 360,
        repeat: -1,
        ease: "none",
      });

      particlesRef.current.forEach((particle, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 60;

        gsap.set(particle, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });

        gsap.to(particle, {
          duration: "random(1.5, 2.5)",
          scale: "random(0.5, 1.5)",
          opacity: 0.3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: i * 0.2,
        });
      });

      gsap.to(textRef.current, {
        duration: 0.8,
        opacity: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950">
      <div className="relative w-32 h-32">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) particlesRef.current[i] = el;
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary rounded-full"
          />
        ))}

        <div
          ref={circleRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-20 h-20 rounded-full border-2 border-primary"
            style={{
              borderStyle: "dashed",
              strokeDasharray: "31.4 31.4",
            }}
          />
        </div>
      </div>

      <div
        ref={textRef}
        className="mt-12 text-primary text-sm font-light tracking-widest uppercase"
      >
        Loading...
      </div>
    </div>
  );
}
