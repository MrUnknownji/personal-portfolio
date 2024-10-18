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
    ],
    demoLink: "https://myecommerce-demo.com",
    githubLink: "https://github.com/yourusername/ecommerce-project",
    category: "Web",
  },
];
