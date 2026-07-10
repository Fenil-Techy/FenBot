"use client";
import { activityEvents } from "@/lib/dashboard/mock-data";
import { DashboardCard } from "../shared/DashboardCard";
import { Globe, FileText, Code, CreditCard, Bot } from "lucide-react";

export function ActivityTimeline() {
  const iconMap = {
    train: Globe,
    upload: FileText,
    install: Code,
    billing: CreditCard,
    create_bot: Bot,
  };

  return (
    <DashboardCard>
      <div className="pb-4 border-b border-[#24262D] mb-6">
        <h3 className="text-card-title text-[#F5F5F5]">Activity Timeline</h3>
      </div>

      <div className="relative pl-6 border-l border-[#20232A] space-y-6 ml-3">
        {activityEvents.map((evt) => {
          const Icon = iconMap[evt.type] || Bot;
          return (
            <div key={evt.id} className="relative">
              {/* Timeline dot */}
              <span className="absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#101113] border border-[#2A2E36] text-[#8B919D]">
                <Icon className="w-3.5 h-3.5 text-[#E8281E]" />
              </span>

              {/* Event Content */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] font-semibold text-[#F5F5F5]">
                    {evt.text}
                  </span>
                  <span className="text-[11px] text-[#8B919D] shrink-0 font-mono">
                    {evt.time}
                  </span>
                </div>
                {evt.metadata && (
                  <p className="text-[12px] text-[#8B919D] mt-0.5">
                    {evt.metadata}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
