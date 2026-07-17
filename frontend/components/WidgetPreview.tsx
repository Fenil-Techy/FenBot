"use client";
import { MessageCircle, Send } from "lucide-react";

type PreviewProps = {
  bubbleColor?: string;
  headerColor?: string;
  accentColor?: string;
  welcomeMessage?: string;
  inputPlaceholder?: string;
  botName?: string;
  /** Explicit theme override — prevents deriving dark/light from headerColor which causes reset bugs */
  isDark?: boolean;
};

function isHeaderColorLight(hex?: string) {
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

export function WidgetPreview({
  bubbleColor = "#E8281E",
  headerColor = "#101113",
  accentColor = "#E8281E",
  welcomeMessage = "Hello! How can I help you today?",
  inputPlaceholder = "Type your message...",
  botName = "FenBot",
  isDark = true,
}: PreviewProps) {
  const fallbackBotName = botName || "FenBot";
  const initials = fallbackBotName.slice(0, 2).toUpperCase();
  // Header text contrast is still driven by actual header color luminance
  const isLight = isHeaderColorLight(headerColor);

  return (
    <div className="sticky top-6 select-none">
      <p className="text-xs font-bold text-[#8B919D] uppercase tracking-wider mb-3">Live Preview</p>
      <div className={`w-[340px] h-[480px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-all duration-200 ${
        isDark
          ? "bg-[#101012] text-white border-white/5"
          : "bg-white text-slate-900 border-slate-200"
      }`}>
        {/* Header — always uses custom headerColor, text adapts to contrast */}
        <div
          className={`px-4 py-4 flex items-center gap-3 transition-colors duration-200 border-b ${
            isLight ? "border-slate-100" : "border-transparent"
          }`}
          style={{ backgroundColor: headerColor }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
              isLight ? "bg-slate-100 text-slate-800" : "bg-white/20 text-white"
            }`}
          >
            {initials}
          </div>
          <div>
            <p className={`font-medium text-sm leading-none ${isLight ? "text-slate-800" : "text-white"}`}>
              {fallbackBotName}
            </p>
            <span className={`text-[10px] mt-1 block ${isLight ? "text-slate-400" : "text-white/70"}`}>
              Online now
            </span>
          </div>
        </div>

        {/* Chat Body — background driven by isDark */}
        <div className={`flex-1 px-4 py-4 overflow-y-auto ${isDark ? "bg-[#161619]" : "bg-[#F5F7FF]"}`}>
          <div className="flex items-end gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 transition-colors duration-200 ${
                isDark ? "bg-white/10 text-white" : "bg-[#1E3A5F] text-white"
              }`}
            >
              {initials}
            </div>
            <div className={`rounded-2xl rounded-bl-md px-3.5 py-2 text-sm shadow-sm max-w-[75%] leading-relaxed ${
              isDark
                ? "bg-white/5 text-[#F5F5F5] border border-white/5"
                : "bg-white text-[#1F2937] border border-slate-100"
            }`}>
              {welcomeMessage || "Hello! How can I help you today?"}
            </div>
          </div>
        </div>

        {/* Input bar — background driven by isDark */}
        <div className={`flex items-center gap-2 border-t p-3 ${
          isDark ? "border-white/5 bg-[#101012]" : "border-[#E5E9F5] bg-white"
        }`}>
          <div className={`flex-1 rounded-full border px-4 py-2 text-sm truncate ${
            isDark
              ? "bg-white/5 border-white/5 text-zinc-500"
              : "bg-[#F5F7FF] border-[#E5E9F5] text-[#9CA3AF]"
          }`}>
            {inputPlaceholder || "Type your message..."}
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 transition-colors duration-200"
            style={{ backgroundColor: accentColor || "#E8281E" }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Bubble Launcher */}
      <div className="flex justify-end mt-4 pr-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-200 cursor-pointer"
          style={{ backgroundColor: bubbleColor || "#E8281E" }}
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
