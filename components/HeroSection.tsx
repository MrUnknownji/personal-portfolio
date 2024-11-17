import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          if (contentRef.current) {
            gsap.to(contentRef.current, {
              y: self.progress * -50,
              opacity: 1 - self.progress * 0.5,
              duration: 0.1,
              ease: "none",
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-0"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div
          ref={contentRef}
          className="relative bg-gray-900/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 border border-gray-800/50 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            <HeroContent />
            <CodeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
