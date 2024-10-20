import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const AboutMe: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(textRef, { once: false, amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const skills = [
    {
      name: "Full Stack Development",
      icon: "💻",
      description:
        "Proficient in both frontend and backend technologies, creating seamless web applications.",
    },
    {
      name: "UI/UX Design",
      icon: "🎨",
      description:
        "Passionate about creating intuitive and visually appealing user interfaces.",
    },
    {
      name: "Database Management",
      icon: "🗄️",
      description:
        "Experienced in designing and optimizing database structures for efficient data handling.",
    },
    {
      name: "Cloud Services",
      icon: "☁️",
      description:
        "Skilled in deploying and managing applications on various cloud platforms.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % skills.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [skills.length]);

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [50, 0, 0, -50],
  );

  const imageOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.9],
    [0, 1, 1, 0],
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.9],
    [0.8, 1, 1, 0.8],
  );

  const journeyOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.6, 0.8],
    [0, 1, 1, 0],
  );
  const journeyY = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.6, 0.8],
    [50, 0, 0, -50],
  );

  const skillsOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7, 0.9],
    [0, 1, 1, 0],
  );
  const skillsY = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7, 0.9],
    [50, 0, 0, -50],
  );

  const descriptionWords =
    "From writing my first line of code to developing complex web applications, every step of my journey has been driven by a passion for problem-solving and a desire to create impactful digital experiences. I thrive on challenges and continuously push myself to learn and grow in this ever-evolving field.".split(
      " ",
    );

  return (
    <section ref={sectionRef} className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-5xl font-bold text-primary mb-16 text-center"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          About Me
        </motion.h2>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-1/2 relative"
            style={{ opacity: imageOpacity, scale: imageScale }}
          >
            <div
              className="w-64 h-64 mx-auto lg:w-96 lg:h-96 relative cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="w-full h-full absolute"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
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
              </motion.div>
            </div>
            <motion.div
              className="mt-8 text-center"
              style={{ opacity: imageOpacity }}
            >
              <h3 className="text-3xl font-semibold text-primary">
                Sandeep Kumar
              </h3>
              <p className="text-accent text-xl">Full Stack Developer</p>
            </motion.div>
          </motion.div>
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-inner"
              style={{ opacity: journeyOpacity, y: journeyY }}
            >
              <h3 className="text-2xl font-semibold text-primary mb-4">
                My Journey
              </h3>
              <p
                ref={textRef}
                className="text-gray-300 text-lg leading-relaxed"
              >
                {descriptionWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInView ? 1 : 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="inline-block mr-1"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-inner"
              style={{ opacity: skillsOpacity, y: skillsY }}
            >
              <h3 className="text-2xl font-semibold text-primary mb-4">
                Core Skills
              </h3>
              <motion.div
                key={activeSkill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <span className="text-4xl mb-2 block">
                  {skills[activeSkill].icon}
                </span>
                <h4 className="text-xl font-semibold text-accent mb-2">
                  {skills[activeSkill].name}
                </h4>
                <p className="text-gray-300">
                  {skills[activeSkill].description}
                </p>
              </motion.div>
              <div className="flex justify-center mt-4">
                {skills.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full mx-1 ${index === activeSkill ? "bg-primary" : "bg-gray-600"}`}
                    onClick={() => setActiveSkill(index)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
