// Review 2 · Atlas: the portfolio drawn as one map. This module places every island on the map and
// writes the stops of the tour. All copy comes from the shared data files.
import { motionChannel, motionVideos } from "@/data/motion";
import { PROFILE } from "@/data/profile";
import { selectedProjects } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";
import type { Project } from "@/types/Project";

export type Rect = { x: number; y: number; w: number; h: number };
export type AtlasLink = { label: string; href: string; external?: boolean };
export type Stop = {
  id: string;
  kicker: string;
  title: string;
  rect: Rect;
  summary: string;
  points?: string[];
  facts?: { value: string; label: string }[];
  links?: AtlasLink[];
};
export type Region = { id: string; numeral: string; name: string; rect: Rect };

export const WORLD = { w: 5200, h: 3800 };

export const REGIONS: Region[] = [
  { id: "origin", numeral: "I", name: "Origin", rect: { x: 500, y: 1000, w: 1300, h: 820 } },
  { id: "works", numeral: "II", name: "The Works", rect: { x: 2150, y: 420, w: 2600, h: 2380 } },
  { id: "path", numeral: "III", name: "The Path", rect: { x: 420, y: 2150, w: 1500, h: 900 } },
  { id: "legend", numeral: "IV", name: "Legend", rect: { x: 2150, y: 3000, w: 1500, h: 600 } },
  {
    id: "broadcasts",
    numeral: "V",
    name: "Broadcasts",
    rect: { x: 500, y: 240, w: 1330, h: 560 },
  },
  { id: "signal", numeral: "VI", name: "Signal", rect: { x: 3850, y: 3000, w: 920, h: 600 } },
];

const byId = (id: number) => selectedProjects.find((project) => project.id === id) as Project;
export const FEATURED = [9, 13, 11, 10].map(byId);
export const MORE = [8, 7, 1, 12].map(byId);

export const HERO_RECT: Rect = { x: 550, y: 1050, w: 1200, h: 720 };
export const FEATURED_RECTS: Rect[] = [
  { x: 2200, y: 500, w: 1150, h: 800 },
  { x: 3500, y: 500, w: 1150, h: 800 },
  { x: 2200, y: 1380, w: 1150, h: 800 },
  { x: 3500, y: 1380, w: 1150, h: 800 },
];
export const MORE_RECTS: Rect[] = MORE.map((_, i) => ({
  x: 2200 + i * 630,
  y: 2300,
  w: 560,
  h: 440,
}));
export const STATION_Y = 2400;
export const STATION_RECTS: Rect[] = [0, 1, 2, 3].map((i) => ({
  x: 470 + i * 360,
  y: 2480,
  w: 320,
  h: 520,
}));
export const LEGEND_RECTS: Rect[] = PROFILE.skills.map((_, i) => ({
  x: 2200 + (i % 4) * 360,
  y: 3060 + Math.floor(i / 4) * 260,
  w: 340,
  h: 230,
}));
export const SIGNAL_RECT: Rect = { x: 3900, y: 3060, w: 820, h: 480 };
export const BROADCAST_RECTS: Rect[] = motionVideos.map((_, i) => ({
  x: 550 + i * 315,
  y: 330,
  w: 295,
  h: 420,
}));

const pad = (rect: Rect, by: number): Rect => ({
  x: rect.x - by,
  y: rect.y - by,
  w: rect.w + by * 2,
  h: rect.h + by * 2,
});
const span = (rects: Rect[]): Rect => {
  const x = Math.min(...rects.map((r) => r.x));
  const y = Math.min(...rects.map((r) => r.y));
  return {
    x,
    y,
    w: Math.max(...rects.map((r) => r.x + r.w)) - x,
    h: Math.max(...rects.map((r) => r.y + r.h)) - y,
  };
};

const projectLinks = (project: Project): AtlasLink[] => [
  ...(project.demoLink ? [{ label: "Live site", href: project.demoLink, external: true }] : []),
  ...(project.githubLink ? [{ label: "Source", href: project.githubLink, external: true }] : []),
  { label: "Case study", href: `/my-projects/${project.id}` },
];
export { projectLinks };

/** Chronological stations on the career line. */
export const STATIONS = [
  {
    period: PROFILE.education[0].period,
    title: PROFILE.education[0].title,
    place: PROFILE.education[0].institution,
    note: "Computer applications degree.",
  },
  ...[...PROFILE.experience].reverse().map((entry) => ({
    period: entry.period,
    title: entry.role,
    place: entry.organization,
    note: entry.summary,
  })),
];

const current = PROFILE.experience.find((entry) => "current" in entry && entry.current);
const studio = PROFILE.experience.find((entry) => entry.organization === "FrameRelay Studio");

