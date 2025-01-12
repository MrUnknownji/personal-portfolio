"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface GsapMagneticProps {
  children: React.ReactNode;
  strength?: number;
}

const MAGNETIC_ANIMATION_DURATION: number = 1;
const MAGNETIC_EASE: string = "elastic.out(1, 0.3)";

const GsapMagnetic: React.FC<GsapMagneticProps> = ({
  children,
  strength = 0.5,
}) => {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = magnetic.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", {
      duration: MAGNETIC_ANIMATION_DURATION,
      ease: MAGNETIC_EASE,
    });
    const yTo = gsap.quickTo(element, "y", {
      duration: MAGNETIC_ANIMATION_DURATION,
      ease: MAGNETIC_EASE,
    });

    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * strength);
      yTo(y * strength);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);

    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, [strength]);

  return (
    <div ref={magnetic} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
};

export default GsapMagnetic;
