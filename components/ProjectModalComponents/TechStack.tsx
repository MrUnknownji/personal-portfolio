interface TechStackProps {
  technologies: string[];
}

export const TechStack = ({ technologies }: TechStackProps) => {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-medium text-foreground/90">
        <span className="inline-block h-4 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        Technologies Used
      </h3>
      <ul className="flex flex-wrap gap-2.5" aria-label="Technologies used">
        {technologies.map((tech) => (
          <li
            key={tech}
            className="relative cursor-default rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary opacity-80" aria-hidden="true" />
              {tech}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
