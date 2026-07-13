"use client";
import { ReactNode, useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/shell/DashboardSidebar";
import { DashboardTopNav } from "@/components/dashboard/shell/DashboardTopNav";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="dashboard-dark h-screen w-screen bg-[#090909] text-[#FAFAFA] flex font-sans antialiased overflow-hidden">
      {/* Sidebar: Floating Card Wrapper */}
      <div className="p-4 pr-2 shrink-0 h-full flex">
        <DashboardSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Column: Flat, edge-to-edge */}
      <div className="flex-1 flex flex-col bg-[#090909] h-full overflow-hidden">
        {/* Top Nav */}
        <DashboardTopNav />

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Subtle radial background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8281E]/3 rounded-full blur-[160px] pointer-events-none" />

          <main className="w-full max-w-[1600px] mx-auto p-8 flex flex-col gap-6 relative z-10 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
