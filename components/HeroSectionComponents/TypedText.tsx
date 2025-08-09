"use client";
import { useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

const TypedText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const TEXTS = useMemo(
    () => [
      "Building robust backend systems",
      "Crafting intuitive UIs",
      "Optimizing database performance",
      "Implementing secure authentication",
      "Developing RESTful APIs",
      "Creating responsive web designs",
    ],
    [],
  );

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const split = new SplitText(container, { type: "chars" });
      const chars = split.chars;

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % TEXTS.length);
        },
      });

      tl.from(chars, {
        duration: 0.8,
        opacity: 0,
        y: -20,
        ease: "back.out(1.7)",
        stagger: 0.05,
      }).to(chars, {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: "power2.in",
        stagger: 0.03,
        delay: 3,
      });

      return () => {
        split.revert();
      };
    },
    { dependencies: [currentIndex], scope: containerRef },
  );

  return (
    <div className="h-8">
      <div
        ref={containerRef}
        className="text-primary text-xl"
        key={currentIndex}
      >
        {TEXTS[currentIndex]}
      </div>
    </div>
  );
};

export default TypedText;
