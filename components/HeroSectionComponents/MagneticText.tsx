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

  // Split text into characters
  const chars = children.split("");

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const charElements = el.querySelectorAll(".char");
      if (!charElements.length) return;

      // Initial animation
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
          // Use offset relative to the char's own center, but we can't trust getBoundingClientRect if it moves.
          // Instead, we damp the movement or use a stable reference? 
          // Actually, simply scaling the distance calculation by the INVERSE of the movement might help,
          // but the easiest fix for "flickering" is to NOT move the element under the cursor so much it leaves the cursor.
          // Or, use a proxy element for the hit area. 
          // For now, I'll reduce the intensity and maxDist to minimize "escaping".

          const maxDist = 80; // Reduced from 150 to keep interaction tighter
          if (dist < maxDist) {
            const intensity = 1 - dist / maxDist;
            // Dampen movement significantly so the element stays "under" the cursor primarily
            const moveX = (mouseX - charCenterX) * intensity * 0.1;
            const moveY = (mouseY - charCenterY) * intensity * 0.1;

            gsap.to(char, {
              x: moveX,
              y: moveY,
              scale: 1 + intensity * 0.1,
              color: "#00ff9f",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            // Reset if out of range
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
    { scope: containerRef }
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
