import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const HireBadge = () => {
  const badgeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!badgeRef.current) return;
    const hoverTl = gsap.timeline({ paused: true });
    hoverTl
      .to(badgeRef.current, { scale: 1.05, duration: 0.2, ease: "power2.out" })
      .to(
        ".pulse-ring",
        { scale: 1.5, opacity: 0, duration: 0.8, ease: "power2.out" },
        0
      );

    const handleMouseEnter = () => {
      hoverTl.play();
    };
    const handleMouseLeave = () => {
      hoverTl.reverse();
    };

    badgeRef.current.addEventListener("mouseenter", handleMouseEnter);
    badgeRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      badgeRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      badgeRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <span
        ref={badgeRef}
        className="relative inline-flex items-center px-4 py-2 rounded-full
        bg-primary/10 text-primary text-sm font-medium border border-primary/20
        hover:bg-primary/20 transition-all duration-300 cursor-pointer"
      >
        <span className="pulse-ring absolute inset-0 border-2 border-primary/30 rounded-full" />
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        Available for hire
      </span>
    </div>
  );
};

export default HireBadge;
