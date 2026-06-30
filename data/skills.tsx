import {
  FiClock,
  FiCpu,
  FiSearch,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

export const HeroSectionSkills = [
  {
    icon: <FiCpu className="w-6 h-6" />,
    text: "Problem Solving",
  },
  {
    icon: <FiTrendingUp className="w-6 h-6" />,
    text: "Continuous Learning",
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    text: "Team Collaboration",
  },
  {
    icon: <FiClock className="w-6 h-6" />,
    text: "Time Management",
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    text: "Creative Thinking",
  },
  {
    icon: <FiSearch className="w-6 h-6" />,
    text: "Attention to Detail",
  },
] as const;

export const SkillsData = {
  frontend: [
    "React",
    "React Native",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
    "Framer Motion",
    "Reanimated",
  ],
  backend: ["Node.js", "Express", "MongoDB", "REST APIs", "GraphQL"],
  tools: [
    "Git",
    "GitHub",
    "Docker",
    "AWS (S3, EC2)",
    "Next js",
    "Vercel",
    "Expo",
    "Postman",
    "Figma",
  ],
  other: [
    "UI/UX Principles",
    "Performance",
    "SEO Basics",
    "Responsive Design",
    "Agile/Scrum",
    "Problem Solving",
  ],
} as const;
