"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const HireBadge = () => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.to(pulseRef.current, {
        scale: 1.8,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
      });

      const hoverAnimation = gsap.to(badgeRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
        paused: true,
      });

      badgeRef.current?.addEventListener("mouseenter", () =>
        hoverAnimation.play(),
      );
      badgeRef.current?.addEventListener("mouseleave", () =>
        hoverAnimation.reverse(),
      );
    },
    { scope: badgeRef },
  );

  return (
    <div
      ref={badgeRef}
      className="relative inline-flex items-center px-4 py-2 rounded-full
                 bg-primary/10 text-primary text-sm font-medium border border-primary/20
                 hover:bg-primary/20 transition-colors duration-300 cursor-pointer transform-gpu"
    >
      <span className="relative flex h-2 w-2 mr-2">
        <span
          ref={pulseRef}
          className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      Available for hire
    </div>
  );
};

export default HireBadge;
