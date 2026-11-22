/**
 * The portfolio for machines: the same facts the pages show, as plain Markdown and JSON Resume, so a
 * recruiter's AI agent (or a search engine's) can read the whole candidate in one request instead of
 * scraping animated pages. Everything is built from the typed data the site renders, so it can never
 * say more than the site does, and it changes when they change.
 */
import { PROFILE } from "@/data/profile";
import { selectedProjects } from "@/data/projects";
import { projectStories } from "@/data/projectStories";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";
import type { Project } from "@/types/Project";
import { SITE_URL, absolute } from "@/lib/siteUrl";

const projectUrl = (project: Project) => absolute(`/my-projects/${project.id}`);
const current = PROFILE.experience.find((entry) => "current" in entry && entry.current);
const link = (href: string) => (href.startsWith("http") ? href : absolute(href));
const stack = [...new Set(selectedProjects.flatMap((project) => project.technologies))];

const links = [
  { label: "Portfolio", href: SITE_URL },
  { label: "One-page profile", href: absolute("/quick") },
  { label: "Résumé (PDF)", href: absolute(PROFILE.resumePath) },
  { label: "Résumé (JSON Resume)", href: absolute("/resume.json") },
  { label: "GitHub", href: SOCIAL_PROFILES.github.href },
  { label: "LinkedIn", href: SOCIAL_PROFILES.linkedin.href },
];

/** The short version: who, for what role, how to reach, and where everything else is. */
export function llmsIndex() {
  const lines = [
    `# ${SITE_CONFIG.name}`,
    "",
    `> ${PROFILE.headline} Based in ${PROFILE.location}. Open to: ${PROFILE.openTo.toLowerCase()}.`,
    "",
    "Facts for recruiters and hiring agents:",
    "",
    `- Name: ${SITE_CONFIG.name}`,
    `- Role sought: ${PROFILE.openTo}`,
    `- Currently: ${current?.current?.label ?? current?.role}`,
    `- Location: ${PROFILE.location}`,
    `- Contact: ${SITE_CONFIG.email} · ${SOCIAL_PROFILES.linkedin.href}`,
    `- Core stack: ${PROFILE.skills
      .filter((skill) => ["Languages", "Frontend", "Backend", "Data"].includes(skill.group))
      .flatMap((skill) => skill.items)
      .join(", ")}`,
    `- Evidence: ${selectedProjects.length} shipped projects, ${selectedProjects.filter((p) => p.demoLink).length} with live demos and ${selectedProjects.filter((p) => p.githubLink).length} with public source code. Numbers on the site are counted from each repository.`,
    "",
    "## Candidate profile",
    "",
    `- [Full profile in Markdown](${absolute("/llms-full.txt")}): experience, skills, education, and every project with its stack, decisions, facts, and source files to read.`,
    `- [Résumé as JSON Resume](${absolute("/resume.json")}): the same facts in the jsonresume.org schema.`,
    `- [Résumé PDF](${absolute(PROFILE.resumePath)})`,
    `- [One-page profile](${absolute("/quick")})`,
    "",
    "## Selected work",
    "",
    ...selectedProjects.map((project) => {
      const extra = [
        project.demoLink && `live: ${project.demoLink}`,
        project.githubLink && `source: ${project.githubLink}`,
      ].filter(Boolean);
      return `- [${project.title}](${projectUrl(project)}): ${project.shortDescription} Stack: ${project.technologies.join(", ")}.${extra.length ? ` (${extra.join(" · ")})` : ""}`;
    }),
    "",
    "## Optional",
    "",
    `- [GitHub](${SOCIAL_PROFILES.github.href})`,
    `- [LinkedIn](${SOCIAL_PROFILES.linkedin.href})`,
    `- [Motion work](${absolute("/motion")})`,
    `- [All projects](${absolute("/my-projects")})`,
  ];
  return `${lines.join("\n")}\n`;
}

