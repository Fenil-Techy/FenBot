"use client";

import { useEffect, useState, useRef } from "react";
import { Bot, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatAi } from "@/hooks/useChatAi";

interface ChatSandboxProps {
  chatbot_id: string;
  chatbot_name: string;
}

export function ChatSandbox({ chatbot_id, chatbot_name }: ChatSandboxProps) {
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

  return (
    <div className="flex flex-col h-[560px] w-[calc(100vw-4rem)] sm:w-[480px] shrink-0 mx-auto bg-[#101113] border border-[#20232A] rounded-2xl overflow-hidden shadow-2xl">
      <div className="h-14 px-4 border-b border-[#20232A] flex items-center gap-3 shrink-0 bg-[#16181D]">
        <div className="w-8 h-8 rounded-lg bg-[#20232A] border border-[#2A2E36] flex items-center justify-center text-[#E8281E]">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#F5F5F5] leading-none">{chatbot_name}</p>
          <span className="text-[10px] text-[#8B919D] block">Live testing panel</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#16181D] border border-[#2A2E36] flex items-center justify-center text-[#8B919D]">
              <Bot className="w-5 h-5" />
            </div>
            <p className="text-[12px] text-[#8B919D] leading-relaxed">
              Send a message to test how your chatbot answers questions based on your knowledge base and tone.
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

      <form onSubmit={handleSubmit} className="p-3 border-t border-[#20232A] bg-[#16181D] shrink-0">
        <div className="flex items-center gap-2 bg-[#101113] border border-[#2A2E36] rounded-xl p-1.5 focus-within:border-[#E8281E]/60 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status === "streaming"}
            placeholder={`Message ${chatbot_name}...`}
            className="flex-1 bg-transparent border-none text-[13px] text-[#F5F5F5] placeholder-[#8B919D] px-2 py-1.5 focus:outline-none disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!input.trim() || status === "streaming"}
            className="bg-[#E8281E] hover:bg-[#C41F16] text-white rounded-lg w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer border-none disabled:opacity-40 transition-colors p-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
