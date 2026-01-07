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
                 bg-zinc-900/90 border border-emerald-500/20
                 hover:border-emerald-500/40 hover:bg-zinc-900
                 transition-all duration-300 cursor-default overflow-hidden"
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Status Dot Container */}
      <div className="relative flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
        {/* Pulse Ring */}
        <span
          ref={pulseRef}
          className="absolute inset-0 rounded-full bg-emerald-400 opacity-40"
        />
        {/* Core Dot */}
        <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      </div>

      {/* Text */}
      <span className="relative text-emerald-100/90 text-xs font-medium tracking-wide">
        Available for hire
      </span>
    </div>
  );
};

export default HireBadge;
