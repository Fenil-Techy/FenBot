import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#2A2E36] rounded-2xl bg-[#16181D]/40 max-w-lg mx-auto my-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#20232A] text-foreground mb-4">
        <Icon className="w-6 h-6 text-[#E8281E]" />
      </div>
      <h3 className="text-[16px] font-semibold text-[#F5F5F5] mb-1">{title}</h3>
      <p className="text-[14px] text-[#8B919D] max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium transition-colors"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
