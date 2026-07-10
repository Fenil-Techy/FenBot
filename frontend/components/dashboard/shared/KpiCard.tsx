import { DashboardCard } from "./DashboardCard";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export function KpiCard({
  title,
  value,
  description,
  trend,
  trendDirection = "neutral"
}: KpiCardProps) {
  const isUp = trendDirection === "up";
  const isDown = trendDirection === "down";

  return (
    <DashboardCard className="flex flex-col justify-between h-full">
      <div>
        <p className="text-[14px] text-[#8B919D] font-medium leading-none">{title}</p>
        <h4 className="text-metric text-[#F5F5F5] mt-2 font-bold tracking-tight leading-none">
          {value}
        </h4>
      </div>
      <div className="flex items-center gap-2 mt-4 text-[13px]">
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold text-[11px] tracking-wide",
              isUp && "bg-[#22C55E]/10 text-[#22C55E]",
              isDown && "bg-[#EF4444]/10 text-[#EF4444]",
              trendDirection === "neutral" && "bg-[#252932] text-[#B4BAC5]"
            )}
          >
            {isUp && <ArrowUpRight className="w-3 h-3" />}
            {isDown && <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
        <span className="text-[#8B919D] text-[12px]">{description}</span>
      </div>
    </DashboardCard>
  );
}
