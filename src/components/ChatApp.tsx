import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, MessageCircle, HelpCircle, Gamepad2 } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatAppProps {
  chatHistory: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
  isSending: boolean;
}

export default function ChatApp({ chatHistory, onSendMessage, isSending }: ChatAppProps) {
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom whenever history alters
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const msg = inputText;
    setInputText("");
    await onSendMessage(msg);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isSending) return;
    await onSendMessage(suggestion);
  };

  const chips = [
    "How does your mood/fur change?",
    "Tell me a lofi developer joke!",
    "Suggest a creative sketch break ideas",
    "How do I beat programmer's block?"
  ];

  return (
    <div className="h-full flex flex-col text-slate-300 font-sans select-none bg-slate-900 overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 flex flex-col">
        {chatHistory.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 leading-relaxed font-sans mt-8">
            <MessageCircle className="w-10 h-10 text-indigo-500/80 mb-2 animate-bounce" />
            <h3 className="text-xs font-extrabold text-slate-400">Yip! Chat with Artie!</h3>
            <p className="text-[10px] text-slate-600 font-mono mt-1 max-w-sm">
              Artie is fully connected to Gemini-3.5-flash. He understands what apps you are simulated to be running (Figma, VS Code, Spotify) and reacts contextually!
            </p>
          </div>
        )}

        {chatHistory.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[85%] ${
              m.role === "user" ? "self-end items-end" : "self-start items-start"
            }`}
          >
            {/* Bubble header role */}
            <span className="text-[8.5px] font-mono text-slate-500 mb-0.5 leading-none">
              {m.role === "user" ? "You" : "Artie 🦊"}
            </span>

            {/* Bubble */}
            <div
              className={`rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed shadow-md ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-950 border border-slate-800/80 text-slate-200 rounded-tl-none font-medium"
              }`}
            >
              {m.content}
            </div>
            <span className="text-[8px] text-slate-600 font-mono mt-0.5 pl-1 pr-1">
              {m.timestamp}
            </span>
          </div>
        ))}

        {/* Loading Bubble */}
        {isSending && (
          <div className="self-start items-start max-w-[85%] flex flex-col">
            <span className="text-[8.5px] font-mono text-slate-500 mb-0.5">Artie 🦊</span>
            <div className="rounded-2xl px-3.5 py-2.5 text-[11px] bg-slate-950 border border-slate-800 text-indigo-400 font-bold rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-0"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-300"></span>
              <span className="text-[10px] tracking-wide text-slate-500 pl-1">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips list */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 flex-shrink-0 flex gap-1.5 overflow-x-auto text-[9px] select-none">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSuggestionClick(chip)}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer flex-shrink-0 font-medium disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Dialogue Input Form bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800/90 flex gap-2 items-center flex-shrink-0 font-sans">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          placeholder="Ask Artie about designing, lofi beats, or anything..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-none h-9 outline-none h-9 font-sans"
        />
        <button
          type="submit"
          disabled={isSending || !inputText.trim()}
          className="w-9 h-9 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-650 rounded-xl flex items-center justify-center text-white transition-transform active:scale-95 cursor-pointer flex-shrink-0"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
}
