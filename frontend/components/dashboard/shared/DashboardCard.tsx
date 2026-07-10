import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DashboardCard({ children, className, onClick }: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "dashboard-card",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
