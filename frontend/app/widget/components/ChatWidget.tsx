"use client";
import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useChatAi } from "@/hooks/useChatAi";
import { WidgetPanel, isColorLight } from "@/components/widget/WidgetPanel";

/* ── Web Audio sounds ──────────────────────────────────────────── */
function playTone(type: OscillatorType, freq: number, dur: number, vol = 0.15, endFreq?: number) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch (_) {}
}
const sfxOpen    = () => playTone("sine", 440, 0.18, 0.13, 660);
const sfxClose   = () => playTone("sine", 500, 0.14, 0.10, 320);
const sfxReceive = () => {
  playTone("sine", 880, 0.08, 0.09);
  setTimeout(() => playTone("sine", 1100, 0.12, 0.07), 90);
};

/* ── Component ─────────────────────────────────────────────────── */
export function ChatWidget({ chatbot_id }: { chatbot_id: string }) {
  const [isOpen, setIsOpen]       = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [config, setConfig]       = useState<any>(null);

  const { messages, sendMessage, status } = useChatAi(chatbot_id);

  /* Load config */
  useEffect(() => {
    fetch(`http://localhost:8000/chat/${chatbot_id}/config`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setConfig(d))
      .catch(() => {});
  }, [chatbot_id]);

  /* Notify parent iframe */
  useEffect(() => {
    window.parent.postMessage({ type: "fenbot:toggle", open: isOpen }, "*");
  }, [isOpen]);

  /* Sound on new assistant message */
  useEffect(() => {
    if (messages.length > prevCount) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") sfxReceive();
      setPrevCount(messages.length);
    }
  }, [messages]);

  /* Open / close */
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
    sfxOpen();
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    sfxClose();
    setTimeout(() => setIsOpen(false), 150);
  }, []);

  const toggle = useCallback(() => {
    isOpen ? handleClose() : handleOpen();
  }, [isOpen, handleOpen, handleClose]);

  const bubbleColor = config?.bubble_color || "#E8281E";
  const headerColor = config?.header_color;
  const accentColor = config?.accent_color || "#E8281E";
  const botName     = config?.name || "FenBot";
  const isBubbleLight = isColorLight(bubbleColor);
  const isDark = !isColorLight(headerColor);

  return (
    <>
      <style>{`
        html, body {
          width:100%!important; height:100%!important;
          overflow:hidden!important; margin:0!important;
          padding:0!important; background:transparent!important;
        }

        @keyframes widgetOpen {
          0%   { opacity:0; transform:translateY(20px) scale(0.95); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes widgetClose {
          0%   { opacity:1; transform:translateY(0) scale(1); }
          100% { opacity:0; transform:translateY(16px) scale(0.94); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow:0 0 0 0 rgba(232,40,30,0.45); }
          50%     { box-shadow:0 0 0 9px rgba(232,40,30,0); }
        }
        @keyframes msgSlideIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .w-open  { animation:widgetOpen 0.36s cubic-bezier(0.16,1,0.3,1) forwards; }
        .w-close { animation:widgetClose 0.14s cubic-bezier(0.4,0,1,1) forwards; }
        .b-pulse { animation:pulse-glow 2.4s ease-in-out infinite; }
        .msg-slide-in { animation:msgSlideIn 0.22s ease-out both; }

        .widget-scroll::-webkit-scrollbar { width:4px; }
        .widget-scroll::-webkit-scrollbar-track { background:transparent; }
        .widget-scroll::-webkit-scrollbar-thumb { background:rgba(150,150,150,0.22); border-radius:99px; }
      `}</style>

      <div className="relative w-full h-full">
        <div className="absolute bottom-5 right-5 flex flex-col items-end gap-3">

          {/* Panel */}
          {isOpen && (
            <WidgetPanel
              botName={botName}
              headerColor={headerColor}
              accentColor={accentColor}
              isDark={isDark}
              welcomeMessage={config?.welcome_message}
              inputPlaceholder={config?.input_placeholder}
              messages={messages}
              status={status}
              onSend={(text) => sendMessage({ text })}
              onClose={handleClose}
              className={`w-[390px] rounded-[26px] border shadow-[0_32px_80px_rgba(0,0,0,0.28)] ${
                isVisible ? "w-open" : "w-close"
              }`}
              style={{
                height: "calc(100vh - 120px)",
                maxHeight: "640px",
                minHeight: "480px",
                transformOrigin: "bottom right",
              }}
            />
          )}

          {/* Launcher Bubble */}
          <button
            onClick={toggle}
            className={`relative w-[58px] h-[58px] rounded-full flex items-center justify-center cursor-pointer border-none transition-all duration-200 hover:scale-110 active:scale-95 ${
              !isOpen ? "b-pulse" : ""
            } ${isBubbleLight ? "shadow-lg ring-1 ring-black/10" : "shadow-2xl"}`}
            style={{ backgroundColor: bubbleColor }}
            aria-label="Toggle chat"
          >
            {/* Logo — tilted +20deg right, hidden when open */}
            <img
              src="/logo/apple-touch-icon.png"
              alt="Chat"
              className="object-contain drop-shadow-sm"
              style={{
                width: "26px",
                height: "26px",
                transform: "rotate(20deg)",
                opacity: isOpen ? 0 : 1,
                position: isOpen ? "absolute" : "relative",
                transition: "opacity 0.18s ease, transform 0.18s ease",
              }}
            />
            {/* X — shown when open */}
            <X
              size={22}
              strokeWidth={2.5}
              className={isBubbleLight ? "text-slate-800" : "text-white"}
              style={{
                opacity: isOpen ? 1 : 0,
                position: isOpen ? "relative" : "absolute",
                transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
                transition: "all 0.18s ease",
              }}
            />
          </button>
        </div>
      </div>
    </>
  );
}