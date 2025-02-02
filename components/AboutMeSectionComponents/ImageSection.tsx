import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const ImageSection = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const rotatingBorderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.to(rotatingBorderRef.current, {
      rotation: 360,
      duration: 15,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="w-64 h-64 sm:w-72 sm:h-72 mx-auto lg:w-[28rem] lg:h-[28rem] relative"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={rotatingBorderRef}
          className="absolute inset-0 rounded-full transition-all duration-500 [@media(hover:hover)]:hover:scale-105"
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 [@media(hover:hover)]:hover:via-accent"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>

        <div
          ref={imageContainerRef}
          className="w-full h-full absolute transition-all duration-500 [@media(hover:hover)]:hover:scale-105"
          style={{
            transform: `rotateY(${isFlipped ? "180deg" : "0deg"})`,
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="w-full h-full absolute backface-hidden">
            <div className="absolute inset-4 bg-secondary rounded-full overflow-hidden border-2 border-primary/30 transition-all duration-500 [@media(hover:hover)]:hover:border-accent p-1">
              <div className="relative w-full h-full rounded-full overflow-hidden transition-all duration-500">
                <Image
                  src="/images/logo.svg"
                  fill
                  alt="Sandeep Kumar"
                  className="rounded-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 transition-all duration-500 [@media(hover:hover)]:hover:opacity-100" />
              </div>
            </div>
          </div>

          <div
            className="w-full h-full absolute backface-hidden bg-secondary rounded-full flex flex-col items-center justify-center p-8 text-center border-2 border-primary/30 transition-all duration-500 [@media(hover:hover)]:hover:border-accent"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h4 className="text-primary text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Quick Facts
            </h4>
            <ul className="text-gray-200 space-y-4">
              {[
                "🎓 CS Graduate from Top University",
                "💼 5+ Years of Experience",
                "🌟 10+ Successful Projects",
                "🏆 Award-winning Developer",
              ].map((fact, index) => (
                <li
                  key={index}
                  className="transition-all duration-500 cursor-default [@media(hover:hover)]:hover:text-accent [@media(hover:hover)]:hover:translate-x-1"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="absolute -right-2 -top-2 text-xs text-primary/70 transition-all duration-500 [@media(hover:hover)]:hover:text-accent">
          Click to flip
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center space-y-2">
        <h3 className="text-2xl sm:text-3xl font-semibold text-primary transition-all duration-500 [@media(hover:hover)]:hover:text-accent">
          Sandeep Kumar
        </h3>
        <p className="text-lg sm:text-xl text-accent transition-all duration-500 [@media(hover:hover)]:hover:text-primary">
          Full Stack Developer
        </p>
        <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 [@media(hover:hover)]:hover:via-accent" />
      </div>
    </div>
  );
};

export default ImageSection;
