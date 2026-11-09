"use client";

import { useEffect, useRef, useState } from "react";

/** A display word drawn as a hairline outline, with its rendered width measured above it. */
export default function MeasuredWord({ word }: { word: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.borderBoxSize?.[0]?.inlineSize ?? el.offsetWidth)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span className="ld-word ld-word-draft" ref={ref}>
      {[...word].map((letter, index) => (
        <span className="ld-ch" key={index} aria-hidden="true">
          {letter}
        </span>
      ))}
      <span className="ld-wdim" aria-hidden="true">
        <b>{width ? `${width} px` : "— px"}</b>
      </span>
    </span>
  );
}
