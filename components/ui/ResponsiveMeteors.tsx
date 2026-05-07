"use client";
import { Meteors } from "@/components/ui/Meteors";
import { useEffect, useState } from "react";

export default function ResponsiveMeteors() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const updateCount = () => {
      setCount(window.innerWidth >= 768 ? 30 : 10);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  if (count === null) return null;

  return <Meteors number={count} />;
}
