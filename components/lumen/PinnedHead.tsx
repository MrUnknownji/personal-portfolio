"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The work section's title row. When it pins under the header, the sheets and the index rail pin
 * below it, so they need its height: this writes it to --ld-work-top on the section and keeps it
 * current as the text wraps.
 */
export default function PinnedHead({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    const observer = new ResizeObserver(() =>
      section.style.setProperty("--ld-work-top", `${Math.ceil(el.offsetHeight)}px`),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ld-work-top" ref={ref}>
      {children}
    </div>
  );
}
