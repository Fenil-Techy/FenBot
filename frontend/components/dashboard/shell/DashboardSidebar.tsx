"use client";
import Link from "next/link";
import { navItems } from "@/lib/dashboard/nav-config";
import { SidebarNavItem } from "./SidebarNavItem";
import { UserProfile } from "./UserProfile";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ isCollapsed, onToggle }: DashboardSidebarProps) {
  const mainNavItems = navItems.filter((item) => item.group === "main");
  const secondaryNavItems = navItems.filter((item) => item.group === "secondary");

  return (
    <aside className={`h-full bg-[#090909] border border-white/5 rounded-[20px] flex flex-col shrink-0 select-none transition-all duration-300 overflow-visible z-20 relative ${
      isCollapsed ? "w-[72px]" : "w-[260px]"
    }`}>
      {/* Top Header: Logo & Toggle Button */}
      <div className={`px-4 py-4 flex border-b border-white/5 shrink-0 ${
        isCollapsed ? "flex-col items-center" : "items-center justify-between"
      }`}>
        <Link href="/dashboard" className="flex items-center gap-2 group overflow-hidden shrink-0">
          <img
            src="/logo/rocket.svg"
            alt="FenBot Logo"
            className="w-8 h-8 shrink-0 object-contain rotate-[20deg]"
          />
          {!isCollapsed && (
            <span className="font-sans font-bold text-[18px] text-[#FAFAFA] tracking-tight group-hover:text-white transition-colors truncate">
              FenBot
            </span>
          )}
        </Link>

        {isCollapsed ? (
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#111111] border border-white/5 hover:bg-[#151515] text-[#71717A] hover:text-[#FAFAFA] transition-all cursor-pointer mt-4 shrink-0"
            title="Expand Sidebar"
          >
            <PanelLeft size={16} strokeWidth={1.5} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#111111] border border-white/5 hover:bg-[#151515] text-[#71717A] hover:text-[#FAFAFA] transition-all cursor-pointer shrink-0"
            title="Collapse Sidebar"
          >
            <PanelLeftClose size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-visible p-4 space-y-6">
        {/* Main Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-[#71717A] px-3.5 mb-2 uppercase tracking-wider">
              General
            </div>
          )}
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mx-2" />

        {/* Secondary Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-[#71717A] px-3.5 mb-2 uppercase tracking-wider">
              System
            </div>
          )}
          {secondaryNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-white/5 bg-[#090909] shrink-0 rounded-b-[20px]">
        <UserProfile isCollapsed={isCollapsed} onToggle={isCollapsed ? onToggle : undefined} />
      </div>
    </aside>
  );
}
