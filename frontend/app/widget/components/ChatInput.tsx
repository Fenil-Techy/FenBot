"use client";
import { useState, KeyboardEvent, useRef } from "react";
import { ArrowUp } from "lucide-react";

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
  accentColor = "#E8281E",
  isDark,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasInput = input.trim().length > 0;

  return (
    <div
      className={`shrink-0 px-4 py-3 border-t ${
        isDark ? "border-white/5 bg-[#0f0f11]" : "border-slate-100 bg-white"
      }`}
    >
      <div
        className={`flex items-center gap-2 rounded-[18px] px-4 py-2.5 transition-all duration-200 ${
          isDark
            ? "bg-white/5 border border-white/8 focus-within:border-white/20"
            : "bg-slate-50 border border-slate-200 focus-within:border-slate-300 focus-within:bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={`flex-1 text-[13.5px] bg-transparent border-none outline-none disabled:opacity-40 ${
            isDark
              ? "text-white placeholder-zinc-500"
              : "text-slate-800 placeholder-slate-400"
          }`}
        />

        {/* Send button — only visible when there's input */}
        <button
          onClick={handleSend}
          disabled={disabled || !hasInput}
          style={{
            backgroundColor: hasInput ? (accentColor || "#E8281E") : "transparent",
            transform: hasInput ? "scale(1)" : "scale(0.7)",
            opacity: hasInput ? 1 : 0,
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 border-none cursor-pointer transition-all duration-200 disabled:cursor-not-allowed`}
          aria-label="Send"
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Powered-by footer */}
      <p className={`text-center text-[10px] mt-2 ${isDark ? "text-white/20" : "text-slate-300"}`}>
        Powered by <span className="font-semibold">FenBot</span>
      </p>
    </div>
  );
}