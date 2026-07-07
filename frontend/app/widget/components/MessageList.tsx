import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { UIMessage } from "ai";

type MessageListProps = {
  messages: UIMessage[];
  status: string;
};

export function MessageList({ messages, status }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8FAFC]">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-slate-400 text-sm">
            👋 Hi! Ask me anything about your order, shipping, or returns.
          </p>
        </div>
      )}

      {messages.map((message) => {
        const text = message.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(" ");

        if (!text) return null;

        return <MessageBubble key={message.id} role={message.role} text={text} />;
      })}

      {status === "streaming" && (
        <div className="flex items-end gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
            FB
          </div>
          <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
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