import React from "react";
import { IoSend, IoClose } from "react-icons/io5";

interface BotChatProps {
  chatOpen: boolean;
  bubbleText: string | null;
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  handleCloseChat: (e: React.MouseEvent) => void;
  isProcessing: boolean;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const BotChat: React.FC<BotChatProps> = ({
  chatOpen,
  bubbleText,
  input,
  setInput,
  handleSend,
  handleCloseChat,
  isProcessing,
  suggestions,
  onSuggestionClick,
}) => {
  return (
    <>
      {/* Bubble */}
      <div
        className={`absolute z-30 mb-4 w-max max-w-[min(200px,calc(100vw-2rem))] -translate-y-full rounded-xl border-2 border-primary bg-[#17120f]/95 px-4 py-2 text-center font-mono text-sm font-bold text-primary shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-opacity duration-200 pointer-events-none ${chatOpen ? "left-1/2 top-5 -translate-x-1/2 sm:top-0" : "-top-3 right-0"} ${bubbleText ? "opacity-100" : "opacity-0"}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {bubbleText}
        <div className={`absolute bottom-[-10px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-primary ${chatOpen ? "left-1/2 -translate-x-1/2" : "right-3"}`}>
          {" "}
        </div>
      </div>

      {/* Input Area */}
      <div
        className={`absolute z-40 pointer-events-auto bottom-[60px] sm:bottom-[40px] left-1/2 -translate-x-1/2 translate-y-full w-[90%] sm:w-[300px] transition-all duration-300 ${chatOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}
      >
        {suggestions.length > 0 && (
          <div className="mb-2 flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionClick(suggestion)}
                className="rounded-full border border-primary/30 bg-background/90 px-3 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-dark"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 rounded-full border border-primary/60 bg-black/80 p-2 transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(255,146,51,0.14)]">
          <input
            type="text"
            aria-label="Ask Krypton about Sandeep's portfolio"
            maxLength={500}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about projects, skills, hiring..."
            className="min-w-0 flex-1 bg-transparent px-3 py-1 font-mono text-sm text-primary outline-none placeholder:text-primary/50"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={isProcessing}
            className="bg-primary text-black p-2 rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <IoSend />
          </button>
          <button
            onClick={handleCloseChat}
            className="bg-transparent text-primary border border-primary p-2 rounded-full hover:bg-primary/10 active:scale-95 transition-all flex-shrink-0"
            aria-label="Close chat"
            title="Close chat"
          >
            <IoClose />
          </button>
        </div>
      </div>
    </>
  );
};
