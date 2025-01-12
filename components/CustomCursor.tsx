"use client";
import React, { useEffect, useRef, useState } from "react";

const CURSOR_RING_SIZE: number = 10;
const CURSOR_DOT_SIZE: number = 1.5;
const CURSOR_RING_BORDER_WIDTH: number = 2;
const CURSOR_RING_OPACITY: number = 100;
const CURSOR_DOT_OPACITY: number = 100;
const CURSOR_RING_TRANSITION_DURATION: number = 300;
const CURSOR_DOT_TRANSITION_DURATION: number = 300;
const CURSOR_RING_SCALE_VISIBLE: number = 100;
const CURSOR_RING_SCALE_HIDDEN: number = 0;
const CURSOR_RING_OPACITY_HIDDEN: number = 0;
const CURSOR_DOT_OPACITY_HOVER: number = 10;
const CURSOR_DOT_HOVER_SIZE: number = 16;
const CURSOR_RING_EASE: string = "ease-out";
const CURSOR_DOT_EASE: string = "ease-out";
const CURSOR_RING_SMOOTHING: number = 0.3;
const CURSOR_DOT_SMOOTHING: number = 0.4;
const CURSOR_Z_INDEX: number = 500;

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
      ringX += (mouseX - ringX) * CURSOR_RING_SMOOTHING;
      ringY += (mouseY - ringY) * CURSOR_RING_SMOOTHING;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      dotX += (mouseX - dotX) * CURSOR_DOT_SMOOTHING;
      dotY += (mouseY - dotY) * CURSOR_DOT_SMOOTHING;
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
        className={`cursor-ring fixed pointer-events-none z-[${CURSOR_Z_INDEX}] w-${CURSOR_RING_SIZE} h-${CURSOR_RING_SIZE} border-${CURSOR_RING_BORDER_WIDTH} border-primary rounded-full transition-all duration-${CURSOR_RING_TRANSITION_DURATION} ${CURSOR_RING_EASE} ${
          isPointerOrText
            ? `opacity-${CURSOR_RING_OPACITY_HIDDEN} scale-${CURSOR_RING_SCALE_HIDDEN}`
            : `opacity-${CURSOR_RING_OPACITY} scale-${CURSOR_RING_SCALE_VISIBLE}`
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorDotRef}
        className={`cursor-dot fixed pointer-events-none z-[${CURSOR_Z_INDEX}] bg-primary rounded-full transition-all duration-${CURSOR_DOT_TRANSITION_DURATION} ${CURSOR_DOT_EASE} ${
          isPointerOrText
            ? `w-${CURSOR_DOT_HOVER_SIZE} h-${CURSOR_DOT_HOVER_SIZE} opacity-${CURSOR_DOT_OPACITY_HOVER}`
            : `w-${CURSOR_DOT_SIZE} h-${CURSOR_DOT_SIZE} opacity-${CURSOR_DOT_OPACITY}`
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
};

export default CustomCursor;
