import React, { useState } from "react";

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

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-primary mb-12 text-center">
          Technical Skills
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skills.map((skillSet) => (
            <button
              key={skillSet.category}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ${
                activeCategory === skillSet.category
                  ? "bg-primary text-secondary"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveCategory(skillSet.category)}
            >
              {skillSet.icon} {skillSet.category}
            </button>
          ))}
        </div>
        <div className="bg-gray-800 rounded-lg p-8 shadow-2xl">
          {skills.map(
            (skillSet) =>
              skillSet.category === activeCategory && (
                <div
                  key={skillSet.category}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                >
                  {skillSet.items.map((skill) => (
                    <div
                      key={skill}
                      className="group relative bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition duration-300"></div>
                      <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">
                          {skill}
                        </h3>
                        <div className="w-12 h-1 bg-accent"></div>
                      </div>
                      <div className="absolute bottom-0 right-0 transform translate-y-full group-hover:translate-y-0 transition duration-300">
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
                      </div>
                    </div>
                  ))}
                </div>
              ),
          )}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
