import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/ProjectGallery";
import WireframeToggle from "@/components/WireframeToggle";
import { getProject, selectedProjects } from "@/data/projects";
import { projectStories } from "@/data/projectStories";
import "@/app/styles/case-study.css";

type ProjectPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return selectedProjects.map((project) => ({ id: String(project.id) }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).id);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/my-projects/${project.id}` },
    openGraph: {
      title: `${project.title} | Sandeep Kumar`,
      description: project.shortDescription,
      url: `/my-projects/${project.id}`,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).id);
  if (!project) notFound();

  const story = projectStories[project.id];
  const index = selectedProjects.findIndex((item) => item.id === project.id);
  const next = selectedProjects[(index + 1) % selectedProjects.length];
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    image: project.image,
    url: `/my-projects/${project.id}`,
    keywords: project.technologies.join(", "),
  };

  return (
    <article className="study-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="study-wrap">
        <Link href="/my-projects" className="study-back">
          ← All projects
        </Link>
      </div>
      <nav className="study-action-bar" aria-label={`${project.title} project links`}>
        <span className="study-action-label">
          {project.title} <i aria-hidden="true" />
        </span>
        <div className="study-action-links">
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
              Live demo <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
              Source code <span aria-hidden="true">↗</span>
            </a>
          )}
          {!project.githubLink && project.sourceNote && (
            <span className="study-action-note">{project.sourceNote}</span>
          )}
          <WireframeToggle floatingExit={false} />
        </div>
      </nav>
      <div className="study-wrap">
        <header
          className="study-header"
          data-build-file="data/projects.ts"
          data-build-note="Title, summary, stack, and links come from one typed record per project."
        >
          <span className="offset-kicker">
            Case study / {String(index + 1).padStart(2, "0")} / {project.category}
          </span>
          <ViewTransition name={`project-title-${project.id}`} share="project-morph" default="none">
            <h1>
              {project.title}
              <span>.</span>
            </h1>
          </ViewTransition>
          <div>
            <p>{project.shortDescription}</p>
            <span>{project.year ? `Built / ${project.year}` : "Selected work"}</span>
          </div>
          {gallery.length > 0 && (
            <a className="study-screen-jump" href="#screens">
              Browse product screens <span aria-hidden="true">↓</span>
            </a>
          )}
        </header>
        {story && (
          <dl className="study-facts">
            <div>
              <dt>My contribution</dt>
              <dd>{story.contribution}</dd>
            </div>
            <div>
              <dt>Product scope</dt>
              <dd>{story.scope}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
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
      </div>
      <ViewTransition name={`project-media-${project.id}`} share="project-morph" default="none">
        <figure className="study-cover">
          <Image
            src={project.image}
            alt={`${project.title} interface overview`}
            fill
            priority
            sizes="100vw"
          />
          <figcaption>{project.title} / Product overview</figcaption>
        </figure>
      </ViewTransition>
      <div className="study-wrap">
        <section className="study-statement">
          <span className="study-marker">01 / The problem</span>
          <div>
            <h2>What needed solving</h2>
            <p>{project.caseStudy?.problem || project.longDescription}</p>
          </div>
        </section>
        {story && (
          <section
            className="study-reasoning"
            aria-labelledby="study-decision-title"
            data-build-file="data/projectStories.ts"
            data-build-note="The constraint and the decision are written per project, next to the screens chosen to prove them."
          >
            <div>
              <span className="study-marker">02 / The decision</span>
              <h2 id="study-decision-title">
                Why this
                <br />
                approach<span>.</span>
              </h2>
            </div>
            <div>
              <h3>The constraint</h3>
              <p>{story.constraint}</p>
              <h3>The response</h3>
              <p>{story.decision}</p>
            </div>
          </section>
        )}
        {project.facts && (
          <section
            className="study-numbers"
            aria-labelledby="study-numbers-title"
            data-build-file="project.facts"
            data-build-note="Counted from the repository or measured on the live demo, never estimated."
          >
            <span className="study-marker">By the numbers</span>
            <h2 id="study-numbers-title" className="sr-only">
              Facts from the repository and live demo
            </h2>
            <dl>
              {project.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p>
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
          </section>
        )}
        {gallery.length > 0 && (
          <section className="study-evidence" id="screens" aria-label="Project evidence">
            <div className="study-evidence-head">
              <span className="study-marker">{story ? "03" : "02"} / In the product</span>
              <p>Follow the product flow, screen by screen. Open any image to inspect it.</p>
            </div>
            <ProjectGallery items={gallery} title={project.title} />
          </section>
        )}
        {project.films?.map((film) => (
          <figure className="study-film" key={film.src}>
            <span className="study-marker">Watch / {film.title}</span>
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
        ))}
        <section className="study-solution">
          <span className="study-marker">{story ? "04" : "03"} / The response</span>
          <h2>
            The solution<span>.</span>
          </h2>
          <p>{project.caseStudy?.solution || project.longDescription}</p>
        </section>
        {story && (
          <section className="study-proof">
            <span className="study-marker">05 / What to inspect</span>
            <h2>Evidence in the work</h2>
            <ol>
              {story.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        )}
        <section className="study-system">
          <div>
            <span className="study-marker">{story ? "06" : "04"} / Product anatomy</span>
            <h2>
              Under the
              <br />
              hood<span>.</span>
            </h2>
            <p>{project.technologies.join(" / ")}</p>
          </div>
          <ol>
            {(project.caseStudy?.architecture || project.features).map((item, position) => (
              <li key={item}>
                <span>0{position + 1}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>
        {story?.pipeline && (
          <section
            className="study-pipeline"
            aria-labelledby="study-pipeline-title"
            data-build-file="System map"
            data-build-note={
              project.githubLink
                ? "The request path, step by step."
                : "The repository is private, so the path through the system is shown here instead of the code."
            }
          >
            <span className="study-marker">System map</span>
            <h2 id="study-pipeline-title">
              {(story.pipelineHeading ?? ["One request,", "start to finish"])[0]}
              <br />
              {(story.pipelineHeading ?? ["One request,", "start to finish"])[1]}
              <span>.</span>
            </h2>
            <ol>
              {story.pipeline.map((step, position) => (
                <li key={step.title}>
                  <span aria-hidden="true">{String(position + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
        {story?.sourceMap && project.githubLink && (
          <section
            className="study-source"
            aria-labelledby="study-source-title"
            data-build-file={project.githubLink.replace("https://github.com/", "")}
            data-build-note="Open these files first to check the claims on this page."
          >
            <span className="study-marker">Source map</span>
            <h2 id="study-source-title">
              Where to look
              <br />
              in the code<span>.</span>
            </h2>
            <ol>
              {story.sourceMap.map((entry) => (
                <li key={entry.path}>
                  <a
                    href={`${project.githubLink}/blob/${project.repoBranch ?? "main"}/${entry.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <code>{entry.path}</code>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <p>{entry.role}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
        {project.caseStudy && (
          <section className="study-decisions">
            <span className="study-marker">{story ? "07" : "05"} / Tradeoffs</span>
            <h2>What this cost</h2>
            <div>
              {project.caseStudy.tradeoffs.map((item, position) => (
                <p key={item}>
                  <span>0{position + 1}</span>
                  {item}
                </p>
              ))}
            </div>
          </section>
        )}
        {story && (
          <aside className="study-takeaway">
            <span className="study-marker">The takeaway</span>
            <p>{story.takeaway}</p>
          </aside>
        )}
        <div className="study-end">
          <div>
            <span className="study-marker">Keep exploring</span>
            <h2>
              Next:
              <br />
              {next.title}
              <span>.</span>
            </h2>
          </div>
          <div>
            <Link href={`/my-projects/${next.id}`} className="study-next">
              <span>Open {next.title} case study</span>
              <span aria-hidden="true">↗</span>
            </Link>
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                Live demo ↗
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                Source code ↗
              </a>
            )}
            <Link href="/my-projects">All projects ←</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
