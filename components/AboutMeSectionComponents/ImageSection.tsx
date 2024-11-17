import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const ImageSection = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <div ref={containerRef} className="lg:w-1/2 relative">
      <div
        className="w-64 h-64 mx-auto lg:w-96 lg:h-96 relative cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <div
          className="w-full h-full absolute"
          style={{
            transform: `rotateY(${isFlipped ? "180deg" : "0deg"})`,
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="w-full h-full absolute backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gray-800 rounded-full overflow-hidden">
              <Image
                src="/images/logo.svg"
                alt="Sandeep Kumar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
          <div
            className="w-full h-full absolute backface-hidden bg-gray-800 rounded-full flex flex-col items-center justify-center p-6 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h4 className="text-primary text-2xl font-bold mb-2">
              Quick Facts
            </h4>
            <ul className="text-gray-300 text-sm">
              <li>🎓 CS Graduate from Top University</li>
              <li>💼 5+ Years of Experience</li>
              <li>🌟 10+ Successful Projects</li>
              <li>🏆 Award-winning Developer</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-3xl font-semibold text-primary">Sandeep Kumar</h3>
        <p className="text-accent text-xl">Full Stack Developer</p>
      </div>
    </div>
  );
};

export default ImageSection;
