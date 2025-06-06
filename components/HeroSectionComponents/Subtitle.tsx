import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

export const Subtitle = () => {
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const splitInstanceRef = useRef<SplitText | null>(null);

  useGSAP(() => {
    if (!subtitleRef.current) return;

    splitInstanceRef.current = new SplitText(subtitleRef.current, {
      type: "chars",
      charsClass: "subtitle-char",
    });

    const chars = splitInstanceRef.current.chars;
    if (!chars?.length) return;

    gsap.from(chars, {
      y: 50,
      opacity: 0,
      stagger: 0.02,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.1,
    });

    const handleMouseMove = (event: MouseEvent) => {
      const subtitleElement = subtitleRef.current;
      if (!subtitleElement || !splitInstanceRef.current?.chars) return;

      const rect = subtitleElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const maxDistance = 150;

      splitInstanceRef.current.chars.forEach((char: Element) => {
        if (!char) return;
        const charRect = (char as HTMLElement).getBoundingClientRect();
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
      gsap.to(splitInstanceRef.current.chars as gsap.TweenTarget, {
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
      gsap.killTweensOf(chars as gsap.TweenTarget);
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
