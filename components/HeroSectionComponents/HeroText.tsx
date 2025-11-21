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
          className="hero-subtitle text-2xl md:text-3xl lg:text-4xl font-semibold text-accent/90 tracking-wide cursor-default"
        >
          Full Stack Developer
        </MagneticText>
        <MagneticText
          as="p"
          className="hero-description text-neutral-300 text-lg md:text-xl leading-relaxed max-w-2xl select-none font-light"
        >
          &quot;Code is like humor. When you have to explain it, it&rsquo;s
          bad.&quot; &ndash; Cory House
        </MagneticText>
      </div>
    </div>
  );
};

export default HeroText;
