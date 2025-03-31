"use client";

import { LenisRef, ReactLenis } from "lenis/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { LenisOptions } from "lenis";

const SmoothScrollLenisGSAP = ({
  children,
  lenisOptions,
}: {
  children: React.ReactNode;
  lenisOptions?: LenisOptions;
}) => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    console.log(
      "SmoothScrollLenisGSAP Mounted. lenisRef.current:",
      lenisRef.current,
    );

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    if (gsap.ticker) {
      console.log("Adding GSAP ticker update function");
      gsap.ticker.add(update);
    } else {
      console.error("GSAP ticker not found!");
    }

    return () => {
      if (gsap.ticker) {
        console.log("Removing GSAP ticker update function");
        gsap.ticker.remove(update);
      }
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, ...lenisOptions }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollLenisGSAP;
