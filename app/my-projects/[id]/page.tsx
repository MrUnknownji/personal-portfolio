import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { selectedProjects } from "@/data/projects";

type ProjectPageProps = { params: Promise<{ id: string }> };
const getProject = (id: string) => selectedProjects.find((project) => project.id === Number(id));

export function generateStaticParams() {
  return selectedProjects.map((project) => ({ id: String(project.id) }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).id);
  if (!project) return { title: "Project Not Found" };
  return { title: project.title, description: project.shortDescription, alternates: { canonical: `/my-projects/${project.id}` }, openGraph: { title: `${project.title} | Sandeep Kumar`, description: project.shortDescription, url: `/my-projects/${project.id}`, images: [{ url: project.image }] } };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).id);
  if (!project) notFound();
  const structuredData = { "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, description: project.shortDescription, image: project.image, url: `/my-projects/${project.id}`, keywords: project.technologies.join(", ") };
  const index = selectedProjects.findIndex((item) => item.id === project.id) + 1;
  const gallery = project.gallery?.filter((item) => item.type === "image" && item.src !== project.image).slice(0, 2) ?? [];

  return <article className="study-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <div className="study-wrap">
      <Link href="/my-projects" className="study-back">← Selected work</Link>
    </div>
    <nav className="study-action-bar" aria-label={`${project.title} project links`}>
      <span className="study-action-label">{project.title} <i aria-hidden="true" /></span>
      <div className="study-action-links">
        {project.demoLink && <a href={project.demoLink} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
        {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span></a>}
      </div>
    </nav>
    <div className="study-wrap">
      <header className="study-header"><span className="offset-kicker">Case study / 0{index} / {project.category}</span><ViewTransition name={`project-title-${project.id}`} share="project-morph" default="none"><h1>{project.title}<span>.</span></h1></ViewTransition><div><p>{project.shortDescription}</p><span>PROJECT / {String(index).padStart(3, "0")}</span></div></header>
    </div>
    <ViewTransition name={`project-media-${project.id}`} share="project-morph" default="none"><figure className="study-cover"><Image src={project.image} alt={`${project.title} project interface`} fill priority sizes="100vw" /><figcaption>Fig. 0{index} / {project.title} / Interface</figcaption></figure></ViewTransition>
    <div className="study-wrap">
      <section className="study-statement"><span className="study-marker">01 / The challenge</span><div><h2>What needed solving</h2><p>{project.caseStudy?.problem || project.longDescription}</p></div></section>
      {gallery.length > 0 && <div className="study-gallery">{gallery.map((item, position) => <figure key={item.src}><div><Image src={item.src} alt={item.alt || `${project.title} detail ${position + 1}`} fill sizes="(max-width: 760px) 100vw, 50vw" /></div><figcaption>Fig. {String(position + 2).padStart(2,"0")} / {item.alt || project.title}</figcaption></figure>)}</div>}
      <section className="study-solution"><span className="study-marker">02 / The response</span><h2>The solution<span>.</span></h2><p>{project.caseStudy?.solution || project.longDescription}</p></section>
      <section className="study-system"><div><span className="study-marker">03 / Product anatomy</span><h2>Under the<br />hood<span>.</span></h2><p>{project.technologies.join(" / ")}</p></div><ol>{(project.caseStudy?.architecture || project.features).map((item, position) => <li key={item}><span>0{position + 1}</span><p>{item}</p></li>)}</ol></section>
      {project.caseStudy && <section className="study-decisions"><span className="study-marker">04 / Decisions</span><h2>Tradeoffs</h2><div>{project.caseStudy.tradeoffs.map((item, position) => <p key={item}><span>0{position + 1}</span>{item}</p>)}</div></section>}
      <div className="study-end"><div><span className="study-marker">Keep exploring</span><h2>See the<br />next idea<span>.</span></h2></div><div>{project.demoLink && <a href={project.demoLink} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}{project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">Source code ↗</a>}<Link href="/my-projects">Back to selected work ←</Link></div></div>
    </div>
  </article>;
}
