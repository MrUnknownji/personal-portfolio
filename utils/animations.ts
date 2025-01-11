import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ANIMATION_CONFIGS } from "@/constants/animations";

gsap.registerPlugin(ScrollTrigger);

export const fadeInUp = (element: Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { ...ANIMATION_CONFIGS.fadeIn, delay },
    { opacity: 1, y: 0 },
  );
};

export const fadeInScale = (element: Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { ...ANIMATION_CONFIGS.fadeInScale, delay },
    { opacity: 1, scale: 1 },
  );
};

export const slideIn = (element: Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { ...ANIMATION_CONFIGS.slideIn, delay },
    { opacity: 1, x: 0 },
  );
};

export const createScrollTrigger = (
  element: Element,
  animation: gsap.core.Tween,
) => {
  return ScrollTrigger.create({
    trigger: element,
    animation,
    start: "top bottom-=100",
    toggleActions: "play none none reverse",
  });
};

export const animateHeroSection = (container: Element) => {
  const elements = container.querySelectorAll(".animate-hero");
  const timeline = gsap.timeline();

  elements.forEach((element, index) => {
    timeline.fromTo(
      element,
      { ...ANIMATION_CONFIGS.heroSection.initial },
      {
        ...ANIMATION_CONFIGS.heroSection.animate,
        delay: index * ANIMATION_CONFIGS.staggerChildren.stagger,
      },
    );
  });

  return timeline;
};

export const animateCodeDisplay = (container: Element, codeBlock: Element) => {
  const timeline = gsap.timeline();

  timeline
    .fromTo(
      container,
      { ...ANIMATION_CONFIGS.codeDisplay.container.initial },
      ANIMATION_CONFIGS.codeDisplay.container.animate,
    )
    .to(codeBlock, ANIMATION_CONFIGS.codeDisplay.rotation);

  return timeline;
};

export const animateModal = (overlay: Element, content: Element) => {
  const timeline = gsap.timeline();

  timeline
    .fromTo(overlay, { opacity: 0 }, ANIMATION_CONFIGS.modal.overlay)
    .fromTo(
      content,
      { ...ANIMATION_CONFIGS.modal.content },
      { opacity: 1, y: 0 },
      "-=0.2",
    );

  return timeline;
};

export const animateCursor = (cursor: Element, isActive: boolean) => {
  return gsap.to(
    cursor,
    isActive
      ? ANIMATION_CONFIGS.cursor.active
      : ANIMATION_CONFIGS.cursor.normal,
  );
};
