"use client";
import { useRouter } from "next/navigation";
import { recentConversations } from "@/lib/dashboard/mock-data";
import { DashboardCard } from "../shared/DashboardCard";
import { StatusBadge } from "../shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function RecentConversations() {
  const router = useRouter();

  const getStatusType = (status: string): "online" | "training" | "offline" => {
    if (status === "open") return "online";
    if (status === "pending") return "training";
    return "offline";
  };

  return (
    <DashboardCard className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#24262D]">
          <h3 className="text-card-title text-[#F5F5F5]">Recent Conversations</h3>
          <span className="text-[12px] text-[#8B919D] font-mono">
            {recentConversations.length} Active
          </span>
        </div>

        <div className="divide-y divide-[#20232A] mt-2">
          {recentConversations.slice(0, 5).map((conv) => (
            <div
              key={conv.id}
              onClick={() => router.push(`/dashboard/inbox?id=${conv.id}`)}
              className="py-3 flex items-center justify-between gap-4 cursor-pointer group hover:bg-[#1D2026]/40 px-2 rounded-xl transition-all duration-150"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[13px] text-[#F5F5F5] group-hover:text-white truncate">
                    {conv.customerName}
                  </span>
                  <span className="text-[11px] text-[#8B919D] shrink-0">
                    • {conv.time}
                  </span>
                </div>
                <p className="text-[12px] text-[#8B919D] truncate mt-0.5">
                  {conv.preview}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge
                  status={getStatusType(conv.status)}
                  label={conv.status}
                  className="text-[10px] py-0 px-2"
                />
                <ChevronRight className="w-4 h-4 text-[#8B919D] group-hover:text-[#F5F5F5] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#24262D] mt-4 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/inbox")}
          className="text-[#E8281E] hover:text-[#C41F16] hover:bg-transparent text-[13px] font-semibold flex items-center gap-1 p-0 h-auto cursor-pointer"
        >
          <span>View Inbox</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </DashboardCard>
  );
}
