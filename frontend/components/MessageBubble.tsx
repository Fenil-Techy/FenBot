type MessageBubbleProps = {
  role: "user" | "assistant" |"system";
  text: string;
};

export function MessageBubble({ role, text }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
          FB
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#1E3A5F] text-white rounded-br-md"
            : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >
        {text}
      </div>
    </div>
  );
}