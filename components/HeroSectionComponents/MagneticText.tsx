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

      gsap.from(charElements, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: "power3.out",
      });

      const handleMouseMove = (e: MouseEvent) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        charElements.forEach((char) => {
          const charRect = char.getBoundingClientRect();
          const charCenterX = charRect.left + charRect.width / 2;
          const charCenterY = charRect.top + charRect.height / 2;

          const dist = Math.hypot(mouseX - charCenterX, mouseY - charCenterY);

          const maxDist = 80;
          if (dist < maxDist) {
            const intensity = 1 - dist / maxDist;
            const moveX = (mouseX - charCenterX) * intensity * 0.1;
            const moveY = (mouseY - charCenterY) * intensity * 0.1;

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

      const handleMouseLeave = () => {
        gsap.to(charElements, {
          x: 0,
          y: 0,
          scale: 1,
          color: "inherit",
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
        });
      };

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
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
          style={{ position: "relative", willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Component>
  );
};
