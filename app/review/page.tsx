import Link from "next/link";
import BuildMap from "@/components/lumen/BuildMap";
import ContactForm from "@/components/lumen/ContactForm";
import CopyEmail from "@/components/lumen/CopyEmail";
import LabStudies from "@/components/lumen/LabStudies";
import Letter from "@/components/lumen/Letter";
import MeasuredWord from "@/components/lumen/MeasuredWord";
import ProjectSheet, { sheetTimeline } from "@/components/lumen/ProjectSheet";
import ReplySlip from "@/components/lumen/ReplySlip";
import { SoftLayers, softStyle } from "@/components/lumen/Soft";
import { profileRoles } from "@/data/sections";
import { PROFILE } from "@/data/profile";
import { selectedProjects, toProjectSummary } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";
import type { ShowcaseProject } from "@/types/Project";

const featured = selectedProjects
  .filter((project) => project.showcaseVariant)
  .map((project): ShowcaseProject => {
    const {
      gallery: _gallery,
      caseStudy: _caseStudy,
      longDescription: _long,
      features: _features,
      films: _films,
      ...rest
    } = project;
    return rest;
  });
const evidence = selectedProjects
  .filter((project) => project.showcaseVariant || project.category === "Engineering")
  .map(toProjectSummary);
const current = PROFILE.experience.find((entry) => "current" in entry && entry.current);
const studio = PROFILE.experience.find((entry) => entry.organization === "FrameRelay Studio");
const reviewHref = (href: string) => `/review${href}`;
const pad = (value: number) => String(value).padStart(2, "0");

/** Counted from the projects' own facts, so the summary never claims more than the sheets show. */
const testCount = selectedProjects
  .flatMap((project) => project.facts ?? [])
  .filter((fact) => /\btests?\b|test cases/i.test(fact.label) && /^\d+$/.test(fact.value))
  .reduce((sum, fact) => sum + Number(fact.value), 0);
const liveCount = selectedProjects.filter((project) => project.demoLink).length;

function SectionHead({
  sheet,
  id,
  title,
  children,
}: {
  sheet: string;
  id: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="ld-section-head">
      <span className="ld-anno">{sheet}</span>
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </header>
  );
}

