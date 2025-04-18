import { Project } from "@/types/Project";

export const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    shortDescription:
      "A full-stack e-commerce solution with real-time inventory management.",
    longDescription:
      "This project is a comprehensive e-commerce platform built with React, Node.js, and MongoDB. It features a responsive design, user authentication, product catalog, shopping cart functionality, and integrated payment processing.",
    image: "/images/projects/ecommerce.jpg",
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
    demoLink: "#",
    githubLink: "#",
    category: "Full Stack",
    gallery: [
      {
        type: "image",
        src: "https://placehold.co/1280x720/1E1E1E/00FF9F/png?text=E-commerce+Screenshot+1",
        alt: "E-commerce Product Page",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/141414/00D1FF/png?text=E-commerce+Screenshot+2",
        alt: "E-commerce Cart",
      },
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/4892333/4892333-sd_960_506_24fps.mp4",
        alt: "E-commerce Demo Video",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/333333/FFFFFF/png?text=E-commerce+Screenshot+3",
        alt: "E-commerce Admin Panel",
      },
    ],
  },
  {
    id: 2,
    title: "AI Image Generator",
    shortDescription: "An AI-powered image generation tool using DALL-E API.",
    longDescription:
      "A modern web application that leverages OpenAI's DALL-E API to generate unique images from text descriptions. Features a clean UI, image history, and social sharing capabilities.",
    image: "/images/projects/ai-generator.jpg",
    technologies: [
      "Next.js",
      "TypeScript",
      "OpenAI API",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
    ],
    features: [
      "Text-to-image generation using DALL-E",
      "User galleries and collections",
      "Social sharing integration",
      "Image editing and customization",
      "Premium tier with advanced features",
    ],
    demoLink: "#",
    githubLink: "#",
    category: "AI/ML",
    gallery: [
      {
        type: "image",
        src: "https://placehold.co/1280x720/1E1E1E/00FF9F/png?text=AI+Generator+UI",
        alt: "AI Generator Interface",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/141414/00D1FF/png?text=Generated+Image+Example",
        alt: "Example Generated Image",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/333333/FFFFFF/png?text=Gallery+View",
        alt: "User Gallery View",
      },
    ],
  },
  {
    id: 3,
    title: "Portfolio Website",
    shortDescription:
      "A modern, responsive portfolio website with dynamic animations.",
    longDescription:
      "A personal portfolio website built with Next.js and TypeScript, featuring smooth animations, responsive design, and dynamic content loading. Showcases projects, skills, and professional experience.",
    image: "/images/projects/portfolio.jpg",
    technologies: [
      "Next.js",
      "TypeScript",
      "GSAP",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      "Responsive design for all devices",
      "Dynamic page transitions",
      "Interactive project showcase",
      "Contact form integration",
      "Blog section with MDX",
    ],
    demoLink: "#",
    githubLink: "#",
    category: "Frontend",
    gallery: [
      {
        type: "image",
        src: "https://placehold.co/1280x720/1E1E1E/00FF9F/png?text=Portfolio+Homepage",
        alt: "Portfolio Homepage",
      },
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/4892333/4892333-sd_960_506_24fps.mp4",
        alt: "Portfolio Scroll Animation Video",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/141414/00D1FF/png?text=Portfolio+Projects+Section",
        alt: "Portfolio Projects Section",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/333333/FFFFFF/png?text=Portfolio+Contact+Form",
        alt: "Portfolio Contact Form",
      },
    ],
  },
  {
    id: 4,
    title: "Task Management API",
    shortDescription: "RESTful API for task and project management.",
    longDescription:
      "A robust REST API built with Node.js and Express, providing endpoints for task and project management. Features authentication, role-based access control, and comprehensive documentation.",
    image: "/images/projects/api.jpg",
    technologies: ["Node.js", "Express", "MongoDB", "JWT", "Swagger", "Jest"],
    features: [
      "RESTful API endpoints",
      "JWT authentication",
      "Role-based access control",
      "API documentation with Swagger",
      "Automated testing with Jest",
      "Rate limiting and security features",
    ],
    demoLink: "#",
    githubLink: "#",
    category: "Backend",
    gallery: [
      {
        type: "image",
        src: "https://placehold.co/1280x720/1E1E1E/00FF9F/png?text=API+Endpoint+Example",
        alt: "API Endpoint Example",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/141414/00D1FF/png?text=Swagger+Docs",
        alt: "Swagger Documentation",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/333333/FFFFFF/png?text=Postman+Request",
        alt: "Postman Request Example",
      },
    ],
  },
  {
    id: 5,
    title: "DevOps Dashboard",
    shortDescription: "Monitoring and deployment management dashboard.",
    longDescription:
      "A comprehensive DevOps dashboard for monitoring application performance, managing deployments, and tracking infrastructure health. Integrates with popular CI/CD tools and cloud providers.",
    image: "/images/projects/devops.jpg",
    technologies: [
      "React",
      "Docker",
      "Kubernetes",
      "Grafana",
      "Prometheus",
      "AWS",
    ],
    features: [
      "Real-time performance monitoring",
      "Deployment automation",
      "Infrastructure health tracking",
      "Alert management",
      "Log aggregation",
      "Cost optimization insights",
    ],
    demoLink: "#",
    githubLink: "#",
    category: "DevOps",
    gallery: [
      {
        type: "image",
        src: "https://placehold.co/1280x720/1E1E1E/00FF9F/png?text=Grafana+Dashboard",
        alt: "Grafana Monitoring Dashboard",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/141414/00D1FF/png?text=Deployment+Pipeline",
        alt: "CI/CD Pipeline View",
      },
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/4892333/4892333-sd_960_506_24fps.mp4",
        alt: "Dashboard Walkthrough Video",
      },
      {
        type: "image",
        src: "https://placehold.co/1280x720/333333/FFFFFF/png?text=Alert+Configuration",
        alt: "Alert Configuration Screen",
      },
    ],
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
