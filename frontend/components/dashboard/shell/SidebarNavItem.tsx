"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function SidebarNavItem({ href, label, icon: Icon }: SidebarNavItemProps) {
  const pathname = usePathname();
  
  // Exact match for dashboard home, prefix match for others to keep active state when nested
  const isActive = href === "/dashboard" 
    ? pathname === "/dashboard" 
    : pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 px-4 h-[44px] rounded-[12px] text-[14px] font-medium transition-all group select-none",
        isActive
          ? "bg-[#252932] text-[#F5F5F5]"
          : "text-[#B4BAC5] hover:bg-[#1D2026] hover:text-[#F5F5F5]"
      )}
    >
      {/* 3px left active indicator in brand red */}
      {isActive && (
        <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-[#E8281E]" />
      )}
      
      <Icon
        className={cn(
          "w-5 h-5 shrink-0 transition-colors",
          isActive ? "text-[#E8281E]" : "text-[#8B919D] group-hover:text-[#F5F5F5]"
        )}
      />
      <span className="leading-none">{label}</span>
    </Link>
  );
}
