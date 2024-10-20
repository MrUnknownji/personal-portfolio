import Link from "next/link";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

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

      return () => {
        typed.destroy();
      };
    }
  }, []);

  // Individual element animations
  const greetingOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const greetingY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);

  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.15], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0.05, 0.15], [0, -50]);

  const subtitleOpacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0.1, 0.2], [0, -50]);

  const descriptionOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25],
    [1, 0],
  );
  const descriptionY = useTransform(scrollYProgress, [0.15, 0.25], [0, -50]);

  const specializationOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.3],
    [1, 0],
  );
  const specializationY = useTransform(scrollYProgress, [0.2, 0.3], [0, -50]);

  const skillsOpacity = useTransform(scrollYProgress, [0.25, 0.35], [1, 0]);
  const skillsY = useTransform(scrollYProgress, [0.25, 0.35], [0, -50]);

  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);
  const ctaY = useTransform(scrollYProgress, [0.3, 0.4], [0, -50]);

  const monitorOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);
  const monitorY = useTransform(scrollYProgress, [0.35, 0.45], [0, -50]);

  // Empty card animation
  const cardOpacity = useTransform(scrollYProgress, [0.45, 0.55], [1, 0]);
  const cardScale = useTransform(scrollYProgress, [0.45, 0.55], [1, 0.95]);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center p-4 font-sans"
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-6xl shadow-2xl"
        style={{ opacity: cardOpacity, scale: cardScale }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <motion.h3
              className="text-accent font-semibold text-xl mb-2"
              style={{ opacity: greetingOpacity, y: greetingY }}
            >
              {"Hello, I'm"}
            </motion.h3>
            <motion.h1
              className="text-white font-bold text-4xl md:text-5xl mb-3"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              Sandeep Kumar
            </motion.h1>
            <motion.h2
              className="text-primary text-2xl md:text-3xl mb-4"
              style={{ opacity: subtitleOpacity, y: subtitleY }}
            >
              Full Stack Developer
            </motion.h2>
            <motion.p
              className="text-gray-300 mb-6 leading-relaxed"
              style={{ opacity: descriptionOpacity, y: descriptionY }}
            >
              {`I'm passionate about crafting efficient, scalable solutions and
              creating exceptional user experiences. With a focus on clean code
              and continuous learning, I strive to make a positive impact
              through technology.`}
            </motion.p>
            <motion.div
              className="mb-6"
              style={{ opacity: specializationOpacity, y: specializationY }}
            >
              <h3 className="text-white font-semibold mb-2">
                I specialize in:
              </h3>
              <span ref={typedRef} className="text-accent text-xl"></span>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
              style={{ opacity: skillsOpacity, y: skillsY }}
            >
              {[
                { icon: "🚀", text: "Problem Solving" },
                { icon: "🌱", text: "Continuous Learning" },
                { icon: "🤝", text: "Team Collaboration" },
                { icon: "⏱️", text: "Time Management" },
                { icon: "💡", text: "Creative Thinking" },
                { icon: "🔍", text: "Attention to Detail" },
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-3 rounded-lg text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-primary text-2xl mb-1">{skill.icon}</div>
                  <div className="text-white text-sm font-medium">
                    {skill.text}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div style={{ opacity: ctaOpacity, y: ctaY }}>
              <Link
                href="/my-projects"
                className="inline-block bg-primary text-secondary font-semibold px-6 py-3 rounded-lg"
              >
                Explore My Projects
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="flex-1 flex justify-center items-center"
            style={{ opacity: monitorOpacity, y: monitorY }}
          >
            <div className="relative w-[380px] h-[240px]">
              <div className="absolute inset-0 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="absolute inset-[2px] bg-gray-900 rounded-md overflow-hidden">
                  <div className="h-5 bg-gray-800 flex items-center px-2">
                    <div className="flex space-x-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="p-2 h-[205px] overflow-hidden">
                    <pre className="text-green-500 text-xs whitespace-pre animate-scroll">
                      {`const infiniteCode = () => {
  while (true) {
    console.log("Hello, World!");
    setTimeout(() => {
      fetchData();
      updateUI();
      optimizePerformance();
    }, 1000);
  }
};

function fetchData() {
  return new Promise((resolve, reject) => {
    // Simulating API call
    setTimeout(() => {
      resolve({ success: true, data: {} });
    }, 500);
  });
}

function updateUI() {
  document.getElementById("app").innerHTML = "Updated!";
}

function optimizePerformance() {
  // Implement performance optimizations
  console.log("Optimizing...");
}

infiniteCode();

// This code repeats to create scrolling effect
          `.repeat(10)}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
