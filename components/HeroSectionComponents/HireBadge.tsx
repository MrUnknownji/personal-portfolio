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
      className="relative inline-flex items-center px-4 py-1.5 rounded-full
                 bg-primary/5 text-primary text-xs uppercase tracking-widest font-semibold border border-primary/10
                 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer transform-gpu shadow-[0_0_15px_-5px_rgba(0,255,159,0.2)]"
    >
      <span className="relative flex h-2 w-2 mr-3">
        <span
          ref={pulseRef}
          className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      Available for hire
    </div>
  );
};

export default HireBadge;
