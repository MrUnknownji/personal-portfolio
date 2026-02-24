"use client";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";

const HeroSection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="w-full max-w-7xl mx-auto relative rounded-[2.5rem] p-8 md:p-10 lg:p-16
                   bg-[#0a0a0a]/90 backdrop-blur-md z-10
                   border border-white/5 shadow-2xl overflow-hidden
                   transform-gpu"
      >
        {/* Subtle geometric top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Ambient background glow inside hero container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 h-full justify-center items-center">
          <div className="z-10 w-full h-full lg:w-1/2">
            <HeroContent />
          </div>
          <div
            className="z-1 w-full lg:w-1/2 lg:block hidden"
            style={{ transform: "translateZ(50px)" }}
          >
            <CodeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
