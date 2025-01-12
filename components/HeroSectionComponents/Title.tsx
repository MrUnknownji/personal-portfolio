import { useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

export const Title = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!titleRef.current) return;

    const titleSplit = new SplitType(titleRef.current, { types: "chars" });
    if (!titleSplit.chars) return;

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
    });

    tl.from(titleSplit.chars, {
      y: 100,
      opacity: 0,
      rotateX: -90,
      stagger: 0.02,
    });

    titleSplit.chars.forEach((char) => {
      if (!char.parentNode) return;

      const wrapper = document.createElement("span");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";

      const originalContent = char.innerHTML;
      char.innerHTML = "";
      char.style.position = "relative";
      char.style.display = "inline-block";

      const original = document.createElement("span");
      original.innerHTML = originalContent;
      original.style.position = "relative";
      original.style.display = "block";

      const clone = document.createElement("span");
      clone.innerHTML = originalContent;
      clone.style.position = "absolute";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.opacity = "0";
      clone.style.color = "#4FD1C5";
      clone.style.transform = "translateY(100%)";

      wrapper.appendChild(original);
      wrapper.appendChild(clone);
      char.appendChild(wrapper);

      wrapper.addEventListener("mouseenter", () => {
        gsap.to(original, {
          y: "-100%",
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
        gsap.to(clone, {
          y: "0%",
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut",
        });
      });

      wrapper.addEventListener("mouseleave", () => {
        gsap.to(original, {
          y: "0%",
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut",
        });
        gsap.to(clone, {
          y: "100%",
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      });
    });
  }, []);

  return (
    <div className="overflow-hidden py-2">
      <h1
        ref={titleRef}
        className="hero-title text-white font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight"
      >
        Sandeep Kumar
      </h1>
    </div>
  );
};
