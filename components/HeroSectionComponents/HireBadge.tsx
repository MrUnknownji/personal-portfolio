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
        scale: 2,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
      });

      const hoverAnimation = gsap.to(badgeRef.current, {
        scale: 1.02,
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
      className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full
                 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium tracking-wide border border-emerald-500/20
                 hover:bg-emerald-500/20 transition-colors duration-300 cursor-default backdrop-blur-sm"
    >
      <span className="relative flex h-2 w-2">
        <span
          ref={pulseRef}
          className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      Available for hire
    </div>
  );
};

export default HireBadge;
