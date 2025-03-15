import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  INITIAL: {
    Y: -30,
    OPACITY: 0
  },
  ENTER: {
    DURATION: 1,
    STAGGER: 0.05,
    EASE: "back.out(1.7)"
  },
  EXIT: {
    DURATION: 1,
    STAGGER: 0.03,
    Y: 20,
    EASE: "power2.in"
  },
  DISPLAY_DURATION: 4000,
  OVERLAP_FACTOR: 0.5
} as const;

const TypedText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Clean up function for DOM and animations
  const cleanupCurrentAnimation = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Kill any ongoing animations
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
  }, []);

  const createChars = useCallback((text: string, container: HTMLElement, isNextText = false) => {
    // Create container for better performance
    const fragment = document.createDocumentFragment();
    
    // Create a temporary div for measuring
    const measureDiv = document.createElement("div");
    measureDiv.style.cssText = "visibility: hidden; position: absolute; white-space: nowrap;";
    container.appendChild(measureDiv);

    const positions: { left: number }[] = [];
    text.split("").forEach((char) => {
      const measureSpan = document.createElement("span");
      measureSpan.textContent = char === " " ? "\u00A0" : char;
      measureSpan.style.display = "inline-block";
      measureDiv.appendChild(measureSpan);
      positions.push({
        left: measureSpan.offsetLeft,
      });
    });
    measureDiv.remove();

    // Create a wrapper to help with identification of text sets
    const wrapper = document.createElement("div");
    wrapper.className = isNextText ? "next-text" : "current-text";
    wrapper.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%;";
    
    // Create all character spans
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

  const animateText = useCallback(
    (text: string) => {
      if (!containerRef.current || isAnimating) return;
      setIsAnimating(true);
      
      // Clean up previous animations but don't clear DOM yet
      cleanupCurrentAnimation();

      // Create a master timeline
      const masterTimeline = gsap.timeline({ 
        defaults: { overwrite: true },
        onComplete: () => {
          // Clear container when all animations are done
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
          
          // Set up next phase
          setIsAnimating(false);
          setCurrentTextIndex((prev) => (prev + 1) % TEXTS.length);
        }
      });
      
      // Store timeline for cleanup
      animationRef.current = masterTimeline;
      
      // Find current text wrapper if it exists
      const currentTextWrapper = containerRef.current.querySelector('.current-text');
      
      if (currentTextWrapper) {
        // Get current chars as actual HTMLElements
        const currentChars = Array.from(currentTextWrapper.querySelectorAll('.typed-char')) as HTMLElement[];
        
        // Create the next text while current is still visible
        const nextTextIndex = (currentTextIndex + 1) % TEXTS.length;
        const nextText = TEXTS[nextTextIndex];
        const { chars: nextChars } = createChars(nextText, containerRef.current, true);
        
        // Initially hide the next text
        gsap.set(nextChars, {
          y: ANIMATION_CONFIG.INITIAL.Y,
          opacity: 0
        });
        
        // Add display duration in the timeline - how long to show the completed text
        masterTimeline.to({}, { duration: ANIMATION_CONFIG.DISPLAY_DURATION / 1000 });
        
        // Exit animation for current text - character by character
        masterTimeline.to(currentChars, {
          y: ANIMATION_CONFIG.EXIT.Y,
          opacity: 0,
          duration: ANIMATION_CONFIG.EXIT.DURATION,
          stagger: ANIMATION_CONFIG.EXIT.STAGGER,
          ease: ANIMATION_CONFIG.EXIT.EASE
        });
        
        // Entrance animation for next text with overlap
        masterTimeline.to(nextChars, {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.ENTER.DURATION,
          stagger: ANIMATION_CONFIG.ENTER.STAGGER,
          ease: ANIMATION_CONFIG.ENTER.EASE
        }, `-=${ANIMATION_CONFIG.EXIT.DURATION * ANIMATION_CONFIG.OVERLAP_FACTOR}`);
      } else {
        // First run - no existing text
        const { chars } = createChars(text, containerRef.current);
        
        // Initial state
        gsap.set(chars, {
          y: ANIMATION_CONFIG.INITIAL.Y,
          opacity: 0
        });
        
        // Enter animation for first text
        masterTimeline.to(chars, {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.ENTER.DURATION,
          stagger: ANIMATION_CONFIG.ENTER.STAGGER,
          ease: ANIMATION_CONFIG.ENTER.EASE
        });
        
        // Add display duration in the timeline
        masterTimeline.to({}, { duration: ANIMATION_CONFIG.DISPLAY_DURATION / 1000 });
      }
    },
    [isAnimating, currentTextIndex, TEXTS, cleanupCurrentAnimation, createChars],
  );

  // Start animation when needed
  useGSAP(() => {
    if (!isAnimating) {
      animateText(TEXTS[currentTextIndex]);
    }
  }, [currentTextIndex, isAnimating, animateText, TEXTS]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupCurrentAnimation();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [cleanupCurrentAnimation]);

  return (
    <div className="min-h-[2rem] overflow-hidden">
      <div
        ref={containerRef}
        className="text-accent text-xl relative transform-gpu"
        style={{
          position: "relative",
          minHeight: "2rem",
          whiteSpace: "nowrap",
        }}
        aria-label={TEXTS[currentTextIndex]}
      />
    </div>
  );
};

export default TypedText;
