"use client";

import { useEffect, useState } from "react";
import type React from "react";

const READY_EVENT = "portfolio:initial-ready";

export function useDeferredAnimation<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "600px 0px",
) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) return;

    let observer: IntersectionObserver | null = null;

    const observe = () => {
      const element = ref.current;
      if (!element) return;

      if (!("IntersectionObserver" in window)) {
        setIsReady(true);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setIsReady(true);
          observer?.disconnect();
          observer = null;
        },
        { rootMargin, threshold: 0.01 },
      );
      observer.observe(element);
    };

    const handleInitialReady = () => observe();
    const initialReady =
      document.documentElement.dataset.portfolioReady === "true";

    if (initialReady) {
      observe();
    } else {
      window.addEventListener(READY_EVENT, handleInitialReady, { once: true });
    }

    return () => {
      window.removeEventListener(READY_EVENT, handleInitialReady);
      observer?.disconnect();
    };
  }, [isReady, ref, rootMargin]);

  return isReady;
}
