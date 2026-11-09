import type { Metadata } from "next";
import Link from "next/link";
import { selectedProjects } from "@/data/projects";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";
import PrintProfile from "@/components/PrintProfile";
import "@/app/styles/quick-profile.css";
import "@/app/styles/print.css";

export const metadata: Metadata = {
  title: "1-Page Profile",
  description:
    "Sandeep Kumar's experience, skills, selected projects, and contact details on one page.",
  alternates: { canonical: "/quick" },
};

const projects = selectedProjects.slice(0, 4);

export default function QuickView() {
  return (
    <div className="quick-view offset-wrap">
      <header className="quick-view-intro">
        <span className="offset-kicker">1-page profile</span>
        <h1>
          Sandeep <br />
          Kumar<span>.</span>
        </h1>
        <div className="quick-view-intro-bottom">
          <p>{PROFILE.headline}</p>
          <ul className="quick-view-contact-line">
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
        </div>
      </header>

      <section
        id="experience"
        className="quick-view-section"
        aria-labelledby="quick-experience-title"
      >
        <div className="quick-view-section-heading">
          <span>Background</span>
          <h2 id="quick-experience-title">Experience &amp; education</h2>
        </div>
        <div className="quick-view-timeline">
          {PROFILE.experience.map((entry) => (
            <article key={`${entry.role}-${entry.organization}`}>
              <span>{entry.period}</span>
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
            </article>
          ))}
          {PROFILE.education.map((entry) => (
            <article key={entry.title}>
              <span>{entry.period}</span>
              <div>
                <h3>
                  {entry.title}, {entry.institution}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="quick-view-section" aria-labelledby="quick-skills-title">
        <div className="quick-view-section-heading">
          <span>Capabilities</span>
          <h2 id="quick-skills-title">Skills</h2>
        </div>
        <div className="quick-view-facts">
          {PROFILE.skills.map((skill) => (
            <p key={skill.group}>
              <strong>{skill.group}</strong>
              <span>{skill.items.join(" · ")}</span>
            </p>
          ))}
        </div>
        <div className="quick-view-profile-actions">
          <a className="quick-view-more" href={PROFILE.resumePath} download>
            Download résumé (PDF) <span aria-hidden="true">↓</span>
          </a>
          <PrintProfile />
        </div>
      </section>

      <section id="projects" className="quick-view-section" aria-labelledby="quick-projects-title">
        <div className="quick-view-section-heading">
          <span>Work</span>
          <h2 id="quick-projects-title">Selected projects</h2>
        </div>
        <div className="quick-view-projects">
          {projects.map((project) => (
            <article key={project.id}>
              <div>
                <h3>
                  <Link href={`/my-projects/${project.id}`}>
                    {project.title}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </h3>
                <p>{project.shortDescription}</p>
                {project.facts && (
                  <p className="quick-view-project-facts">
                    {project.facts
                      .slice(0, 3)
                      .map((fact) => `${fact.value} ${fact.label}`)
                      .join(" · ")}
                  </p>
                )}
                {(project.demoLink || project.githubLink) && (
                  <p className="quick-view-project-links">
                    {project.demoLink && (
                      <a href={project.demoLink}>Live: {new URL(project.demoLink).host}</a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink}>
                        Source: {project.githubLink.replace("https://", "")}
                      </a>
                    )}
                  </p>
                )}
              </div>
              <span>{project.technologies.slice(0, 5).join(" · ")}</span>
            </article>
          ))}
        </div>
        <Link className="quick-view-more" href="/my-projects">
          All projects <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section id="contact" className="quick-view-contact" aria-labelledby="quick-contact-title">
        <span className="offset-kicker">Open to {PROFILE.openTo.toLowerCase()}</span>
        <h2 id="quick-contact-title">
          Let&apos;s talk<span>.</span>
        </h2>
        <a href={`mailto:${SITE_CONFIG.email}`}>
          {SITE_CONFIG.email}
          <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
