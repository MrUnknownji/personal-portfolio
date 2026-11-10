"use client";

import { useEffect } from "react";
import { ORBIT_SECONDS, sheenKeyframes } from "@/lib/lumen/light";
import { lightStore } from "./lightStore";

const SELECTOR = ".ld-sheen";

/**
 * Moves every sheen with the light. Each surface gets one transform animation that
 * the compositor runs, so the orbit never touches style, layout, or paint on the main thread.
 * All animations share one start time, so every surface agrees on where the light is.
 */
export default function LightEngine() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const duration = ORBIT_SECONDS * 1000;
    const animations = new Map<Element, Animation>();
    const sheen = sheenKeyframes();

    const sync = (animation: Animation) => {
      const { running, epoch } = lightStore.get();
      if (running) {
        if (animation.playState !== "running") animation.play();
        animation.startTime = epoch;
      } else {
        animation.pause();
        animation.currentTime = lightStore.phase();
      }
    };
    const syncAll = () => animations.forEach(sync);

    const attach = (element: Element) => {
      if (animations.has(element)) return;
      const animation = element.animate(sheen, { duration, iterations: Infinity });
      animations.set(element, animation);
      sync(animation);
    };
    const detach = (element: Element) => {
      animations.get(element)?.cancel();
      animations.delete(element);
    };
    const scan = (node: Node, fn: (element: Element) => void) => {
      if (!(node instanceof Element)) return;
      if (node.matches(SELECTOR)) fn(node);
      node.querySelectorAll(SELECTOR).forEach(fn);
    };

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => scan(node, attach));
        record.removedNodes.forEach((node) => scan(node, detach));
      }
    });
    // The light starts once the page is idle, so it never competes with the first paint.
    const start = () => {
      lightStore.setRunning(!reduced.matches);
      scan(document.body, attach);
      mutations.observe(document.body, { childList: true, subtree: true });
    };
    // Safari has no requestIdleCallback; a short timeout does the same job there.
    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 300);

    const unsubscribe = lightStore.subscribe(syncAll);
    const onMotionChange = () => lightStore.setRunning(!reduced.matches);
    reduced.addEventListener("change", onMotionChange);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      unsubscribe();
      reduced.removeEventListener("change", onMotionChange);
      mutations.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return null;
}
