import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  accentColor?: string;
};

export function ChatInput({ onSend, disabled, placeholder = "Type your message...", accentColor = "#1E3A5F" }: ChatInputProps) {
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
    <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder || "Type your message..."}
        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#1E3A5F] outline-none focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 disabled:opacity-50 transition"
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