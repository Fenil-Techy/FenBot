"use client";
import { useEffect, useRef, useState } from "react";
import { useChatAi } from "@/hooks/useChatAi";
import { X, Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatbotTestDrawerProps {
  chatbot: {
    id: string;
    name: string;
    model?: string;
    persona?: string;
  };
  onClose: () => void;
}

export function ChatbotTestDrawer({ chatbot, onClose }: ChatbotTestDrawerProps) {
  const { messages, sendMessage, status } = useChatAi(chatbot.id);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;
    sendMessage({ text: input });
    setInput("");
  };

  const getMessageText = (message: any) => {
    if (message.content) return message.content;
    if (Array.isArray(message.parts)) {
      return message.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join(" ");
    }
    return "";
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#101113] border-l border-[#20232A] shadow-2xl z-50 flex flex-col text-[#F5F5F5] font-sans antialiased animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-16 px-6 border-b border-[#20232A] flex items-center justify-between shrink-0 bg-[#16181D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#20232A] border border-[#2A2E36] flex items-center justify-center text-[#E8281E]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#F5F5F5] truncate max-w-[240px]">
              Test {chatbot.name}
            </h3>
            <span className="text-[10px] text-[#8B919D] font-mono block">
              {chatbot.model || "FenBot-Core-v2"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1D2026] text-[#8B919D] hover:text-[#F5F5F5] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Persona Info bar */}
      {chatbot.persona && (
        <div className="bg-[#16181D]/50 border-b border-[#20232A] px-6 py-2.5 text-[11px] text-[#8B919D] flex gap-2 items-start shrink-0">
          <span className="font-semibold text-white uppercase tracking-wider shrink-0 mt-0.5">Instructions:</span>
          <p className="line-clamp-2 leading-relaxed">{chatbot.persona}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#16181D] border border-[#2A2E36] flex items-center justify-center text-[#8B919D]">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-[13px] font-semibold text-[#F5F5F5]">Start conversation</h4>
            <p className="text-[11px] text-[#8B919D] leading-relaxed">
              Send a message to test how the agent behaves based on your documents and brand persona.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const text = getMessageText(m);
            if (!text) return null;

            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-[#E8281E] text-white rounded-br-none"
                    : "self-start bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] rounded-bl-none"
                }`}
              >
                <span className="whitespace-pre-wrap">{text}</span>
              </div>
            );
          })
        )}

        {status === "streaming" && (
          <div className="self-start bg-[#16181D] border border-[#2A2E36] rounded-2xl rounded-bl-none px-4 py-2.5 text-[13px] flex items-center gap-2 text-[#8B919D]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-[#20232A] bg-[#16181D] shrink-0"
      >
        <div className="flex items-center gap-2 bg-[#101113] border border-[#2A2E36] rounded-xl p-1.5 focus-within:border-[#E8281E]/60 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status === "streaming"}
            placeholder={`Message {chatbot.name}...`}
            className="flex-1 bg-transparent border-none text-[13px] text-[#F5F5F5] placeholder-[#8B919D] px-2 py-1.5 focus:outline-none disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!input.trim() || status === "streaming"}
            size="icon"
            className="w-8 h-8 rounded-lg bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 flex items-center justify-center border-none cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
