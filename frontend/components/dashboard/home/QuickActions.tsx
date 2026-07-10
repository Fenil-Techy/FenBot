"use client";
import { useRouter } from "next/navigation";
import { DashboardCard } from "../shared/DashboardCard";
import { Bot, Globe, FileText, Code } from "lucide-react";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "Create Chatbot",
      desc: "Deploy a new AI support agent",
      icon: Bot,
      href: "/dashboard/chatbots",
      color: "text-[#E8281E] bg-[#E8281E]/10 border-[#E8281E]/20",
    },
    {
      title: "Train Website",
      desc: "Sync knowledge from your docs URL",
      icon: Globe,
      href: "/dashboard/knowledge",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Upload PDF",
      desc: "Add product guides or policies",
      icon: FileText,
      href: "/dashboard/knowledge",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Install Widget",
      desc: "Embed chat console on your site",
      icon: Code,
      href: "/dashboard/settings",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <DashboardCard className="flex flex-col h-full justify-between">
      <div>
        <div className="pb-4 border-b border-[#24262D] mb-4">
          <h3 className="text-card-title text-[#F5F5F5]">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.title}
                onClick={() => router.push(act.href)}
                className="p-4 rounded-xl border border-[#20232A] bg-[#101113] hover:bg-[#1D2026] hover:border-[#2A2E36] transition-all duration-150 cursor-pointer group flex flex-col justify-between min-h-[110px]"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <div className="text-[13px] font-semibold text-[#F5F5F5] group-hover:text-white transition-colors">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-[#8B919D] mt-0.5 leading-tight">
                    {act.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
}
