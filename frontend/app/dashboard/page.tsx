"use client";
import { DashboardHero } from "@/components/dashboard/home/DashboardHero";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { RecentConversations } from "@/components/dashboard/home/RecentConversations";
import { QuickActions } from "@/components/dashboard/home/QuickActions";
import { ActivityTimeline } from "@/components/dashboard/home/ActivityTimeline";
import { ConversationPreview } from "@/components/dashboard/home/ConversationPreview";
import { homeKpis } from "@/lib/dashboard/mock-data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Widget */}
      <DashboardHero />

      {/* KPI Grid - 4 cards, responsive column count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {homeKpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            description={kpi.description}
            trend={kpi.trend}
            trendDirection={kpi.trendDirection}
          />
        ))}
      </div>

      {/* Two-Column Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <RecentConversations />
        </div>
        <div className="h-full">
          <QuickActions />
        </div>
      </div>

      {/* Activity Log */}
      <ActivityTimeline />

      {/* Highlighted Conversation Preview */}
      <ConversationPreview />
    </div>
  );
}