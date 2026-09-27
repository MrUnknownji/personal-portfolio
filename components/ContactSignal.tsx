"use client";

import { useEffect, useRef } from "react";

export default function ContactSignal() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let revert = () => {};
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const { animate, createScope, stagger, svg } = await import("animejs");
      if (cancelled) return;
      const scope = createScope({ root: element }).add(() => {
        animate(svg.createDrawable(element.querySelectorAll<SVGPathElement>(".offset-contact-art-line")), {
          draw: ["0 0", "0 1"],
          duration: 900,
          delay: stagger(130),
          ease: "inOutQuad",
        });
      });
      revert = () => scope.revert();
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); revert(); };
  }, []);

  return <div className="offset-contact-art" ref={root} aria-hidden="true">
    <svg viewBox="0 0 620 237" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="offset-contact-line-fade" x1="0" x2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--offset-dark)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--offset-dark)" />
        </linearGradient>
      </defs>
      <path className="offset-contact-art-line offset-contact-art-incoming" d="M0 160h175c35 0 44-19 58-33 14-14 31-24 52-24h35" />
      <path className="offset-contact-art-line" d="M492 103h123m-19-19 19 19-19 19" />
      <path className="offset-contact-art-line offset-contact-art-envelope" d="M328 59h156a8 8 0 0 1 8 8v95a8 8 0 0 1-8 8H328a8 8 0 0 1-8-8V67a8 8 0 0 1 8-8Z" />
      <path className="offset-contact-art-line" d="m323 62 82 64 84-64" />
      <path className="offset-contact-art-line" d="m323 167 57-54m109 54-60-54" />
      <circle className="offset-contact-art-node" cx="100" cy="160" r="10" />
      <circle className="offset-contact-art-node" cx="233" cy="127" r="6" />
      <circle className="offset-contact-art-node" cx="405" cy="126" r="11" />
    </svg>
  </div>;
}
