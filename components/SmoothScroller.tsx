"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)")
      .matches;

    if (reduceMotion || ScrollSmoother.get()) return;

    const smoother = ScrollSmoother.create({
      smooth: isTouch ? 0.18 : 0.45,
      effects: false,
      smoothTouch: isTouch ? 0.12 : 0,
      normalizeScroll: false,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
    } else if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const timeout = setTimeout(() => {
      if (ScrollSmoother.get()) {
        ScrollTrigger.refresh();
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
