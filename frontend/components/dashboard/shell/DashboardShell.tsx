"use client";
import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/shell/DashboardSidebar";
import { DashboardTopNav } from "@/components/dashboard/shell/DashboardTopNav";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard-dark min-h-screen bg-[#0B0B0C] text-[#F5F5F5] flex font-sans antialiased">
      {/* Sidebar: Fixed, full height */}
      <DashboardSidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Nav: Sticky at top of the main column */}
        <DashboardTopNav />

        {/* Content Container: Scrollable, max-width 1600px, 32px padding (p-8), 24px gaps */}
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-[1600px] mx-auto p-8 flex flex-col gap-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
