"use client";
import { Title } from "./Title";
import { MagneticText } from "./MagneticText";

const HeroText = () => {
  return (
    <div className="space-y-4">
      <Title />
      <MagneticText
        as="h2"
        className="hero-subtitle text-2xl md:text-3xl font-semibold text-[#4FD1C5] cursor-default"
      >
        Full Stack Developer
      </MagneticText>
      <MagneticText
        as="p"
        className="hero-description text-gray-300 text-lg leading-relaxed max-w-2xl select-none"
      >
        &quot;Code is like humor. When you have to explain it, it&rsquo;s
        bad.&quot; &ndash; Cory House
      </MagneticText>
    </div>
  );
};

export default HeroText;
