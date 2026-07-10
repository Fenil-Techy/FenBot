"use client";
import Link from "next/link";
import { navItems } from "@/lib/dashboard/nav-config";
import { SidebarNavItem } from "./SidebarNavItem";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { UserProfile } from "./UserProfile";

export function DashboardSidebar() {
  const mainNavItems = navItems.filter((item) => item.group === "main");
  const secondaryNavItems = navItems.filter((item) => item.group === "secondary");

  return (
    <aside className="w-[260px] h-screen bg-[#101113] border-r border-[#20232A] flex flex-col shrink-0 select-none">
      {/* Top Header: Logo */}
      <div className="h-16 px-6 flex items-center gap-2 border-b border-[#20232A]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-lg bg-[#E8281E] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#E8281E]/20">
            F
          </div>
          <span className="font-display font-bold text-[18px] text-[#F5F5F5] tracking-tight group-hover:text-white transition-colors">
            FenBot
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#252932] text-[#B4BAC5] font-mono leading-none">
            Beta
          </span>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="p-4 border-b border-[#20232A]">
        <WorkspaceSwitcher />
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Items */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#24262D] mx-2" />

        {/* Secondary Items */}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-[#20232A] bg-[#0E0F11]">
        <UserProfile />
      </div>
    </aside>
  );
}
