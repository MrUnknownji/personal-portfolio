import React from 'react';
import { IoSend, IoClose } from "react-icons/io5";

interface BotChatProps {
    chatOpen: boolean;
    bubbleText: string | null;
    input: string;
    setInput: (val: string) => void;
    handleSend: () => void;
    handleCloseChat: (e: React.MouseEvent) => void;
    isProcessing: boolean;
}

export const BotChat: React.FC<BotChatProps> = ({
    chatOpen,
    bubbleText,
    input,
    setInput,
    handleSend,
    handleCloseChat,
    isProcessing
}) => {
    return (
        <>
            {/* Bubble */}
            <div
                className={`absolute top-[20px] sm:top-[0px] left-1/2 -translate-x-1/2 -translate-y-full mb-4 w-max max-w-[200px] bg-[#00ff99]/10 border-2 border-[#00ff99] text-[#00ff99] px-4 py-2 rounded-xl text-center font-mono text-sm font-bold shadow-[0_0_15px_#00ff99] pointer-events-none transition-opacity duration-200 ${bubbleText && chatOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                {bubbleText}
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#00ff99]" > </div>
            </div>

            {/* Input Area */}
            <div className={`absolute bottom-[60px] sm:bottom-[40px] left-1/2 -translate-x-1/2 translate-y-full w-[90%] sm:w-[300px] transition-all duration-300 ${chatOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}>
                <div className="flex gap-2 bg-black/80 p-2 rounded-full border border-[#00ff99] shadow-[0_0_10px_rgba(0,255,153,0.2)]" >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-transparent text-[#00ff99] placeholder-[#00ff99]/50 px-3 py-1 outline-none font-mono text-sm min-w-0"
                        disabled={isProcessing}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing}
                        className="bg-[#00ff99] text-black p-2 rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <IoSend />
                    </button>
                    <button
                        onClick={handleCloseChat}
                        className="bg-transparent text-[#00ff99] border border-[#00ff99] p-2 rounded-full hover:bg-[#00ff99]/10 active:scale-95 transition-all flex-shrink-0 sm:hidden"
                        title="Close chat"
                    >
                        <IoClose />
                    </button>
                </div>
            </div>
        </>
    );
};
