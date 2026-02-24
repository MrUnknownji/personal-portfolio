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
        scale: 3,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power1.out",
        transformOrigin: "center",
      });
    },
    { scope: badgeRef },
  );

  return (
    <div
      ref={badgeRef}
      className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                 bg-zinc-900/90 border border-primary/20
                 hover:border-primary/40 hover:bg-zinc-900
                 transition-all duration-300 cursor-default overflow-hidden"
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Status Dot Container */}
      <div className="relative flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
        {/* Pulse Ring */}
        <span
          ref={pulseRef}
          className="absolute inset-0 rounded-full bg-primary opacity-40"
        />
        {/* Core Dot */}
        <span className="relative w-2.5 h-2.5 rounded-full bg-primary shadow-none" />
      </div>

      {/* Text */}
      <span className="relative text-primary font-medium text-xs tracking-wide">
        Available for hire
      </span>
    </div>
  );
};

export default HireBadge;
