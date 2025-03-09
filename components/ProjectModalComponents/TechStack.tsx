import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface TechStackProps {
  technologies: string[];
}

const ANIMATION_CONFIG = {
  INITIAL: {
    OPACITY: 0,
    SCALE: 0.8,
    Y: 10
  },
  ANIMATION: {
    DURATION: 0.4,
    STAGGER: 0.05,
    EASE: "back.out(1.7)"
  },
  HOVER: {
    DURATION: 0.3,
    EASE: "power2.out"
  },
  SHINE: {
    DURATION: 1,
    EASE: "power1.inOut"
  }
} as const;

export const TechStack = ({ technologies }: TechStackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const techItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // Initial animation for tech items
    gsap.fromTo(
      containerRef.current?.children || [],
      { 
        opacity: ANIMATION_CONFIG.INITIAL.OPACITY,
        scale: ANIMATION_CONFIG.INITIAL.SCALE,
        y: ANIMATION_CONFIG.INITIAL.Y
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: ANIMATION_CONFIG.ANIMATION.DURATION,
        stagger: ANIMATION_CONFIG.ANIMATION.STAGGER,
        ease: ANIMATION_CONFIG.ANIMATION.EASE,
      }
    );

    // Setup hover animations for each tech item
    techItemsRef.current.forEach((item) => {
      if (!item) return;
      
      const border = item;
      const shine = item.querySelector('.shine-effect');
      
      const ctx = gsap.context(() => {
        // Create hover animation
        item.addEventListener('mouseenter', () => {
          gsap.to(border, {
            borderColor: 'rgba(0, 255, 159, 0.4)',
            backgroundColor: 'rgba(55, 65, 81, 0.7)',
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE
          });
          
          // Animate the shine effect
          gsap.fromTo(shine, 
            { x: '-100%' },
            { 
              x: '100%', 
              duration: ANIMATION_CONFIG.SHINE.DURATION, 
              ease: ANIMATION_CONFIG.SHINE.EASE 
            }
          );
        });
        
        item.addEventListener('mouseleave', () => {
          gsap.to(border, {
            borderColor: 'rgba(0, 255, 159, 0.2)',
            backgroundColor: 'rgba(55, 65, 81, 0.5)',
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE
          });
        });
      }, item);
      
      return () => ctx.revert();
    });
    
  }, { scope: containerRef });

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Technologies Used</h3>
      <div 
        ref={containerRef}
        className="flex flex-wrap gap-2"
      >
        {technologies.map((tech, index) => (
          <div
            key={index}
            ref={(el: HTMLDivElement | null) => { techItemsRef.current[index] = el }}
            className="px-3 py-1.5 rounded-lg bg-gray-700/50 text-primary border border-primary/20
              text-sm font-medium backdrop-blur-sm shadow-lg relative group overflow-hidden"
            style={{ willChange: "transform, opacity, background-color, border-color" }}
          >
            <div className="relative z-10">
              {tech}
            </div>
            <div 
              className="shine-effect absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0"
              style={{ willChange: "transform" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