/** The long version: everything a screening agent would otherwise click through to find. */
export function llmsFull() {
  const out: string[] = [
    `# ${SITE_CONFIG.name}: ${SITE_CONFIG.role}`,
    "",
    `> ${PROFILE.headline}`,
    "",
    "This is the machine-readable version of the portfolio, generated from the same data as the",
    "pages. Every number here is counted from a project's repository or its live site; where",
    "source code is private, that is stated.",
    "",
    "## At a glance",
    "",
    `- Name: ${SITE_CONFIG.name}`,
    `- Title: ${SITE_CONFIG.role}`,
    `- Looking for: ${PROFILE.openTo}`,
    `- Currently: ${current?.current?.label ?? current?.role}`,
    `- Location: ${PROFILE.location}`,
    `- Email: ${SITE_CONFIG.email}`,
    ...links.map((entry) => `- ${entry.label}: ${entry.href}`),
    "",
    "## Skills",
    "",
    ...PROFILE.skills.map((skill) => `- ${skill.group}: ${skill.items.join(", ")}`),
    `- Used in shipped projects: ${stack.join(", ")}`,
    "",
    "## Experience",
    "",
  ];
  for (const entry of PROFILE.experience) {
    out.push(`### ${entry.role}, ${entry.organization} (${entry.period})`, "", entry.summary, "");
    for (const item of entry.highlights)
      out.push(`- ${item.text}${item.href ? ` (${link(item.href)})` : ""}`);
    if (entry.highlights.length) out.push("");
  }
  out.push("## Education", "");
  for (const entry of PROFILE.education)
    out.push(`- ${entry.title}, ${entry.institution} (${entry.period})`);
  out.push("", "## Projects", "");
  for (const project of selectedProjects) {
    const story = projectStories[project.id];
    out.push(
      `### ${project.title}${project.year ? ` (${project.year})` : ""}`,
      "",
      `- Case study: ${projectUrl(project)}`,
    );
    if (project.demoLink) out.push(`- Live demo: ${project.demoLink}`);
    if (project.githubLink) out.push(`- Source code: ${project.githubLink}`);
    else if (project.sourceNote) out.push(`- Source code: ${project.sourceNote}`);
    out.push(`- Type: ${project.category}`, `- Stack: ${project.technologies.join(", ")}`);
    if (story) out.push(`- My role: ${story.contribution}`, `- Scope: ${story.scope}`);
    out.push("", project.longDescription, "");
    if (project.facts?.length) {
      out.push("Facts:", "");
      for (const fact of project.facts) out.push(`- ${fact.value} ${fact.label}`);
      out.push("");
    }
    if (project.caseStudy) {
      out.push(
        `Problem: ${project.caseStudy.problem}`,
        "",
        `Approach: ${project.caseStudy.solution}`,
        "",
      );
    }
    if (story)
      out.push(`Constraint: ${story.constraint}`, "", `Key decision: ${story.decision}`, "");
    out.push("Features:", "", ...project.features.map((feature) => `- ${feature}`), "");
    if (project.caseStudy?.architecture.length) {
      out.push(
        "Architecture:",
        "",
        ...project.caseStudy.architecture.map((item) => `- ${item}`),
        "",
      );
    }
    if (project.caseStudy?.tradeoffs.length) {
      out.push("Trade-offs:", "", ...project.caseStudy.tradeoffs.map((item) => `- ${item}`), "");
    }
    if (story?.sourceMap?.length && project.githubLink) {
      const branch = project.repoBranch ?? "main";
      out.push("Files to read first:", "");
      for (const file of story.sourceMap)
        out.push(`- ${project.githubLink}/blob/${branch}/${file.path}: ${file.role}`);
      out.push("");
    }
  }
  out.push(
    "## Contact",
    "",
    `Email ${SITE_CONFIG.email}, or write through the form at ${absolute("/#contact")}.`,
    `LinkedIn: ${SOCIAL_PROFILES.linkedin.href}`,
  );
  return `${out.join("\n")}\n`;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Oct 2026" -> "2026-10", "2024" -> "2024", "Now" -> undefined. */
function isoDate(text: string | undefined) {
  const match = text?.trim().match(/^(?:([A-Za-z]{3})[a-z]*\s+)?(\d{4})$/);
  if (!match) return undefined;
  const month = match[1] ? MONTHS.indexOf(match[1].toLowerCase()) + 1 : 0;
  return month ? `${match[2]}-${String(month).padStart(2, "0")}` : match[2];
}

function dates(period: string) {
  const [start, end] = period.split("—").map((part) => part.trim());
  return {
    startDate: isoDate(start),
    // A single date is a project that started and ended then; "Now" means it is ongoing.
    ...(end === undefined
      ? { endDate: isoDate(start) }
      : isoDate(end)
        ? { endDate: isoDate(end) }
        : {}),
  };
}

/** The résumé in the JSON Resume schema (https://jsonresume.org/schema), which ATS tools import. */
export function jsonResume() {
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: SITE_CONFIG.name,
      label: SITE_CONFIG.role,
      image: absolute("/images/sandeep-cutout-640.webp"),
      email: SITE_CONFIG.email,
      url: SITE_URL,
      summary: `${PROFILE.headline} Open to: ${PROFILE.openTo.toLowerCase()}.`,
      location: { region: "Punjab", countryCode: "IN" },
      profiles: [
        {
          network: "GitHub",
          username: SOCIAL_PROFILES.github.username,
          url: SOCIAL_PROFILES.github.href,
        },
        {
          network: "LinkedIn",
          username: SOCIAL_PROFILES.linkedin.username,
          url: SOCIAL_PROFILES.linkedin.href,
        },
        {
          network: "Twitter",
          username: SOCIAL_PROFILES.twitter.username,
          url: SOCIAL_PROFILES.twitter.href,
        },
      ],
    },
    work: PROFILE.experience.map((entry) => ({
      name: entry.organization,
      position: entry.role,
      ...dates(entry.period),
      summary: entry.summary,
      highlights: entry.highlights.map((item) => item.text),
      ...(entry.highlights[0]?.href ? { url: link(entry.highlights[0].href) } : {}),
    })),
    education: PROFILE.education.map((entry) => ({
      institution: entry.institution,
      studyType: entry.title,
      endDate: isoDate(entry.period),
    })),
    skills: PROFILE.skills.map((skill) => ({ name: skill.group, keywords: [...skill.items] })),
    projects: selectedProjects.map((project) => {
      const story = projectStories[project.id];
      return {
        name: project.title,
        description: project.shortDescription,
        highlights: [
          ...(project.facts ?? []).map((fact) => `${fact.value} ${fact.label}`),
          ...project.features,
        ],
        keywords: project.technologies,
        ...(project.year ? { startDate: String(project.year) } : {}),
        url: project.demoLink ?? project.githubLink ?? projectUrl(project),
        ...(story ? { roles: [story.contribution] } : {}),
        type: project.category,
      };
    }),
    meta: { canonical: absolute("/resume.json"), version: "v1.0.0" },
  };
}
