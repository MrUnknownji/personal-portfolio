"use client";
import { Meteors } from "@/components/ui/Meteors";
import { useEffect, useState } from "react";

export default function ResponsiveMeteors() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const updateCount = () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        setCount(0);
        return;
      }

      setCount(window.innerWidth >= 768 ? 12 : 4);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", updateCount);

    return () => {
      window.removeEventListener("resize", updateCount);
      motionQuery.removeEventListener("change", updateCount);
    };
  }, []);

  if (!count) return null;

  return <Meteors number={count} />;
}
