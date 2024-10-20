"use client";
import React, { useEffect, useRef, useState } from "react";

const CustomCursor: React.FC = () => {
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isPointerOrText, setIsPointerOrText] = useState(false);

  useEffect(() => {
    const cursorRing = cursorRingRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursorRing || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateCursorPosition = () => {
      ringX += (mouseX - ringX) * 0.3;
      ringY += (mouseY - ringY) * 0.3;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      dotX += (mouseX - dotX) * 0.4;
      dotY += (mouseY - dotY) * 0.4;
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;

      requestAnimationFrame(updateCursorPosition);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      setIsPointerOrText(
        computedStyle.cursor === "pointer" || computedStyle.cursor === "text",
      );
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    updateCursorPosition();

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRingRef}
        className={`cursor-ring fixed pointer-events-none z-50 w-10 h-10 border-2 border-primary rounded-full transition-all duration-300 ease-out ${
          isPointerOrText ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorDotRef}
        className={`cursor-dot fixed pointer-events-none z-50 bg-primary rounded-full transition-all duration-300 ease-out ${
          isPointerOrText ? "w-16 h-16 opacity-10" : "w-1.5 h-1.5 opacity-100"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
};

export default CustomCursor;
