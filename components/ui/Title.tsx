import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface TitleProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  showGlowBar?: boolean;
  className?: string;
}

const ANIMATION_CONFIG = {
  DURATION: 0.8,
  STAGGER: 0.1,
  EASE: "power3.out",
  Y_OFFSET: 30,
  SCALE: {
    START: 0.9,
    END: 1
  },
  GLOW: {
    DURATION: 1.5,
    EASE: "sine.inOut"
  }
} as const;

const Title: React.FC<TitleProps> = ({ 
  title, 
  subtitle, 
  showGlowBar = false,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const glowBarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current) return;

    const words = titleRef.current.querySelectorAll("span");
    
    gsap.set(words, { 
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

    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll("span");
      
      gsap.set(subtitleLines, { 
        opacity: 0,
        y: ANIMATION_CONFIG.Y_OFFSET,
        scale: ANIMATION_CONFIG.SCALE.START
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
    }

    if (glowBarRef.current && showGlowBar) {
      gsap.set(glowBarRef.current, { 
        opacity: 0,
        scaleX: 0.5
      });

      gsap.to(glowBarRef.current, {
        opacity: 1,
        scaleX: 1,
        duration: ANIMATION_CONFIG.DURATION,
        ease: ANIMATION_CONFIG.EASE,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          once: true
        }
      });

      // Add pulsing glow effect
      gsap.to(glowBarRef.current, {
        opacity: 0.7,
        repeat: -1,
        yoyo: true,
        duration: ANIMATION_CONFIG.GLOW.DURATION,
        ease: ANIMATION_CONFIG.GLOW.EASE
      });
    }
  }, { scope: containerRef });

  // Helper function to wrap text in spans if it's a string
  const wrapInSpans = (text: string | React.ReactNode): React.ReactNode => {
    if (typeof text === 'string') {
      return text.split(' ').map((word, index) => (
        <span key={index} className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-1">
          {word}
        </span>
      ));
    }
    return text;
  };

  return (
    <div ref={containerRef} className={`text-center space-y-4 ${className}`}>
      <h2 
        ref={titleRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
        style={{ willChange: "transform" }}
      >
        {wrapInSpans(title)}
      </h2>
      
      {subtitle && (
        <p 
          ref={subtitleRef}
          className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg"
          style={{ willChange: "transform" }}
        >
          {typeof subtitle === 'string' ? (
            <>
              <span className="inline-block">{subtitle}</span>
            </>
          ) : subtitle}
        </p>
      )}
      
      {showGlowBar && (
        <div 
          ref={glowBarRef}
          className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ willChange: "transform" }}
        />
      )}
    </div>
  );
};

export default Title;