export const STOPS: Stop[] = [
  {
    id: "origin",
    kicker: "I · Origin",
    title: SITE_CONFIG.name,
    rect: pad(HERO_RECT, 40),
    summary: PROFILE.headline,
    points: [
      `Now: ${current?.role} at ${current?.organization}`,
      `Founder, ${studio?.organization} (${studio?.period})`,
      `Based in ${PROFILE.location} · open to ${PROFILE.openTo.toLowerCase()}`,
    ],
    links: [
      { label: "Résumé (PDF)", href: PROFILE.resumePath, external: true },
      { label: "Email", href: `mailto:${SITE_CONFIG.email}` },
    ],
  },
  {
    id: "works",
    kicker: "II · The Works",
    title: "Eight products, end to end",
    rect: { ...pad(REGIONS[1].rect, 20), y: REGIONS[1].rect.y - 180, h: REGIONS[1].rect.h + 200 },
    summary:
      "Four featured islands and four smaller ones. Zoom into any island to read its problem, the fix, and the numbers behind it.",
  },
  ...FEATURED.map(
    (project, i): Stop => ({
      id: `project-${project.id}`,
      kicker: `II · ${project.category}${project.year ? ` · ${project.year}` : ""}`,
      title: project.title,
      rect: pad(FEATURED_RECTS[i], 30),
      summary: project.shortDescription,
      points: project.caseStudy
        ? [`Problem: ${project.caseStudy.problem}`, `Fix: ${project.caseStudy.solution}`]
        : undefined,
      facts: project.facts,
      links: projectLinks(project),
    }),
  ),
  {
    id: "more",
    kicker: "II · Smaller islands",
    title: "More work",
    rect: pad(span(MORE_RECTS), 40),
    summary: MORE.map((project) => project.title).join(" · "),
    points: MORE.map((project) => `${project.title}: ${project.shortDescription}`),
  },
  {
    id: "path",
    kicker: "III · The Path",
    title: "Experience",
    rect: pad(span(STATION_RECTS), 60),
    summary: "From a computer applications degree to TCS, six shipped products, and a studio.",
    points: STATIONS.map((s) => `${s.period} · ${s.title}, ${s.place}`),
  },
  {
    id: "legend",
    kicker: "IV · Legend",
    title: "Skills",
    rect: pad(span(LEGEND_RECTS), 40),
    summary: "The tools every island on this map was built with.",
    points: PROFILE.skills.map((group) => `${group.group}: ${group.items.join(", ")}`),
  },
  {
    id: "broadcasts",
    kicker: "V · Broadcasts",
    title: "CruxLog films",
    rect: pad(span(BROADCAST_RECTS), 40),
    summary: "Technology stories I made for CruxLog, told through research, pacing, and visuals.",
    points: motionVideos.map((video) => `${video.title} (${video.duration})`),
    links: [{ label: "Open the channel", href: motionChannel, external: true }],
  },
  {
    id: "signal",
    kicker: "VI · Signal",
    title: "Contact",
    rect: pad(SIGNAL_RECT, 40),
    summary: `Open to ${PROFILE.openTo.toLowerCase()}. Email is fastest.`,
    links: [
      { label: "Email", href: `mailto:${SITE_CONFIG.email}` },
      { label: "LinkedIn", href: SOCIAL_PROFILES.linkedin.href, external: true },
      { label: "GitHub", href: SOCIAL_PROFILES.github.href, external: true },
      { label: "Résumé (PDF)", href: PROFILE.resumePath, external: true },
    ],
  },
];

export const stopIndex = (id: string) => STOPS.findIndex((stop) => stop.id === id);

/** A closed, hand-drawn-looking ring around a rectangle, for the contour lines. */
export function contour(rect: Rect, by: number, seed: number) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const rx = rect.w / 2 + by;
  const ry = rect.h / 2 + by;
  const points: [number, number][] = [];
  const count = 48;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    // A squircle with a slow wobble, so rings read as terrain rather than rounded rectangles.
    const wobble =
      1 +
      0.035 * Math.sin(a * 3 + seed) +
      0.025 * Math.sin(a * 5 + seed * 1.7) +
      0.015 * Math.sin(a * 9 + seed * 0.6 + by / 40);
    const c = Math.cos(a);
    const s = Math.sin(a);
    const px = Math.sign(c) * Math.pow(Math.abs(c), 0.55) * rx * wobble;
    const py = Math.sign(s) * Math.pow(Math.abs(s), 0.55) * ry * wobble;
    points.push([cx + px, cy + py]);
  }
  // Catmull-Rom through the points, written as cubic Béziers.
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < count; i++) {
    const p0 = points[(i - 1 + count) % count];
    const p1 = points[i];
    const p2 = points[(i + 1) % count];
    const p3 = points[(i + 2) % count];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}
