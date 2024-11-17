import { useEffect, useRef } from "react";
import gsap from "gsap";

const JourneySection = () => {
  const journeyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.fromTo(
      journeyRef.current,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: journeyRef.current,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
    );

    const words = textRef.current?.children;
    if (words) {
      gsap.fromTo(
        words,
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          stagger: 0.02,
          duration: 0.5,
          ease: "power1.out",
        },
      );
    }
  }, []);

  const description =
    "From writing my first line of code to developing complex web applications, every step of my journey has been driven by a passion for problem-solving and a desire to create impactful digital experiences. I thrive on challenges and continuously push myself to learn and grow in this ever-evolving field.";

  return (
    <div ref={journeyRef} className="bg-gray-800 p-6 rounded-lg shadow-inner">
      <h3 className="text-2xl font-semibold text-primary mb-4">My Journey</h3>
      <p ref={textRef} className="text-gray-300 text-lg leading-relaxed">
        {description.split(" ").map((word, index) => (
          <span key={index} className="inline-block mr-1">
            {word}
          </span>
        ))}
      </p>
    </div>
  );
};

export default JourneySection;
