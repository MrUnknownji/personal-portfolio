import { useEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export const Description = () => {
  useEffect(() => {
    const descriptionSplit = new SplitType(".hero-description", {
      types: "chars",
    });
    if (!descriptionSplit.chars) return;

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
    });

    tl.from(
      descriptionSplit.chars,
      {
        y: 20,
        opacity: 0,
        stagger: 0.01,
      },
      "-=0.5",
    );

    const container = document.querySelector(".description-container");
    if (!container) return;

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = container.getBoundingClientRect();
      const mouseX = mouseEvent.clientX - rect.left;
      const mouseY = mouseEvent.clientY - rect.top;

      if (!descriptionSplit.chars) return;

      descriptionSplit.chars.forEach((char) => {
        if (!char) return;
        const charRect = char.getBoundingClientRect();
        const charCenterX = charRect.left + charRect.width / 2 - rect.left;
        const charCenterY = charRect.top + charRect.height / 2 - rect.top;

        const distance = Math.sqrt(
          Math.pow(mouseX - charCenterX, 2) + Math.pow(mouseY - charCenterY, 2),
        );

        const maxDistance = 100;
        const intensity = 1 - Math.min(distance / maxDistance, 1);

        if (intensity > 0) {
          gsap.to(char, {
            color: "#4FD1C5",
            scale: 1 + 0.2 * intensity,
            opacity: 0.5 + 0.5 * intensity,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(char, {
            color: "#9CA3AF",
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
    };

    const handleMouseLeave = () => {
      descriptionSplit.chars?.forEach((char) => {
        if (!char) return;
        gsap.to(char, {
          color: "#9CA3AF",
          scale: 1,
          opacity: 1,
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
    <div className="description-container overflow-hidden cursor-pointer">
      <p className="hero-description text-gray-300 text-lg leading-relaxed max-w-2xl">
        Transforming ideas into elegant digital solutions with clean code and
        innovative thinking.
      </p>
    </div>
  );
};
