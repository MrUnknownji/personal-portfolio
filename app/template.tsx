"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { fetchSocialStats } from "@/utils/social";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

let hasPlayedInitialLoader = false;
const INITIAL_READY_EVENT = "portfolio:initial-ready";
const MINIMUM_LOADER_MS = 520;
const MAXIMUM_LOADER_MS = 650;

function scrollToCurrentHash(duration = 0.65) {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  if (!target) return;

  const headerHeight =
    document.querySelector("header")?.getBoundingClientRect().height ?? 64;
  gsap.to(window, {
    scrollTo: {
      y: target,
      offsetY: Math.round(headerHeight + 20),
      autoKill: false,
    },
    duration,
    ease: "power2.inOut",
  });
}

function getOrCreateOverlay(): HTMLDivElement {
  let overlay = document.getElementById(
    "page-transition-overlay",
  ) as HTMLDivElement | null;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    overlay.className =
      "fixed top-0 left-0 w-screen h-dvh flex items-center justify-center bg-background flex-col pointer-events-none";
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100dvh;display:flex;align-items:center;justify-content:center;flex-direction:column;z-index:9999;pointer-events:none;opacity:1;background-color:hsl(25 11% 6%);";
    overlay.innerHTML = `
      <div class="bloom-flower" style="position:relative;width:7rem;height:7rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;pointer-events:none;">
        <svg viewBox="-10 0 120 100" style="width:100%;height:100%;overflow:visible;">
          <defs>
            <linearGradient id="lotusGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#ff5500" />
              <stop offset="50%" stop-color="#ff8c00" />
              <stop offset="100%" stop-color="#ffcc00" />
            </linearGradient>
          </defs>
          <g transform="translate(50, 70)">
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

function createFlowerAnimation(overlay: HTMLDivElement) {
  const petals = overlay.querySelectorAll(".petal");
  const centerGlow = overlay.querySelector(".center-glow");

  if (!centerGlow || petals.length === 0) return null;

  gsap.killTweensOf([centerGlow, ...Array.from(petals)]);

  centerGlow.setAttribute("transform", "translate(0,-10) scale(0)");
  centerGlow.setAttribute("opacity", "0");
  petals.forEach((p) => p.setAttribute("transform", "scale(0)"));

  const angles = [-75, -50, -25, 0, 25, 50, 75];
  const timeline = gsap.timeline();

  timeline.to(
    centerGlow,
    {
      attr: { transform: "translate(0,-10) scale(1)", opacity: 0.8 },
      duration: 0.35,
      ease: "power2.out",
    },
    0,
  );

  petals.forEach((petal, i) => {
    timeline.to(
      petal,
      {
        attr: { transform: `rotate(${angles[i]}) scale(1)` },
        duration: 0.45,
        ease: "back.out(1.15)",
      },
      0.04 + i * 0.025,
    );
  });

  return timeline;
}

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

async function decodeCriticalImages() {
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

  const images = Array.from(document.images).filter((image) => {
    const rect = image.getBoundingClientRect();
    return (
      image.fetchPriority === "high" ||
      image.loading === "eager" ||
      rect.top < window.innerHeight * 1.25
    );
  });

  await Promise.allSettled(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        });
      }
      if (typeof image.decode === "function") {
        await image.decode().catch(() => undefined);
      }
    }),
  );
}

async function waitForCriticalReadiness(onProgress: (value: number) => void) {
  const startedAt = performance.now();
  let completed = 0;
  let acceptProgress = true;
  const tasks = [
    document.fonts.ready,
    fetchSocialStats(),
    decodeCriticalImages(),
  ];

  const trackedTasks = tasks.map((task) =>
    Promise.resolve(task)
      .catch(() => undefined)
      .finally(() => {
        completed += 1;
        if (acceptProgress) {
          onProgress(10 + Math.round((completed / tasks.length) * 80));
        }
      }),
  );

  await Promise.race([
    Promise.allSettled(trackedTasks),
    wait(MAXIMUM_LOADER_MS),
  ]);
  acceptProgress = false;

  const elapsed = performance.now() - startedAt;
  if (elapsed < MINIMUM_LOADER_MS) {
    await wait(MINIMUM_LOADER_MS - elapsed);
  }
  onProgress(100);
}

function signalInitialReady() {
  document.documentElement.dataset.portfolioReady = "true";
  window.dispatchEvent(new Event(INITIAL_READY_EVENT));
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
      const bodyStyle = document.body.style;

      if (hasPlayedInitialLoader) {
        overlay.style.display = "none";
        overlay.style.pointerEvents = "none";
        bodyStyle.cursor = "";
        bodyStyle.overflow = "";

        gsap.set(contentRef.current, { opacity: 0 });
        const routeFade = gsap.to(contentRef.current, {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
          onComplete: () => {
            ScrollTrigger.refresh();
            scrollToCurrentHash();
          },
        });

        return () => routeFade.kill();
      }

      let cancelled = false;
      let flowerTimeline: gsap.core.Timeline | null = null;
      let exitTimeline: gsap.core.Timeline | null = null;
      let lastProgress = -1;

      const setProgress = (value: number) => {
        if (cancelled || value === lastProgress) return;
        counterEl.textContent = `${value}%`;
        lastProgress = value;
      };

      bodyStyle.cursor = "wait";
      bodyStyle.overflow = "hidden";
      overlay.style.pointerEvents = "auto";

      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      window.scrollTo(0, 0);
      flowerTimeline = createFlowerAnimation(overlay);
      setProgress(10);

      gsap.set(overlay, { opacity: 1, display: "flex" });
      gsap.set(contentRef.current, { opacity: 0 });
      gsap.to(counterEl, { opacity: 1, duration: 0.16 });
      gsap.to(contentRef.current, {
        opacity: 1,
        duration: 0.32,
        delay: 0.08,
        ease: "power2.out",
      });

      void waitForCriticalReadiness(setProgress).then(() => {
        if (cancelled || !contentRef.current) return;

        exitTimeline = gsap.timeline({
          onComplete: () => {
            if (cancelled) return;
            hasPlayedInitialLoader = true;
            flowerTimeline?.kill();
            flowerTimeline = null;

          if (!window.location.hash) {
            window.scrollTo(0, 0);
          }

          bodyStyle.cursor = "";
          bodyStyle.overflow = "";
          overlay.style.display = "none";
          overlay.style.pointerEvents = "none";
          ScrollTrigger.refresh();
          signalInitialReady();
          scrollToCurrentHash();
          },
        });
        exitTimeline
          .to(counterEl, { opacity: 0, duration: 0.12 }, 0)
          .to(overlay, { opacity: 0, duration: 0.22 }, 0.04);
      });

      return () => {
        cancelled = true;
        exitTimeline?.kill();
        flowerTimeline?.kill();
        gsap.killTweensOf([overlay, contentRef.current, counterEl]);
        bodyStyle.cursor = "";
        bodyStyle.overflow = "";
        overlay.style.pointerEvents = "none";
      };
    },
    { dependencies: [children, mounted] },
  );

  return (
    <div ref={contentRef} className="page-content" style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
