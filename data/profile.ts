// Career facts shown on the home page, the quick profile, the résumé PDF, and
// the assistant. Keep this file as the single source of truth for them.

export type ExperienceEntry = {
  period: string;
  role: string;
  organization: string;
  summary: string;
  highlights: { text: string; href?: string }[];
};

export const PROFILE = {
  headline:
    "Full-stack developer building web, mobile, and real-time products with TypeScript, React, Next.js, React Native, and Node.js.",
  location: "Punjab, India",
  openTo: "Full-stack and frontend developer roles",
  resumePath: "/sandeep-kumar-resume.pdf",
  experience: [
    {
      period: "Oct 2026 — Now",
      role: "Founder",
      organization: "FrameRelay Studio",
      summary:
        "A motion studio for software teams. I built its site, film pipeline, pricing, and intake.",
      highlights: [
        {
          text: "framerelaystudio.com: a painted WebGL2 world with four quality tiers and a frame-time governor.",
          href: "https://framerelaystudio.com/",
        },
        {
          text: "23 Remotion compositions, rendered in 16:9, 1:1, and 9:16 and cut to measured musical beats.",
          href: "/my-projects/13",
        },
      ],
    },
    {
      period: "2024 — Now",
      role: "Quality management and review",
      organization: "Tata Consultancy Services (TCS)",
      summary: "Quality management and review work, alongside independent product work.",
      highlights: [],
    },
    {
      period: "2024 — Now",
      role: "Independent product engineer",
      organization: "Self-directed",
      summary:
        "Designed, built, and shipped six products end to end across web, mobile, and AI, most with a live demo and public source code.",
      highlights: [
        {
          text: "Mirror: an Expo app, a Next.js admin, and a FastAPI AI service sharing one Supabase database, with 39 Python tests and row-level security.",
          href: "/my-projects/11",
        },
        {
          text: "BidStrike: real-time auctions over Socket.io, with server-side bid validation and proxy auto-bidding across 26 API routes.",
          href: "/my-projects/9",
        },
        {
          text: "This portfolio: mobile Lighthouse performance raised from 50 to 90+, guarded by performance budgets in CI.",
          href: "https://github.com/MrUnknownji/personal-portfolio",
        },
      ],
    },
  ] satisfies ExperienceEntry[],
  education: [{ period: "2023", title: "BSc (CAS)", institution: "Panjab University" }],
  skills: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
    {
      group: "Frontend",
      items: ["React", "Next.js", "React Native / Expo", "Tailwind CSS", "Accessibility"],
    },
    { group: "Backend", items: ["Node.js", "Express", "FastAPI", "Socket.io", "REST APIs"] },
    { group: "Data", items: ["MongoDB", "PostgreSQL / Supabase", "Row-level security"] },
    {
      group: "Quality & delivery",
      items: [
        "Quality review",
        "Vitest",
        "Jest",
        "Playwright",
        "GitHub Actions",
        "Docker",
        "Vercel",
        "Cloudflare Workers",
      ],
    },
    { group: "Motion", items: ["Three.js / WebGL2", "Remotion", "Scroll-driven CSS animation"] },
    { group: "AI", items: ["Gemini API", "OpenAI API", "Prompted workflows with fallbacks"] },
  ],
} as const;
