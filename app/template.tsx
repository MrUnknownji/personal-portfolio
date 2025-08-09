"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export default function Template({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!overlayRef.current || !contentRef.current || !counterRef.current) {
        gsap.set(contentRef.current, { opacity: 1 });
        gsap.set(overlayRef.current, { display: "none" });
        return;
      }

      gsap.killTweensOf([
        overlayRef.current,
        contentRef.current,
        counterRef.current,
      ]);

      const counter = { value: 0 };
      const bodyStyle = document.body.style;

      const tl = gsap.timeline({
        onStart: () => {
          bodyStyle.cursor = "wait";
          overlayRef.current?.classList.remove("pointer-events-none");
        },
        onComplete: () => {
          bodyStyle.cursor = "";
          gsap.set(overlayRef.current, { display: "none" });
          overlayRef.current?.classList.add("pointer-events-none");

          gsap.delayedCall(0.05, () => {
            ScrollTrigger.refresh();
            window.scrollTo(0, 0);
          });
        },
        defaults: { ease: "power2.inOut" },
      });

      const counterDuration = 0.8;
      const contentFadeInDelay = 0.2;
      const overlayFadeOutDelay = counterDuration - 0.1;
      const overlayFadeOutDuration = 0.4;

      tl.set(overlayRef.current, { opacity: 1, display: "flex" })
        .set(contentRef.current, { opacity: 0 })
        .set(counterRef.current, { textContent: "0%", opacity: 1 })
        .to(
          counter,
          {
            value: 100,
            duration: counterDuration,
            ease: "power1.out",
            onUpdate: () => {
              counterRef.current!.textContent = Math.floor(counter.value) + "%";
            },
          },
          0,
        )
        .to(
          contentRef.current,
          {
            opacity: 1,
            duration: 0.5,
          },
          contentFadeInDelay,
        )
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: overlayFadeOutDuration,
          },
          overlayFadeOutDelay,
        )
        .to(
          counterRef.current,
          {
            opacity: 0,
            duration: overlayFadeOutDuration * 0.5,
            clearProps: "opacity",
          },
          `-=${overlayFadeOutDuration * 0.3}`,
        );
    },
    { dependencies: [children] },
  );

  return (
    <>
      <div ref={contentRef} className="page-content">
        {children}
      </div>

      <div
        ref={overlayRef}
        className="
          transition-overlay
          fixed top-0 left-0 w-screen h-dvh z-50
          flex items-center justify-center
          bg-gray-950
          pointer-events-none
        "
      >
        <span
          ref={counterRef}
          className="
            font-outfit font-light text-5xl sm:text-6xl md:text-7xl
            bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent
            opacity-0 pointer-events-none select-none
          "
          style={{
            textShadow:
              "0 0 15px rgba(0, 255, 159, 0.3), 0 0 25px rgba(0, 209, 255, 0.2)",
          }}
        >
          0%
        </span>
      </div>
    </>
  );
}
