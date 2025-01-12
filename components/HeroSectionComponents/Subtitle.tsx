import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

export const Subtitle = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!subtitleRef.current) return;
    const subtitleSplit = new SplitType(subtitleRef.current, {
      types: "chars",
    });
    if (!subtitleSplit.chars) return;

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
    });

    tl.from(
      subtitleSplit.chars,
      {
        y: 50,
        opacity: 0,
        stagger: 0.02,
      },
      "-=0.5",
    );

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      subtitleSplit.chars?.forEach((char) => {
        if (!char) return;
        const charRect = char.getBoundingClientRect();
        const charCenter = charRect.left + charRect.width / 2 - rect.left;
        const distance = Math.abs(mouseX - charCenter);
        const maxDistance = 100;
        const intensity = 1 - Math.min(distance / maxDistance, 1);

        if (intensity > 0) {
          gsap.to(char, {
            y: -15 * intensity,
            scale: 1 + 0.2 * intensity,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(char, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
    };

    const handleMouseLeave = () => {
      subtitleSplit.chars?.forEach((char) => {
        if (!char) return;
        gsap.to(char, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    };

    containerRef.current?.addEventListener(
      "mousemove",
      handleMouseMove as EventListener,
    );
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      containerRef.current?.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener,
      );
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="subtitle-container">
      <h2
        ref={subtitleRef}
        className="hero-subtitle text-2xl md:text-3xl font-semibold text-[#4FD1C5]"
      >
        Full Stack Developer
      </h2>
    </div>
  );
};
