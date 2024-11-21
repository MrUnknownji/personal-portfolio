import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      gsap.to(borderRef.current, {
        backgroundPosition: "200% 0",
        duration: 3,
        ease: "none",
        repeat: -1,
      });

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
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative mt-24 sm:mt-6"
    >
      <div className="w-full max-w-7xl mx-auto mt-24 sm:mt-0">
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-3xl overflow-hidden z-1">
            <div
              ref={borderRef}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(79, 209, 197, 0.2) 25%,
                  rgba(79, 209, 197, 0.5) 50%,
                  rgba(79, 209, 197, 0.2) 75%,
                  transparent 100%
                )`,
                backgroundSize: "200% 100%",
                backgroundPosition: "0 0",
              }}
            />
          </div>

          <div
            ref={cardRef}
            className="relative backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12
              bg-gray-900 border border-gray-800/50 z-10"
          >
            <div
              ref={contentRef}
              className="relative flex flex-col lg:flex-row gap-8 h-full justify-center items-center"
            >
              <div className="z-10 w-full h-full">
                <HeroContent />
              </div>
              <div className="z-1 w-full sm:visible hidden">
                <CodeDisplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
