"use client";
import { MessageCircle, Send } from "lucide-react";

type PreviewProps = {
  bubbleColor?: string;
  headerColor?: string;
  accentColor?: string;
  welcomeMessage?: string;
  inputPlaceholder?: string;
  botName?: string;
};

export function WidgetPreview({
  bubbleColor = "#E8281E",
  headerColor = "#101113",
  accentColor = "#E8281E",
  welcomeMessage = "Hello! How can I help you today?",
  inputPlaceholder = "Type your message...",
  botName = "FenBot",
}: PreviewProps) {
  const fallbackBotName = botName || "FenBot";
  const initials = fallbackBotName.slice(0, 2).toUpperCase();

  return (
    <div className="sticky top-6 select-none">
      <p className="text-xs font-bold text-[#8B919D] uppercase tracking-wider mb-3">Live Preview</p>
      <div className="w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="px-4 py-4 flex items-center gap-3 transition-colors duration-200"
          style={{ backgroundColor: headerColor || "#101113" }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-white font-medium text-sm leading-none">{fallbackBotName}</p>
            <span className="text-[10px] text-white/70 mt-1 block">Online now</span>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-[#F5F7FF] px-4 py-4 overflow-y-auto">
          <div className="flex items-end gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold shrink-0 transition-colors duration-200"
              style={{ backgroundColor: headerColor || "#101113" }}
            >
              {initials}
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-3.5 py-2 text-sm text-[#1F2937] shadow-sm max-w-[75%] leading-relaxed">
              {welcomeMessage || "Hello! How can I help you today?"}
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 border-t border-[#E5E9F5] bg-white p-3">
          <div className="flex-1 rounded-full border border-[#E5E9F5] bg-[#F5F7FF] px-4 py-2 text-sm text-[#9CA3AF] truncate">
            {inputPlaceholder || "Type your message..."}
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 transition-colors duration-200"
            style={{ backgroundColor: accentColor || "#E8281E" }}
          >
            <Send className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Bubble Launcher */}
      <div className="flex justify-end mt-4 pr-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-200 cursor-pointer"
          style={{ backgroundColor: bubbleColor || "#E8281E" }}
        >
          <MessageCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
