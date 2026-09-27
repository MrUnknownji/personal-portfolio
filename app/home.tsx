import ContactInteraction from "@/components/ContactSectionComponents/ContactInteraction";
import OffsetScrollMotion from "@/components/OffsetScrollMotion";
import InteractiveHero from "@/components/InteractiveHero";
import ProjectShowcase from "@/components/ProjectShowcase";
import CreativeLab from "@/components/CreativeLab";
import SectionIndex from "@/components/SectionIndex";
import FieldNote from "@/components/FieldNote";
import ProfileRoles from "@/components/ProfileRoles";
import ContactSignal from "@/components/ContactSignal";
import HomeScrollReset from "@/components/HomeScrollReset";
import { selectedProjects } from "@/data/projects";
import { SkillsData } from "@/data/skills";
import { SITE_CONFIG } from "@/data/site";

const featuredProjects = [10, 11, 9].flatMap((id) => selectedProjects.filter((project) => project.id === id));

export default function Home() {
  return (
    <>
      <HomeScrollReset />
      <OffsetScrollMotion />
      <SectionIndex />

      <InteractiveHero />

      <ProjectShowcase projects={featuredProjects} />
      <CreativeLab />

      <section id="about" className="offset-about offset-wrap" aria-labelledby="about-title">
        <div className="offset-about-heading" data-offset-reveal>
          <span className="offset-kicker">03 / About</span>
          <h2 id="about-title">I like building things<br />that explain themselves<span>.</span></h2>
        </div>
        <FieldNote />
        <ProfileRoles />
        <div id="skills" className="offset-toolkit" data-offset-reveal>
          <div className="offset-toolkit-heading"><span className="offset-kicker">04 / Toolkit</span><h3>The tools<span>.</span></h3></div>
          <div className="offset-toolkit-grid">
            {[
              { title: "Interface", tools: ["React", "React Native", "TypeScript", "Tailwind CSS"] },
              { title: "Systems", tools: SkillsData.backend },
              { title: "Motion", tools: ["GSAP", "Anime.js", "Framer Motion", "Reanimated"] },
              { title: "Delivery", tools: ["Git", "Docker", "AWS", "Vercel", "Figma"] },
            ].map((group, index) => <article className={`offset-toolkit-panel offset-toolkit-panel-${index + 1}`} key={group.title} tabIndex={0} aria-label={`${group.title} tools`}>
              <span className="offset-toolkit-screw offset-toolkit-screw-fixed" aria-hidden="true" />
              <span className="offset-toolkit-screw offset-toolkit-screw-loose" aria-hidden="true" />
              <h4>{group.title}</h4>
              <ul>{group.tools.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </article>)}
          </div>
        </div>
      </section>

      <section id="contact" className="offset-contact" aria-labelledby="contact-title">
        <div className="offset-wrap">
          <div className="offset-contact-header" data-offset-reveal><span className="offset-kicker">05 / Contact</span><h2 id="contact-title">Have an idea?<br />Let&apos;s build it<span>.</span></h2><p>Tell me what you&apos;re making, even if it&apos;s still rough.</p></div>
          <div className="offset-contact-grid"><div className="offset-contact-direct"><span className="offset-kicker">Send an email</span><ContactSignal /><a href={`mailto:${SITE_CONFIG.email}`}><span>{SITE_CONFIG.email}</span><b aria-hidden="true">↗</b></a><p>Based in Punjab, India.<br />Working with people everywhere.</p><span className="offset-contact-stamp">OPEN TO INTERESTING WORK <i aria-hidden="true" /></span></div><div className="offset-contact-form"><div className="offset-contact-form-head"><span>Or leave a note here</span></div><ContactInteraction /></div></div>
        </div>
      </section>
    </>
  );
}
