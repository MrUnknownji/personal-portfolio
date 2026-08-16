import React from "react";

interface TitleProps {
  title: string;
  subtitle?: string | React.ReactNode;
  showGlowBar?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  showGlowBar = false,
  className = "",
  as: Heading = "h2",
}) => {
  return (
    <div className={`space-y-4 text-center ${className}`}>
      <Heading className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text pb-2 text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
        {title}
      </Heading>

      {subtitle && (
        <div className="mx-auto max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </div>
      )}

      {showGlowBar && (
        <div className="mt-6 flex w-full flex-col items-center justify-center overflow-hidden">
          <svg
            width="240"
            height="28"
            viewBox="0 0 240 28"
            className="text-primary"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M120 4 L128 14 L120 24 L112 14 Z M120 9 L124 14 L120 19 L116 14 Z"
              fill="currentColor"
            />
            <circle cx="120" cy="1" r="1.5" fill="currentColor" />
            <circle cx="120" cy="27" r="1.5" fill="currentColor" />
            <circle cx="104" cy="14" r="2" fill="currentColor" />
            <circle cx="136" cy="14" r="2" fill="currentColor" />
            <path d="M96 12.5 Q 64 20.5 32 12.5" stroke="currentColor" fill="none" />
            <path d="M96 15.5 Q 64 23.5 32 15.5" stroke="currentColor" fill="none" />
            <path d="M144 12.5 Q 176 20.5 208 12.5" stroke="currentColor" fill="none" />
            <path d="M144 15.5 Q 176 23.5 208 15.5" stroke="currentColor" fill="none" />
            <path d="M26 10 L32 14 L26 18 L20 14 Z" fill="currentColor" />
            <path d="M214 10 L220 14 L214 18 L208 14 Z" fill="currentColor" />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
            <circle cx="228" cy="14" r="1.5" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Title;
