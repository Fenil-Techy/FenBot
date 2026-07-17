"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  text: string;
  accentColor?: string;
  isDark?: boolean;
  initials?: string;
  headerColor?: string;
  isLast?: boolean;
};

export function MessageBubble({
  role,
  text,
  accentColor,
  isDark,
  initials = "FB",
  headerColor,
  isLast,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`msg-slide-in flex items-end gap-2.5 mb-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0 self-end shadow-sm overflow-hidden"
          style={{ backgroundColor: headerColor || (isDark ? "#1a1a1f" : "#1E3A5F") }}
        >
          <img
            src="/logo/apple-touch-icon.png"
            alt="bot"
            className="w-5 h-5 object-contain"
          />
        </div>
      )}

      {/* Bubble */}
      <div
        style={isUser && accentColor ? { backgroundColor: accentColor } : undefined}
        className={[
          "max-w-[76%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
          "shadow-sm transition-all duration-200",
          isUser
            ? `text-white rounded-br-sm ${!accentColor ? "bg-black" : ""}`
            : isDark
            ? "bg-white/7 text-zinc-100 border border-white/8 rounded-bl-sm"
            : "bg-white text-slate-800 border border-slate-100/80 rounded-bl-sm",
        ].join(" ")}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        ) : (
          <div className={`prose prose-sm max-w-none leading-relaxed ${
            isDark
              ? "prose-invert prose-p:text-zinc-100 prose-strong:text-white prose-code:text-zinc-200 prose-code:bg-white/10"
              : "prose-p:text-slate-700 prose-strong:text-slate-900 prose-code:bg-slate-100"
          }`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* User avatar placeholder spacer */}
      {isUser && <div className="w-1 shrink-0" />}
    </div>
  );
}