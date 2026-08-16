import ImageSection from "./AboutMeSectionComponents/ImageSection";
import JourneySection from "./AboutMeSectionComponents/JourneySection";
import SkillsSection from "./AboutMeSectionComponents/SkillsSection";
import Title from "./ui/Title";

const AboutMe = () => {
  return (
    <section
      id="about"
      data-krypton-context="about"
      data-krypton-title="About Sandeep"
      data-krypton-summary="Sandeep is a full stack developer focused on readable code, polished interfaces, and practical product experiences."
      className="relative mx-auto max-w-7xl scroll-mt-24 space-y-20 px-4 py-20 sm:space-y-24 sm:px-6 lg:px-8"
    >
      <div className="relative px-4 text-center" data-reveal="up">
        <Title
          title="About Me"
          showGlowBar
          subtitle={
            <span className="mx-auto block max-w-2xl italic">
              &quot;Any fool can write code that a computer can understand.{" "}
              <br className="hidden sm:block" />
              <span className="font-medium tracking-wide text-foreground">
                Good programmers write code that humans can understand.
              </span>
              &quot;
              <span className="mt-4 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest text-primary not-italic">
                <span className="h-px w-8 bg-primary/40" />
                Martin Fowler
                <span className="h-px w-8 bg-primary/40" />
              </span>
            </span>
          }
        />
      </div>

      <div className="relative grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="z-10 lg:col-span-5 lg:self-stretch">
          <div className="lg:sticky lg:top-28">
            <div data-reveal="left">
              <ImageSection />
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <JourneySection />
        </div>
      </div>

      <div className="w-full border-t border-border/20 pt-16 lg:pt-24" data-reveal="up">
        <SkillsSection />
      </div>
    </section>
  );
};

export default AboutMe;
