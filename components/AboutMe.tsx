"use client";
import React from "react";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./ui/Title";

const AboutMe = () => {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 sm:py-20 lg:space-y-24 lg:px-8 lg:py-24"
    >
      <Title
        title="About Me"
        subtitle={
          <>
            <span className="inline-block">
              Passionate about creating seamless user experiences
            </span>{" "}
            <span className="inline-block">
              and bringing innovative ideas to life through code.
            </span>
          </>
        }
      />
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2 h-full flex items-center justify-center">
          <ImageSection />
        </div>
        <div className="lg:col-span-3">
          <JourneySection />
        </div>
      </div>

      <div className="w-full pt-6 lg:pt-8">
        <SkillsSection />
      </div>
    </section>
  );
};

export default AboutMe;
