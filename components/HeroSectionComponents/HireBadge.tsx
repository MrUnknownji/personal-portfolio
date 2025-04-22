import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const HireBadge = () => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!badgeRef.current || !pulseRef.current) return;

      gsap.to(pulseRef.current, {
        scale: 1.8,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
      });

      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(badgeRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });

      const handleMouseEnter = () => hoverTl.play();
      const handleMouseLeave = () => hoverTl.reverse();

      const currentBadgeRef = badgeRef.current;
      currentBadgeRef.addEventListener("mouseenter", handleMouseEnter);
      currentBadgeRef.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        currentBadgeRef.removeEventListener("mouseenter", handleMouseEnter);
        currentBadgeRef.removeEventListener("mouseleave", handleMouseLeave);
        hoverTl.kill();
      };
    },
    { scope: badgeRef },
  );

  return (
    <div className="relative inline-block">
      <div
        ref={badgeRef}
        className="relative inline-flex items-center px-4 py-2 rounded-full
        bg-primary/10 text-primary text-sm font-medium border border-primary/20
        hover:bg-primary/20 transition-colors duration-300 cursor-pointer transform-gpu"
      >
        <span className="absolute inset-0 border border-primary/20 rounded-full" />
        <span className="relative flex h-2 w-2 mr-2">
          <span
            ref={pulseRef}
            className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 transform-gpu"
          />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        Available for hire
      </div>
    </div>
  );
};

export default HireBadge;
