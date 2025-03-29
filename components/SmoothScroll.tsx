"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Lenis from "lenis";
import { LenisContext } from "@/contexts/LenisContext";

interface SmoothScrollProps {
  children: React.ReactNode;
  duration?: number;
  lerp?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  easing?: (t: number) => number;
  infinite?: boolean;
}

const defaultEasing = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function SmoothScroll({
  children,
  duration = 1,
  lerp = 0.1,
  wheelMultiplier = 1,
  touchMultiplier = 2,
  easing = defaultEasing,
  infinite = false,
}: SmoothScrollProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const reqIdRef = useRef<number | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration,
      easing,
      orientation: "vertical",
      gestureOrientation: "vertical",
      lerp,
      wheelMultiplier,
      touchMultiplier,
      infinite,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    const animate = (time: number) => {
      lenis.raf(time);
      reqIdRef.current = requestAnimationFrame(animate);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
        reqIdRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [duration, easing, lerp, wheelMultiplier, touchMultiplier, infinite]);

  const contextValue = useMemo(
    () => ({ lenis: lenisInstance }),
    [lenisInstance],
  );

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}
