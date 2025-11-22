"use client";

import { useEffect, useLayoutEffect } from "react";
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

  useLayoutEffect(() => {
    // Kill existing ScrollSmoother instance to avoid duplicates or conflicts
    // ScrollSmoother.get()?.kill(); // Causes issues if not careful?
    // Ideally, we create it once. But Next.js navigation might not unmount Layout?
    // Layout wraps Template. Template is what transitions.
    // If SmoothScroller is in RootLayout, it mounts once.

    const smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: true, // Helps with some mobile scroll jumps
    });

    return () => {
      smoother.kill();
    };
  }, []);

  // Refresh ScrollTrigger on route change
  useEffect(() => {
      const timeout = setTimeout(() => {
          ScrollTrigger.refresh();
      }, 100); // Delay to allow DOM updates

      return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
