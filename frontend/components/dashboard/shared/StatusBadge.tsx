import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "online" | "offline" | "training";
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const dotColorMap = {
    online: "bg-[#22C55E]",
    offline: "bg-[#EF4444]",
    training: "bg-[#F59E0B] animate-pulse",
  };

  const defaultLabelMap = {
    online: "Online",
    offline: "Offline",
    training: "Training",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#16181D] text-[#B4BAC5] border border-[#2A2E36]",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColorMap[status])} />
      <span className="leading-none">{label || defaultLabelMap[status]}</span>
    </span>
  );
}
