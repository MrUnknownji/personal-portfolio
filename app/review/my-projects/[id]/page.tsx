import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SoftLayers, softStyle, type Body } from "@/components/lumen/Soft";
import { getProject, selectedProjects } from "@/data/projects";
import { projectStories } from "@/data/projectStories";

type Props = { params: Promise<{ id: string }> };
const bodies: Body[] = ["clay", "sage", "peach", "putty"];

export function generateStaticParams() {
  return selectedProjects.map((project) => ({ id: String(project.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).id);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.shortDescription };
}

export default async function ReviewCaseStudy({ params }: Props) {
  const project = getProject((await params).id);
  if (!project) notFound();

  const story = projectStories[project.id];
  const index = selectedProjects.findIndex((item) => item.id === project.id);
  const next = selectedProjects[(index + 1) % selectedProjects.length];
  const body = bodies[index % bodies.length];
  const gallery = story
    ? story.gallery.flatMap(({ match, caption }) => {
        const item = project.gallery?.find(
          (media) =>
            media.type === "image" && media.alt?.toLowerCase().includes(match.toLowerCase()),
        );
        return item ? [{ ...item, caption }] : [];
      })
    : (
        project.gallery
          ?.filter((item) => item.type === "image" && item.src !== project.image)
          .slice(0, 3) ?? []
      ).map((item) => ({ ...item, caption: item.alt || project.title }));
  const architecture = project.caseStudy?.architecture || project.features;

  return (
    <article className="ld-study">
      <div className="ld-wrap">
        <Link href="/review/my-projects" className="ld-back">
          <span aria-hidden="true">←</span> All projects
        </Link>
        <header className="ld-study-head">
          <span className="ld-anno">
            Case study · Dwg {String(index + 1).padStart(2, "0")} · {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </span>
          <h1>{project.title}</h1>
          <p className="ld-thesis">{project.shortDescription}</p>
          <div className="ld-actions" aria-label={`${project.title} links`} role="group">
            {project.demoLink && (
              <a
                className="ld-key ld-soft ld-key-signal"
                style={softStyle("signal")}
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SoftLayers />
                <span>
                  Live demo <span aria-hidden="true">↗</span>
                </span>
              </a>
            )}
            {project.githubLink && (
              <a
                className="ld-key ld-soft"
                style={softStyle("putty")}
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SoftLayers />
                <span>
                  Source code <span aria-hidden="true">↗</span>
                </span>
              </a>
            )}
            {!project.githubLink && project.sourceNote && (
              <span className="ld-anno">{project.sourceNote}</span>
            )}
          </div>
          {story && (
            <dl className="ld-tblock">
              <div className="ld-tblock-wide">
                <dt className="ld-anno">My contribution</dt>
                <dd>{story.contribution}</dd>
              </div>
              <div className="ld-tblock-wide">
                <dt className="ld-anno">Product scope</dt>
                <dd>{story.scope}</dd>
              </div>
              <div className="ld-tblock-wide">
                <dt className="ld-anno">Evidence</dt>
                <dd>
                  Product screens{project.films?.length ? " · Film" : ""}
                  {project.demoLink ? " · Live demo" : ""}
                  {project.githubLink ? " · Source code" : ""}
                  {!project.githubLink && project.sourceNote
                    ? " · Private source, walkthrough on request"
                    : ""}
                </dd>
              </div>
            </dl>
          )}
        </header>
      </div>

      <div className="ld-wrap">
        <figure className="ld-cover ld-soft" style={softStyle(body, 12)}>
          <SoftLayers z={12} sheen={false} />
          <span className="ld-cover-frame">
            <Image
              src={project.image}
              alt={`${project.title} interface overview`}
              fill
              priority
              sizes="(max-width: 1240px) 94vw, 1160px"
            />
          </span>
          <figcaption className="ld-anno">{project.title} · product overview</figcaption>
        </figure>
      </div>

      <div className="ld-wrap ld-study-body">
        {project.facts && (
          <section className="ld-study-block" aria-labelledby="ld-numbers">
            <h2 id="ld-numbers" className="ld-study-label">
              By the numbers
            </h2>
            <div>
              <dl className="ld-measures">
                {project.facts.map((fact) => (
                  <div key={fact.label}>
                    <dd>{fact.value}</dd>
                    <dt>{fact.label}</dt>
                  </div>
                ))}
              </dl>
              <p className="ld-note">
                Counted from the{" "}
                {project.githubLink ? (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    source repository
                  </a>
                ) : (
                  `private source repository${project.demoLink ? " and the live site" : ""}`
                )}
                {project.facts.some((fact) => fact.label.includes("Lighthouse")) &&
                  "; Lighthouse figures are the median of three mobile audits of the live demo"}
                .
              </p>
            </div>
          </section>
        )}

        <section className="ld-study-block" aria-labelledby="ld-problem">
          <h2 id="ld-problem" className="ld-study-label">
            The problem
          </h2>
          <p className="ld-lead">{project.caseStudy?.problem || project.longDescription}</p>
        </section>

        {story && (
          <section className="ld-study-block" aria-labelledby="ld-decision">
            <h2 id="ld-decision" className="ld-study-label">
              The decision
            </h2>
            <div className="ld-two">
              <div>
                <h3>The constraint</h3>
                <p>{story.constraint}</p>
              </div>
              <div>
                <h3>The response</h3>
                <p>{story.decision}</p>
              </div>
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="ld-study-block" id="screens" aria-labelledby="ld-screens">
            <h2 id="ld-screens" className="ld-study-label">
              In the product
            </h2>
            <div className="ld-gallery">
              {gallery.map((item, position) => (
                <figure key={item.src} className="ld-shot">
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ld-shot-frame"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt || `${project.title} screen ${position + 1}`}
                      fill
                      sizes="(max-width: 900px) 92vw, 560px"
                    />
                    <span className="ld-sr-only">Open full image</span>
                  </a>
                  <figcaption>
                    <span className="ld-anno">Fig. {String(position + 1).padStart(2, "0")}</span>
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {project.films?.map((film) => (
          <section className="ld-study-block" key={film.src} aria-label={film.title}>
            <h2 className="ld-study-label">Watch · {film.title}</h2>
            <figure className="ld-film-figure">
              <video
                controls
                playsInline
                preload="none"
                poster={film.poster}
                aria-label={`${film.title}, ${project.title}`}
              >
                <source src={film.src} type="video/mp4" />
              </video>
              <figcaption>{film.caption}</figcaption>
            </figure>
          </section>
        ))}

        <section className="ld-study-block" aria-labelledby="ld-solution">
          <h2 id="ld-solution" className="ld-study-label">
            The solution
          </h2>
          <p className="ld-lead">{project.caseStudy?.solution || project.longDescription}</p>
        </section>

        {story && (
          <section className="ld-study-block" aria-labelledby="ld-inspect">
            <h2 id="ld-inspect" className="ld-study-label">
              What to inspect
            </h2>
            <ol className="ld-checklist">
              {story.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        )}

        <section className="ld-study-block" aria-labelledby="ld-anatomy">
          <h2 id="ld-anatomy" className="ld-study-label">
            Product anatomy
          </h2>
          <div className="ld-anatomy">
            <div className="ld-stack" aria-hidden="true">
              {architecture.map((item, position) => (
                <span
                  key={item}
                  className="ld-stack-plate"
                  style={{ "--i": position, "--n": architecture.length } as React.CSSProperties}
                >
                  <b>{String(position + 1).padStart(2, "0")}</b>
                </span>
              ))}
            </div>
            <div>
              <p className="ld-anno">{project.technologies.join(" / ")}</p>
              <ol className="ld-layers-list">
                {architecture.map((item, position) => (
                  <li key={item}>
                    <span className="ld-anno">Layer {String(position + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {story?.pipeline && (
          <section className="ld-study-block" aria-labelledby="ld-pipeline">
            <h2 id="ld-pipeline" className="ld-study-label">
              {(story.pipelineHeading ?? ["One request,", "start to finish"]).join(" ")}
            </h2>
            <ol className="ld-pipeline">
              {story.pipeline.map((step, position) => (
                <li key={step.title}>
                  <span className="ld-station" aria-hidden="true">
                    {String(position + 1).padStart(2, "0")}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {story?.sourceMap && project.githubLink && (
          <section className="ld-study-block" aria-labelledby="ld-source">
            <h2 id="ld-source" className="ld-study-label">
              Where to look in the code
            </h2>
            <ul className="ld-sourcemap">
              {story.sourceMap.map((entry) => (
                <li key={entry.path}>
                  <a
                    href={`${project.githubLink}/blob/${project.repoBranch ?? "main"}/${entry.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <code>{entry.path}</code> <span aria-hidden="true">↗</span>
                  </a>
                  <p>{entry.role}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.caseStudy && (
          <section className="ld-study-block" aria-labelledby="ld-tradeoffs">
            <h2 id="ld-tradeoffs" className="ld-study-label">
              What it cost
            </h2>
            <ul className="ld-tradeoffs">
              {project.caseStudy.tradeoffs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {story && (
          <aside className="ld-takeaway">
            <span className="ld-anno">The takeaway</span>
            <p>{story.takeaway}</p>
          </aside>
        )}

        <nav className="ld-next" aria-label="Keep exploring">
          <span className="ld-anno">Next sheet</span>
          <Link href={`/review/my-projects/${next.id}`} className="ld-next-link">
            {next.title} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/review/my-projects" className="ld-link-strong">
            All projects
          </Link>
        </nav>
      </div>
    </article>
  );
}
