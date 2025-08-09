"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const Title = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: titleRef },
  );

  return (
    <div className="overflow-visible py-2 cursor-default">
      <h1
        ref={titleRef}
        className="hero-title font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight
                   bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
      >
        Sandeep Kumar
      </h1>
    </div>
  );
};
