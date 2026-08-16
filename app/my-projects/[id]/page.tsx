import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { selectedProjects } from "@/data/projects";

type ProjectPageProps = { params: Promise<{ id: string }> };

const getProject = (id: string) => {
  const projectId = Number(id);
  return selectedProjects.find((project) => project.id === projectId);
};

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
    <article className="mx-auto min-h-screen max-w-5xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Link href="/my-projects" className="mb-8 inline-flex rounded-lg text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
        ← Back to selected work
      </Link>

      <header className="space-y-6">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">{project.category}</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">{project.title}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">{project.shortDescription}</p>
      </header>

      <div className="relative my-10 aspect-video overflow-hidden rounded-2xl border border-border bg-card">
        <Image src={project.image} alt={`${project.title} project preview`} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 960px" />
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_18rem]">
        <div className="space-y-10">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="mb-4 text-2xl font-bold text-foreground">Overview</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{project.longDescription}</p>
          </section>

          {project.caseStudy && (
            <section aria-labelledby="case-study-heading" className="space-y-6">
              <h2 id="case-study-heading" className="text-2xl font-bold text-foreground">Case study</h2>
              <div><h3 className="mb-2 text-lg font-semibold text-foreground">Problem</h3><p className="leading-relaxed text-muted-foreground">{project.caseStudy.problem}</p></div>
              <div><h3 className="mb-2 text-lg font-semibold text-foreground">Solution</h3><p className="leading-relaxed text-muted-foreground">{project.caseStudy.solution}</p></div>
            </section>
          )}

          <section aria-labelledby="features-heading">
            <h2 id="features-heading" className="mb-4 text-2xl font-bold text-foreground">Key features</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </section>
        </div>

        <aside className="space-y-6 md:sticky md:top-28 md:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Technologies</h2>
            <ul className="flex flex-wrap gap-2">{project.technologies.map((technology) => <li key={technology} className="rounded-full border border-primary/30 px-3 py-1 text-sm text-primary">{technology}</li>)}</ul>
          </div>
          <div className="flex flex-col gap-3">
            {project.demoLink && <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary px-5 py-3 text-center font-bold text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Open live demo</a>}
            {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border px-5 py-3 text-center font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">View source code</a>}
          </div>
        </aside>
      </div>
    </article>
  );
}
