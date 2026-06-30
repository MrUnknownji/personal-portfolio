type BotProject = {
  id: number;
  title: string;
  technologies: readonly string[];
  demoLink: string;
  githubLink: string;
  featured: true;
};

export const botProjects: readonly BotProject[] = [
  {
    id: 9,
    title: "BidStrike",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Pusher",
      "Prisma",
      "PostgreSQL",
    ],
    demoLink: "https://bid-strike.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/bid-strike",
    featured: true,
  },
  {
    id: 8,
    title: "YouTube Content OS",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "OpenAI/Gemini API",
      "Drizzle ORM",
      "Supabase",
    ],
    demoLink: "https://youtube-content-os-one.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/youtube-content-os",
    featured: true,
  },
  {
    id: 7,
    title: "AuraEdit",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Canvas API",
      "Framer Motion",
    ],
    demoLink: "https://image-modifier-jet.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/image-modifier",
    featured: true,
  },
  {
    id: 1,
    title: "AudioVibes",
    technologies: ["React Native", "Expo", "Reanimated"],
    demoLink: "https://github.com/MrUnknownji/AudioVibes2",
    githubLink: "https://github.com/MrUnknownji/AudioVibes_music_player.git",
    featured: true,
  },
  {
    id: 10,
    title: "OmniMart",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "Stripe",
      "AI Personalization",
    ],
    demoLink: "https://omni-mart-orpin.vercel.app/",
    githubLink: "https://github.com/MrUnknownji/omni-mart",
    featured: true,
  },
];
