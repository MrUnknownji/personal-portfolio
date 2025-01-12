import { Project } from "@/types/Project";

export const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    shortDescription:
      "A full-stack e-commerce solution with real-time inventory management.",
    longDescription:
      "This project is a comprehensive e-commerce platform built with React, Node.js, and MongoDB. It features a responsive design, user authentication, product catalog, shopping cart functionality, and integrated payment processing.",
    image: "/images/logo.svg",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe"],
    features: [
      "User authentication and authorization",
      "Product catalog with search and filter options",
      "Shopping cart and checkout process",
      "Real-time inventory management",
      "Order tracking and history",
      "Admin dashboard for product and order management",
      "Payment processing with Stripe integration",
    ],
    demoLink: "https://myecommerce-demo.com",
    githubLink: "https://github.com/yourusername/ecommerce-project",
    category: "Web",
  },
];

export const HeroSectionSkills = [
  {
    icon: "🚀",
    text: "Problem Solving",
  },
  {
    icon: "🌱",
    text: "Continuous Learning",
  },
  {
    icon: "🤝",
    text: "Team Collaboration",
  },
  {
    icon: "⏱️",
    text: "Time Management",
  },
  {
    icon: "💡",
    text: "Creative Thinking",
  },
  {
    icon: "🔍",
    text: "Attention to Detail",
  },
];

export const AboutMeSkills = [
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

export const TechnicalSectionSkills = [
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
