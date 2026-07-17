/**
 * Shared FenBot Widget Panel
 * ─────────────────────────
 * Used by: ChatWidget (real embed), ChatSandbox (dashboard test), WidgetPreview (static preview)
 *
 * Design decisions:
 *  - Header has NO logo — just bot name + online status + optional close button
 *  - Bot message avatar uses initials in a colored pill (not a logo image)
 *  - "Powered by FenBot" footer shows the favicon logo + bold brand name, eye-catching
 */

"use client";

import {
  useRef,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDown, ArrowUp } from "lucide-react";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ── Luminance helper (shared, canonical) ───────────────────────── */
export function isColorLight(hex?: string): boolean {
  if (!hex) return false;
  const c = hex.replace("#", "");
  if (c.toLowerCase() === "ffffff" || c.toLowerCase() === "fafafa") return true;
  if (c.length === 6) {
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 180;
  }
  return false;
}

/* ── Bot Avatar ─────────────────────────────────────────────────── */
interface BotAvatarProps {
  initials: string;
  headerColor?: string;
  isDark?: boolean;
  size?: "sm" | "md";
}
export function BotAvatar({ initials, headerColor, isDark, size = "sm" }: BotAvatarProps) {
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-[12px]";
  const bg = headerColor
    ? undefined
    : isDark
    ? "#2a2a32"
    : "#1E3A5F";

  return (
    <div
      className={`${dim} rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm`}
      style={{ backgroundColor: headerColor || bg || "#1E3A5F" }}
    >
      {initials}
    </div>
  );
}

