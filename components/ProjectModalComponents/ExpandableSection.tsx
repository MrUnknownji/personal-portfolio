import { FiChevronDown } from "react-icons/fi";

interface ExpandableSectionProps {
  title: string;
  content: string | string[];
  isList?: boolean;
}

export const ExpandableSection = ({
  title,
  content,
  isList = false,
}: ExpandableSectionProps) => {
  return (
    <details className="group overflow-hidden rounded-xl border border-border bg-card open:border-primary/40 open:bg-primary/5">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 py-4 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <span className="h-0 w-[3px] rounded-full bg-primary opacity-0 transition-all group-open:h-6 group-open:opacity-100" />
          {title}
        </span>
        <span className="rounded-full bg-background p-2 text-foreground/60 transition-transform group-open:rotate-180 group-open:text-primary">
          <FiChevronDown className="size-5" aria-hidden="true" />
        </span>
      </summary>

      <div className="px-5 pb-6 pt-2">
        {isList && Array.isArray(content) ? (
          <ul className="space-y-3">
            {content.map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {content as string}
          </div>
        )}
      </div>
    </details>
  );
};
