"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

interface MagneticTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const MagneticText = ({
  children,
  className,
  as: Component = "div",
}: MagneticTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const split = new SplitText(el, { type: "chars" });
      const chars = split.chars;
      if (!chars || chars.length === 0) return;

      const handleMouseEnter = (e: MouseEvent) => {
        if (hoverTimelineRef.current) {
          hoverTimelineRef.current.kill();
        }

        const rect = el.getBoundingClientRect();
        const originX = e.clientX - rect.left;
        const originY = e.clientY - rect.top;

        const maxDist = Math.hypot(
          Math.max(originX, rect.width - originX),
          Math.max(originY, rect.height - originY),
        );

        hoverTimelineRef.current = gsap.timeline();

        chars.forEach((char) => {
          const charRect = char.getBoundingClientRect();
          const charCenterX = charRect.left + charRect.width / 2 - rect.left;
          const charCenterY = charRect.top + charRect.height / 2 - rect.top;
          const distance = Math.hypot(
            originX - charCenterX,
            originY - charCenterY,
          );
          const delay = gsap.utils.mapRange(0, maxDist, 0, 0.5)(distance);

          hoverTimelineRef.current?.to(
            char,
            {
              y: -10,
              scale: 1.1,
              color: "#00ff9f",
              duration: 0.3,
              ease: "power2.out",
            },
            delay,
          );
        });
      };

      const handleMouseLeave = () => {
        if (hoverTimelineRef.current) {
          hoverTimelineRef.current.kill();
        }

        hoverTimelineRef.current = gsap.timeline();
        hoverTimelineRef.current.to(chars, {
          y: 0,
          scale: 1,
          color: "inherit",
          duration: 0.4,
          ease: "power2.inOut",
          stagger: {
            amount: 0.5,
            from: "random",
          },
        });
      };

      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        if (split.revert) {
          split.revert();
        }
      };
    },
    { scope: containerRef },
  );

  return (
    <Component ref={containerRef} className={className}>
      {children}
    </Component>
  );
};
