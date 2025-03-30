import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

export const Description = () => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const splitInstanceRef = useRef<SplitType | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const lastEnterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const lastLeaveTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const initialCharsRef = useRef<HTMLElement[]>([]);

  const HOVER_COLOR = "#00ff9f";
  const TARGET_SCALE = 1.1;
  const TARGET_OPACITY = 1;
  const BASE_OPACITY = 1;
  const STAGGER_TOTAL_DURATION_IN = 0.5;
  const STAGGER_TOTAL_DURATION_OUT = 0.4;
  const CHARACTER_ANIMATION_DURATION = 0.3;
  const EASE_TYPE = "power2.out";

  const runAnimation = useCallback(
    (originX: number, originY: number, isEntering: boolean) => {
      const descriptionElement = descriptionRef.current;
      const currentChars = initialCharsRef.current;

      if (!descriptionElement || !currentChars || currentChars.length === 0)
        return;

      const rect = descriptionElement.getBoundingClientRect();
      const relativeOriginX = originX - rect.left;
      const relativeOriginY = originY - rect.top;

      const maxDist =
        Math.max(
          Math.sqrt(relativeOriginX ** 2 + relativeOriginY ** 2),
          Math.sqrt((rect.width - relativeOriginX) ** 2 + relativeOriginY ** 2),
          Math.sqrt(
            relativeOriginX ** 2 + (rect.height - relativeOriginY) ** 2,
          ),
          Math.sqrt(
            (rect.width - relativeOriginX) ** 2 +
              (rect.height - relativeOriginY) ** 2,
          ),
        ) || 1;

      const tl = gsap.timeline({
        defaults: {
          duration: CHARACTER_ANIMATION_DURATION,
          ease: EASE_TYPE,
          overwrite: "auto",
        },
      });

      if (isEntering) {
        lastEnterTimelineRef.current = tl;
        lastLeaveTimelineRef.current?.kill();
      } else {
        lastLeaveTimelineRef.current = tl;
      }

      currentChars.forEach((char) => {
        if (!char) return;
        const charRect = char.getBoundingClientRect();
        const charCenterX = charRect.left + charRect.width / 2 - rect.left;
        const charCenterY = charRect.top + charRect.height / 2 - rect.top;

        const distance = Math.sqrt(
          Math.pow(relativeOriginX - charCenterX, 2) +
            Math.pow(relativeOriginY - charCenterY, 2),
        );

        const delay =
          (distance / maxDist) *
          (isEntering ? STAGGER_TOTAL_DURATION_IN : STAGGER_TOTAL_DURATION_OUT);
        const targetVars = isEntering
          ? { color: HOVER_COLOR, scale: TARGET_SCALE, opacity: TARGET_OPACITY }
          : {
              color: "currentColor",
              scale: 1,
              opacity: BASE_OPACITY,
              clearProps: "color,scale,opacity",
            };

        tl.to(char, targetVars, delay);
      });
    },
    [
      HOVER_COLOR,
      TARGET_SCALE,
      TARGET_OPACITY,
      BASE_OPACITY,
      CHARACTER_ANIMATION_DURATION,
      STAGGER_TOTAL_DURATION_IN,
      STAGGER_TOTAL_DURATION_OUT,
      EASE_TYPE,
    ],
  );

  const handleMouseMove = useCallback((event: MouseEvent) => {
    lastMousePosRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleMouseEnter = useCallback(
    (event: MouseEvent) => {
      if (!isHoveringRef.current) {
        isHoveringRef.current = true;
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
        runAnimation(event.clientX, event.clientY, true);
      }
    },
    [runAnimation],
  );

  const handleMouseLeave = useCallback(() => {
    if (isHoveringRef.current) {
      isHoveringRef.current = false;
      runAnimation(lastMousePosRef.current.x, lastMousePosRef.current.y, false);
    }
  }, [runAnimation]);

  useGSAP(() => {
    if (!descriptionRef.current) return;

    splitInstanceRef.current = new SplitType(descriptionRef.current, {
      types: "chars",
      tagName: "span",
    });

    initialCharsRef.current =
      (splitInstanceRef.current.chars as HTMLElement[]) || [];
    const chars = initialCharsRef.current;

    if (!chars || chars.length === 0) {
      splitInstanceRef.current?.revert();
      return;
    }

    gsap.set(chars, { opacity: 0, y: 20 });

    gsap.to(chars, {
      y: 0,
      opacity: BASE_OPACITY,
      stagger: 0.01,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.5,
    });

    const currentDescriptionRef = descriptionRef.current;
    currentDescriptionRef.addEventListener("mouseenter", handleMouseEnter);
    currentDescriptionRef.addEventListener("mousemove", handleMouseMove);
    currentDescriptionRef.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      currentDescriptionRef.removeEventListener("mouseenter", handleMouseEnter);
      currentDescriptionRef.removeEventListener("mousemove", handleMouseMove);
      currentDescriptionRef.removeEventListener("mouseleave", handleMouseLeave);
      lastEnterTimelineRef.current?.kill();
      lastLeaveTimelineRef.current?.kill();
      splitInstanceRef.current?.revert();
      gsap.killTweensOf(chars);
    };
  }, [
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    BASE_OPACITY,
    runAnimation,
  ]);

  return (
    <div className="overflow-visible cursor-default py-1">
      <p
        ref={descriptionRef}
        className="hero-description text-gray-300 text-lg leading-relaxed max-w-2xl"
        style={{ willChange: "transform, opacity, color" }}
      >
        Transforming ideas into elegant digital solutions with clean code and
        innovative thinking.
      </p>
    </div>
  );
};
