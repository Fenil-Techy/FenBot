"use client";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChatAi } from "@/hooks/useChatAi";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatWidget({ chatbot_id }: { chatbot_id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status } = useChatAi(chatbot_id);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`http://localhost:8000/chat/${chatbot_id}/config`);
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (e) {
        console.error("Failed to load widget config", e);
      }
    }
    loadConfig();
  }, [chatbot_id]);

  useEffect(() => {
    window.parent.postMessage(
      { type: "fenbot:toggle", open: isOpen },
      "*"
    );
  }, [isOpen]);

  const bubbleColor = config?.bubble_color ;
  const headerColor = config?.header_color ;
  const accentColor = config?.accent_color ;
  const botName = config?.name || "FenBot Support";
  const welcomeMessage = config?.welcome_message;
  const inputPlaceholder = config?.input_placeholder;

  return (
    <>
      <style>{`
        html, body {
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
        }
      `}</style>
      <div className="relative w-full h-full">
        <div className="absolute bottom-5 right-5 flex flex-col items-end">
          {/* Panel */}
          {isOpen && (
            <div className="mb-3 w-[380px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
              {/* Header */}
              <div
                className="px-4 py-4 flex items-center justify-between transition-colors duration-200"
                style={{ backgroundColor: headerColor }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/logo/apple-touch-icon.png"
                    alt="FenBot Logo"
                    className="w-9 h-9 rounded-full shrink-0 object-contain bg-white p-1"
                  />
                  <div>
                    <p className="text-white font-medium text-sm leading-tight">{botName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EA5A4] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0EA5A4]"></span>
                      </span>
                      <span className="text-slate-300 text-xs">Online now</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white transition cursor-pointer border-none bg-transparent"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <MessageList messages={messages} status={status} welcomeMessage={welcomeMessage} />

              {/* Input */}
              <ChatInput
                onSend={(text) => sendMessage({ text })}
                disabled={status === "streaming"}
                placeholder={inputPlaceholder}
                accentColor={accentColor}
              />
            </div>
          )}

          {/* Launcher button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ backgroundColor: bubbleColor }}
            className="w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border-none"
            aria-label="Toggle chat"
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </button>
        </div>
      </div>
    </>
  );
}