"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./AboutMeSectionComponents/Title";

gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
  const SECTION_PADDING_Y: number = 20;
  const STICKY_TOP_OFFSET: number = 24;

  useEffect(() => {
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className={`py-${SECTION_PADDING_Y}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title />
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
          <div className="w-full lg:w-2/5 lg:sticky lg:top-24">
            <ImageSection />
          </div>
          <div className="w-full lg:w-3/5 space-y-8 lg:space-y-12">
            <JourneySection />
            <SkillsSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
