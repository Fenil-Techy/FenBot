"use client";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { UIMessage } from "ai";

type MessageListProps = {
  messages: UIMessage[];
  status: string;
  welcomeMessage?: string;
  accentColor?: string;
  isDark?: boolean;
  botName?: string;
  headerColor?: string;
};

export function MessageList({
  messages,
  status,
  welcomeMessage,
  accentColor,
  isDark,
  botName,
  headerColor,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const initials = botName ? botName.slice(0, 2).toUpperCase() : "FB";

  return (
    <div
      className={`flex-1 overflow-y-auto widget-scroll px-4 py-5 flex flex-col gap-1 ${
        isDark ? "bg-[#131316]" : "bg-[#F8F9FF]"
      }`}
    >
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: headerColor || (isDark ? "#1a1a1f" : "#1E3A5F") }}
          >
            <img src="/logo/apple-touch-icon.png" alt="Bot" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <p className={`text-[15px] font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
              {botName || "FenBot"}
            </p>
            <p className={`text-[13px] leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              {welcomeMessage || "👋 Hi! How can I help you today?"}
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, idx) => {
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
            initials={initials}
            headerColor={headerColor}
            isLast={idx === messages.length - 1}
          />
        );
      })}

      {/* Streaming typing indicator */}
      {status === "streaming" && (
        <div className="msg-slide-in flex items-end gap-2.5 mb-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm"
            style={{ backgroundColor: headerColor || (isDark ? "#1a1a1f" : "#1E3A5F") }}
          >
            <img src="/logo/apple-touch-icon.png" alt="" className="w-5 h-5 object-contain" />
          </div>
          <div
            className={`rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center ${
              isDark
                ? "bg-white/6 border border-white/8"
                : "bg-white border border-slate-100 shadow-sm"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-zinc-400" : "bg-slate-400"}`}
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <span
              className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-zinc-400" : "bg-slate-400"}`}
              style={{ animationDelay: "160ms", animationDuration: "1s" }}
            />
            <span
              className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-zinc-400" : "bg-slate-400"}`}
              style={{ animationDelay: "320ms", animationDuration: "1s" }}
            />
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
}