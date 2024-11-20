import { useEffect, useRef } from "react";
import gsap from "gsap";

const Title = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: titleRef.current,
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
  }, []);

  return (
    <h2
      ref={titleRef}
      className="text-5xl font-bold text-primary mb-16 text-center"
    >
      About Me
    </h2>
  );
};

export default Title;