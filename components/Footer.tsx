"use client";

import { usePathname } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";

const QUICK_LINKS = [
  { href: "/", text: "Home" },
  { href: "/#about", text: "About" },
  { href: "/my-projects", text: "Projects" },
  { href: "/#contact", text: "Contact" },
];

const BUILT_WITH = ["Next.js", "Tailwind CSS", "TypeScript"];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-background px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-primary/80" />

      <div className="container relative z-10 mx-auto flex flex-col items-center space-y-10">
        <nav aria-label="Footer navigation" data-reveal="up">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {QUICK_LINKS.map((link) => {
              const targetPath = link.href.split("#")[0] || "/";
              const opensAnotherPage = targetPath !== pathname;

              return (
                <li key={link.text}>
                  <a
                    href={link.href}
                    className="group relative flex min-h-11 items-center gap-1.5 overflow-hidden rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground"
                  >
                    <span className="absolute inset-x-2 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-accent to-primary transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    <span>{link.text}</span>
                    {opensAnotherPage && (
                      <span className="flex w-0 -translate-x-1 items-center overflow-hidden text-primary opacity-0 transition-[width,transform,opacity] duration-200 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:w-4 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" aria-hidden="true">
                        <FiArrowUpRight className="size-3 shrink-0" />
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-3" data-reveal="up">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Crafted with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BUILT_WITH.map((tech, index) => (
              <div key={tech} className="flex items-center">
                <span className="cursor-default text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-primary">
                  {tech}
                </span>
                {index < BUILT_WITH.length - 1 && (
                  <span className="mx-3 size-1 rounded-full bg-white/30" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xs border-t border-border pt-4 text-center" data-reveal="up">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sandeep Kumar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
