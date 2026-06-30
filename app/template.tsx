"use client";

import { useRef } from "react";
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

function getOverlay(): HTMLDivElement | null {
  return document.getElementById(
    "page-transition-overlay",
  ) as HTMLDivElement | null;
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

  useGSAP(
    () => {
      if (!contentRef.current) return;

      const overlay = getOverlay();
      if (!overlay) {
        gsap.set(contentRef.current, { opacity: 1 });
        hasPlayedInitialLoader = true;
        signalInitialReady();
        return;
      }

      const counterEl = overlay.querySelector(".counter-text") as HTMLElement;
      if (!counterEl) {
        gsap.set(contentRef.current, { opacity: 1 });
        overlay.style.display = "none";
        hasPlayedInitialLoader = true;
        signalInitialReady();
        return;
      }

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
      gsap.set(contentRef.current, { opacity: 1 });
      gsap.to(counterEl, { opacity: 1, duration: 0.16 });

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
    { dependencies: [children] },
  );

  return (
    <div ref={contentRef} className="page-content" style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
