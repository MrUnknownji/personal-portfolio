"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./AboutMeSectionComponents/Title";

const AboutMe = () => {
  const SECTION_PADDING_Y: number = 20;

  useEffect(() => {
    gsap.to(".about-me", { duration: 0.5, opacity: 1 });
  }, []);

  return (
    <section className={`py-${SECTION_PADDING_Y} about-me opacity-0`}>
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
