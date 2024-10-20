import React, { useState, useRef, useMemo } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

const skills = [
  {
    category: "Frontend",
    icon: "🎨",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Vue.js",
      "Angular",
    ],
  },
  {
    category: "Backend",
    icon: "⚙️",
    items: [
      "Node.js",
      "Express",
      "Python",
      "Django",
      "RESTful APIs",
      "GraphQL",
      "Java",
      "Spring Boot",
      "PHP",
    ],
  },
  {
    category: "Database",
    icon: "🗄️",
    items: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Elasticsearch",
      "SQLite",
      "Oracle",
      "Cassandra",
    ],
  },
  {
    category: "DevOps & Tools",
    icon: "🛠️",
    items: [
      "Git",
      "Docker",
      "AWS",
      "CI/CD",
      "Webpack",
      "Babel",
      "Jenkins",
      "Kubernetes",
      "Terraform",
    ],
  },
];

const TechnicalSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(skills[0].category);
  const sectionRef = useRef<HTMLDivElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(skillsContainerRef, { once: false, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [50, 0, 0, -50],
  );

  const categoriesOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.8, 0.9],
    [0, 1, 1, 0],
  );
  const categoriesY = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.8, 0.9],
    [50, 0, 0, -50],
  );

  const categoryButtons = useMemo(() => {
    return skills.map((skillSet, index) => (
      <motion.button
        key={skillSet.category}
        className={`px-6 py-3 rounded-full text-lg font-semibold ${
          activeCategory === skillSet.category
            ? "bg-primary text-secondary"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
        onClick={() => setActiveCategory(skillSet.category)}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        {skillSet.icon} {skillSet.category}
      </motion.button>
    ));
  }, [activeCategory]);

  const activeSkillSet = useMemo(() => {
    return skills.find((skillSet) => skillSet.category === activeCategory);
  }, [activeCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section ref={sectionRef} className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold text-primary mb-12 text-center"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          Technical Skills
        </motion.h2>
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          style={{ opacity: categoriesOpacity, y: categoriesY }}
        >
          {categoryButtons}
        </motion.div>
        <motion.div
          ref={skillsContainerRef}
          className="bg-gray-800 rounded-lg p-8 shadow-2xl"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {activeSkillSet?.items.map((skill, index) => (
                <motion.div
                  key={skill}
                  className="relative bg-gray-700 rounded-lg p-4 overflow-hidden"
                  variants={skillVariants}
                  custom={index}
                >
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      {skill}
                    </h3>
                    <motion.div
                      className="w-12 h-1 bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    ></motion.div>
                  </div>
                  <motion.div
                    className="absolute bottom-0 right-0"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg
                      className="w-16 h-16 text-primary opacity-10"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
