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
      className="group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full
                 bg-[#111] border border-white/10 shadow-md
                 transition-all duration-500 ease-out hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]
                 cursor-pointer overflow-hidden"
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Continuous Shimmer on Hover */}
      <div
        className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_2s_infinite]
                   bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        style={{ width: "200%" }}
      />

      {/* Decorative left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary/80 transition-colors duration-500" />

      {/* Status Dot Container */}
      <div className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
        <span
          ref={pulseRef}
          className="absolute inset-0 rounded-full bg-primary opacity-80"
        />
        <span className="relative w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
      </div>

      {/* Text */}
      <span className="relative text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/80 group-hover:text-primary transition-colors duration-300">
        Available For Hire
      </span>
    </div>
  );
};

export default HireBadge;
