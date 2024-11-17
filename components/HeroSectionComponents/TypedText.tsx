import { useEffect, useRef } from "react";
import Typed from "typed.js";

const TypedText = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: [
          "Building robust backend systems",
          "Crafting intuitive front-end interfaces",
          "Optimizing database performance",
          "Implementing secure authentication",
          "Developing RESTful APIs",
          "Creating responsive web designs",
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 1500,
      });

      return () => typed.destroy();
    }
  }, []);

  return (
    <div className="min-h-[2rem]">
      <span ref={typedRef} className="text-accent text-xl inline-block" />
    </div>
  );
};

export default TypedText;
