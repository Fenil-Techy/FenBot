"use client";
import { highlightedConversationPreview } from "@/lib/dashboard/mock-data";
import { DashboardCard } from "../shared/DashboardCard";
import { StatusBadge } from "../shared/StatusBadge";
import { MessageSquare, Bot, User } from "lucide-react";

export function ConversationPreview() {
  const conv = highlightedConversationPreview;

  return (
    <DashboardCard>
      <div className="pb-4 border-b border-[#24262D] mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-[#E8281E]" />
          <h3 className="text-card-title text-[#F5F5F5]">Highlighted Support Thread</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="font-semibold text-[#F5F5F5]">{conv.customerName}</span>
          <span className="text-[#8B919D] truncate max-w-[150px] sm:max-w-none">({conv.email})</span>
          <span className="text-[#8B919D]">• {conv.time}</span>
          <StatusBadge status="online" label="Open" className="text-[10px] py-0 px-2" />
        </div>
      </div>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
        {conv.messages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isAI ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Sender Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs border ${
                  isAI
                    ? "bg-[#E8281E]/10 border-[#E8281E]/20 text-[#E8281E]"
                    : "bg-[#20232A] border-[#2A2E36] text-[#B4BAC5]"
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div>
                <div
                  className={`p-3.5 rounded-2xl text-[13px] leading-relaxed ${
                    isAI
                      ? "bg-[#252932] text-[#F5F5F5] rounded-tr-none border border-[#2A2E36]"
                      : "bg-[#1D2026] text-[#F5F5F5] rounded-tl-none border border-[#20232A]"
                  }`}
                >
                  {msg.content}
                </div>
                <div
                  className={`text-[10px] text-[#8B919D] mt-1 px-1 font-mono ${
                    isAI ? "text-right" : "text-left"
                  }`}
                >
                  {isAI ? "AI Agent" : "Customer"} • {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
