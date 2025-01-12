"use client";
import { useEffect } from "react";
import Lenis from "lenis";

const ANIMATION_DURATION = 1.2;
const LERP_SMOOTH_SCROLL = 0.1;
const WHEEL_MULTIPLIER = 1;
const TOUCH_MULTIPLIER = 2;

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: ANIMATION_DURATION,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      lerp: LERP_SMOOTH_SCROLL,
      wheelMultiplier: WHEEL_MULTIPLIER,
      touchMultiplier: TOUCH_MULTIPLIER,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
