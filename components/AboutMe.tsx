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

  useGSAP(() => {
    if (!gridRef.current || !pinContainerRef.current) return;

    // Create a timeline for pinning to ensure it works with ScrollSmoother
    const st = ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top top+=120", // Start pinning when grid top hits 120px from viewport top
      end: "bottom bottom", // End when grid bottom hits viewport bottom
      pin: pinContainerRef.current,
      pinSpacing: false, // Important for grid layouts to avoid breaking structure
      scrub: true,
      markers: false,
    });

    return () => {
      st.kill();
    };
  }, { scope: containerRef });

  return (
    <div className="">
      <section
        id="about"
        ref={containerRef}
        className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-20 sm:space-y-24"
      >
        {/* Background Gradient Blob - Reduced blur and opacity */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-2xl -z-10 opacity-30 pointer-events-none" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/10 rounded-full blur-2xl -z-10 opacity-30 pointer-events-none" />

        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Title
            title="About Me"
            subtitle=""
          />
          <FadeIn direction="up" distance={30} delay={0.2}>
            <div className="text-lg sm:text-xl text-neutral-300 font-light italic leading-relaxed">
              &quot;Any fool can write code that a computer can understand. <br className="hidden sm:block" />
              <span className="text-primary/90 font-normal">Good programmers write code that humans can understand.</span>&quot;
              <div className="text-sm text-neutral-500 mt-2 not-italic font-medium">- Martin Fowler</div>
            </div>
          </FadeIn>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          <div ref={pinContainerRef} className="lg:col-span-5 h-fit z-10">
            {/* Enhanced Image Container */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-lg opacity-50" />
              <ImageSection />
            </div>
          </div>

          <div className="lg:col-span-7">
            <JourneySection />
          </div>
        </div>

        <div className="w-full border-t border-white/5 pt-16 lg:pt-24">
          <SkillsSection />
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
