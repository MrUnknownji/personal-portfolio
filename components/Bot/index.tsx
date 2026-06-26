"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type BotVisualMode = "svg" | "three";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function SvgBotVisual({
  active,
  mood,
}: {
  active: boolean;
  mood: EyeState;
}) {
  const happy = mood === "happy" || active;
  const thinking = mood === "thinking";
  const sad = mood === "sad" || mood === "error";

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 160 160"
        className="h-28 w-28 sm:h-36 sm:w-36 drop-shadow-[0_0_24px_rgba(255,146,51,0.35)] transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label="Krypton assistant"
      >
        <defs>
          <filter id="bot-eye-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bot-shell" x1="28" y1="20" x2="132" y2="144">
            <stop stopColor="#2a2623" />
            <stop offset="1" stopColor="#090807" />
          </linearGradient>
          <linearGradient id="bot-accent" x1="40" y1="28" x2="126" y2="132">
            <stop stopColor="#ffcc66" />
            <stop offset="0.48" stopColor="#ff9233" />
            <stop offset="1" stopColor="#d04438" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="58" fill="url(#bot-shell)" stroke="#ff9233" strokeWidth="3" />
        <path
          d="M42 88c6 28 24 43 38 43s32-15 38-43"
          fill="none"
          stroke="url(#bot-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.45"
        />
        <rect x="38" y="48" width="84" height="54" rx="24" fill="#050505" stroke="#3a3028" strokeWidth="3" />
        <g filter="url(#bot-eye-glow)">
          {thinking ? (
            <>
            <circle cx="62" cy="75" r="5" fill="#ff9233">
              <animate attributeName="cy" values="75;66;75" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="75" r="5" fill="#ff9233">
              <animate attributeName="cy" values="75;66;75" dur="0.9s" begin="0.12s" repeatCount="indefinite" />
            </circle>
            <circle cx="98" cy="75" r="5" fill="#ff9233">
              <animate attributeName="cy" values="75;66;75" dur="0.9s" begin="0.24s" repeatCount="indefinite" />
            </circle>
            </>
          ) : sad ? (
            <>
            <path d="M58 76l18-8" stroke="#ff9233" strokeWidth="5" strokeLinecap="round" />
            <path d="M102 76l-18-8" stroke="#ff9233" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : happy ? (
            <>
            <path d="M56 76c6-12 18-12 24 0" stroke="#ff9233" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M80 76c6-12 18-12 24 0" stroke="#ff9233" strokeWidth="5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="66" cy="75" r="12" fill="#ff9233" fillOpacity="0.22" stroke="#ff9233" strokeWidth="5" />
              <circle cx="94" cy="75" r="12" fill="#ff9233" fillOpacity="0.22" stroke="#ff9233" strokeWidth="5" />
              <circle cx="66" cy="75" r="4" fill="#ffcc66" />
              <circle cx="94" cy="75" r="4" fill="#ffcc66" />
            </>
          )}
        </g>
        <circle cx="80" cy="118" r="9" fill="url(#bot-accent)" />
        <path d="M80 30v-13" stroke="#ff9233" strokeWidth="5" strokeLinecap="round" />
        <circle cx="80" cy="13" r="6" fill="#ff9233" />
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
  const [activeSection, setActiveSection] = useState("home");
  const [activeProject, setActiveProject] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<KryptonContextMenu>(null);
  const [visualMode, setVisualMode] = useState<BotVisualMode>("svg");
  const [canUse3D, setCanUse3D] = useState(false);
  const [idleReadyFor3D, setIdleReadyFor3D] = useState(false);
  const [hasVisualIntent, setHasVisualIntent] = useState(false);

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
  const handleSceneUnavailable = useCallback(() => {
    setCanUse3D(false);
    setVisualMode("svg");
  }, []);

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

    if (isMobile || reduceMotion || !supportsWebGL()) {
      setCanUse3D(false);
      setVisualMode("svg");
      return;
    }

    setCanUse3D(true);

    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | null = null;
    const timeoutId = window.setTimeout(() => setIdleReadyFor3D(true), 3000);

    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(() => setIdleReadyFor3D(true), {
        timeout: 2500,
      });
    }

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== null && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    setVisualMode(canUse3D && idleReadyFor3D && hasVisualIntent ? "three" : "svg");
  }, [canUse3D, hasVisualIntent, idleReadyFor3D]);

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
      enabled: visualMode === "three",
      onUnavailable: handleSceneUnavailable,
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
    enabled: visualMode === "three",
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
    if (visualMode === "three") {
      interactionMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    interactionMouseLeave();
    if (!chatOpen && !isProcessing && !isCooldown) {
      setBubbleText(null);
    }
  };

  const openChat = (message = "Ask me about projects, skills, or hiring.") => {
    setHasVisualIntent(true);
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
        className={`group relative w-full h-full ${visualMode === "svg" ? "cursor-pointer" : ""}`}
        onDoubleClick={handleDoubleClick}
        onClick={handleContainerClick}
      >
        {visualMode === "svg" && (
          <SvgBotVisual active={chatOpen || isHoveredRef.current} mood={eyeState} />
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
