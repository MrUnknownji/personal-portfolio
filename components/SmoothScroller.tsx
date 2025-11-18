"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useLoading } from "@/lib/loadingContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useLoading();

  useGSAP(
    () => {
      if (isLoading) return;

      const smoother = ScrollSmoother.create({
        smooth: 1,
        effects: true,
        smoothTouch: 0.1,
      });

      return () => {
        smoother.kill();
      };
    },
    { dependencies: [isLoading] },
  );

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
