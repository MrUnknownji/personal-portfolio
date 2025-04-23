// "use client"; removed - This is now a Server Component by default
import React from "react";
import ImageSection from "./AboutMeSectionComponents/ImageSection"; // Client Component
import JourneySection from "./AboutMeSectionComponents/JourneySection"; // Client Component
import SkillsSection from "./AboutMeSectionComponents/SkillsSection"; // Client Component
import Title from "./ui/Title"; // Can be Server or Client (assuming it doesn't use client hooks)

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
          {/* ImageSection remains a Client Component due to useGSAP */}
          <ImageSection />
        </div>
        <div className="lg:col-span-3">
          {/* JourneySection remains a Client Component due to useGSAP */}
          <JourneySection />
        </div>
      </div>

      <div className="w-full pt-6 lg:pt-8">
        {/* SkillsSection remains a Client Component due to useGSAP */}
        <SkillsSection />
      </div>
    </section>
  );
};

export default AboutMe;
