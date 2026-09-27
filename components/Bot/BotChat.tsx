"use client";

import type { FormEvent, RefObject } from "react";
import KryptonMark from "./KryptonMark";

export type BotMessage = { id: number; role: "assistant" | "user"; text: string };

type BotChatProps = {
  messages: BotMessage[];
  input: string;
  inputRef: RefObject<HTMLInputElement | null>;
  messagesRef: RefObject<HTMLDivElement | null>;
  isProcessing: boolean;
  suggestions: string[];
  onInput: (value: string) => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onSuggestion: (suggestion: string) => void;
};

export default function BotChat({ messages, input, inputRef, messagesRef, isProcessing, suggestions, onInput, onSend, onClose, onSuggestion }: BotChatProps) {
  return <>
    <div className="krypton-panel-head">
      <KryptonMark />
      <div><span>PORTFOLIO ASSISTANT</span><strong>KRYPTON<span>.</span></strong></div>
      <button type="button" onClick={onClose} aria-label="Close chat">CLOSE ×</button>
    </div>
    <div className="krypton-panel-intro">A quick route through the work. Ask a question or choose a starting point.</div>
    <div className="krypton-messages" ref={messagesRef} role="log" aria-live="polite" aria-label="Krypton conversation">
      {messages.map((message) => <div className={`krypton-message krypton-message-${message.role}`} key={message.id}>
        <span>{message.role === "assistant" ? "K /" : "YOU /"}</span>
        <p>{message.text}</p>
      </div>)}
      {isProcessing && <div className="krypton-message krypton-message-assistant krypton-thinking"><span>K /</span><p>Looking through the work<span aria-hidden="true">…</span></p></div>}
    </div>
    <div className="krypton-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => onSuggestion(suggestion)} disabled={isProcessing}>{suggestion} <span aria-hidden="true">↗</span></button>)}</div>
    <form className="krypton-form" onSubmit={onSend}>
      <input ref={inputRef} type="text" aria-label="Ask Krypton about Sandeep's portfolio" maxLength={500} value={input} onChange={(event) => onInput(event.target.value)} placeholder="Ask about projects, skills..." disabled={isProcessing} />
      <button type="submit" aria-label="Send message" disabled={isProcessing || !input.trim()}>SEND ↗</button>
    </form>
  </>;
}
