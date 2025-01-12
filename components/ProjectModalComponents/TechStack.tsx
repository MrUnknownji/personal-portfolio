import { FC } from "react";

interface TechStackProps {
  technologies: string[];
}

export const TechStack: FC<TechStackProps> = ({ technologies }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="px-3 py-1.5 bg-dark text-primary text-sm font-medium
            border border-primary/30 rounded-md hover:bg-primary/10
            transition-colors duration-200"
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};
