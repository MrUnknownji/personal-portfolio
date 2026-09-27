import ContactInteraction from "@/components/ContactSectionComponents/ContactInteraction";
import InteractiveHero from "@/components/InteractiveHero";
import ProjectShowcase from "@/components/ProjectShowcase";
import CreativeLab from "@/components/CreativeLab";
import FieldNote from "@/components/FieldNote";
import ProfileRoles from "@/components/ProfileRoles";
import HowIBuild from "@/components/HowIBuild";
import ContactSignal from "@/components/ContactSignal";
import { selectedProjects } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";

const featuredProjects = selectedProjects.filter((project) => project.showcaseVariant);

export default function Home() {
  return (
    <>
      <InteractiveHero />

      <ProjectShowcase projects={featuredProjects} />
      <CreativeLab />

      <section id="about" className="offset-about offset-wrap" data-build-file="FieldNote.tsx" data-build-note="A timeline of practice, followed by direct links to work that supports each role." aria-labelledby="about-title">
        <div className="offset-about-heading" data-offset-reveal>
          <span className="offset-kicker">03 / About</span>
          <h2 id="about-title">I like building things<br />that explain themselves<span>.</span></h2>
        </div>
        <FieldNote />
        <ProfileRoles />
        <div className="offset-profile-actions"><a className="offset-resume-link" href="/quick">View quick profile <span aria-hidden="true">↗</span></a><a className="offset-resume-link" href={`mailto:${SITE_CONFIG.email}?subject=R%C3%A9sum%C3%A9%20request`}>Request full résumé <span aria-hidden="true">↗</span></a></div>
        <HowIBuild />
      </section>

      <section id="contact" className="offset-contact" data-build-file="ContactInteraction.tsx" data-build-note="Visitors can reach me directly or send a short note through the form." aria-labelledby="contact-title">
        <div className="offset-wrap">
          <div className="offset-contact-header" data-offset-reveal><span className="offset-kicker">05 / Contact</span><h2 id="contact-title">Have an idea?<br />Let&apos;s build it<span>.</span></h2><p>Interested in product engineering, selected projects, and creative collaborations. Tell me what you&apos;re making, even if it&apos;s still rough.</p></div>
          <div className="offset-contact-grid"><div className="offset-contact-direct"><span className="offset-kicker">Send an email</span><ContactSignal /><a href={`mailto:${SITE_CONFIG.email}`}><span>{SITE_CONFIG.email}</span><b aria-hidden="true">↗</b></a><p>Based in Punjab, India.<br />Working with people everywhere.</p><span className="offset-contact-stamp">OPEN TO INTERESTING WORK <i aria-hidden="true" /></span></div><div className="offset-contact-form"><div className="offset-contact-form-head"><span>Or leave a note here</span></div><ContactInteraction /></div></div>
        </div>
      </section>
    </>
  );
}
