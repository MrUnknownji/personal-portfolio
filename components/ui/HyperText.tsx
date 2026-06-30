"use client";

import { useEffect, useRef } from "react";

type CharacterSet = string[] | readonly string[];

interface HyperTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  animateOnHover?: boolean;
  characterSet?: CharacterSet;
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""),
) as readonly string[];

const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  as: Component = "span",
  startOnView = false,
  animateOnHover = false,
  characterSet = DEFAULT_CHARACTER_SET,
}: HyperTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const triggerAnimationRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const stopAnimation = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isAnimatingRef.current = false;
    };

    const startAnimation = () => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      const maxIterations = children.length;
      const startTime = performance.now();
      let lastTextUpdate = 0;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const iteration = progress * maxIterations;

        if (currentTime - lastTextUpdate >= 1000 / 30 || progress === 1) {
          element.textContent = children
            .split("")
            .map((letter, index) =>
              letter === " "
                ? " "
                : index <= iteration
                  ? children[index]
                  : characterSet[getRandomInt(characterSet.length)],
            )
            .join("");
          lastTextUpdate = currentTime;
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          element.textContent = children;
          animationFrameRef.current = null;
          isAnimatingRef.current = false;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    triggerAnimationRef.current = startAnimation;

    let observer: IntersectionObserver | null = null;
    if (!startOnView) {
      startTimeoutRef.current = setTimeout(startAnimation, delay);
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          startTimeoutRef.current = setTimeout(startAnimation, delay);
          observer?.disconnect();
          observer = null;
        },
        { threshold: 0.1, rootMargin: "-20% 0px -20% 0px" },
      );
      observer.observe(element);
    }

    return () => {
      observer?.disconnect();
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      stopAnimation();
      element.textContent = children;
    };
  }, [characterSet, children, delay, duration, startOnView]);

  return (
    <Component
      ref={elementRef}
      className={`inline-block whitespace-nowrap ${className || ""}`}
      onMouseEnter={
        animateOnHover ? () => triggerAnimationRef.current() : undefined
      }
    >
      {children}
    </Component>
  );
}

export default HyperText;
