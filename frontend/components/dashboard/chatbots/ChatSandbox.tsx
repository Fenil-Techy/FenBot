"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { useChatAi } from "@/hooks/useChatAi";

function isHeaderColorLight(hex?: string) {
  if (!hex) return false;
  const c = hex.replace("#", "");
  if (c.toLowerCase() === "ffffff" || c.toLowerCase() === "fafafa") return true;
  if (c.length === 6) {
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 180;
  }
  return false;
}

interface ChatSandboxProps {
  chatbot_id: string;
  chatbot_name: string;
  header_color?: string;
  bubble_color?: string;
  accent_color?: string;
  welcome_message?: string;
  input_placeholder?: string;
  widget_spacing?: number;
  widget_placement?: "left" | "right";
}

export function ChatSandbox({
  chatbot_id,
  chatbot_name,
  header_color,
  bubble_color,
  accent_color,
  welcome_message,
  input_placeholder,
  widget_spacing = 20,
  widget_placement = "right",
}: ChatSandboxProps) {
  const { messages, sendMessage, status } = useChatAi(chatbot_id);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;
    const msg = input.trim();
    setInput("");
    // sendMessage expects { text } in this AI SDK version (matches ChatWidget pattern)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sendMessage as any)({ text: msg });
  };

  const isLight = isHeaderColorLight(header_color);

  return (
    <div
      style={{
        bottom: `${widget_spacing}px`,
        left: widget_placement === "left" ? `${widget_spacing}px` : "auto",
        right: widget_placement === "right" ? `${widget_spacing}px` : "auto",
      }}
      className={`absolute z-10 w-[295px] h-[395px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-all duration-200 ${
        isLight
          ? "bg-white text-slate-900 border-slate-200"
          : "bg-[#101012] text-white border-white/5"
      }`}
    >
      {/* Header */}
      <div
        className="px-3.5 py-3 flex items-center gap-2.5 transition-colors text-white shrink-0"
        style={{ backgroundColor: header_color || "#101113" }}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
          {chatbot_name ? chatbot_name.slice(0, 2).toUpperCase() : "FB"}
        </div>
        <div>
          <p className="text-[13px] font-bold leading-none text-white">{chatbot_name || "FenBot"}</p>
          <span className="text-[9px] opacity-75 mt-0.5 block leading-none text-white/90">Online now</span>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 ${isLight ? "bg-[#F5F7FF]" : "bg-[#161619]"}`}>
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-3 space-y-2.5 w-full">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: header_color || "#101113" }}
            >
              {chatbot_name ? chatbot_name.slice(0, 2).toUpperCase() : "FB"}
            </div>
            <p className={`text-[11px] leading-relaxed w-full ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              {welcome_message || "Hello! Ask me anything."}
            </p>
          </div>
        ) : (
          messages.map((m) => {
            // UIMessage uses parts[], not content — extract all text parts
            const text = (m.parts ?? [])
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((p: any) => p.type === "text")
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((p: any) => p.text as string)
              .join("");

            const isUser = m.role === "user";

            return (
              <div
                key={m.id}
                style={isUser ? { backgroundColor: accent_color || "#E8281E" } : undefined}
                className={`flex flex-col max-w-[80%] rounded-xl px-3 py-2 text-[12px] leading-relaxed shadow-sm ${
                  isUser
                    ? "self-end text-white rounded-br-none"
                    : isLight
                    ? "self-start bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                    : "self-start bg-white/5 text-[#F5F5F5] border border-white/5 rounded-bl-none"
                }`}
              >
                <span className="whitespace-pre-wrap">{text}</span>
              </div>
            );
          })
        )}
        {status === "streaming" && (
          <div className="self-start bg-white/5 border border-white/5 rounded-xl rounded-bl-none px-3 py-2 text-[12px] flex items-center gap-1.5 text-zinc-400">
            <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 p-2 border-t shrink-0 ${
          isLight ? "border-slate-100 bg-white" : "border-white/5 bg-[#101012]"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status === "streaming"}
          placeholder={input_placeholder || "Type your message..."}
          className={`flex-1 bg-transparent border-none text-[11px] px-2 py-1 focus:outline-none disabled:opacity-50 ${
            isLight ? "text-slate-800 placeholder-slate-400" : "text-[#F5F5F5] placeholder-zinc-500"
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || status === "streaming"}
          style={{ backgroundColor: accent_color || "#E8281E" }}
          className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer border-none disabled:opacity-40 transition-colors p-0"
        >
          <Send className="w-2.5 h-2.5 text-white" />
        </button>
      </form>
    </div>
  );
}
