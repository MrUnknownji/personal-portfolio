"use client";

import { useRef } from "react";

export type CrosshairPoint = {
  x: number;
  y: number;
  w: number;
  h: number;
  clientX: number;
  target: Element;
};

/**
 * Hairline guides that sit exactly under the pointer. They are moved straight from the pointer
 * event, with no easing or smoothing, so they never trail the real cursor (which stays visible as
 * the native crosshair). `read` returns the label for the readout tag, or null to hide it.
 */
export default function Crosshair({
  className,
  read,
  onLeave,
  children,
  label,
}: {
  className?: string;
  read: (point: CrosshairPoint) => string | null;
  onLeave?: () => void;
  children: React.ReactNode;
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLSpanElement>(null);
  const h = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  const move = (event: React.PointerEvent) => {
    const el = root.current;
    if (!el || !v.current || !h.current || !tag.current) return;
    const box = el.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    v.current.style.transform = `translate3d(${x}px,0,0)`;
    h.current.style.transform = `translate3d(0,${y}px,0)`;
    const text = read({
      x,
      y,
      w: box.width,
      h: box.height,
      clientX: event.clientX,
      target: event.target as Element,
    });
    tag.current.textContent = text ?? "";
    // The tag flips to the other side of the pointer near the right and bottom edges.
    const flipX = x > box.width - 240;
    const flipY = y > box.height - 48;
    tag.current.style.transform = `translate3d(${x + (flipX ? -12 : 12)}px,${y + (flipY ? -12 : 12)}px,0) translate(${flipX ? "-100%" : "0"},${flipY ? "-100%" : "0"})`;
    el.dataset.live = text === null ? "lines" : "true";
  };

  return (
    <div
      ref={root}
      className={`tk-cross ${className ?? ""}`}
      data-live="false"
      onPointerMove={move}
      onPointerDown={move}
      onPointerLeave={() => {
        if (root.current) root.current.dataset.live = "false";
        onLeave?.();
      }}
      role="group"
      aria-label={label}
    >
      {children}
      <span ref={v} className="tk-cross-v" aria-hidden="true" />
      <span ref={h} className="tk-cross-h" aria-hidden="true" />
      <span ref={tag} className="tk-cross-tag" aria-hidden="true" />
    </div>
  );
}
