"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticTextProps {
  children: string;
  className?: string;
  as?: React.ElementType;
}

export const MagneticText = ({
  children,
  className,
  as: Component = "div",
}: MagneticTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const chars = children.split("");

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const charElements = el.querySelectorAll(".char");
      if (!charElements.length) return;
      const chars = Array.from(charElements) as HTMLElement[];
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let charMetrics: Array<{ x: number; y: number }> = [];
      let rafId: number | null = null;
      let lastFrameTime = 0;
      let pointer = { x: 0, y: 0 };

      const measureChars = () => {
        charMetrics = chars.map((char) => {
          const rect = char.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        });
      };

      gsap.set(chars, { willChange: "transform" });
      gsap.from(charElements, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(chars, { clearProps: "willChange" });
        },
      });

      if (prefersReducedMotion) return;

      const applyMagnet = (timestamp: number) => {
        rafId = null;

        if (timestamp - lastFrameTime < 33) {
          rafId = requestAnimationFrame(applyMagnet);
          return;
        }

        lastFrameTime = timestamp;
        const mouseX = pointer.x;
        const mouseY = pointer.y;

        chars.forEach((char, index) => {
          const metric = charMetrics[index];
          if (!metric) return;

          const dist = Math.hypot(mouseX - metric.x, mouseY - metric.y);

          const maxDist = 80;
          if (dist < maxDist) {
            const intensity = 1 - dist / maxDist;
            const moveX = (mouseX - metric.x) * intensity * 0.1;
            const moveY = (mouseY - metric.y) * intensity * 0.1;

            gsap.to(char, {
              x: moveX,
              y: moveY,
              scale: 1 + intensity * 0.1,
              color: "#ff9233",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(char, {
              x: 0,
              y: 0,
              scale: 1,
              color: "inherit",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      };

      const handleMouseMove = (e: MouseEvent) => {
        pointer = { x: e.clientX, y: e.clientY };
        if (rafId === null) {
          rafId = requestAnimationFrame(applyMagnet);
        }
      };

      const handleMouseLeave = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        gsap.to(charElements, {
          x: 0,
          y: 0,
          scale: 1,
          color: "inherit",
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(chars, { clearProps: "willChange" });
          },
        });
      };

      const handleMouseEnter = () => {
        gsap.set(chars, { willChange: "transform" });
        measureChars();
      };

      measureChars();
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("resize", measureChars);

      return () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", measureChars);
      };
    },
    { scope: containerRef },
  );

  return (
    <Component ref={containerRef} className={`${className} inline-block`}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="char inline-block cursor-default"
          style={{ position: "relative" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Component>
  );
};
