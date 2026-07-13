"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Inbox,
  BookOpen,
  LineChart,
  Code,
  CreditCard,
  Settings,
  HelpCircle
} from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  label: string;
  isCollapsed: boolean;
}

const getIcon = (href: string) => {
  switch (href) {
    case "/dashboard":
      return LayoutDashboard;
    case "/dashboard/chatbots":
      return Bot;
    case "/dashboard/inbox":
      return Inbox;
    case "/dashboard/knowledge":
      return BookOpen;
    case "/dashboard/analytics":
      return LineChart;
    case "/dashboard/docs":
      return Code;
    case "/dashboard/billing":
      return CreditCard;
    case "/dashboard/settings":
      return Settings;
    case "/dashboard/help":
      return HelpCircle;
    default:
      return HelpCircle;
  }
};

export function SidebarNavItem({ href, label, isCollapsed }: SidebarNavItemProps) {
  const pathname = usePathname();
  
  // Exact match for dashboard home, prefix match for others to keep active state when nested
  const isActive = href === "/dashboard" 
    ? pathname === "/dashboard" 
    : pathname === href || pathname?.startsWith(href + "/");

  const IconNode = getIcon(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center rounded-[12px] text-[14px] font-medium transition-all group select-none h-11 border border-transparent pl-3 pr-3.5",
        isCollapsed ? "justify-center px-0 w-11 mx-auto" : "gap-3",
        isActive
          ? "bg-[#151515] text-[#FAFAFA]"
          : "text-[#71717A] hover:bg-[#111111] hover:text-[#FAFAFA]"
      )}
    >
      {/* Red Left Indicator (Linear-style active indicator) */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#E8281E]" />
      )}

      <IconNode
        size={18}
        strokeWidth={isActive ? 2 : 1.5}
        className={cn(
          "shrink-0 transition-colors",
          isActive ? "text-[#E8281E]" : "text-[#71717A] group-hover:text-[#FAFAFA]"
        )}
      />
      
      {!isCollapsed && <span className="leading-none tracking-tight">{label}</span>}

      {/* Premium Collapsed Tooltip Bubble (Vercel Style) */}
      {isCollapsed && (
        <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none transition-all animate-in fade-in slide-in-from-left-2 duration-150">
          {/* Left Arrow */}
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-[#111111] mr-[-1px]" />
          {/* Tooltip Content */}
          <div className="bg-[#111111] text-[#FAFAFA] text-[12px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-white/5">
            {label}
          </div>
        </div>
      )}
    </Link>
  );
}
