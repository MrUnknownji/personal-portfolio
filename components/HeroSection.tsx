"use client";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";

const HeroSection = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20 overflow-hidden"
      style={{ perspective: "2000px" }}
    >
      {/* Subtle modern background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      <div
        className="w-full max-w-7xl mx-auto relative rounded-3xl p-8 md:p-10 lg:p-16
                   bg-white/[0.02] backdrop-blur-2xl z-10
                   shadow-[0_0_100px_-30px_rgba(0,0,0,0.5)] border border-white/[0.05]"
      >
        {/* Inner subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-30 pointer-events-none rounded-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 h-full justify-center items-center">
          <div className="z-10 w-full h-full lg:w-1/2">
            <HeroContent />
          </div>
          <div className="z-1 w-full lg:w-1/2 lg:block hidden">
            <CodeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
