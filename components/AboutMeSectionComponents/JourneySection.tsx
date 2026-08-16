const journeyData = [
  {
    year: "2020",
    title: "Started Programming Journey",
    description:
      "Began learning web development with a focus on modern JavaScript and React. Built my first few projects and fell in love with coding.",
  },
  {
    year: "2023",
    title: "Completed Graduation",
    description:
      "Completed a BSc in Computer Science, building a strong foundation in algorithms and data structures.",
  },
  {
    year: "2024",
    title: "Joined TCS",
    description:
      "Started working as a developer at TCS, gaining professional experience with large-scale enterprise applications and agile workflows.",
  },
  {
    year: "2025",
    title: "Working and Learning",
    description:
      "Continued growing as a developer, exploring advanced backend architectures, cloud technologies, and open-source work.",
  },
];

const JourneySection = () => {
  return (
    <div className="relative py-10">
      <h3 className="mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text pb-2 text-left text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl" data-reveal="up">
        My Journey
      </h3>

      <div className="relative">
        <div className="absolute bottom-2 left-[9px] top-2 w-0.5 rounded-full bg-gradient-to-b from-primary via-accent to-primary" aria-hidden="true" />

        <div className="flex flex-col gap-12" data-reveal-group>
          {journeyData.map((item) => (
            <div key={item.year} className="group relative pl-8 md:pl-12">
              <div className="absolute left-0 top-8 z-20 flex size-5 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0a] transition-colors group-hover:border-primary" aria-hidden="true">
                <div className="size-1.5 rounded-full bg-primary" />
              </div>

              <article data-reveal="right" className="relative z-10 overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 transition-[transform,border-color] group-hover:-translate-y-1 group-hover:border-primary/40 md:p-8">
                <div className="relative z-10">
                  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <h4 className="text-xl font-bold tracking-wide text-foreground/90 md:text-2xl">
                      {item.title}
                    </h4>
                    <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-primary">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                    {item.description}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneySection;
