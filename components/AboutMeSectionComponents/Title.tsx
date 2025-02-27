import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  DURATION: 0.8,
  STAGGER: 0.1,
  EASE: "power3.out",
  Y_OFFSET: 30,
  SCALE: {
    START: 0.9,
    END: 1
  }
} as const;

const Title = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current || !subtitleRef.current) return;

    const words = titleRef.current.querySelectorAll("span");
    const subtitleLines = subtitleRef.current.querySelectorAll("span");

    gsap.set([words, subtitleLines], { 
      opacity: 0,
      y: ANIMATION_CONFIG.Y_OFFSET,
      scale: ANIMATION_CONFIG.SCALE.START
    });

    gsap.to(words, {
      opacity: 1,
      y: 0,
      scale: ANIMATION_CONFIG.SCALE.END,
      duration: ANIMATION_CONFIG.DURATION,
      stagger: ANIMATION_CONFIG.STAGGER,
      ease: ANIMATION_CONFIG.EASE,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        once: true
      }
    });

    gsap.to(subtitleLines, {
      opacity: 1,
      y: 0,
      scale: ANIMATION_CONFIG.SCALE.END,
      duration: ANIMATION_CONFIG.DURATION,
      stagger: ANIMATION_CONFIG.STAGGER,
      ease: ANIMATION_CONFIG.EASE,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        once: true
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="text-center space-y-4">
      <h2 
        ref={titleRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
        style={{ willChange: "transform" }}
      >
        <span className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-1">About</span>
        <span className="inline-block px-1">Me</span>
      </h2>
      <p 
        ref={subtitleRef}
        className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg"
        style={{ willChange: "transform" }}
      >
        <span className="inline-block">Passionate about creating seamless user experiences</span>{" "}
        <span className="inline-block">and bringing innovative ideas to life through code.</span>
      </p>
    </div>
  );
};

export default Title;
