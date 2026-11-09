"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** A muted loop that plays only while on screen, and never under reduced motion or Save-Data. */
export default function LoopVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Image src={poster} alt={alt} fill sizes="(max-width: 900px) 92vw, 640px" />
      <video ref={video} muted loop playsInline preload="none" aria-hidden="true">
        <source src={src} type="video/mp4" />
      </video>
    </>
  );
}
