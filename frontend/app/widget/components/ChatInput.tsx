import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  accentColor?: string;
  isDark?: boolean;
};

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Type your message...",
  accentColor = "#1E3A5F",
  isDark,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex items-center gap-2 border-t p-3 ${
      isDark ? "border-white/5 bg-[#101012]" : "border-slate-200 bg-white"
    }`}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder || "Type your message..."}
        className={`flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 disabled:opacity-50 transition ${
          isDark
            ? "bg-white/5 border-white/5 text-[#F5F5F5] placeholder-zinc-500"
            : "bg-slate-50 border-slate-200 text-[#1E3A5F] placeholder-slate-400"
        }`}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        style={{ backgroundColor: accentColor || "#1E3A5F" }}
        className="w-10 h-10 rounded-full text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition shrink-0 border-none cursor-pointer"
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}