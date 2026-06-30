"use client";

import { useCallback } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { botProjects as projects } from "@/data/bot-projects";

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

  const isPageReady = useCallback(() => {
    const overlay = document.getElementById("page-transition-overlay");
    return !overlay || window.getComputedStyle(overlay).display === "none";
  }, []);

  const runWhenReady = useCallback(
    (task: () => boolean, maxAttempts = 50) => {
      let attempts = 0;

      const attempt = () => {
        attempts += 1;
        if ((!isPageReady() || !task()) && attempts < maxAttempts) {
          window.setTimeout(attempt, 100);
        }
      };

      attempt();
    },
    [isPageReady],
  );

  const scrollElementPrecisely = useCallback(
    (target: Element, hash?: string) => {
      const headerHeight =
        document.querySelector("header")?.getBoundingClientRect().height ?? 64;
      const topOffset = Math.round(headerHeight + 20);

      ScrollTrigger.refresh();
      const smoother = ScrollSmoother.get();

      if (smoother) {
        smoother.paused(false);
        smoother.scrollTo(
          Math.max(0, smoother.offset(target, `top ${topOffset}px`)),
          true,
        );
      } else {
        window.scrollTo({
          top: Math.max(
            0,
            window.scrollY + target.getBoundingClientRect().top - topOffset,
          ),
          behavior: "smooth",
        });
      }

      if (hash) {
        window.history.replaceState(null, "", hash);
      }

      window.setTimeout(() => {
        const correction = target.getBoundingClientRect().top - topOffset;
        if (Math.abs(correction) < 3) return;

        const currentSmoother = ScrollSmoother.get();
        if (currentSmoother) {
          currentSmoother.scrollTo(
            Math.max(0, currentSmoother.scrollTop() + correction),
            true,
          );
        } else {
          window.scrollTo({
            top: Math.max(0, window.scrollY + correction),
            behavior: "smooth",
          });
        }
      }, 900);
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
        router.push("/");
        runWhenReady(runScroll);
      } else if (isPageReady()) {
        runScroll();
      } else {
        runWhenReady(runScroll);
      }
    },
    [
      isPageReady,
      pathname,
      router,
      runWhenReady,
      scrollElementPrecisely,
    ],
  );

  const openProjectDetails = useCallback(
    (projectId: number) => {
      const dispatchOpen = () => {
        window.dispatchEvent(
          new CustomEvent("portfolio:open-project", {
            detail: { id: projectId },
          }),
        );
      };

      if (pathname !== "/my-projects") {
        router.push("/my-projects");
        runWhenReady(() => {
          if (!document.querySelector('[data-krypton-context="project"]')) {
            return false;
          }
          dispatchOpen();
          return true;
        });
        return;
      }

      dispatchOpen();
    },
    [pathname, router, runWhenReady],
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
          runWhenReady(openHome);
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
          "https://github.com/MrUnknownji",
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
      runWhenReady,
      scrollElementPrecisely,
      scrollToTarget,
    ],
  );

  return { handleLocalCommand };
}
