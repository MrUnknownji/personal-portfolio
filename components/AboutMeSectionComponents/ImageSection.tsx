import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const ImageSection = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

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

    gsap.to(indicatorRef.current, {
      rotate: 360,
      duration: 3,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div ref={containerRef} className="lg:w-1/2 relative">
      <div
        className="w-64 h-64 mx-auto lg:w-96 lg:h-96 relative group"
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={indicatorRef}
          className="absolute -right-2 -top-2 w-12 h-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          <div className="relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <circle
                  id="baseCircle"
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="stroke-primary"
                  strokeLinecap="round"
                />
              </defs>
              <use
                href="#baseCircle"
                style={{
                  clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                }}
              />
              <use
                href="#baseCircle"
                style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
              />
            </svg>
            <div className="absolute inset-3 bg-primary rounded-full"></div>
            <div className="absolute inset-4 bg-accent rounded-full transform rotate-45"></div>
          </div>
        </div>

        <div
          className="w-full h-full absolute"
          style={{
            transform: `rotateY(${isFlipped ? "180deg" : "0deg"})`,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="w-full h-full absolute backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 rounded-full before:absolute before:inset-0 before:rounded-full before:border-2 before:border-primary before:scale-0 before:opacity-0 group-hover:before:scale-105 group-hover:before:opacity-100 before:transition-all before:duration-500 before:ease-out"
                style={{
                  transform: isHovered ? "rotate(360deg)" : "rotate(0deg)",
                  transition: "transform 3s linear",
                }}
              ></div>
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
            <h4 className="text-primary text-2xl font-bold mb-4">
              Quick Facts
            </h4>
            <ul className="text-gray-300 text-sm space-y-3">
              {[
                "🎓 CS Graduate from Top University",
                "💼 5+ Years of Experience",
                "🌟 10+ Successful Projects",
                "🏆 Award-winning Developer",
              ].map((fact, index) => (
                <li
                  key={index}
                  className="transition-all duration-300 hover:text-primary"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-3xl font-semibold text-primary transition-colors duration-300 hover:text-accent">
          Sandeep Kumar
        </h3>
        <p className="text-accent text-xl transition-colors duration-300 hover:text-primary">
          Full Stack Developer
        </p>
      </div>
    </div>
  );
};

export default ImageSection;
