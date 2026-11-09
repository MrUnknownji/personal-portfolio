// Copy shared by the live home page and the Lumen Draft review.

export const profileRoles = [
  {
    name: "Full-stack developer",
    detail: "Interface ↔ API ↔ Data",
    href: "#work",
    preview: "full",
  },
  {
    name: "Mobile developer",
    detail: "React Native / Expo ↗",
    href: "/my-projects/11",
    preview: "mobile",
  },
  {
    name: "Real-time systems",
    detail: "Socket.io / server authority ↗",
    href: "/my-projects/9",
    preview: "systems",
  },
  {
    name: "Creative coder & video",
    detail: "Motion / frames / story ▣",
    href: "/motion",
    preview: "video",
  },
] as const;

export const buildStages = [
  // Practices rather than tools: every case study records its constraints and trade-offs.
  { title: "Idea", note: "Find the useful flow.", tools: ["Constraints", "Trade-offs"] },
  {
    title: "Interface",
    note: "Make the flow legible.",
    tools: ["React Native", "Next.js", "TypeScript"],
  },
  {
    title: "Interaction",
    note: "Give feedback a purpose.",
    tools: ["CSS motion", "Anime.js", "SVG"],
  },
  {
    title: "Systems",
    note: "Keep the product in sync.",
    tools: ["Socket.io", "MongoDB", "Supabase"],
  },
  {
    title: "Delivery",
    note: "Put it in people's hands.",
    tools: ["Playwright", "Vitest", "Lighthouse CI"],
  },
] as const;
