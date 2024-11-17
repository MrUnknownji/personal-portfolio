import { useEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export const Subtitle = () => {
  useEffect(() => {
    const subtitleSplit = new SplitType(".hero-subtitle", { types: "chars" });
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

    const container = document.querySelector(".subtitle-container");
    if (!container) return;

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = container.getBoundingClientRect();
      const mouseX = mouseEvent.clientX - rect.left;

      if (!subtitleSplit.chars) return;

      subtitleSplit.chars.forEach((char) => {
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

    container.addEventListener("mousemove", handleMouseMove as EventListener);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener,
      );
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="subtitle-container">
      <h2 className="hero-subtitle text-2xl md:text-3xl font-semibold text-[#4FD1C5]">
        Full Stack Developer
      </h2>
    </div>
  );
};
