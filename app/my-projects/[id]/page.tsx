import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/ProjectGallery";
import { selectedProjects } from "@/data/projects";
import { projectStories } from "@/data/projectStories";

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

  const story = projectStories[project.id];
  const index = selectedProjects.findIndex((item) => item.id === project.id);
  const next = selectedProjects[(index + 1) % selectedProjects.length];
  const gallery = story
    ? story.gallery.flatMap(({ match, caption }) => {
        const item = project.gallery?.find((media) => media.type === "image" && media.alt?.toLowerCase().includes(match.toLowerCase()));
        return item ? [{ ...item, caption }] : [];
      })
    : (project.gallery?.filter((item) => item.type === "image" && item.src !== project.image).slice(0, 3) ?? []).map((item) => ({ ...item, caption: item.alt || project.title }));
  const structuredData = { "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, description: project.shortDescription, image: project.image, url: `/my-projects/${project.id}`, keywords: project.technologies.join(", ") };

  return <article className="study-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <div className="study-wrap"><Link href="/my-projects" className="study-back">← All projects</Link></div>
    <nav className="study-action-bar" aria-label={`${project.title} project links`}>
      <span className="study-action-label">{project.title} <i aria-hidden="true" /></span>
      <div className="study-action-links">
        {project.demoLink && <a href={project.demoLink} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
        {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span></a>}
      </div>
    </nav>
    <div className="study-wrap">
      <header className="study-header">
        <span className="offset-kicker">Case study / {String(index + 1).padStart(2, "0")} / {project.category}</span>
        <ViewTransition name={`project-title-${project.id}`} share="project-morph" default="none"><h1>{project.title}<span>.</span></h1></ViewTransition>
        <div><p>{project.shortDescription}</p><span>{project.year ? `Built / ${project.year}` : "Selected work"}</span></div>
        {gallery.length > 0 && <a className="study-screen-jump" href="#screens">Browse product screens <span aria-hidden="true">↓</span></a>}
      </header>
      {story && <dl className="study-facts">
        <div><dt>My contribution</dt><dd>{story.contribution}</dd></div>
        <div><dt>Product scope</dt><dd>{story.scope}</dd></div>
        <div><dt>Evidence</dt><dd>Product screens{project.demoLink ? " · Live demo" : ""}{project.githubLink ? " · Source code" : ""}</dd></div>
      </dl>}
    </div>
    <ViewTransition name={`project-media-${project.id}`} share="project-morph" default="none"><figure className="study-cover"><Image src={project.image} alt={`${project.title} interface overview`} fill priority sizes="100vw" /><figcaption>{project.title} / Product overview</figcaption></figure></ViewTransition>
    <div className="study-wrap">
      <section className="study-statement"><span className="study-marker">01 / The problem</span><div><h2>What needed solving</h2><p>{project.caseStudy?.problem || project.longDescription}</p></div></section>
      {story && <section className="study-reasoning" aria-labelledby="study-decision-title">
        <div><span className="study-marker">02 / The decision</span><h2 id="study-decision-title">Why this<br />approach<span>.</span></h2></div>
        <div><h3>The constraint</h3><p>{story.constraint}</p><h3>The response</h3><p>{story.decision}</p></div>
      </section>}
      {gallery.length > 0 && <section className="study-evidence" id="screens" aria-label="Project evidence">
        <div className="study-evidence-head"><span className="study-marker">{story ? "03" : "02"} / In the product</span><p>Follow the product flow, screen by screen. Open any image to inspect it.</p></div>
        <ProjectGallery items={gallery} title={project.title} />
      </section>}
      <section className="study-solution"><span className="study-marker">{story ? "04" : "03"} / The response</span><h2>The solution<span>.</span></h2><p>{project.caseStudy?.solution || project.longDescription}</p></section>
      {story && <section className="study-proof"><span className="study-marker">05 / What to inspect</span><h2>Evidence in the work</h2><ol>{story.evidence.map((item) => <li key={item}>{item}</li>)}</ol></section>}
      <section className="study-system"><div><span className="study-marker">{story ? "06" : "04"} / Product anatomy</span><h2>Under the<br />hood<span>.</span></h2><p>{project.technologies.join(" / ")}</p></div><ol>{(project.caseStudy?.architecture || project.features).map((item, position) => <li key={item}><span>0{position + 1}</span><p>{item}</p></li>)}</ol></section>
      {project.caseStudy && <section className="study-decisions"><span className="study-marker">{story ? "07" : "05"} / Tradeoffs</span><h2>What this cost</h2><div>{project.caseStudy.tradeoffs.map((item, position) => <p key={item}><span>0{position + 1}</span>{item}</p>)}</div></section>}
      {story && <aside className="study-takeaway"><span className="study-marker">The takeaway</span><p>{story.takeaway}</p></aside>}
      <div className="study-end"><div><span className="study-marker">Keep exploring</span><h2>Next:<br />{next.title}<span>.</span></h2></div><div><Link href={`/my-projects/${next.id}`} className="study-next"><span>Open {next.title} case study</span><span aria-hidden="true">↗</span></Link>{project.demoLink && <a href={project.demoLink} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}{project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">Source code ↗</a>}<Link href="/my-projects">All projects ←</Link></div></div>
    </div>
  </article>;
}
