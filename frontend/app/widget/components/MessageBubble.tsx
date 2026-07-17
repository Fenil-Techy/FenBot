import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  text: string;
  accentColor?: string;
  isDark?: boolean;
};

export function MessageBubble({ role, text, accentColor, isDark }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0 ${
          isDark ? "bg-white/10 text-white" : "bg-[#1E3A5F] text-white"
        }`}>
          FB
        </div>
      )}
      <div
        style={isUser && accentColor ? { backgroundColor: accentColor } : undefined}
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap prose prose-sm ${
          isUser
            ? "bg-black text-white rounded-br-md"
            : isDark
            ? "bg-white/5 text-[#F5F5F5] border border-white/5 rounded-bl-md"
            : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}