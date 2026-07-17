import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { UIMessage } from "ai";

type MessageListProps = {
  messages: UIMessage[];
  status: string;
  welcomeMessage?: string;
  accentColor?: string;
  isDark?: boolean;
};

export function MessageList({ messages, status, welcomeMessage, accentColor, isDark }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className={`flex-1 overflow-y-auto px-4 py-4 ${isDark ? "bg-[#161619]" : "bg-[#F8FAFC]"}`}>
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-slate-400 text-sm whitespace-pre-wrap">
            {welcomeMessage || "👋 Hi! Ask me anything about your order, shipping, or returns."}
          </p>
        </div>
      )}

      {messages.map((message) => {
        const text = message.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(" ");

        if (!text) return null;

        return (
          <MessageBubble
            key={message.id}
            role={message.role}
            text={text}
            accentColor={accentColor}
            isDark={isDark}
          />
        );
      })}

      {status === "streaming" && (
        <div className="flex items-end gap-2 mb-4">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
            isDark ? "bg-white/10 text-white" : "bg-[#1E3A5F] text-white"
          }`}>
            FB
          </div>
          <div className={`rounded-2xl rounded-bl-md px-4 py-3 flex gap-1 ${
            isDark ? "bg-white/5 text-[#F5F5F5] border border-white/5" : "bg-slate-100 text-slate-800"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}