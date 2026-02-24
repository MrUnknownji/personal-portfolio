import React, { useRef } from "react";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./ui/Title";
import FadeIn from "./FadeIn";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current || !pinContainerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const pinImage = () => {
          const gridHeight = gridRef.current?.offsetHeight || 0;
          const imageContainerHeight =
            pinContainerRef.current?.offsetHeight || 0;

          if (gridHeight > imageContainerHeight) {
            ScrollTrigger.create({
              trigger: gridRef.current,
              start: "top top+=120",
              end: () => `+=${gridHeight - imageContainerHeight}`,
              pin: pinContainerRef.current,
              pinSpacing: false,
              scrub: true,
              invalidateOnRefresh: true,
            });
          }
        };

        pinImage();
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef },
  );

  return (
    <div className="">
      <section
        id="about"
        ref={containerRef}
        className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-20 sm:space-y-24"
      >
        <div className="relative px-4 text-center">
          <Title
            title="About Me"
            showGlowBar={true}
            subtitle={
              <span className="italic block max-w-2xl mx-auto">
                &quot;Any fool can write code that a computer can understand.{" "}
                <br className="hidden sm:block" />
                <span className="text-foreground tracking-wide font-medium">
                  Good programmers write code that humans can understand.
                </span>
                &quot;
                <span className="block text-sm text-primary mt-4 not-italic font-bold tracking-widest uppercase flex items-center justify-center gap-3">
                  <span className="w-8 h-[1px] bg-primary/40"></span>
                  Martin Fowler
                  <span className="w-8 h-[1px] bg-primary/40"></span>
                </span>
              </span>
            }
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative"
        >
          <div
            ref={pinContainerRef}
            className="lg:col-span-5 h-fit z-10 will-change-transform"
          >
            <ImageSection />
          </div>

          <div className="lg:col-span-7">
            <JourneySection />
          </div>
        </div>

        <div className="w-full border-t border-border/20 pt-16 lg:pt-24">
          <SkillsSection />
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
