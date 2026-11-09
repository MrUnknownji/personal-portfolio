"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

/**
 * Frame state for a project preview: which screen is showing, the screen fading out,
 * and touch swipes. A swipe also suppresses the click it would otherwise trigger on
 * the case-study link underneath.
 */
export function useFrameCarousel(count: number) {
  const [frame, setFrame] = useState(0);
  const [outgoingFrame, setOutgoingFrame] = useState<number | null>(null);
  const frameRef = useRef(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    if (outgoingFrame === null) return;
    const timer = window.setTimeout(() => setOutgoingFrame(null), 420);
    return () => window.clearTimeout(timer);
  }, [frame, outgoingFrame]);

  const changeFrame = (next: number) => {
    if (next === frameRef.current) return;
    setOutgoingFrame(frameRef.current);
    frameRef.current = next;
    setFrame(next);
  };

  const swipeHandlers = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "touch" || count < 2) return;
      swipeStart.current = { x: event.clientX, y: event.clientY };
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(event.clientY - start.y)) return;
      suppressClick.current = true;
      changeFrame((frameRef.current + (dx < 0 ? 1 : count - 1)) % count);
    },
    onPointerCancel: () => {
      swipeStart.current = null;
    },
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.preventDefault();
    },
  };

  return { frame, outgoingFrame, changeFrame, swipeHandlers };
}
