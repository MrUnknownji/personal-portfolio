import type { Metadata } from "next";
import Link from "next/link";
import { PROFILE } from "@/data/profile";
import { selectedProjects } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";

export const metadata: Metadata = {
  title: "1-page profile",
  description:
    "Sandeep Kumar's experience, skills, selected projects, and contact details on one page.",
};

const projects = selectedProjects.slice(0, 4);
const host = (url: string) => new URL(url).host;

export default function ReviewQuick() {
  return (
    <div className="ld-wrap ld-page ld-quick">
      <header className="ld-page-head">
        <span className="ld-anno">1-page profile · Sheet 1 of 1</span>
        <h1>{SITE_CONFIG.name}.</h1>
        <p>{PROFILE.headline}</p>
        <ul className="ld-contact-line">
          <li>{PROFILE.location}</li>
          <li>
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
          </li>
          <li>
            <a href={SOCIAL_PROFILES.github.href}>github.com/{SOCIAL_PROFILES.github.username}</a>
          </li>
          <li>
            <a href={SOCIAL_PROFILES.linkedin.href}>
              linkedin.com/in/{SOCIAL_PROFILES.linkedin.username}
            </a>
          </li>
        </ul>
      </header>

      <section className="ld-quick-block" aria-labelledby="ld-q-experience">
        <h2 id="ld-q-experience" className="ld-study-label">
          Experience &amp; education
        </h2>
        <ol className="ld-revisions">
          {PROFILE.experience.map((entry) => (
            <li key={`${entry.role}-${entry.organization}`}>
              <span className="ld-anno">{entry.period}</span>
              <div>
                <h3>
                  {entry.role}, {entry.organization}
                </h3>
                <p>{entry.summary}</p>
                {entry.highlights.length > 0 && (
                  <ul>
                    {entry.highlights.map((highlight) => (
                      <li key={highlight.text}>{highlight.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
          {PROFILE.education.map((entry) => (
            <li key={entry.title}>
              <span className="ld-anno">{entry.period}</span>
              <div>
                <h3>
                  {entry.title}, {entry.institution}
                </h3>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ld-quick-block" aria-labelledby="ld-q-skills">
        <h2 id="ld-q-skills" className="ld-study-label">
          Skills
        </h2>
        <dl className="ld-skill-list">
          {PROFILE.skills.map((skill) => (
            <div key={skill.group}>
              <dt className="ld-anno">{skill.group}</dt>
              <dd>{skill.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ld-quick-block" aria-labelledby="ld-q-projects">
        <h2 id="ld-q-projects" className="ld-study-label">
          Selected projects
        </h2>
        <ul className="ld-quick-projects">
          {projects.map((project) => (
            <li key={project.id}>
              <h3>
                <Link href={`/review/my-projects/${project.id}`}>{project.title}</Link>
              </h3>
              <p>{project.shortDescription}</p>
              <p className="ld-anno">{project.technologies.join(" · ")}</p>
              <p className="ld-quick-links">
                {project.demoLink && <a href={project.demoLink}>Live: {host(project.demoLink)}</a>}
                {project.githubLink && (
                  <a href={project.githubLink}>
                    Source: {project.githubLink.replace("https://github.com/", "")}
                  </a>
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="ld-actions">
        <a className="ld-link-strong" href={PROFILE.resumePath} download>
          Download résumé (PDF) <span aria-hidden="true">↓</span>
        </a>
        <Link className="ld-link-strong" href="/review">
          Full portfolio <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
