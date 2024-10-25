import Link from "next/link";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

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

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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
  const cardOpacity = useTransform(scrollYProgress, [0.45, 0.55], [1, 0]);
  const cardScale = useTransform(scrollYProgress, [0.45, 0.55], [1, 0.95]);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center p-8 font-sans pt-16"
    >
      <motion.div
        className="relative w-full max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
      >
        <motion.div
          className="relative bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl"
          style={{ opacity: cardOpacity, scale: cardScale }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <motion.div
                  className="inline-block"
                  style={{ opacity: greetingOpacity, y: greetingY }}
                >
                  <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
                    Available for hire
                  </span>
                </motion.div>

                <motion.h1
                  className="text-white font-bold text-5xl md:text-6xl tracking-tight"
                  style={{ opacity: titleOpacity, y: titleY }}
                >
                  Sandeep Kumar
                </motion.h1>

                <motion.h2
                  className="text-primary text-2xl md:text-3xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
                  style={{ opacity: subtitleOpacity, y: subtitleY }}
                >
                  Full Stack Developer
                </motion.h2>

                <motion.p
                  className="text-gray-300 text-lg leading-relaxed max-w-2xl"
                  style={{ opacity: descriptionOpacity, y: descriptionY }}
                >
                  Transforming ideas into elegant digital solutions with clean
                  code and innovative thinking. Specialized in building scalable
                  web applications with modern technologies.
                </motion.p>
              </div>

              <motion.div
                className="space-y-4"
                style={{ opacity: specializationOpacity, y: specializationY }}
              >
                <h3 className="text-white font-semibold text-xl">
                  I specialize in:
                </h3>
                <span ref={typedRef} className="text-accent text-xl"></span>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                style={{ opacity: skillsOpacity, y: skillsY }}
              >
                {[
                  {
                    icon: "🚀",
                    text: "Problem Solving",
                    color: "from-blue-500/20 to-cyan-500/20",
                  },
                  {
                    icon: "🌱",
                    text: "Continuous Learning",
                    color: "from-green-500/20 to-emerald-500/20",
                  },
                  {
                    icon: "🤝",
                    text: "Team Collaboration",
                    color: "from-purple-500/20 to-pink-500/20",
                  },
                  {
                    icon: "⏱️",
                    text: "Time Management",
                    color: "from-orange-500/20 to-yellow-500/20",
                  },
                  {
                    icon: "💡",
                    text: "Creative Thinking",
                    color: "from-red-500/20 to-pink-500/20",
                  },
                  {
                    icon: "🔍",
                    text: "Attention to Detail",
                    color: "from-indigo-500/20 to-purple-500/20",
                  },
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br ${skill.color} p-4 rounded-2xl text-center backdrop-blur-sm border border-gray-700/50 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">
                      {skill.icon}
                    </div>
                    <div className="text-white text-sm font-medium">
                      {skill.text}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-center"
                style={{ opacity: ctaOpacity, y: ctaY }}
              >
                <Link
                  href="/my-projects"
                  className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-center border border-gray-700 hover:border-primary/50 hover:bg-gray-800 backdrop-blur-sm shadow-lg hover:shadow-primary/20"
                >
                  View My Projects
                </Link>
                <div className="flex gap-4">
                  {[FiGithub, FiLinkedin, FiTwitter].map((Icon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700 text-white transition-all duration-300 border border-gray-700 hover:border-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="flex-1 hidden lg:block">
              <CodeDisplay />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const CodeDisplay = () => {
  return (
    <div className="relative w-full h-full flex items-center">
      <div className="relative w-full h-[400px] perspective-1000">
        <motion.div
          className="w-full h-full"
          initial={{ rotateY: 20 }}
          animate={{ rotateY: [20, 25, 20] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="h-8 bg-gray-800 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="p-4 h-[calc(100%-2rem)] overflow-hidden">
              <pre className="text-sm font-mono">
                <code className="text-green-400">
                  {`const developer = {
    name: 'Sandeep Kumar',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript'],
    passion: 'Building amazing web experiences',

    code() {
      while(true) {
        learn();
        build();
        improve();
      }
    }
  };

  developer.code();`}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
