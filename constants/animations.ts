export const ANIMATION_CONFIGS = {
  fadeIn: {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power2.out",
  },
  fadeInScale: {
    opacity: 0,
    scale: 0.9,
    duration: 0.6,
    ease: "power2.out",
  },
  slideIn: {
    x: -30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  },
  staggerChildren: {
    stagger: 0.1,
  },
  heroSection: {
    initial: {
      opacity: 0,
      y: 30,
    },
    animate: {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    },
  },
  codeDisplay: {
    container: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0, duration: 1, delay: 0.5 },
    },
    rotation: {
      rotateY: "+=3",
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    },
  },
  modal: {
    overlay: {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
    },
    content: {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "power2.out",
    },
  },
  cursor: {
    normal: {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    },
    active: {
      scale: 1.5,
      duration: 0.3,
      ease: "power2.out",
    },
  },
} as const;

export const SCROLL_SETTINGS = {
  smooth: {
    duration: 0.8,
    ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: true,
  },
} as const;
