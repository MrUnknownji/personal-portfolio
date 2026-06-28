"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { chatWithBot } from "@/app/actions/chat";
import { useBotInteractions } from "./useBotInteractions";
import { BotChat } from "./BotChat";
import { useBotCommands } from "./useBotCommands";
import type { EyeState } from "./types";

type KryptonContextMenu = {
  x: number;
  y: number;
  prompt: string;
  label: string;
} | null;

type BotVisualMode = "svg" | "three";

const ThreeBotVisual = dynamic(() => import("./ThreeBotVisual"), {
  ssr: false,
  loading: () => null,
});

function SvgBotVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        className="h-28 w-28 sm:h-36 sm:w-36"
        role="img"
        aria-label="Krypton assistant"
      >
        <defs>
          <linearGradient id="head-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#273549" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="100%" stopColor="#020408" />
          </linearGradient>
          <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffa552" />
            <stop offset="100%" stopColor="#ff9233" />
          </linearGradient>
        </defs>
        <g id="bot-head">
          <rect
            x="194"
            y="95"
            width="12"
            height="24"
            rx="6"
            fill="url(#accent-grad)"
          />
          <rect
            x="62"
            y="170"
            width="18"
            height="60"
            rx="9"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
          />
          <rect
            x="56"
            y="185"
            width="6"
            height="30"
            rx="3"
            fill="url(#accent-grad)"
          />
          <rect
            x="320"
            y="170"
            width="18"
            height="60"
            rx="9"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
          />
          <rect
            x="338"
            y="185"
            width="6"
            height="30"
            rx="3"
            fill="url(#accent-grad)"
          />
          <rect
            x="80"
            y="115"
            width="240"
            height="170"
            rx="60"
            fill="url(#head-grad)"
            stroke="#334155"
            strokeWidth="2"
          />
          <path
            d="M 110,135 C 160,126 240,126 290,135 C 295,136 290,142 250,140 C 190,137 130,140 110,135 Z"
            fill="#ffffff"
            opacity="0.08"
          />
          <rect
            x="105"
            y="145"
            width="190"
            height="110"
            rx="45"
            fill="url(#visor-grad)"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <rect
            x="108"
            y="148"
            width="184"
            height="104"
            rx="42"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            opacity="0.3"
          />
          <g id="eyes">
            <rect
              x="140"
              y="185"
              width="36"
              height="20"
              rx="10"
              fill="url(#accent-grad)"
            />
            <circle cx="149" cy="191" r="3.5" fill="#ffffff" opacity="0.9" />
            <rect
              x="224"
              y="185"
              width="36"
              height="20"
              rx="10"
              fill="url(#accent-grad)"
            />
            <circle cx="233" cy="191" r="3.5" fill="#ffffff" opacity="0.9" />
            <rect
              x="230"
              y="175"
              width="24"
              height="3"
              rx="1.5"
              fill="url(#accent-grad)"
              opacity="0.8"
            />
          </g>
          <path
            d="M 210,146 C 245,146 290,175 290,210 C 290,185 245,146 210,146 Z"
            fill="#ffffff"
            opacity="0.03"
          />
        </g>
      </svg>
    </div>
  );
}

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
  const [activeProject, setActiveProject] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<KryptonContextMenu>(null);
  const [visualMode, setVisualMode] = useState<BotVisualMode>("svg");
  const [canUse3D, setCanUse3D] = useState(false);
  const [hasVisualIntent, setHasVisualIntent] = useState(false);
  const [isThreeReady, setIsThreeReady] = useState(false);
  const [isBotHovered, setIsBotHovered] = useState(false);

  const isHoveredRef = useRef(false);
  const eyeStateRef = useRef(eyeState);
  const inputRef = useRef(input);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const isGlobalModalOpenRef = useRef(false);
  const handleSceneUnavailable = useCallback(() => {
    setCanUse3D(false);
    setVisualMode("svg");
    setIsThreeReady(false);
  }, []);
  const handleSceneReady = useCallback(() => setIsThreeReady(true), []);

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
    const isMobile =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isMobile || reduceMotion) {
      setCanUse3D(false);
      setVisualMode("svg");
      return;
    }

    setCanUse3D(true);
  }, []);

  useEffect(() => {
    const nextMode = canUse3D && hasVisualIntent ? "three" : "svg";
    setVisualMode(nextMode);
    if (nextMode === "svg") setIsThreeReady(false);
  }, [canUse3D, hasVisualIntent]);

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
    eyeStateRef.current = eyeState;
  }, [eyeState]);

  const {
    handleMouseEnter: interactionMouseEnter,
    handleMouseLeave: interactionMouseLeave,
    isRightClickingRef,
  } = useBotInteractions({
    containerRef,
    setEyeState,
    isProcessing,
    isCooldown,
    isHoveredRef,
    setBubbleText,
    enabled: visualMode === "three",
  });

  const { handleLocalCommand } = useBotCommands({
    activeProject,
    pathname,
    router,
  });

  useEffect(() => {
    if (
      visualMode !== "three" ||
      isGlobalModalOpen ||
      eyeState !== "open" ||
      isRightClickingRef.current ||
      isProcessing ||
      isCooldown
    ) {
      return;
    }

    const blinkTimeout = window.setTimeout(
      () => {
        if (
          eyeStateRef.current !== "open" ||
          isRightClickingRef.current ||
          isProcessing ||
          isCooldown
        ) {
          return;
        }

        setEyeState("closed");
        scheduleTimeout(() => {
          if (
            eyeStateRef.current === "closed" &&
            !isRightClickingRef.current &&
            !isProcessing &&
            !isCooldown
          ) {
            setEyeState("open");
          }
        }, 150);
      },
      3000 + Math.random() * 4000,
    );

    return () => window.clearTimeout(blinkTimeout);
  }, [
    eyeState,
    isCooldown,
    isGlobalModalOpen,
    isProcessing,
    isRightClickingRef,
    visualMode,
  ]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setIsBotHovered(true);
    if (visualMode === "three") {
      interactionMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsBotHovered(false);
    interactionMouseLeave();
    if (!chatOpen && !isProcessing && !isCooldown) {
      setBubbleText(null);
    }
  };

  const openChat = (message = "Ask me about projects, skills, or hiring.") => {
    setHasVisualIntent(true);
    setChatOpen(true);
    setEyeState("happy");
    setBubbleText(message);
  };

  const closeChat = () => {
    setEyeState("sad");
    setBubbleText("Okay, I will stay nearby.");
    scheduleTimeout(() => {
      setChatOpen(false);
      setBubbleText(null);
      if (eyeStateRef.current === "sad") setEyeState("open");
    }, 1500);
  };

  const handleContainerClick = () => {
    setHasVisualIntent(true);
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

    return ["Show projects", "Summarize Sandeep", "Go to contact"];
  }, [activeProject]);

  const isMinimized = !chatOpen && !isBotHovered;
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
        className={`group relative z-10 w-full h-full ${visualMode === "svg" ? "cursor-pointer" : ""}`}
        onDoubleClick={handleDoubleClick}
        onClick={handleContainerClick}
      >
        {(visualMode === "svg" || !isThreeReady) && (
          <SvgBotVisual />
        )}
        {visualMode === "three" && (
          <ThreeBotVisual
            containerRef={containerRef}
            active={isBotHovered || isProcessing || isCooldown}
            eyeState={eyeState}
            isGlobalModalOpenRef={isGlobalModalOpenRef}
            onReady={handleSceneReady}
            onUnavailable={handleSceneUnavailable}
          />
        )}
      </div>

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
          className="fixed z-60 min-w-48 rounded-lg border border-primary/30 bg-card p-1.5"
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
