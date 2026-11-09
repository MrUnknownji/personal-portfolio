"use client";

import { useEffect, useState } from "react";

/** Shows the launcher's label near the top of the page, then shrinks it to the icon so it never covers content while reading. */
export function useCompactLauncher(threshold = 480) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCompact(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return compact;
}
