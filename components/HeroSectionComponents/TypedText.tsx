import { useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  INITIAL: {
    Y: -30,
    OPACITY: 0
  },
  ENTER: {
    DURATION: 0.6,
    STAGGER: 0.05,
    EASE: "back.out(1.7)"
  },
  EXIT: {
    DURATION: 0.4,
    STAGGER: 0.02,
    Y: 20,
    EASE: "power2.in"
  },
  DISPLAY_DURATION: 2000
} as const;

const TypedText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const TEXTS = useMemo(
    () => [
      "Building robust backend systems",
      "Crafting intuitive front-end interfaces",
      "Optimizing database performance",
      "Implementing secure authentication",
      "Developing RESTful APIs",
      "Creating responsive web designs",
    ],
    [],
  );

  const animateText = useCallback(
    async (text: string) => {
      if (!containerRef.current || isAnimating) return;
      setIsAnimating(true);

      containerRef.current.innerHTML = "";

      const measureDiv = document.createElement("div");
      measureDiv.style.cssText = "visibility: hidden; position: absolute; white-space: nowrap;";
      containerRef.current.appendChild(measureDiv);

      const positions: { left: number }[] = [];
      text.split("").forEach((char) => {
        const measureSpan = document.createElement("span");
        measureSpan.textContent = char === " " ? "\u00A0" : char;
        measureSpan.style.display = "inline-block";
        measureDiv.appendChild(measureSpan);
        positions.push({
          left: measureSpan.offsetLeft,
        });
      });
      measureDiv.remove();

      const chars = text.split("").map((char, index) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.cssText = `
          display: inline-block;
          position: absolute;
          left: ${positions[index].left}px;
          transform-origin: center;
          will-change: transform, opacity;
        `;
        containerRef.current?.appendChild(span);
        return span;
      });

      gsap.set(chars, {
        y: ANIMATION_CONFIG.INITIAL.Y,
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
      });

      await gsap.to(chars, {
        y: 0,
        duration: ANIMATION_CONFIG.ENTER.DURATION,
        stagger: ANIMATION_CONFIG.ENTER.STAGGER,
        ease: ANIMATION_CONFIG.ENTER.EASE,
        opacity: 1,
      });

      await new Promise((resolve) => setTimeout(resolve, ANIMATION_CONFIG.DISPLAY_DURATION));
      
      await gsap.to(chars, {
        y: ANIMATION_CONFIG.EXIT.Y,
        duration: ANIMATION_CONFIG.EXIT.DURATION,
        stagger: ANIMATION_CONFIG.EXIT.STAGGER,
        ease: ANIMATION_CONFIG.EXIT.EASE,
        opacity: 0,
      });

      setIsAnimating(false);
      setCurrentTextIndex((prev) => (prev + 1) % TEXTS.length);
    },
    [isAnimating, TEXTS],
  );

  useGSAP(() => {
    if (!isAnimating) {
      animateText(TEXTS[currentTextIndex]);
    }
  }, [currentTextIndex, isAnimating, animateText, TEXTS]);

  return (
    <div className="min-h-[2rem] overflow-hidden">
      <div
        ref={containerRef}
        className="text-accent text-xl relative transform-gpu"
        style={{
          position: "relative",
          minHeight: "2rem",
          whiteSpace: "nowrap",
        }}
        aria-label={TEXTS[currentTextIndex]}
      />
    </div>
  );
};

export default TypedText;
