"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

interface GsapInitializerProps {
  children: React.ReactNode;
}

const GsapInitializer = ({ children }: GsapInitializerProps) => {
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // const smoother = ScrollSmoother.create({
      //   wrapper: "#smooth-wrapper",
      //   content: "#smooth-content",
      //   smooth: 1,
      //   effects: true,
      //   smoothTouch: 0.1,
      // });
      // return () => {
      //   smoother?.kill(); // Add null check just in case
      // };
    },
    { scope: mainRef }
  );

  return <div ref={mainRef}>{children}</div>;
};

export default GsapInitializer;
