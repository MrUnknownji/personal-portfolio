import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const JourneySection = () => {
  const journeyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      journeyRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        scrollTrigger: {
          trigger: journeyRef.current,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
    );

    gsap.fromTo(
      borderRef.current,
      { width: "0%" },
      {
        scrollTrigger: {
          trigger: journeyRef.current,
          start: "top 75%",
        },
        width: "100%",
        duration: 1.2,
        ease: "power2.out",
      },
    );

    const words = textRef.current?.children;
    if (words) {
      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 20,
        },
        {
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 75%",
          },
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.7,
          ease: "power2.out",
        },
      );
    }
  }, []);

  const description =
    "From writing my first line of code to developing complex web applications, every step of my journey has been driven by a passion for problem-solving and a desire to create impactful digital experiences. I thrive on challenges and continuously push myself to learn and grow in this ever-evolving field.";

  return (
    <div
      ref={journeyRef}
      className="relative bg-secondary p-6 sm:p-8 rounded-lg
        [@media(hover:hover)]:hover:scale-[1.02]
        [transition:transform_0.3s_ease-out]
        border border-primary/20"
    >
      <div className="space-y-6">
        <div className="relative">
          <h3 className="text-2xl font-semibold text-primary tracking-wide">
            My Journey
          </h3>
          <div
            ref={borderRef}
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent"
          />
        </div>

        <p
          ref={textRef}
          className="text-gray-200 text-lg leading-relaxed tracking-wide"
        >
          {description.split(" ").map((word, index) => (
            <span
              key={index}
              className="inline-block mr-1 [transition:color_0.2s_ease-out]
                hover:text-primary"
            >
              {word}
            </span>
          ))}
        </p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
    </div>
  );
};

export default JourneySection;
