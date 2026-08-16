"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { chatWithBot } from "@/app/actions/chat";
import { useBotInteractions } from "./useBotInteractions";
import { BotChat } from "./BotChat";
import { useBotCommands } from "./useBotCommands";
import type { EyeState } from "./types";
import { useModalState } from "@/components/modalState";

type KryptonContextMenu = {
  x: number;
  y: number;
  prompt: string;
  label: string;
} | null;

type BotVisualMode = "svg" | "three";
const BOT_3D_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const subscribeToBotCapability = (callback: () => void) => {
  const query = window.matchMedia(BOT_3D_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const getBotCapability = () => window.matchMedia(BOT_3D_QUERY).matches;

let threeBotVisualPromise: ReturnType<typeof importThreeBotVisual> | null =
  null;

function importThreeBotVisual() {
  return import("./ThreeBotVisual");
}

function loadThreeBotVisual() {
  threeBotVisualPromise ??= importThreeBotVisual();
  return threeBotVisualPromise;
}

const ThreeBotVisual = dynamic(loadThreeBotVisual, {
  ssr: false,
  loading: () => null,
});

function SvgBotVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute bottom-[10%] left-1/2 h-5 w-28 -translate-x-1/2 scale-y-50 rounded-[50%] bg-primary/35 blur-xl sm:bottom-[11%] sm:w-36"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[11%] left-1/2 h-px w-16 -translate-x-1/2 bg-primary/60 blur-[2px] sm:bottom-[12%] sm:w-20"
      />
      <Image
        src="/bot.png"
        alt="Krypton assistant"
        width={300}
        height={300}
        className="relative z-10 size-56 object-contain drop-shadow-[0_14px_18px_rgba(255,122,26,0.14)] sm:size-72"
      />
    </div>
  );
}

export default function Bot({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { activeProject, isModalOpen: isGlobalModalOpen } = useModalState();
  const [chatOpen, setChatOpen] = useState(initiallyOpen);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(
    initiallyOpen ? "Ask me about projects, skills, or hiring." : null,
  );
  const [eyeState, setEyeState] = useState<EyeState>("open");
  const [contextMenu, setContextMenu] = useState<KryptonContextMenu>(null);
  const canUse3D = useSyncExternalStore(
    subscribeToBotCapability,
    getBotCapability,
    () => false,
  );
  const [sceneUnavailable, setSceneUnavailable] = useState(false);
  const [hasVisualIntent, setHasVisualIntent] = useState(false);
  const [isBotHovered, setIsBotHovered] = useState(false);

  const isHoveredRef = useRef(false);
  const eyeStateRef = useRef(eyeState);
  const inputRef = useRef(input);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const hasScheduledThreePreloadRef = useRef(false);
  const isGlobalModalOpenRef = useRef(false);
  const handleSceneUnavailable = useCallback(() => {
    setSceneUnavailable(true);
  }, []);
  const handleSceneReady = useCallback(() => undefined, []);

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

  const visualMode: BotVisualMode =
    canUse3D && hasVisualIntent && !sceneUnavailable ? "three" : "svg";

  useEffect(() => {
    isGlobalModalOpenRef.current = isGlobalModalOpen;
  }, [isGlobalModalOpen]);

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
    if (!chatOpen && !isProcessing && !isCooldown) {
      setBubbleText("Click me to chat.");
    }
    if (canUse3D && !hasScheduledThreePreloadRef.current) {
      hasScheduledThreePreloadRef.current = true;
      const preload = () => void loadThreeBotVisual();
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(preload, { timeout: 250 });
      } else {
        scheduleTimeout(preload, 100);
      }
    }
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
      className={`fixed z-50 transition-[width,height,bottom,right,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        chatOpen
          ? "bottom-16 right-0 h-[320px] w-[min(320px,100vw)] sm:bottom-20 sm:size-[420px]"
          : "bottom-5 right-5 size-16"
      }`}
      style={{
        pointerEvents: "auto",
        display: isGlobalModalOpen ? "none" : "block",
        opacity: isGlobalModalOpen ? 0 : 1,
      }}
      onMouseEnter={
        !isGlobalModalOpen ? handleMouseEnter : undefined
      }
      onMouseLeave={
        !isGlobalModalOpen ? handleMouseLeave : undefined
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
        className={`group relative z-10 flex h-full w-full items-center justify-center ${visualMode === "svg" ? "cursor-pointer" : ""}`}
        style={{ pointerEvents: "auto" }}
      >
        {chatOpen ? <SvgBotVisual /> : (
          <Image src="/bot-mark.svg" alt="" width={42} height={42} className="size-11" />
        )}
        {chatOpen && visualMode === "three" && (
          <ThreeBotVisual
            containerRef={containerRef}
            active={isBotHovered || isProcessing || isCooldown}
            eyeState={eyeState}
            isGlobalModalOpenRef={isGlobalModalOpenRef}
            onReady={handleSceneReady}
            onUnavailable={handleSceneUnavailable}
          />
        )}
        <button
          type="button"
          className={`absolute inset-0 z-20 rounded-full focus-visible:outline-2 focus-visible:outline-primary ${chatOpen ? "focus-visible:outline-offset-[-16px]" : "border border-primary/40 bg-card/20 shadow-[0_8px_30px_rgba(0,0,0,0.35)] focus-visible:outline-offset-4"}`}
          onDoubleClick={handleDoubleClick}
          onClick={handleContainerClick}
          aria-label={chatOpen ? "Close Krypton assistant" : "Open Krypton assistant"}
          aria-expanded={chatOpen}
        />
      </div>

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
