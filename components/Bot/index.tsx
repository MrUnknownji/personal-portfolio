"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as THREE from "three";
import gsap from "gsap";
import { chatWithBot } from "@/app/actions/chat";
import { useBotScene } from "./useBotScene";
import { useBotEyes, EyeState } from "./useBotEyes";
import { useBotInteractions } from "./useBotInteractions";
import { BotChat } from "./BotChat";
import { useBotCommands } from "./useBotCommands";

type KryptonContextMenu = {
  x: number;
  y: number;
  prompt: string;
  label: string;
} | null;

export default function Bot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [eyeState, setEyeState] = useState<EyeState>("open");
  const [activeSection, setActiveSection] = useState("home");
  const [activeProject, setActiveProject] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<KryptonContextMenu>(null);

  const mouseRef = useRef(new THREE.Vector2());
  const isHoveredRef = useRef(false);
  const isProcessingRef = useRef(false);
  const isCooldownRef = useRef(false);
  const chatOpenRef = useRef(false);
  const inputRef = useRef(input);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const nextBlinkTimeRef = useRef(2);
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const isGlobalModalOpenRef = useRef(false);

  const scheduleTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((item) => {
        return item !== timeout;
      });
      callback();
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const checkModal = () => {
      const isHidden =
        document.body.style.overflow === "hidden" ||
        document.body.style.cursor === "wait";

      setIsGlobalModalOpen(isHidden);
      isGlobalModalOpenRef.current = isHidden;
    };

    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    checkModal();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    isCooldownRef.current = isCooldown;
  }, [isCooldown]);

  const { eyeContextRef, eyeCanvasRef, eyeTextureRef, clockRef, robotRef } =
    useBotScene({
      containerRef,
      mouseRef,
      isHoveredRef,
      isProcessingRef,
      isCooldownRef,
      chatOpenRef,
      isGlobalModalOpenRef,
    });

  const { eyeStateRef } = useBotEyes({
    eyeContextRef,
    eyeCanvasRef,
    eyeTextureRef,
    eyeState,
    clockRef,
  });

  const {
    handleMouseEnter: interactionMouseEnter,
    handleMouseLeave: interactionMouseLeave,
    isRightClickingRef,
  } = useBotInteractions({
    containerRef,
    mouseRef,
    setEyeState,
    isProcessing,
    isCooldown,
    setChatOpen,
    isHoveredRef,
    robotRef,
    setBubbleText,
  });

  const { handleLocalCommand } = useBotCommands({
    activeProject,
    pathname,
    router,
  });

  useEffect(() => {
    const checkBlink = () => {
      if (isGlobalModalOpen) return;
      const t = clockRef.current.getElapsedTime();
      if (
        eyeState === "open" &&
        !isRightClickingRef.current &&
        !isProcessing &&
        !isCooldown &&
        t > nextBlinkTimeRef.current
      ) {
        setEyeState("closed");
        gsap.delayedCall(0.15, () => {
          if (
            eyeStateRef.current === "closed" &&
            !isRightClickingRef.current &&
            !isProcessing &&
            !isCooldown
          ) {
            setEyeState("open");
          }
          nextBlinkTimeRef.current = t + 3 + Math.random() * 4;
        });
      }
    };

    gsap.ticker.add(checkBlink);
    return () => gsap.ticker.remove(checkBlink);
  }, [
    clockRef,
    eyeState,
    eyeStateRef,
    isCooldown,
    isGlobalModalOpen,
    isProcessing,
    isRightClickingRef,
  ]);

  const handleMouseEnter = () => {
    interactionMouseEnter();
  };

  const handleMouseLeave = () => {
    interactionMouseLeave();
    if (!chatOpen && !isProcessing && !isCooldown) {
      setBubbleText(null);
    }
  };

  const openChat = (message = "Ask me about projects, skills, or hiring.") => {
    setChatOpen(true);
    isHoveredRef.current = true;
    setEyeState("happy");
    setBubbleText(message);
  };

  const closeChat = () => {
    setEyeState("sad");
    setBubbleText("Okay, I will stay nearby.");
    scheduleTimeout(() => {
      setChatOpen(false);
      isHoveredRef.current = false;
      setBubbleText(null);
      if (eyeStateRef.current === "sad") setEyeState("open");
    }, 1500);
  };

  const handleContainerClick = () => {
    if (chatOpen) {
      closeChat();
      return;
    }

    openChat();
  };

  const handleCloseChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeChat();
  };

  const handleDoubleClick = () => {
    setEyeState("angry");
    setBubbleText("Hey! Personal space! 🤖");
    scheduleTimeout(() => {
      setBubbleText(null);
      setEyeState("open");
    }, 2000);
  };

  const runPrompt = async (prompt: string) => {
    if (!prompt.trim() || isProcessing) return;

    const userMsg = prompt.trim();
    setInput("");
    setIsProcessing(true);
    setEyeState("thinking");
    setBubbleText("Thinking...");

    try {
      const response =
        handleLocalCommand(userMsg) || (await chatWithBot(userMsg));
      setBubbleText(response);

      const lowerResp = response.toLowerCase();
      if (
        lowerResp.includes("sorry") ||
        lowerResp.includes("unfortunately") ||
        lowerResp.includes("sad") ||
        lowerResp.includes("apologize") ||
        lowerResp.includes("can't") ||
        lowerResp.includes("cannot")
      ) {
        setEyeState("sad");
      } else if (
        lowerResp.includes("wow") ||
        lowerResp.includes("awesome") ||
        lowerResp.includes("great") ||
        lowerResp.includes("cool")
      ) {
        setEyeState("surprised");
      } else if (
        lowerResp.includes("love") ||
        lowerResp.includes("happy") ||
        lowerResp.includes("glad")
      ) {
        setEyeState("happy");
      } else {
        setEyeState("open");
      }
    } catch {
      setBubbleText("I could not process that request.");
      setEyeState("error");
    } finally {
      setIsProcessing(false);
      setIsCooldown(true);
      scheduleTimeout(() => {
        setIsCooldown(false);
        if (["happy", "sad", "surprised"].includes(eyeStateRef.current)) {
          setEyeState("open");
        }
        if (!isHoveredRef.current && !inputRef.current) {
          setChatOpen(false);
        }
      }, 3000);
    }
  };

  const handleSend = async () => {
    await runPrompt(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    void runPrompt(suggestion);
  };

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const contextTarget = target?.closest<HTMLElement>(
        "[data-krypton-context]",
      );

      if (!contextTarget) return;

      event.preventDefault();
      const title =
        contextTarget.dataset.kryptonTitle ||
        contextTarget.dataset.kryptonContext ||
        "this section";
      const summary =
        contextTarget.dataset.kryptonSummary ||
        `Summarize ${title} from Sandeep's portfolio.`;

      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        label: `Ask Krypton about ${title}`,
        prompt: `Give me a concise summary of this portfolio item: ${summary}`,
      });
    };

    const handleClick = () => setContextMenu(null);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const sections = ["about", "contact"];
    const updateActiveSection = () => {
      if (pathname === "/my-projects") {
        setActiveSection("projects");
        return;
      }

      const visibleSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.45 && rect.bottom >= 160;
      });

      setActiveSection(visibleSection || "home");
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [pathname]);

  useEffect(() => {
    const handleProjectContext = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: number; title: string }>;
      setActiveProject(customEvent.detail);
    };
    const clearProjectContext = () => setActiveProject(null);

    window.addEventListener("portfolio:project-context", handleProjectContext);
    window.addEventListener(
      "portfolio:project-context-clear",
      clearProjectContext,
    );
    return () => {
      window.removeEventListener(
        "portfolio:project-context",
        handleProjectContext,
      );
      window.removeEventListener(
        "portfolio:project-context-clear",
        clearProjectContext,
      );
    };
  }, []);

  const suggestions = useMemo(() => {
    if (activeProject) {
      return [
        `Summarize ${activeProject.title}`,
        "Open live demo",
        "Open GitHub",
      ];
    }

    if (activeSection === "projects") {
      return ["Open BidStrike", "Open AudioVibes", "Open GitHub"];
    }

    if (activeSection === "about") {
      return ["Summarize Sandeep", "Show skills", "Go to contact"];
    }

    if (activeSection === "contact") {
      return ["How can I hire Sandeep?", "Show projects", "Go to top"];
    }

    return ["Show projects", "Summarize Sandeep", "Go to contact"];
  }, [activeProject, activeSection]);

  const isMinimized = !chatOpen && !isHoveredRef.current;
  const menuLeft =
    typeof window === "undefined" || !contextMenu
      ? 0
      : Math.min(contextMenu.x, window.innerWidth - 240);
  const menuTop =
    typeof window === "undefined" || !contextMenu
      ? 0
      : Math.min(contextMenu.y, window.innerHeight - 56);

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] ${
        chatOpen
          ? "bottom-20 right-0 sm:bottom-30"
          : "-bottom-6 -right-20 sm:-bottom-10 sm:-right-26"
      }`}
      style={{
        pointerEvents: isMinimized && !contextMenu ? "none" : "auto",
        display: isGlobalModalOpen ? "none" : "block",
        opacity: isGlobalModalOpen ? 0 : 1,
      }}
      onMouseEnter={
        !isMinimized && !isGlobalModalOpen ? handleMouseEnter : undefined
      }
      onMouseLeave={
        !isMinimized && !isGlobalModalOpen ? handleMouseLeave : undefined
      }
    >
      {chatOpen && (
        <div className="absolute -bottom-[200px] -right-[200px] w-[150%] h-[150%] bg-transparent -z-10" />
      )}

      <BotChat
        chatOpen={chatOpen}
        bubbleText={bubbleText}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleCloseChat={handleCloseChat}
        isProcessing={isProcessing}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      <div
        ref={containerRef}
        className="w-full h-full"
        onDoubleClick={handleDoubleClick}
        onClick={handleContainerClick}
      />

      {isMinimized && (
        <div
          className="absolute bottom-16 right-16 sm:bottom-28 sm:right-32 w-24 h-24 sm:w-32 sm:h-32 cursor-pointer"
          style={{ pointerEvents: "auto" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
          onClick={handleContainerClick}
        />
      )}

      {contextMenu && (
        <div
          className="fixed z-60 min-w-48 rounded-lg border border-primary/30 bg-card/95 p-1.5 shadow-xl shadow-black/30 backdrop-blur"
          style={{
            left: menuLeft,
            top: menuTop,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-dark"
            onClick={() => {
              setContextMenu(null);
              openChat("Reading that context...");
              void runPrompt(contextMenu.prompt);
            }}
          >
            {contextMenu.label}
          </button>
        </div>
      )}
    </div>
  );
}
