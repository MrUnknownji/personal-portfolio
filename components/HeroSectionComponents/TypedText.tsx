import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TypedText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const texts = [
    "Building robust backend systems",
    "Crafting intuitive front-end interfaces",
    "Optimizing database performance",
    "Implementing secure authentication",
    "Developing RESTful APIs",
    "Creating responsive web designs",
  ];

  const animateText = async (text: string) => {
    if (!containerRef.current || isAnimating) return;
    setIsAnimating(true);

    containerRef.current.innerHTML = "";

    const measureDiv = document.createElement("div");
    measureDiv.style.visibility = "hidden";
    measureDiv.style.position = "absolute";
    measureDiv.style.whiteSpace = "nowrap";
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
      span.style.display = "inline-block";
      span.style.position = "absolute";
      span.style.left = `${positions[index].left}px`;
      containerRef.current?.appendChild(span);
      return span;
    });

    gsap.set(chars, {
      y: -30,
      opacity: 0,
    });

    await gsap.to(chars, {
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "back.out(1.7)",
      opacity: 1,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await gsap.to(chars, {
      y: 20,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.in",
      opacity: 0,
    });

    setIsAnimating(false);
    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
  };

  useEffect(() => {
    if (!isAnimating) {
      animateText(texts[currentTextIndex]);
    }
  }, [currentTextIndex, isAnimating]);

  return (
    <div className="min-h-[2rem] overflow-x-hidden">
      <div
        ref={containerRef}
        className="text-accent text-xl relative"
        style={{
          position: "relative",
          minHeight: "2rem",
          whiteSpace: "nowrap",
        }}
        aria-label={texts[currentTextIndex]}
      />
    </div>
  );
};

export default TypedText;
