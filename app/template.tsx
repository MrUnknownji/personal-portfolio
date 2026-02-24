"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);
}

function getOrCreateOverlay(): HTMLDivElement {
  let overlay = document.getElementById(
    "page-transition-overlay",
  ) as HTMLDivElement | null;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    overlay.className =
      "fixed top-0 left-0 w-screen h-dvh flex items-center justify-center bg-gray-950 flex-col pointer-events-none";
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100dvh;display:flex;align-items:center;justify-content:center;flex-direction:column;z-index:9999;pointer-events:none;opacity:1;background-color:#030712;";
    overlay.innerHTML = `
      <div class="bloom-flower" style="position:relative;width:7rem;height:7rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;pointer-events:none;">
        <svg viewBox="-10 0 120 100" style="width:100%;height:100%;overflow:visible;">
          <defs>
            <linearGradient id="lotusGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#ff5500" />
              <stop offset="50%" stop-color="#ff8c00" />
              <stop offset="100%" stop-color="#ffcc00" />
            </linearGradient>
            <filter id="lotusGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(50, 70)" filter="url(#lotusGlow)">
            <circle class="center-glow" cx="0" cy="-10" r="15" fill="#ff8c00" transform="translate(0,-10) scale(0)" opacity="0" />
            <path class="petal" d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z" fill="url(#lotusGrad)" opacity="0.85" transform="scale(0)" />
            <path class="petal" d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z" fill="url(#lotusGrad)" opacity="0.85" transform="scale(0)" />
            <path class="petal" d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z" fill="url(#lotusGrad)" opacity="0.85" transform="scale(0)" />
            <path class="petal" d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z" fill="url(#lotusGrad)" opacity="0.85" transform="scale(0)" />
            <path class="petal" d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z" fill="url(#lotusGrad)" opacity="0.85" transform="scale(0)" />
            <path class="petal" d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z" fill="url(#lotusGrad)" opacity="0.85" transform="scale(0)" />
            <path class="petal" d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z" fill="url(#lotusGrad)" opacity="0.85" transform="scale(0)" />
          </g>
        </svg>
      </div>
      <span class="counter-text" style="font-family:'Outfit',sans-serif;font-weight:300;font-size:3.5rem;background:linear-gradient(to right,hsl(28 100% 60%),hsl(2 50% 51%),hsl(28 100% 60%));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;opacity:0;pointer-events:none;user-select:none;">0%</span>
    `;
    document.body.appendChild(overlay);
  }
  return overlay;
}

function playFlowerAnimation(overlay: HTMLDivElement) {
  const petals = overlay.querySelectorAll(".petal");
  const centerGlow = overlay.querySelector(".center-glow");

  if (!centerGlow || petals.length === 0) return;

  gsap.killTweensOf([centerGlow, ...Array.from(petals)]);

  centerGlow.setAttribute("transform", "translate(0,-10) scale(0)");
  centerGlow.setAttribute("opacity", "0");
  petals.forEach((p) => p.setAttribute("transform", "scale(0)"));

  gsap.to(centerGlow, {
    attr: { transform: "translate(0,-10) scale(1)", opacity: 0.8 },
    duration: 1.5,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
    delay: 0.1,
  });

  const angles = [-75, -50, -25, 0, 25, 50, 75];
  petals.forEach((petal, i) => {
    gsap.to(petal, {
      attr: { transform: `rotate(${angles[i]}) scale(1)` },
      duration: 1.8,
      ease: "back.out(1.2)",
      delay: 0.1,
    });
  });
}

export default function Template({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!contentRef.current || !mounted) return;

      const overlay = getOrCreateOverlay();
      const counterEl = overlay.querySelector(".counter-text") as HTMLElement;
      if (!counterEl) return;

      gsap.killTweensOf([overlay, contentRef.current, counterEl]);

      const counter = { value: 0 };
      const bodyStyle = document.body.style;

      const tl = gsap.timeline({
        onStart: () => {
          bodyStyle.cursor = "wait";
          bodyStyle.overflow = "hidden";
          overlay.style.pointerEvents = "auto";

          if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
          }

          window.scrollTo(0, 0);
          gsap.set(window, { scrollTo: { y: 0, autoKill: false } });

          gsap.delayedCall(0.1, () => {
            ScrollTrigger.refresh();
          });

          playFlowerAnimation(overlay);
        },
        onComplete: () => {
          if (!window.location.hash) {
            window.scrollTo(0, 0);
          }

          bodyStyle.cursor = "";
          bodyStyle.overflow = "";
          overlay.style.display = "none";
          overlay.style.pointerEvents = "none";

          if (window.location.hash) {
            const id = window.location.hash.substring(1);
            gsap.to(window, {
              scrollTo: { y: `#${id}`, offsetY: 20, autoKill: false },
              duration: 1,
              ease: "power2.inOut",
            });
          }
        },
        defaults: { ease: "power2.inOut" },
      });

      const counterDuration = 2.5;
      const contentFadeInDelay = 0.5;
      const overlayFadeOutDelay = counterDuration - 0.1;
      const overlayFadeOutDuration = 0.6;

      tl.set(overlay, { opacity: 1, display: "flex" })
        .set(contentRef.current, { opacity: 0 })
        .set(counterEl, { textContent: "0%", opacity: 0 })
        .to(counterEl, { opacity: 1, duration: 0.5 }, 0)
        .to(
          counter,
          {
            value: 100,
            duration: counterDuration,
            ease: "power1.out",
            onUpdate: () => {
              counterEl.textContent = Math.floor(counter.value) + "%";
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
          overlay,
          {
            opacity: 0,
            duration: overlayFadeOutDuration,
          },
          overlayFadeOutDelay,
        )
        .to(
          counterEl,
          {
            opacity: 0,
            duration: overlayFadeOutDuration * 0.5,
          },
          `-=${overlayFadeOutDuration * 0.3}`,
        );
    },
    { dependencies: [children, mounted] },
  );

  return (
    <div ref={contentRef} className="page-content" style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
