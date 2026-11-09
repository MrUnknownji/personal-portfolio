import ContactInteraction from "@/components/ContactSectionComponents/ContactInteraction";
import InteractiveHero from "@/components/InteractiveHero";
import ProjectShowcase from "@/components/ProjectShowcase";
import CreativeLab from "@/components/CreativeLab";
import FieldNote from "@/components/FieldNote";
import ProfileRoles from "@/components/ProfileRoles";
import Experience from "@/components/Experience";
import HowIBuild from "@/components/HowIBuild";
import ContactSignal from "@/components/ContactSignal";
import { selectedProjects, toProjectSummary } from "@/data/projects";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import type { ShowcaseProject } from "@/types/Project";

const featuredProjects = selectedProjects
  .filter((project) => project.showcaseVariant)
  .map((project): ShowcaseProject => {
    const {
      gallery: _gallery,
      caseStudy: _caseStudy,
      longDescription: _long,
      features: _features,
      films: _films,
      ...showcase
    } = project;
    return showcase;
  });
// The build map links tools to the featured products and to this site's own engineering.
const evidenceProjects = selectedProjects
  .filter((project) => project.showcaseVariant || project.category === "Engineering")
  .map(toProjectSummary);

export default function Home() {
  return (
    <>
      <InteractiveHero />

      <ProjectShowcase projects={featuredProjects} />
      <CreativeLab />

      <section
        id="about"
        className="offset-about offset-wrap"
        data-build-file="Experience.tsx"
        data-build-note="Roles, experience, and skills in plain text, with links to the work that supports them."
        aria-labelledby="about-title"
      >
        <div className="offset-about-heading" data-offset-reveal>
          <span className="offset-kicker">03 / About</span>
          <h2 id="about-title">
            I like building things
            <br />
            that explain themselves<span>.</span>
          </h2>
        </div>
        <FieldNote />
        <Experience />
        <ProfileRoles />
        <div className="offset-profile-actions">
          <a className="offset-resume-link" href={PROFILE.resumePath} download>
            Download résumé (PDF) <span aria-hidden="true">↓</span>
          </a>
          <a className="offset-resume-link" href="/quick">
            View 1-page profile <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <div className="offset-wrap offset-toolkit-section">
        <HowIBuild projects={evidenceProjects} />
      </div>

      <section
        id="contact"
        className="offset-contact"
        data-build-file="ContactInteraction.tsx"
        data-build-note="Visitors can reach me directly or send a short note through the form."
        aria-labelledby="contact-title"
      >
        <div className="offset-wrap">
          <div className="offset-contact-header" data-offset-reveal>
            <span className="offset-kicker">05 / Contact</span>
            <h2 id="contact-title">
              Have an idea?
              <br />
              Let&apos;s build it<span>.</span>
            </h2>
            <p>
              Hiring for a full-stack or frontend role, or building something interesting? Tell me
              about it, even if it&apos;s still rough.
            </p>
          </div>
          <div className="offset-contact-grid">
            <div className="offset-contact-direct">
              <span className="offset-kicker">Send an email</span>
              <ContactSignal />
              <a href={`mailto:${SITE_CONFIG.email}`}>
                <span>{SITE_CONFIG.email}</span>
                <b aria-hidden="true">↗</b>
              </a>
              <p>
                Based in {PROFILE.location}.
                <br />
                Working with people everywhere.
              </p>
              <span className="offset-contact-stamp">
                OPEN TO NEW ROLES <i aria-hidden="true" />
              </span>
            </div>
            <div className="offset-contact-form">
              <div className="offset-contact-form-head">
                <span>Or leave a note here</span>
              </div>
              <ContactInteraction />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
