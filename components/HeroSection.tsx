"use client";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";

const HeroSection = () => {

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20 overflow-hidden bg-noise"
      style={{ perspective: "2000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-secondary to-dark -z-20" />

      <div
        className="w-full max-w-7xl mx-auto relative rounded-3xl p-8 md:p-10 lg:p-16
                   bg-frosted-dark backdrop-blur-xl z-10
                   shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] border border-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 pointer-events-none rounded-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 h-full justify-center items-center">
          <div className="z-10 w-full h-full">
            <HeroContent />
          </div>
          <div className="z-1 w-full lg:block hidden">
            <CodeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
