"use client";

import { useCallback } from "react";
import { botProjects as projects } from "@/data/bot-projects";
import { SOCIAL_PROFILES } from "@/data/social";

type ActiveProject = {
  id: number;
  title: string;
} | null;

type BotRouter = {
  push: (href: string) => void;
};

type UseBotCommandsParams = {
  activeProject: ActiveProject;
  pathname: string;
  router: BotRouter;
};

export function useBotCommands({
  activeProject,
  pathname,
  router,
}: UseBotCommandsParams) {
  const findProject = useCallback((prompt: string) => {
    const normalizedPrompt = prompt.toLowerCase();

    return projects.find((project) => {
      return (
        normalizedPrompt.includes(project.title.toLowerCase()) ||
        project.technologies.some((tech) =>
          normalizedPrompt.includes(tech.toLowerCase()),
        )
      );
    });
  }, []);

  const scrollElementPrecisely = useCallback(
    (target: Element, hash?: string) => {
      const headerHeight =
        document.querySelector("header")?.getBoundingClientRect().height ?? 64;
      const topOffset = Math.round(headerHeight + 20);

      window.scrollTo({
        top: Math.max(
          0,
          window.scrollY + target.getBoundingClientRect().top - topOffset,
        ),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });

      if (hash) {
        window.history.replaceState(null, "", hash);
      }

    },
    [],
  );

  const scrollToTarget = useCallback(
    (selector: string, hash: string) => {
      const runScroll = () => {
        const target = document.querySelector(selector);
        if (!target) return false;
        scrollElementPrecisely(target, hash);
        return true;
      };

      if (pathname !== "/") {
        router.push(`/${hash}`);
      } else {
        runScroll();
      }
    },
    [pathname, router, scrollElementPrecisely],
  );

  const openProjectDetails = useCallback(
    (projectId: number) => {
      router.push(`/my-projects/${projectId}`);
    },
    [router],
  );

  const clickTargetByLabel = useCallback(
    (prompt: string) => {
      const labelMatch = prompt.match(
        /\b(?:click|press|select|choose)\s+(?:the\s+)?(.+?)(?:\s+(?:button|link))?$/i,
      );
      if (!labelMatch) return null;

      const requestedLabel = labelMatch[1]
        .replace(/\b(button|link)\b/gi, "")
        .trim()
        .toLowerCase();
      if (!requestedLabel) return null;

      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [role="button"]',
        ),
      )
        .map((element) => {
          const label = (
            element.getAttribute("aria-label") ||
            element.getAttribute("title") ||
            element.innerText ||
            ""
          )
            .trim()
            .replace(/\s+/g, " ");
          const normalizedLabel = label.toLowerCase();
          const rect = element.getBoundingClientRect();
          const inViewport =
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight;

          return {
            element,
            label,
            inViewport,
            score:
              normalizedLabel === requestedLabel
                ? 3
                : normalizedLabel.startsWith(requestedLabel)
                  ? 2
                  : normalizedLabel.includes(requestedLabel)
                    ? 1
                    : 0,
          };
        })
        .filter((candidate) => candidate.score > 0)
        .sort((left, right) => {
          return (
            right.score - left.score ||
            Number(right.inViewport) - Number(left.inViewport)
          );
        });

      const match = candidates[0];
      if (!match) return null;

      if (match.inViewport) {
        match.element.click();
      } else {
        scrollElementPrecisely(match.element);
        window.setTimeout(() => match.element.click(), 950);
      }

      return `Clicking ${match.label || requestedLabel}.`;
    },
    [scrollElementPrecisely],
  );

  const handleLocalCommand = useCallback(
    (prompt: string) => {
      const normalizedPrompt = prompt.toLowerCase();
      const activeProjectMatch = activeProject
        ? projects.find((project) => project.id === activeProject.id)
        : null;
      const requestedProject = findProject(prompt) || activeProjectMatch;

      if (
        /\b(summary|summarize|explain|tell me about|what is|give me)\b/.test(
          normalizedPrompt,
        )
      ) {
        return null;
      }

      if (
        /\b(open|show|view)\b/.test(normalizedPrompt) &&
        requestedProject &&
        !/\bgithub|source|repo|code|live|demo|website|preview\b/.test(
          normalizedPrompt,
        )
      ) {
        const project =
          requestedProject ||
          projects.find((item) => item.featured) ||
          projects[0];

        if (project) {
          openProjectDetails(project.id);
          return `Opening ${project.title}.`;
        }
      }

      if (/\b(home|top|hero)\b/.test(normalizedPrompt)) {
        const openHome = () => {
          const target = document.querySelector("main");
          if (!target) return false;
          scrollElementPrecisely(target);
          return true;
        };

        if (pathname !== "/") {
          router.push("/");
        } else {
          openHome();
        }
        return "Taking you back to the home section.";
      }

      if (/\bskills?\b/.test(normalizedPrompt)) {
        scrollToTarget("#skills", "#skills");
        return "Opening the skills section.";
      }

      if (/\b(about|bio|background|journey)\b/.test(normalizedPrompt)) {
        scrollToTarget("#about", "#about");
        return "Opening the About section.";
      }

      if (/\b(contact|hire|email|reach)\b/.test(normalizedPrompt)) {
        scrollToTarget("#contact", "#contact");
        return "Opening the Contact section.";
      }

      if (/\b(projects?|work|portfolio)\b/.test(normalizedPrompt)) {
        router.push("/my-projects");
        return "Opening the projects page.";
      }

      const clickResult = clickTargetByLabel(prompt);
      if (clickResult) return clickResult;

      if (/\b(source|repo|code)\b/.test(normalizedPrompt)) {
        if (requestedProject?.githubLink) {
          window.open(
            requestedProject.githubLink,
            "_blank",
            "noopener,noreferrer",
          );
          return `Opening ${requestedProject.title} source code.`;
        }
      }

      if (/\bgithub\b/.test(normalizedPrompt)) {
        window.open(
          SOCIAL_PROFILES.github.href,
          "_blank",
          "noopener,noreferrer",
        );
        return "Opening Sandeep's GitHub profile.";
      }

      if (/\b(live|demo|website|preview)\b/.test(normalizedPrompt)) {
        const project = findProject(prompt) || requestedProject;
        if (project?.demoLink) {
          window.open(project.demoLink, "_blank", "noopener,noreferrer");
          return `Opening ${project.title} live demo.`;
        }
      }

      return null;
    },
    [
      activeProject,
      clickTargetByLabel,
      findProject,
      openProjectDetails,
      pathname,
      router,
      scrollElementPrecisely,
      scrollToTarget,
    ],
  );

  return { handleLocalCommand };
}
