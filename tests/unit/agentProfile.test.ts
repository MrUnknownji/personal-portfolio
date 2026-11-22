import { describe, expect, it } from "vitest";
import { PROFILE } from "@/data/profile";
import { selectedProjects } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import { jsonResume, llmsFull, llmsIndex } from "@/lib/agentProfile";

describe("the portfolio for AI agents", () => {
  it("llms.txt follows the convention: a title, a summary quote, and link sections", () => {
    const text = llmsIndex();
    expect(text.startsWith(`# ${SITE_CONFIG.name}\n\n> `)).toBe(true);
    expect(text).toContain("/llms-full.txt");
    for (const project of selectedProjects) expect(text).toContain(`[${project.title}](`);
  });

  it("the full profile carries every job, project, and fact the site shows", () => {
    const text = llmsFull();
    for (const entry of PROFILE.experience) expect(text).toContain(entry.organization);
    for (const project of selectedProjects) {
      expect(text).toContain(`### ${project.title}`);
      for (const fact of project.facts ?? []) expect(text).toContain(`${fact.value} ${fact.label}`);
    }
    expect(text).toContain(SITE_CONFIG.email);
  });

  it("resume.json uses ISO dates and leaves ongoing jobs open-ended", () => {
    const resume = jsonResume();
    for (const job of resume.work) {
      expect(job.startDate).toMatch(/^\d{4}(-\d{2})?$/);
      if ("endDate" in job) expect(job.endDate).toMatch(/^\d{4}(-\d{2})?$/);
    }
    const ongoing = PROFILE.experience.filter((entry) => /Now$/.test(entry.period)).length;
    expect(resume.work.filter((job) => !("endDate" in job)).length).toBe(ongoing);
    expect(resume.projects).toHaveLength(selectedProjects.length);
  });
});
