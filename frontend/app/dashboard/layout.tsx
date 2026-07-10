import { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/shell/DashboardShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
