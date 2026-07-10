"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";
import { MessageSquare, Play, Sparkles } from "lucide-react";

export function DashboardHero() {
  const router = useRouter();

  return (
    <div className="relative p-8 rounded-2xl bg-gradient-to-r from-[#16181D] to-[#101113] border border-[#262A32] overflow-hidden flex flex-col gap-6 select-none">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          {/* Greeting & Workspace */}
          <div className="flex items-center gap-2 text-[#8B919D] text-[12px] font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#E8281E]" />
            <span>Workspace: Acme Support</span>
          </div>
          <h2 className="text-[28px] font-bold text-[#F5F5F5] tracking-tight font-display mt-1">
            Good morning, Fenil
          </h2>
          
          {/* AI Status details */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-[14px] font-medium text-[#B4BAC5]">
              Customer Support AI
            </span>
            <StatusBadge status="online" label="Online" />
            <span className="text-[13px] text-[#8B919D]">
              Working normally. Last response 14 seconds ago.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            onClick={() => router.push("/dashboard/inbox")}
            className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-11 text-[14px] font-medium px-5 flex items-center gap-2 transition-colors cursor-pointer border-none"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Open Inbox</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => alert("Simulating chatbot test drawer...")}
            className="bg-transparent border border-[#2A2E36] text-[#F5F5F5] hover:bg-[#1D2026] hover:text-white rounded-xl h-11 text-[14px] font-medium px-5 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Test Chatbot</span>
          </Button>
        </div>
      </div>

      {/* Decorative backdrop elements for premium Vercel-like feeling */}
      <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#E8281E]/5 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
}
