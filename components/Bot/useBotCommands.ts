"use client";

import { useCallback } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { selectedProjects as projects } from "@/data/data";

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
        project.technologies.some((tech) => {
          return normalizedPrompt.includes(tech.toLowerCase());
        })
      );
    });
  }, []);

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
        window.setTimeout(dispatchOpen, 900);
        return;
      }

      dispatchOpen();
    },
    [pathname, router],
  );

  const scrollToTarget = useCallback(
    (selector: string, hash: string) => {
      const runScroll = () => {
        const target = document.querySelector(selector);
        if (!target) return false;

        const smoother = ScrollSmoother.get();
        if (smoother) {
          smoother.paused(false);
          smoother.scrollTo(target, true, "top 110px");
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        window.history.replaceState(null, "", hash);
        window.setTimeout(() => ScrollTrigger.refresh(), 350);
        return true;
      };

      if (pathname !== "/") {
        router.push("/");

        let attempts = 0;
        const retryScroll = () => {
          attempts += 1;
          if (!runScroll() && attempts < 20) {
            window.setTimeout(retryScroll, 100);
          }
        };

        window.setTimeout(retryScroll, 350);
        return;
      }

      runScroll();
    },
    [pathname, router],
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
        const smoother = ScrollSmoother.get();
        if (pathname !== "/") {
          router.push("/");
          window.setTimeout(() => {
            const currentSmoother = ScrollSmoother.get();
            if (currentSmoother) currentSmoother.scrollTo(0, true);
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }, 350);
        } else if (smoother) {
          smoother.scrollTo(0, true);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return "Taking you back to the home section.";
      }

      if (/\bskills?\b/.test(normalizedPrompt)) {
        scrollToTarget("#skills", "#skills");
        return "Opening the skills section.";
      }

      if (/\b(about|bio|background|journey)\b/.test(normalizedPrompt)) {
        scrollToTarget("#about", "#about");
        return /\bskills?\b/.test(normalizedPrompt)
          ? "Opening the skills section."
          : "Opening the About section.";
      }

      if (/\b(contact|hire|email|reach)\b/.test(normalizedPrompt)) {
        scrollToTarget("#contact", "#contact");
        return "Opening the Contact section.";
      }

      if (/\b(projects?|work|portfolio)\b/.test(normalizedPrompt)) {
        router.push("/my-projects");
        return "Opening the projects page.";
      }

      if (/\b(source|repo|code)\b/.test(normalizedPrompt)) {
        const project = requestedProject;
        if (project?.githubLink) {
          window.open(project.githubLink, "_blank", "noopener,noreferrer");
          return `Opening ${project.title} source code.`;
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
      findProject,
      openProjectDetails,
      pathname,
      router,
      scrollToTarget,
    ],
  );

  return { handleLocalCommand };
}
