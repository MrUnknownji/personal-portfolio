"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.to(overlayRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-gray-950 z-50 transform"
    ></div>
  );
}
