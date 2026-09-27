import type { Metadata } from "next";
import Link from "next/link";
import { selectedProjects } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import PrintProfile from "@/components/PrintProfile";

export const metadata: Metadata = {
  title: "Quick View",
  description: "A concise view of Sandeep Kumar's projects, skills, background, and contact details.",
  alternates: { canonical: "/quick" },
};

const projects = [9, 11, 10].map((id) => selectedProjects.find((project) => project.id === id)!);

export default function QuickView() {
  return (
    <div className="quick-view offset-wrap">
      <header className="quick-view-intro">
        <span className="offset-kicker">The build file / quick view</span>
        <h1>Sandeep<br />Kumar<span>.</span></h1>
        <div className="quick-view-intro-bottom">
          <p>Full-stack developer and creative coder in Punjab, India. I build web and mobile products that look clear and work hard.</p>
          <Link href="/" className="quick-view-experience">Explore the full experience <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section id="projects" className="quick-view-section" aria-labelledby="quick-projects-title">
        <div className="quick-view-section-heading"><span>Work</span><h2 id="quick-projects-title">Selected projects</h2></div>
        <div className="quick-view-projects">{projects.map((project) => <article key={project.id}>
          <div><h3><Link href={`/my-projects/${project.id}`}>{project.title}<span aria-hidden="true">↗</span></Link></h3><p>{project.shortDescription}</p></div>
          <span>{project.technologies.slice(0, 4).join(" · ")}</span>
        </article>)}</div>
        <Link className="quick-view-more" href="/my-projects">All projects <span aria-hidden="true">↗</span></Link>
      </section>

      <section id="skills" className="quick-view-section" aria-labelledby="quick-skills-title">
        <div className="quick-view-section-heading"><span>Capabilities</span><h2 id="quick-skills-title">What I use</h2></div>
        <div className="quick-view-facts"><p><strong>Interfaces</strong><span>React · React Native · TypeScript · Next.js</span></p><p><strong>Systems</strong><span>Node.js · PostgreSQL · Prisma · Pusher</span></p><p><strong>Motion</strong><span>GSAP · Anime.js · SVG</span></p></div>
      </section>

      <section id="education" className="quick-view-section" aria-labelledby="quick-background-title">
        <div className="quick-view-section-heading"><span>Background</span><h2 id="quick-background-title">Experience &amp; education</h2></div>
        <div className="quick-view-facts"><p><strong>2024—Now</strong><span>Developer at TCS</span></p><p><strong>2023</strong><span>BSc Computer Science</span></p></div>
        <div className="quick-view-profile-actions"><PrintProfile /><a className="quick-view-more" href={`mailto:${SITE_CONFIG.email}?subject=R%C3%A9sum%C3%A9%20request`}>Request full résumé <span aria-hidden="true">↗</span></a></div>
      </section>

      <section id="contact" className="quick-view-contact" aria-labelledby="quick-contact-title">
        <span className="offset-kicker">Open to interesting work</span>
        <h2 id="quick-contact-title">Let&apos;s talk<span>.</span></h2>
        <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}<span aria-hidden="true">↗</span></a>
      </section>
    </div>
  );
}
