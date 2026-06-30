"use client";

import { useEffect } from "react";

const BACKGROUND_ID = "global-background-pattern";

export default function GlobalBackgroundMotion() {
  useEffect(() => {
    const background = document.getElementById(BACKGROUND_ID);
    if (!background) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let frameId: number | null = null;
    let maxScroll = 0;
    let lastUpdate = 0;

    const updateScrollBounds = () => {
      maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
    };

    const update = (timestamp = performance.now()) => {
      if (timestamp - lastUpdate < 1000 / 30) {
        frameId = requestAnimationFrame(update);
        return;
      }

      frameId = null;
      lastUpdate = timestamp;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const y = Math.max(-5, Math.min(0, progress * -5));
      background.style.transform = `translate3d(0, ${y}%, 0)`;
    };

    const requestUpdate = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(update);
      }
    };

    const handleResize = () => {
      updateScrollBounds();
      requestUpdate();
    };

    updateScrollBounds();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleResize);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return null;
}
