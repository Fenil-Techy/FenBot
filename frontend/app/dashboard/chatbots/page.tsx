"use client";
import { useState } from "react";
import { Bot, Plus, Settings, Sliders } from "lucide-react";
import { hasData as initialHasData, chatbotsList } from "@/lib/dashboard/mock-data";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { Button } from "@/components/ui/button";

export default function ChatbotsPage() {
  const [demoHasData, setDemoHasData] = useState(initialHasData.chatbots);
  const [bots, setBots] = useState(chatbotsList);

  const handleCreateBot = () => {
    const newBot = {
      id: `bot-${bots.length + 1}`,
      name: `New Support Agent #${bots.length + 1}`,
      status: "training" as const,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      conversationsCount: 0,
      resolutionRate: "0.0%",
      model: "FenBot-Core-v2"
    };
    setBots([...bots, newBot]);
    setDemoHasData(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A]">
        <div>
          <p className="text-[14px] text-[#8B919D]">Manage and configure your AI support employees.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setDemoHasData(!demoHasData)}
            className="text-[12px] h-8 text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl flex items-center gap-1.5 px-3 border border-[#2A2E36] cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>State: {demoHasData ? "Populated" : "Empty"}</span>
          </Button>
          {demoHasData && (
            <Button
              onClick={handleCreateBot}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-9 text-[13px] font-medium flex items-center gap-1.5 px-4 transition-colors cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Chatbot</span>
            </Button>
          )}
        </div>
      </div>

      {!demoHasData ? (
        <EmptyState
          icon={Bot}
          title="No chatbots yet."
          description="Create your first AI employee to automatically answer customers using your own grounded knowledge documents."
          actionLabel="Create Chatbot"
          onAction={handleCreateBot}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bots.map((bot) => (
            <DashboardCard key={bot.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
                      {bot.name}
                    </h3>
                    <p className="text-[12px] text-[#8B919D] mt-1 font-mono">{bot.model}</p>
                  </div>
                  <StatusBadge status={bot.status} />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 py-3 border-y border-[#20232A] text-center">
                  <div>
                    <span className="text-[11px] text-[#8B919D] block">Conversations</span>
                    <span className="text-[15px] font-bold text-[#F5F5F5] mt-1 block">{bot.conversationsCount}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8B919D] block">Resolution Rate</span>
                    <span className="text-[15px] font-bold text-[#F5F5F5] mt-1 block">{bot.resolutionRate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8B919D] block">Created</span>
                    <span className="text-[13px] font-semibold text-[#F5F5F5] mt-1 block">{bot.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => alert(`Opening testing panel for ${bot.name}...`)}
                  className="bg-transparent border border-[#2A2E36] text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl h-9 text-[13px] font-medium px-4 cursor-pointer"
                >
                  Test Bot
                </Button>
                <Button
                  variant="outline"
                  onClick={() => alert(`Opening settings for ${bot.name}...`)}
                  className="bg-[#252932] text-[#F5F5F5] hover:bg-[#1D2026] border border-[#2A2E36] rounded-xl h-9 text-[13px] font-medium px-4 cursor-pointer flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
