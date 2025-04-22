import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

export const Description = () => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const splitInstanceRef = useRef<SplitType | null>(null);
  const initialHoverPosRef = useRef<{ x: number; y: number } | null>(null);
  const activeEnterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeLeaveTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isCurrentlyHoveringRef = useRef(false);
  const initialCharsRef = useRef<HTMLElement[]>([]);

  const HOVER_COLOR = "#00ff9f";
  const TARGET_SCALE = 1.18;
  const TARGET_OPACITY = 1;
  const BASE_OPACITY = 1;
  const STAGGER_TOTAL_DURATION_IN = 0.15;
  const STAGGER_TOTAL_DURATION_OUT = 0.65;
  const CHARACTER_ANIMATION_DURATION = 0.2;
  const EASE_TYPE_IN = "power3.out";
  const EASE_TYPE_OUT = "power2.inOut";

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
          Math.hypot(relativeOriginX, relativeOriginY),
          Math.hypot(rect.width - relativeOriginX, relativeOriginY),
          Math.hypot(relativeOriginX, rect.height - relativeOriginY),
          Math.hypot(
            rect.width - relativeOriginX,
            rect.height - relativeOriginY,
          ),
        ) || 1;

      const tl = gsap.timeline({
        defaults: {
          duration: CHARACTER_ANIMATION_DURATION,
          ease: isEntering ? EASE_TYPE_IN : EASE_TYPE_OUT,
          overwrite: "auto",
        },
        onComplete: () => {
          if (isEntering) {
            activeEnterTimelineRef.current = null;
            if (!isCurrentlyHoveringRef.current && initialHoverPosRef.current) {
              runAnimation(
                initialHoverPosRef.current.x,
                initialHoverPosRef.current.y,
                false,
              );
            }
          } else {
            activeLeaveTimelineRef.current = null;
            initialHoverPosRef.current = null;
          }
        },
      });

      if (isEntering) {
        activeEnterTimelineRef.current = tl;
        activeLeaveTimelineRef.current?.kill();
      } else {
        activeLeaveTimelineRef.current = tl;
        activeEnterTimelineRef.current?.kill();
      }

      currentChars.forEach((char) => {
        if (!char) return;
        const charRect = char.getBoundingClientRect();
        const charCenterX = charRect.left + charRect.width / 2 - rect.left;
        const charCenterY = charRect.top + charRect.height / 2 - rect.top;

        const distance = Math.hypot(
          relativeOriginX - charCenterX,
          relativeOriginY - charCenterY,
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
      EASE_TYPE_IN,
      EASE_TYPE_OUT,
    ],
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent) => {
      isCurrentlyHoveringRef.current = true;
      activeLeaveTimelineRef.current?.kill();

      if (!activeEnterTimelineRef.current && !initialHoverPosRef.current) {
        initialHoverPosRef.current = { x: event.clientX, y: event.clientY };
        runAnimation(
          initialHoverPosRef.current.x,
          initialHoverPosRef.current.y,
          true,
        );
      } else if (
        !activeEnterTimelineRef.current &&
        initialHoverPosRef.current
      ) {
        runAnimation(
          initialHoverPosRef.current.x,
          initialHoverPosRef.current.y,
          true,
        );
      }
    },
    [runAnimation],
  );

  const handleMouseLeave = useCallback(() => {
    isCurrentlyHoveringRef.current = false;
    if (!activeEnterTimelineRef.current && initialHoverPosRef.current) {
      runAnimation(
        initialHoverPosRef.current.x,
        initialHoverPosRef.current.y,
        false,
      );
    }
  }, [runAnimation]);

  useGSAP(() => {
    if (!descriptionRef.current) return;

    splitInstanceRef.current = new SplitType(descriptionRef.current, {
      types: "chars",
      tagName: "span",
    });

    initialCharsRef.current = splitInstanceRef.current.chars || [];
    const chars = initialCharsRef.current;

    if (!chars || chars.length === 0) {
      splitInstanceRef.current?.revert();
      return;
    }

    gsap.set(chars, { opacity: 0, y: 25, transformOrigin: "center center" });

    gsap.to(chars, {
      y: 0,
      opacity: BASE_OPACITY,
      stagger: 0.015,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.7,
    });

    const currentDescriptionRef = descriptionRef.current;
    currentDescriptionRef.addEventListener("mouseenter", handleMouseEnter);
    currentDescriptionRef.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      currentDescriptionRef.removeEventListener("mouseenter", handleMouseEnter);
      currentDescriptionRef.removeEventListener("mouseleave", handleMouseLeave);
      activeEnterTimelineRef.current?.kill();
      activeLeaveTimelineRef.current?.kill();
      splitInstanceRef.current?.revert();
      gsap.killTweensOf(chars);
      initialHoverPosRef.current = null;
      isCurrentlyHoveringRef.current = false;
    };
  }, [handleMouseEnter, handleMouseLeave, BASE_OPACITY]);

  return (
    <div className="overflow-visible cursor-default py-1 group">
      <p
        ref={descriptionRef}
        className="hero-description text-gray-300 text-lg leading-relaxed max-w-2xl select-none"
        style={{ willChange: "transform, opacity, color" }}
      >
        Transforming ideas into elegant digital solutions with clean code and
        innovative thinking.
      </p>
    </div>
  );
};
