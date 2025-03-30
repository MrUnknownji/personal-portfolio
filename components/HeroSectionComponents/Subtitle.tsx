import { useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

export const Subtitle = () => {
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const splitInstanceRef = useRef<SplitType | null>(null);

  useGSAP(() => {
    if (!subtitleRef.current) return;

    splitInstanceRef.current = new SplitType(subtitleRef.current, {
      types: "chars",
    });

    const chars = splitInstanceRef.current.chars;
    if (!chars?.length) return;

    gsap.from(chars, {
      y: 50,
      opacity: 0,
      stagger: 0.02,
      duration: 0.8, // Adjusted duration
      ease: "power3.out",
      delay: 0.1, // Add slight delay
    });

    const handleMouseMove = (event: MouseEvent) => {
      const subtitleElement = subtitleRef.current;
      if (!subtitleElement || !splitInstanceRef.current?.chars) return;

      const rect = subtitleElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const maxDistance = 150; // Increased interaction radius

      splitInstanceRef.current.chars.forEach((char) => {
        if (!char) return;
        const charRect = char.getBoundingClientRect();
        const charCenter = charRect.left + charRect.width / 2 - rect.left;
        const distance = Math.abs(mouseX - charCenter);

        const intensity = Math.max(0, 1 - distance / maxDistance);

        gsap.to(char, {
          y: -15 * intensity,
          scale: 1 + 0.2 * intensity,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    const handleMouseLeave = () => {
      if (!splitInstanceRef.current?.chars) return;
      gsap.to(splitInstanceRef.current.chars, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const currentSubtitleRef = subtitleRef.current;
    currentSubtitleRef.addEventListener("mousemove", handleMouseMove);
    currentSubtitleRef.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      currentSubtitleRef.removeEventListener("mousemove", handleMouseMove);
      currentSubtitleRef.removeEventListener("mouseleave", handleMouseLeave);
      splitInstanceRef.current?.revert();
      gsap.killTweensOf(chars); // Ensure all tweens are killed
    };
  }, []);

  return (
    <div className="subtitle-container">
      <h2
        ref={subtitleRef}
        className="hero-subtitle text-2xl md:text-3xl font-semibold text-[#4FD1C5] cursor-default"
      >
        Full Stack Developer
      </h2>
    </div>
  );
};
