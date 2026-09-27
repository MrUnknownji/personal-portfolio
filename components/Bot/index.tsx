"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { chatWithBot } from "@/app/actions/chat";
import { useModalState } from "@/components/modalState";
import BotChat, { type BotMessage } from "./BotChat";
import KryptonMark from "./KryptonMark";
import { useBotCommands } from "./useBotCommands";

type ContextPrompt = { x: number; y: number; prompt: string; label: string } | null;

export default function Bot({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { activeProject, isModalOpen } = useModalState();
  const { handleLocalCommand } = useBotCommands({ activeProject, pathname, router });
  const [chatOpen, setChatOpen] = useState(initiallyOpen);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([{ id: 0, role: "assistant", text: "Hi, I’m Krypton. I can help you find a project, a skill, or the way to get in touch." }]);
  const [contextPrompt, setContextPrompt] = useState<ContextPrompt>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const busyRef = useRef(false);
  const closingRef = useRef(false);

  const addMessage = (role: BotMessage["role"], text: string) => {
    setMessages((current) => [...current, { id: nextId.current++, role, text }]);
  };

  const closeChat = useCallback(async () => {
    if (closingRef.current || !chatOpen) return;
    closingRef.current = true;
    const finish = () => {
      setChatOpen(false);
      closingRef.current = false;
      launcherRef.current?.focus();
    };
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    try {
      const { animate } = await import("animejs");
      animate(panel, { opacity: [1, 0], translateY: [0, 18], duration: 240, ease: "inQuad", onComplete: finish });
    } catch { finish(); }
  }, [chatOpen]);

  useEffect(() => {
    const launcher = launcherRef.current;
    if (!launcher || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    void import("animejs").then(({ animate }) => {
      const mark = launcher.querySelector("svg");
      if (!cancelled && mark) animate(mark, { opacity: [0, 1], scale: [.75, 1], duration: 420, ease: "outCubic" });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!chatOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusFrame = requestAnimationFrame(() => inputRef.current?.focus());
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      panel.style.opacity = "1";
      panel.style.transform = "none";
      return () => cancelAnimationFrame(focusFrame);
    }
    let cancelled = false;
    void import("animejs").then(({ animate }) => {
      if (!cancelled) animate(panel, { opacity: [0, 1], translateY: [20, 0], scale: [.98, 1], duration: 430, ease: "outCubic" });
    });
    return () => { cancelled = true; cancelAnimationFrame(focusFrame); };
  }, [chatOpen]);

  useEffect(() => {
    const log = messagesRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
    if (messages.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const latest = log.querySelector(".krypton-message:last-child");
    if (!latest) return;
    let cancelled = false;
    void import("animejs").then(({ animate }) => {
      if (!cancelled) animate(latest, { opacity: [0, 1], translateY: [8, 0], duration: 270, ease: "outCubic" });
    });
    return () => { cancelled = true; };
  }, [messages, chatOpen]);

  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-krypton-context]");
      if (!target) return;
      event.preventDefault();
      const title = target.dataset.kryptonTitle || target.dataset.kryptonContext || "this section";
      const summary = target.dataset.kryptonSummary || `Summarize ${title} from Sandeep's portfolio.`;
      setContextPrompt({ x: event.clientX, y: event.clientY, label: `Ask Krypton about ${title}`, prompt: `Give me a concise summary of this portfolio item: ${summary}` });
    };
    const dismiss = () => setContextPrompt(null);
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("click", dismiss);
    return () => { window.removeEventListener("contextmenu", onContextMenu); window.removeEventListener("click", dismiss); };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (contextPrompt) setContextPrompt(null);
      else if (chatOpen) void closeChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chatOpen, contextPrompt, closeChat]);

  const runPrompt = async (prompt: string) => {
    const question = prompt.trim();
    if (!question || busyRef.current) return;
    busyRef.current = true;
    setChatOpen(true);
    setInput("");
    addMessage("user", question);
    setIsProcessing(true);
    try {
      const answer = handleLocalCommand(question) || await chatWithBot(question);
      addMessage("assistant", answer);
    } catch {
      addMessage("assistant", "I could not answer that just now. Try asking about a project or use the contact section.");
    } finally {
      busyRef.current = false;
      setIsProcessing(false);
    }
  };

  const suggestions = useMemo(() => activeProject
    ? [`Summarize ${activeProject.title}`, "Open live demo", "Open GitHub"]
    : ["Show projects", "Summarize BidStrike", "Summarize Mirror Wallpapers", "Go to contact"], [activeProject]);

  const onSend = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void runPrompt(input); };
  const contextLeft = contextPrompt ? Math.max(12, Math.min(contextPrompt.x, window.innerWidth - 270)) : 0;
  const contextTop = contextPrompt ? Math.max(12, Math.min(contextPrompt.y, window.innerHeight - 60)) : 0;

  return <div className="krypton-root" style={{ display: isModalOpen ? "none" : undefined }}>
    {chatOpen && <div className="krypton-panel" ref={panelRef} role="region" aria-label="Krypton portfolio assistant">
      <BotChat messages={messages} input={input} inputRef={inputRef} messagesRef={messagesRef} isProcessing={isProcessing} suggestions={suggestions} onInput={setInput} onSend={onSend} onClose={() => void closeChat()} onSuggestion={(suggestion) => void runPrompt(suggestion)} />
    </div>}
    <button ref={launcherRef} type="button" className="krypton-launcher" onClick={() => chatOpen ? void closeChat() : setChatOpen(true)} aria-label={chatOpen ? "Close Krypton assistant" : "Ask about Sandeep's work"} aria-expanded={chatOpen}>
      <KryptonMark />
      {!chatOpen && <span>Ask about my work</span>}
    </button>
    {contextPrompt && <div className="krypton-context" style={{ left: contextLeft, top: contextTop }} onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => { const prompt = contextPrompt.prompt; setContextPrompt(null); void runPrompt(prompt); }}>{contextPrompt.label} ↗</button></div>}
  </div>;
}