/* ── Message Bubble ─────────────────────────────────────────────── */
interface BubbleProps {
  role: "user" | "assistant" | "system";
  text: string;
  accentColor?: string;
  isDark?: boolean;
  initials?: string;
  headerColor?: string;
  animated?: boolean;
}
export function WidgetMessageBubble({
  role,
  text,
  accentColor,
  isDark,
  initials = "FB",
  headerColor,
  animated = true,
}: BubbleProps) {
  const isUser = role === "user";
  return (
    <div
      className={`${animated ? "msg-slide-in" : ""} flex items-end gap-2.5 mb-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <BotAvatar initials={initials} headerColor={headerColor} isDark={isDark} size="sm" />
      )}

      <div
        style={isUser && accentColor ? { backgroundColor: accentColor } : undefined}
        className={[
          "max-w-[76%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm",
          isUser
            ? `text-white rounded-br-sm ${!accentColor ? "bg-[#E8281E]" : ""}`
            : isDark
            ? "bg-white/7 text-zinc-100 border border-white/8 rounded-bl-sm"
            : "bg-white text-slate-800 border border-slate-100/80 shadow rounded-bl-sm",
        ].join(" ")}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div
            className={`prose prose-sm max-w-none ${
              isDark
                ? "prose-invert prose-p:text-zinc-100 prose-strong:text-white"
                : "prose-p:text-slate-700 prose-strong:text-slate-900"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && <div className="w-1 shrink-0" />}
    </div>
  );
}

/* ── Message List ───────────────────────────────────────────────── */
interface MessageListInternalProps {
  messages: UIMessage[];
  status: string;
  welcomeMessage?: string;
  accentColor?: string;
  isDark?: boolean;
  initials?: string;
  headerColor?: string;
  botName?: string;
}
export function WidgetMessageList({
  messages,
  status,
  welcomeMessage,
  accentColor,
  isDark,
  initials = "FB",
  headerColor,
  botName,
}: MessageListInternalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div
      className={`flex-1 overflow-y-auto widget-scroll px-4 py-5 flex flex-col gap-1 ${
        isDark ? "bg-[#131316]" : "bg-[#F8F9FF]"
      }`}
    >
      {/* Empty / welcome state */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
          <BotAvatar initials={initials} headerColor={headerColor} isDark={isDark} size="md" />
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
      {messages.map((msg) => {
        const text = msg.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(" ");
        if (!text) return null;
        return (
          <WidgetMessageBubble
            key={msg.id}
            role={msg.role as any}
            text={text}
            accentColor={accentColor}
            isDark={isDark}
            initials={initials}
            headerColor={headerColor}
            animated
          />
        );
      })}

      {/* Typing dots */}
      {status === "streaming" && (
        <div className="msg-slide-in flex items-end gap-2.5 mb-2">
          <BotAvatar initials={initials} headerColor={headerColor} isDark={isDark} size="sm" />
          <div
            className={`rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center ${
              isDark
                ? "bg-white/6 border border-white/8"
                : "bg-white border border-slate-100 shadow-sm"
            }`}
          >
            {[0, 160, 320].map((delay) => (
              <span
                key={delay}
                className={`w-2 h-2 rounded-full animate-bounce ${
                  isDark ? "bg-zinc-400" : "bg-slate-400"
                }`}
                style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

/* ── Chat Input ─────────────────────────────────────────────────── */
interface InputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  accentColor?: string;
  isDark?: boolean;
}
export function WidgetInput({
  onSend,
  disabled,
  placeholder = "Type a message...",
  accentColor = "#E8281E",
  isDark,
}: InputProps) {
  const [val, setVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const has = val.trim().length > 0;

  const handleSend = () => {
    if (!has || disabled) return;
    onSend(val.trim());
    setVal("");
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`shrink-0 px-4 pt-3 pb-2 border-t ${
        isDark ? "border-white/6 bg-[#0f0f11]" : "border-slate-100 bg-white"
      }`}
    >
      {/* Input row */}
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
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={`flex-1 text-[13px] bg-transparent border-none outline-none disabled:opacity-40 ${
            isDark ? "text-white placeholder-zinc-500" : "text-slate-800 placeholder-slate-400"
          }`}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !has}
          style={{
            backgroundColor: has ? (accentColor || "#E8281E") : "transparent",
            transform: has ? "scale(1)" : "scale(0.6)",
            opacity: has ? 1 : 0,
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 border-none cursor-pointer transition-all duration-200 disabled:cursor-not-allowed"
          aria-label="Send"
        >
          <ArrowUp size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* Powered by footer — eye-catching with logo */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-0.5">
        <img
          src="/logo/favicon-32x32.png"
          alt="FenBot"
          className="w-3.5 h-3.5 object-contain opacity-70"
        />
        <p className={`text-[10.5px] font-medium tracking-wide ${isDark ? "text-white/35" : "text-slate-400"}`}>
          Powered by{" "}
          <span
            className="font-bold"
            style={{ color: accentColor || "#E8281E", opacity: 0.85 }}
          >
            FenBot
          </span>
        </p>
      </div>
    </div>
  );
}

/* ── Widget Panel Header ────────────────────────────────────────── */
interface HeaderProps {
  botName: string;
  headerColor?: string;
  isDark?: boolean;
  onClose?: () => void;
}
export function WidgetHeader({ botName, headerColor, isDark, onClose }: HeaderProps) {
  const isLight = isColorLight(headerColor);
  return (
    <div
      className="px-5 py-4 flex items-center justify-between shrink-0 relative overflow-hidden"
      style={{ backgroundColor: headerColor || (isDark ? "#101113" : "#FFFFFF") }}
    >
      {/* Shine */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 55%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10">
        <p className={`font-bold text-[15px] leading-none tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
          {botName}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className={`text-[11px] font-medium ${isLight ? "text-slate-500" : "text-white/60"}`}>
            Online now
          </span>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer border-none transition-all duration-150 hover:scale-110 active:scale-95 ${
            isLight
              ? "bg-black/5 text-slate-600 hover:bg-black/10"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          }`}
          aria-label="Close"
        >
          <ChevronDown size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

/* ── Full Widget Panel ──────────────────────────────────────────── */
export interface WidgetPanelProps {
  botName?: string;
  headerColor?: string;
  accentColor?: string;
  isDark?: boolean;
  welcomeMessage?: string;
  inputPlaceholder?: string;
  messages: UIMessage[];
  status: string;
  onSend: (text: string) => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function WidgetPanel({
  botName = "FenBot",
  headerColor,
  accentColor = "#E8281E",
  isDark = true,
  welcomeMessage,
  inputPlaceholder,
  messages,
  status,
  onSend,
  onClose,
  className = "",
  style,
}: WidgetPanelProps) {
  const initials = botName.slice(0, 2).toUpperCase();

  return (
    <div
      className={`flex flex-col overflow-hidden ${
        isDark
          ? "bg-[#0f0f11] text-white border-white/8"
          : "bg-white text-slate-900 border-slate-200/80"
      } ${className}`}
      style={style}
    >
      <WidgetHeader
        botName={botName}
        headerColor={headerColor}
        isDark={isDark}
        onClose={onClose}
      />
      <WidgetMessageList
        messages={messages}
        status={status}
        welcomeMessage={welcomeMessage}
        accentColor={accentColor}
        isDark={isDark}
        initials={initials}
        headerColor={headerColor}
        botName={botName}
      />
      <WidgetInput
        onSend={onSend}
        disabled={status === "streaming"}
        placeholder={inputPlaceholder}
        accentColor={accentColor}
        isDark={isDark}
      />
    </div>
  );
}
