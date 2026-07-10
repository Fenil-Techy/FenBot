"use client";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChatAi } from "@/hooks/useChatAi";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";


export function ChatWidget({ chatbot_id }: { chatbot_id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status } = useChatAi(chatbot_id);

  useEffect(()=>{
    window.parent.postMessage(
      {type:"fenbot:toggle",open:isOpen},
      "*"
    )
  },[isOpen])

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
          <div className="bg-[#1E3A5F] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-sm">
                FB
              </div>
              <div>
                <p className="text-white font-medium text-sm leading-tight">FenBot Support</p>
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
              className="text-slate-300 hover:text-white transition"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <MessageList messages={messages} status={status} />

          {/* Input */}
          <ChatInput
            onSend={(text) => sendMessage({ text })}
            disabled={status === "streaming"}
          />
        </div>
      )}

      {/* Launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#1E3A5F] hover:bg-[#25476f] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      </div>
    </div>
  </>
  );
}