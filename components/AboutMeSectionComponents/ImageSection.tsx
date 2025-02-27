import React, { useRef, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  CONTAINER: {
    DURATION: 1,
    EASE: "power3.out",
    Y_OFFSET: 50,
    OPACITY: 0,
    SCALE: 0.95
  },
  IMAGE: {
    DURATION: 0.8,
    EASE: "power2.out",
    SCALE: 1.05,
    FILTER: "brightness(1.1) contrast(1.1)"
  },
  GLOW: {
    DURATION: 1.5,
    EASE: "power2.inOut",
    OPACITY_RANGE: [0.4, 0.6]
  }
} as const;

const ImageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !glowRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    gsap.to(glowRef.current, {
      x: x - width / 2,
      y: y - height / 2,
      duration: 0.5,
      ease: "power2.out"
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!imageWrapperRef.current || !glowRef.current) return;

    gsap.to(imageWrapperRef.current.querySelector('img'), {
      scale: ANIMATION_CONFIG.IMAGE.SCALE,
      filter: ANIMATION_CONFIG.IMAGE.FILTER,
      duration: ANIMATION_CONFIG.IMAGE.DURATION,
      ease: ANIMATION_CONFIG.IMAGE.EASE
    });

    gsap.to(glowRef.current, {
      opacity: ANIMATION_CONFIG.GLOW.OPACITY_RANGE[1],
      duration: ANIMATION_CONFIG.GLOW.DURATION,
      ease: ANIMATION_CONFIG.GLOW.EASE
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!imageWrapperRef.current || !glowRef.current) return;

    gsap.to(imageWrapperRef.current.querySelector('img'), {
      scale: 1,
      filter: "none",
      duration: ANIMATION_CONFIG.IMAGE.DURATION,
      ease: ANIMATION_CONFIG.IMAGE.EASE
    });

    gsap.to(glowRef.current, {
      opacity: ANIMATION_CONFIG.GLOW.OPACITY_RANGE[0],
      duration: ANIMATION_CONFIG.GLOW.DURATION,
      ease: ANIMATION_CONFIG.GLOW.EASE
    });
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      {
        y: ANIMATION_CONFIG.CONTAINER.Y_OFFSET,
        opacity: ANIMATION_CONFIG.CONTAINER.OPACITY,
        scale: ANIMATION_CONFIG.CONTAINER.SCALE
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.CONTAINER.DURATION,
        ease: ANIMATION_CONFIG.CONTAINER.EASE,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
      
      {/* Interactive glow effect */}
      <div
        ref={glowRef}
        className="absolute w-96 h-96 bg-primary/20 rounded-full filter blur-3xl pointer-events-none opacity-40 transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* Image container */}
      <div
        ref={imageWrapperRef}
        className="relative aspect-square overflow-hidden rounded-2xl transform-gpu"
      >
        <Image
          src="/your-image.jpg"
          alt="Profile"
          fill
          className="object-cover transform-gpu"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* Border effect */}
      <div className="absolute inset-0 border border-primary/20 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default ImageSection;
