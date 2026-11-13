// Shared copy for the review builds (versions 3 to 5). Everything here is derived from the data files,
// so each design shows the same verified facts in its own way.
import { PROFILE } from "@/data/profile";
import { selectedProjects } from "@/data/projects";
import type { Project } from "@/types/Project";

export type ReviewLink = { label: string; href: string; external?: boolean };

const byId = (id: number) => selectedProjects.find((project) => project.id === id) as Project;

/** Featured first, then the smaller pieces, in the order the live site uses. */
export const FEATURED = [9, 13, 11, 10].map(byId);
export const MORE = [8, 7, 1, 12].map(byId);
export const ALL = [...FEATURED, ...MORE];

/** Screenshots that read better than the project's default image at card size. */
const STILLS: Partial<Record<number, string>> = { 13: "/images/framerelay/hero.webp" };
export const stillFor = (project: Project) => STILLS[project.id] ?? project.image;

export const projectLinks = (project: Project): ReviewLink[] => [
  ...(project.demoLink ? [{ label: "Live site", href: project.demoLink, external: true }] : []),
  ...(project.githubLink ? [{ label: "Source", href: project.githubLink, external: true }] : []),
  { label: "Case study", href: `/my-projects/${project.id}` },
];

/** A four-letter symbol per project, used as a ticker code and a postcode. */
export const SYMBOLS: Record<number, string> = {
  9: "BDSK",
  13: "FRMR",
  11: "MIRR",
  10: "OMNI",
  8: "YTOS",
  7: "AURA",
  1: "AUDV",
  12: "PRTF",
};

export const CURRENT = PROFILE.experience.find((entry) => "current" in entry && entry.current);
export const STUDIO = PROFILE.experience.find(
  (entry) => entry.organization === "FrameRelay Studio",
);

/** Oldest first: the degree, then each role. */
export const CAREER = [
  {
    period: PROFILE.education[0].period,
    start: 2023,
    end: 2023.5,
    open: false,
    title: PROFILE.education[0].title,
    place: PROFILE.education[0].institution,
    note: "Computer applications degree.",
  },
  ...[...PROFILE.experience].reverse().map((entry) => {
    const start = entry.period.startsWith("Oct 2026") ? 2026.75 : 2024;
    return {
      period: entry.period,
      start,
      end: null as number | null,
      open: /Now/.test(entry.period),
      title: entry.role,
      place: entry.organization,
      note: entry.summary,
    };
  }),
];

/** Automated tests counted across project repositories (only facts that are test counts). */
export const TEST_COUNT = ALL.flatMap((project) => project.facts ?? [])
  .filter((fact) => /\btests?\b|test cases/i.test(fact.label) && /^\d+$/.test(fact.value))
  .reduce((sum, fact) => sum + Number(fact.value), 0);

/** Technologies across every project, most used first. */
export const TECH_INDEX = (() => {
  const counts = new Map<string, number>();
  for (const project of ALL)
    for (const tech of project.technologies) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
})();
