"use client";
import { useState } from "react";
import { BarChart3, Sliders, TrendingUp, Zap } from "lucide-react";
import { hasData as initialHasData, analyticsMetrics, dailyConversationCounts, hourlyPerformance } from "@/lib/dashboard/mock-data";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [demoHasData, setDemoHasData] = useState(initialHasData.analytics);

  const maxCount = Math.max(...dailyConversationCounts.map((d) => d.count));

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <p className="text-[14px] text-[#8B919D]">Understand how effectively the AI resolves customer inquiries.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setDemoHasData(!demoHasData)}
          className="text-[12px] h-8 text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl flex items-center gap-1.5 px-3 border border-[#2A2E36] cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>State: {demoHasData ? "Populated" : "Empty"}</span>
        </Button>
      </div>

      {!demoHasData ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics insights yet."
          description="Insights on automation rates, CSAT score, and average resolution times will populate here once your chatbots interact with customers."
        />
      ) : (
        <div className="space-y-6">
          {/* KPI metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsMetrics.map((m) => (
              <KpiCard
                key={m.id}
                title={m.title}
                value={m.value}
                description={m.description}
                trend={m.trend}
                trendDirection={m.trendDirection}
              />
            ))}
          </div>

          {/* Two HTML/CSS chart grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Daily Conversations Bar Chart */}
            <DashboardCard className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#24262D] mb-6">
                  <h3 className="text-card-title text-[#F5F5F5] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#E8281E]" />
                    <span>Daily Inquiries & Automation</span>
                  </h3>
                  <span className="text-[11px] text-[#8B919D] font-mono">Last 7 Days</span>
                </div>

                {/* Bars Grid */}
                <div className="h-60 flex items-end justify-between gap-2 px-2 mt-4">
                  {dailyConversationCounts.map((data) => {
                    const totalHeight = `${(data.count / maxCount) * 100}%`;
                    const automatedHeight = `${(data.automated / data.count) * 100}%`;

                    return (
                      <div key={data.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        {/* Bar */}
                        <div className="relative w-full rounded-t-lg bg-[#252932] overflow-hidden hover:bg-[#2A2E36] transition-all duration-150" style={{ height: totalHeight }}>
                          {/* Inner automated portion */}
                          <div className="absolute bottom-0 left-0 right-0 bg-[#E8281E] rounded-t-md hover:bg-[#C41F16]" style={{ height: automatedHeight }} />
                          
                          {/* Hover Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] text-[10px] p-2 rounded-lg -top-12 left-1/2 -translate-x-1/2 shadow-xl z-20 pointer-events-none transition-all w-24 text-center leading-normal">
                            <div>Total: {data.count}</div>
                            <div className="text-[#E8281E] font-semibold">Auto: {data.automated}</div>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#8B919D] font-semibold">{data.day}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-6 text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#E8281E]" />
                    <span className="text-[#B4BAC5]">Automated by AI</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#252932]" />
                    <span className="text-[#8B919D]">Human Agent Handled</span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Chart 2: Hourly Performance */}
            <DashboardCard className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#24262D] mb-6">
                  <h3 className="text-card-title text-[#F5F5F5] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>AI Automation Efficiency</span>
                  </h3>
                  <span className="text-[11px] text-[#8B919D] font-mono">By Peak Hours</span>
                </div>

                {/* Horizontal Progress Bars */}
                <div className="space-y-4 py-2">
                  {hourlyPerformance.map((item) => (
                    <div key={item.hour} className="space-y-1">
                      <div className="flex justify-between items-center text-[12px] text-[#B4BAC5]">
                        <span className="font-semibold">{item.hour}</span>
                        <span className="font-mono text-[#F5F5F5]">{item.rate}% success rate</span>
                      </div>
                      <div className="h-2 w-full bg-[#1D2026] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E8281E] to-[#EF4444] rounded-full"
                          style={{ width: `${item.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#16181D] p-3 rounded-xl border border-[#20232A] mt-6 text-[12px] text-[#8B919D] leading-normal flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">Tip:</span>
                  <span>AI efficiency peaks during business hours when document models receive frequent training updates.</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      )}
    </div>
  );
}
