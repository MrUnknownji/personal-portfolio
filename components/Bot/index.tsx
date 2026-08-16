"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { chatWithBot } from "@/app/actions/chat";
import { BotChat } from "./BotChat";
import { useBotCommands } from "./useBotCommands";
import { useModalState } from "@/components/modalState";

type KryptonContextMenu = {
  x: number;
  y: number;
  prompt: string;
  label: string;
} | null;

function BotVisual() {
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
  const [contextMenu, setContextMenu] = useState<KryptonContextMenu>(null);

  const isHoveredRef = useRef(false);
  const inputRef = useRef(input);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

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
    inputRef.current = input;
  }, [input]);

  const { handleLocalCommand } = useBotCommands({
    activeProject,
    pathname,
    router,
  });

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (!chatOpen && !isProcessing && !isCooldown) {
      setBubbleText("Click me to chat.");
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (!chatOpen && !isProcessing && !isCooldown) {
      setBubbleText(null);
    }
  };

  const openChat = (message = "Ask me about projects, skills, or hiring.") => {
    setChatOpen(true);
    setBubbleText(message);
  };

  const closeChat = () => {
    setBubbleText("Okay, I will stay nearby.");
    scheduleTimeout(() => {
      setChatOpen(false);
      setBubbleText(null);
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
    setBubbleText("Hey! Personal space! 🤖");
    scheduleTimeout(() => {
      setBubbleText(null);
    }, 2000);
  };

  const runPrompt = async (prompt: string) => {
    if (!prompt.trim() || isProcessing) return;

    const userMsg = prompt.trim();
    setInput("");
    setIsProcessing(true);
    setBubbleText("Thinking...");

    try {
      const response =
        handleLocalCommand(userMsg) || (await chatWithBot(userMsg));
      setBubbleText(response);
    } catch {
      setBubbleText("I could not process that request.");
    } finally {
      setIsProcessing(false);
      setIsCooldown(true);
      scheduleTimeout(() => {
        setIsCooldown(false);
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
        className="group relative z-10 flex h-full w-full cursor-pointer items-center justify-center"
        style={{ pointerEvents: "auto" }}
      >
        {chatOpen ? <BotVisual /> : (
          <Image src="/bot-mark.svg" alt="" width={42} height={42} className="size-11" />
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
