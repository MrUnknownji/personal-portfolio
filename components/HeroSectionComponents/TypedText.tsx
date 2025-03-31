import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  INITIAL: { Y: -30, OPACITY: 0 },
  ENTER: { DURATION: 1, STAGGER: 0.05, EASE: "back.out(1.7)" },
  EXIT: { DURATION: 1, STAGGER: 0.03, Y: 20, EASE: "power2.in" },
  DISPLAY_DURATION: 4000,
  OVERLAP_FACTOR: 0.5,
} as const;

const TypedText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  const TEXTS = useMemo(
    () => [
      "Building robust backend systems",
      "Crafting intuitive front-end interfaces",
      "Optimizing database performance",
      "Implementing secure authentication",
      "Developing RESTful APIs",
      "Creating responsive web designs",
    ],
    [],
  );

  const cleanupAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
  }, []);

  const createChars = useCallback((text: string, container: HTMLElement) => {
    const fragment = document.createDocumentFragment();
    const measureDiv = document.createElement("div");
    measureDiv.style.cssText =
      "visibility: hidden; position: absolute; white-space: nowrap;";
    container.appendChild(measureDiv);

    const positions: { left: number }[] = [];
    text.split("").forEach((char) => {
      const measureSpan = document.createElement("span");
      measureSpan.textContent = char === " " ? "\u00A0" : char;
      measureSpan.style.display = "inline-block";
      measureDiv.appendChild(measureSpan);
      positions.push({ left: measureSpan.offsetLeft });
    });
    measureDiv.remove();

    const wrapper = document.createElement("div");
    wrapper.className = "text-wrapper";
    wrapper.style.cssText =
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%;";

    const chars: HTMLElement[] = [];
    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.className = "typed-char";
      span.style.cssText = `
        display: inline-block;
        position: absolute;
        left: ${positions[index].left}px;
        transform-origin: center;
        will-change: transform, opacity;
      `;
      wrapper.appendChild(span);
      chars.push(span);
    });

    fragment.appendChild(wrapper);
    container.appendChild(fragment);

    return { chars, wrapper };
  }, []);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      cleanupAnimation();

      const currentText = TEXTS[currentTextIndex];
      const nextTextIndex = (currentTextIndex + 1) % TEXTS.length;
      const nextText = TEXTS[nextTextIndex];

      let currentWrapper: HTMLDivElement | null =
        container.querySelector(".text-wrapper");
      let currentChars: HTMLElement[] = currentWrapper
        ? (Array.from(
            currentWrapper.querySelectorAll(".typed-char"),
          ) as HTMLElement[])
        : [];

      const masterTimeline = gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => {
          if (containerRef.current) {
            const wrappers =
              containerRef.current.querySelectorAll(".text-wrapper");
            if (wrappers.length > 1) {
              wrappers[0].remove();
            }
          }
          setCurrentTextIndex(nextTextIndex);
        },
      });
      animationRef.current = masterTimeline;

      if (currentChars.length > 0 && currentWrapper) {
        // === Transitioning ===
        const { chars: nextChars } = createChars(nextText, container);

        gsap.set(nextChars, {
          y: ANIMATION_CONFIG.INITIAL.Y,
          opacity: 0,
        });

        masterTimeline.addLabel(
          "startExit",
          `+=${ANIMATION_CONFIG.DISPLAY_DURATION / 1000}`,
        );

        masterTimeline.to(
          currentChars,
          {
            y: ANIMATION_CONFIG.EXIT.Y,
            opacity: 0,
            duration: ANIMATION_CONFIG.EXIT.DURATION,
            stagger: ANIMATION_CONFIG.EXIT.STAGGER,
            ease: ANIMATION_CONFIG.EXIT.EASE,
          },
          "startExit",
        );

        masterTimeline.to(
          nextChars,
          {
            y: 0,
            opacity: 1,
            duration: ANIMATION_CONFIG.ENTER.DURATION,
            stagger: ANIMATION_CONFIG.ENTER.STAGGER,
            ease: ANIMATION_CONFIG.ENTER.EASE,
          },
          `startExit+=${ANIMATION_CONFIG.EXIT.DURATION * (1 - ANIMATION_CONFIG.OVERLAP_FACTOR)}`,
        );
      } else {
        // === First run ===
        const { chars, wrapper } = createChars(currentText, container);
        currentWrapper = wrapper;
        currentChars = chars;

        gsap.set(chars, {
          y: ANIMATION_CONFIG.INITIAL.Y,
          opacity: 0,
        });

        masterTimeline.to(chars, {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.ENTER.DURATION,
          stagger: ANIMATION_CONFIG.ENTER.STAGGER,
          ease: ANIMATION_CONFIG.ENTER.EASE,
        });

        masterTimeline.to(
          {},
          { duration: ANIMATION_CONFIG.DISPLAY_DURATION / 1000 },
        );
      }
    },
    { dependencies: [currentTextIndex, TEXTS, createChars, cleanupAnimation] },
  );

  useEffect(() => {
    const currentContainer = containerRef.current;
    const currentCleanup = cleanupAnimation;
    return () => {
      currentCleanup();
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, [cleanupAnimation]);

  return (
    <div className="min-h-[2rem] overflow-hidden">
      <div
        ref={containerRef}
        className="text-primary text-xl relative transform-gpu"
        style={{
          position: "relative",
          minHeight: "2rem",
          whiteSpace: "nowrap",
        }}
        aria-live="polite"
        aria-label={TEXTS[currentTextIndex]}
      />
    </div>
  );
};

export default TypedText;
