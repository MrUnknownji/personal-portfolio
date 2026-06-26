"use client";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";

const HeroSection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="w-full max-w-7xl mx-auto relative rounded-[2.5rem] p-8 md:p-10 lg:p-16
                   bg-[#0a0a0a]/95 z-10
                   border border-white/5 shadow-[0_14px_45px_rgba(0,0,0,0.28)] overflow-hidden
                   transform-gpu"
      >
        {/* Subtle geometric top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Ambient background glow inside hero container */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, rgba(255, 146, 51, 0.08), transparent 52%)",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 h-full justify-center items-center">
          <div className="z-10 w-full h-full lg:w-1/2">
            <HeroContent />
          </div>
          <div
            className="z-[1] w-full lg:w-1/2 lg:block hidden"
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
