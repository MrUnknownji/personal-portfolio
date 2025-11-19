"use client";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";

const HeroSection = () => {

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20"
      style={{ perspective: "2000px" }}
    >
      <div
        className="w-full max-w-7xl mx-auto relative rounded-3xl p-6 md:p-8 lg:p-12
                   bg-secondary/80 backdrop-blur-md border border-neutral/30 z-10
                   shadow-2xl shadow-black/40"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-70 pointer-events-none -z-1 rounded-3xl" />

        <div className="relative zd-10 flex flex-col lg:flex-row gap-8 h-full justify-center items-center">
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
