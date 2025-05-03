import { useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

const ANIMATION_CONFIG = {
  INITIAL: { Y: -30, OPACITY: 0 },
  ENTER: { DURATION: 1, STAGGER: 0.05, EASE: "back.out(1.7)" },
  EXIT: { DURATION: 1, STAGGER: 0.03, Y: 20, EASE: "power2.in" },
  DISPLAY_DURATION: 4000,
  OVERLAP_FACTOR: 0.5,
} as const;

const TypedText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

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

  const animateText = (index: number) => {
    if (!containerRef.current) return;

    const textElement = containerRef.current.querySelector(`[data-index="${index}"]`);
    if (!textElement) return;

    const splitInstance = new SplitText(textElement, { types: "chars", charsClass: "typed-char" });
    const chars = splitInstance.chars;

    animationRef.current?.kill();

    const enterDuration = ANIMATION_CONFIG.ENTER.DURATION;
    const exitDuration = ANIMATION_CONFIG.EXIT.DURATION;
    const displayTime = ANIMATION_CONFIG.DISPLAY_DURATION / 1000;

    animationRef.current = gsap
      .timeline({
        onComplete: () => {
          const nextIndex = (index + 1) % TEXTS.length;
          setCurrentTextIndex(nextIndex);
        },
      })
      .set(chars, { 
        y: ANIMATION_CONFIG.INITIAL.Y, 
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        force3D: true,
        willChange: "transform, opacity",
      })
      .to(chars, { 
        y: 0,
        opacity: 1,
        stagger: ANIMATION_CONFIG.ENTER.STAGGER,
        duration: enterDuration,
        ease: ANIMATION_CONFIG.ENTER.EASE,
      })
      .to(
        chars, 
        {
          y: ANIMATION_CONFIG.EXIT.Y,
          opacity: 0,
          stagger: ANIMATION_CONFIG.EXIT.STAGGER,
          duration: exitDuration,
          ease: ANIMATION_CONFIG.EXIT.EASE,
        },
        `+=${displayTime}`,
      );
    
    return () => {
      splitInstance.revert();
    };
  };

  useGSAP(
    () => {
      const cleanup = animateText(currentTextIndex);
      return cleanup;
    },
    { dependencies: [currentTextIndex, TEXTS], scope: containerRef }
  );

  return (
    <div className="min-h-[2rem] overflow-hidden">
      <div
        ref={containerRef}
        className="text-primary text-xl relative transform-gpu"
        style={{
          position: "relative",
          minHeight: "2rem",
          whiteSpace: "nowrap",
        }}
        aria-live="polite"
      >
        <span
          key={currentTextIndex}
          data-index={currentTextIndex}
          aria-label={TEXTS[currentTextIndex]}
        >
          {TEXTS[currentTextIndex]}
        </span>
      </div>
    </div>
  );
};

export default TypedText;