export default function ReviewHome() {
  return (
    <>
      <section className="ld-hero ld-wrap" aria-labelledby="ld-home-title">
        <div className="ld-hero-head">
          <span className="ld-anno">01 · Full-stack developer</span>
          <h1 id="ld-home-title" className="ld-display">
            <span className="ld-sr-only">{SITE_CONFIG.name}</span>
            <span className="ld-word" aria-hidden="true">
              {[...SITE_CONFIG.firstName].map((letter, index) => (
                <span className="ld-ch" key={index}>
                  {letter}
                </span>
              ))}
            </span>
            <MeasuredWord word="Kumar" />
          </h1>
        </div>
        <figure className="ld-portrait ld-soft" style={softStyle("signal", 12)}>
          <SoftLayers z={12} sheen={false} />
          <picture>
            <source
              media="(max-width: 760px)"
              type="image/webp"
              srcSet="/images/sandeep-cutout-640.webp"
            />
            <img
              src="/images/sandeep-cutout-960.webp"
              alt="Portrait of Sandeep Kumar"
              width={960}
              height={1193}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <figcaption className="ld-portrait-notes" aria-hidden="true">
            <span data-note="developer">01 · Developer</span>
            <span data-note="motion">02 · Motion</span>
            <span data-note="systems">03 · Systems</span>
          </figcaption>
        </figure>
        <div className="ld-hero-body">
          <p className="ld-thesis">{PROFILE.headline}</p>
          <dl className="ld-tblock">
            <div className="ld-tblock-wide">
              <dt className="ld-anno">Currently</dt>
              <dd>{current?.current?.label}</dd>
            </div>
            <div className="ld-tblock-wide">
              <dt className="ld-anno">Open to</dt>
              <dd>{PROFILE.openTo}</dd>
            </div>
            <div>
              <dt className="ld-anno">Studio</dt>
              <dd>
                <a href="https://framerelaystudio.com/" target="_blank" rel="noopener noreferrer">
                  {studio?.organization}
                </a>
              </dd>
            </div>
            <div>
              <dt className="ld-anno">Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div>
              <dt className="ld-anno">Education</dt>
              <dd>
                {PROFILE.education[0].title}, {PROFILE.education[0].institution}
              </dd>
            </div>
          </dl>
          <div className="ld-actions">
            <a
              className="ld-key ld-soft ld-key-signal"
              style={softStyle("signal")}
              href={PROFILE.resumePath}
              download
            >
              <SoftLayers />
              <span>
                Résumé PDF <span aria-hidden="true">↓</span>
              </span>
            </a>
            <CopyEmail email={SITE_CONFIG.email} />
            <a href={SOCIAL_PROFILES.github.href} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={SOCIAL_PROFILES.linkedin.href} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <Letter slot="intro" />

      {/* Work sits on the light table: the one dark band, so the screens carry the page. */}
      <section id="work" className="ld-section ld-band ld-deferred" aria-labelledby="ld-work-title">
        <div className="ld-wrap">
          <div className="ld-work-top">
            <SectionHead sheet="02 · Work" id="ld-work-title" title="Work that holds up.">
              Real-time bidding, the motion studio I run, a paired-wallpaper product, and an
              end-to-end store. Every number is counted from the project&apos;s repository or its
              live site.
            </SectionHead>
            <dl className="ld-facts ld-work-sum">
              <div>
                <dt>products built end to end</dt>
                <dd>{selectedProjects.length}</dd>
              </div>
              <div>
                <dt>automated tests across the repos</dt>
                <dd>{testCount}</dd>
              </div>
              <div>
                <dt>running live sites</dt>
                <dd>{liveCount}</dd>
              </div>
            </dl>
          </div>
          <div
            className="ld-work"
            style={
              {
                timelineScope: featured.map((_, index) => sheetTimeline(index)).join(", "),
              } as React.CSSProperties
            }
          >
            <nav className="ld-work-rail" aria-label="Featured projects">
              <span className="ld-anno">Featured · {pad(featured.length)}</span>
              <ol>
                {featured.map((project, index) => (
                  <li
                    key={project.id}
                    className={index === featured.length - 1 ? "ld-rail-last" : undefined}
                    style={
                      {
                        animationTimeline:
                          index === featured.length - 1
                            ? sheetTimeline(index)
                            : `${sheetTimeline(index)}, ${sheetTimeline(index + 1)}`,
                      } as React.CSSProperties
                    }
                  >
                    <a href={`#ld-sheet-${project.id}`}>
                      <span className="ld-rail-num">{pad(index + 1)}</span>
                      <span className="ld-rail-name">{project.title}</span>
                      <span className="ld-anno">{project.category}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <Link className="ld-link-strong" href="/review/my-projects">
                All {selectedProjects.length} projects <span aria-hidden="true">→</span>
              </Link>
            </nav>
            <div className="ld-sheets">
              {featured.map((project, index) => (
                <ProjectSheet
                  key={project.id}
                  project={project}
                  index={index}
                  last={index === featured.length - 1}
                />
              ))}
            </div>
          </div>
          <Link className="ld-link-strong ld-more" href="/review/my-projects">
            Browse all {selectedProjects.length} projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section id="lab" className="ld-section ld-wrap ld-deferred" aria-labelledby="ld-lab-title">
        <SectionHead sheet="03 · Lab" id="ld-lab-title" title="The lab.">
          Small working studies. Open one to try it.
        </SectionHead>
        <LabStudies />
      </section>

      <section
        id="about"
        className="ld-section ld-wrap ld-deferred"
        aria-labelledby="ld-about-title"
      >
        <SectionHead
          sheet="04 · About"
          id="ld-about-title"
          title="I like building things that explain themselves."
        />
        <div className="ld-about">
          <div>
            <h3 className="ld-subhead">Experience</h3>
            <ol className="ld-revisions">
              {PROFILE.experience.map((entry) => (
                <li key={`${entry.role}-${entry.organization}`}>
                  <span className="ld-anno">{entry.period}</span>
                  <div>
                    <h4>
                      {entry.role}, {entry.organization}
                    </h4>
                    <p>{entry.summary}</p>
                    {entry.highlights.length > 0 && (
                      <ul>
                        {entry.highlights.map((highlight) => (
                          <li key={highlight.text}>
                            {highlight.href ? (
                              <a
                                href={
                                  highlight.href.startsWith("/")
                                    ? `/review${highlight.href}`
                                    : highlight.href
                                }
                                {...(highlight.href.startsWith("http")
                                  ? { target: "_blank", rel: "noopener noreferrer" }
                                  : {})}
                              >
                                {highlight.text}
                              </a>
                            ) : (
                              highlight.text
                            )}
                          </li>
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
                    <h4>
                      {entry.title}, {entry.institution}
                    </h4>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="ld-subhead">What I bring</h3>
            <div className="ld-roles">
              {profileRoles.map((role) => (
                <Link key={role.name} href={reviewHref(role.href)} className="ld-role">
                  <strong>{role.name}</strong>
                  <span className="ld-anno">{role.detail.replace(/\s*[↗▣]$/, "")}</span>
                </Link>
              ))}
            </div>
            <h3 className="ld-subhead">Skills</h3>
            <div className="ld-tablewrap">
              <table className="ld-parts">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Group</th>
                    <th scope="col">Parts</th>
                  </tr>
                </thead>
                <tbody>
                  {PROFILE.skills.map((skill, index) => (
                    <tr key={skill.group}>
                      <td>{String(index + 1).padStart(2, "0")}</td>
                      <th scope="row">{skill.group}</th>
                      <td>{skill.items.join(" · ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ld-actions">
              <a className="ld-link-strong" href={PROFILE.resumePath} download>
                Download résumé (PDF) <span aria-hidden="true">↓</span>
              </a>
              <Link className="ld-link-strong" href="/review/quick">
                View 1-page profile <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="build"
        className="ld-section ld-wrap ld-deferred"
        aria-labelledby="ld-build-title"
      >
        <SectionHead sheet="05 · Process" id="ld-build-title" title="From idea to shipped.">
          Follow a tool to the work that uses it.
        </SectionHead>
        <BuildMap projects={evidence} />
      </section>

      <section
        id="contact"
        className="ld-section ld-wrap ld-deferred"
        aria-labelledby="ld-contact-title"
      >
        <SectionHead
          sheet="06 · Contact"
          id="ld-contact-title"
          title="Have an idea? Let's build it."
        >
          Hiring for a full-stack or frontend role, or building something interesting? Email is the
          fastest way to reach me, or leave a note and I&apos;ll write back.
        </SectionHead>
        <Letter slot="contact" />
        <div className="ld-reply">
          <ReplySlip
            email={SITE_CONFIG.email}
            openTo={PROFILE.openTo}
            location={PROFILE.location}
            role={current?.current?.label ? `Currently ${current.current.label}` : undefined}
          />
          <div className="ld-reply-note">
            <span className="ld-anno ld-form-label">Or leave a note here</span>
            <ContactForm email={SITE_CONFIG.email} />
          </div>
        </div>
      </section>
    </>
  );
}
