import React from "react";
import ImageSection from "./AboutMeSectionComponents/ImageSection"; 
import JourneySection from "./AboutMeSectionComponents/JourneySection"; 
import SkillsSection from "./AboutMeSectionComponents/SkillsSection"; 
import Title from "./ui/Title"; 
import FadeIn from "./FadeIn";

const AboutMe = () => {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-20 sm:space-y-24"
    >
      {/* Background Gradient Blob */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="text-center space-y-4 max-w-3xl mx-auto">
        {/* Title Component already has ScrollTrigger built-in */}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5 h-full flex flex-col justify-center">
           {/* Enhanced Image Container */}
          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70" />
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
  );
};

export default AboutMe;
