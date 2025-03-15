"use client";
import React from "react";
import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./ui/Title";

const AboutMe = () => {
  return (
    <section id="about" className="py-8 sm:py-12 lg:py-20 about-me relative mx-auto max-w-7xl space-y-12 lg:space-y-16">
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

      {/* Image and journey sections */}
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 w-full">
        <ImageSection />
        <JourneySection />
      </div>

      {/* Skills section */}
      <div className="w-full">
        <SkillsSection />
      </div>
    </section>
  );
};

export default AboutMe;
