"use client";
import { Title } from "./Title";
import { MagneticText } from "./MagneticText";

const HeroText = () => {
  return (
    <div className="space-y-6">
      <Title />
      <div className="space-y-4">
        <MagneticText
          as="h2"
          className="hero-subtitle text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-200 tracking-tight cursor-default"
        >
          Full Stack Developer
        </MagneticText>
        <div className="relative pl-4 border-l-2 border-white/10 py-1">
          <MagneticText
            as="p"
            className="hero-description text-neutral-400 text-base md:text-lg leading-relaxed max-w-2xl select-none font-light italic"
          >
            &quot;Code is like humor. When you have to explain it, it&rsquo;s
            bad.&quot;
          </MagneticText>
          <span className="text-xs text-neutral-500 font-medium mt-1 block uppercase tracking-wider">&mdash; Cory House</span>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
