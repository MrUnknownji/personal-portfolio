"use client";

import { useLayoutEffect } from "react";

export default function HomeScrollReset() {
  useLayoutEffect(() => {
    const reset = () => {
      if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    };
    reset();
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  return null;
}
