import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  DURATION: 1,
  EASE: "power3.out",
  SCALE: {
    START: 1.1,
    END: 1
  },
  OPACITY: {
    START: 0,
    END: 1
  },
  BORDER: {
    DURATION: 1.2,
    EASE: "power2.inOut",
    DELAY: 0.3
  }
} as const;

const ImageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !imageWrapperRef.current || !imageRef.current || !borderRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        once: true
      }
    });

    // Initial setup
    gsap.set(imageWrapperRef.current, { clipPath: "inset(100% 0 0 0)" });
    gsap.set(imageRef.current, { 
      scale: ANIMATION_CONFIG.SCALE.START,
      opacity: ANIMATION_CONFIG.OPACITY.START
    });
    gsap.set(borderRef.current, { autoAlpha: 0 });

    // Animation sequence
    tl.to(imageWrapperRef.current, {
      clipPath: "inset(0% 0 0 0)",
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE
    })
    .to(imageRef.current, {
      scale: ANIMATION_CONFIG.SCALE.END,
      opacity: ANIMATION_CONFIG.OPACITY.END,
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE
    }, "<")
    .to(borderRef.current, {
      autoAlpha: 1,
      duration: ANIMATION_CONFIG.BORDER.DURATION,
      ease: ANIMATION_CONFIG.BORDER.EASE
    }, ANIMATION_CONFIG.BORDER.DELAY);

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-square max-w-md mx-auto"
      style={{ willChange: "transform" }}
    >
      {/* Border decoration */}
      <div 
        ref={borderRef}
        className="absolute -inset-4 border-2 border-primary/20 rounded-2xl -z-10"
      />

      {/* Image wrapper with clip-path animation */}
      <div 
        ref={imageWrapperRef}
        className="w-full h-full rounded-xl overflow-hidden bg-gray-900/50"
        style={{ willChange: "clip-path" }}
      >
        <Image
          ref={imageRef}
          src="/my-image.jpg"
          alt="Profile"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          style={{ willChange: "transform, opacity" }}
          priority
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />
    </div>
  );
};

export default ImageSection;
