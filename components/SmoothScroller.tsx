"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useGSAP(() => {
    // Create smoother with slightly reduced settings for performance
    const smoother = ScrollSmoother.create({
      smooth: 0.8, // Slightly less smoothing for more responsiveness
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: false, // Disable to avoid potential jitter on some devices
    });

    return () => {
      smoother.kill();
    };
  }, { dependencies: [] });

  // Refresh ScrollTrigger on route change
  useEffect(() => {
      const timeout = setTimeout(() => {
          ScrollTrigger.refresh();
      }, 200);

      return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
