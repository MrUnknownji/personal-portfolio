"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.to(loaderRef.current, {
        rotate: 360,
        repeat: -1,
        duration: 1,
        ease: "linear",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
      <div
        ref={loaderRef}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
}
