"use client";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/lib/dashboard/nav-config";
import { Search, Bell, RefreshCw, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardTopNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Map pathname to active config
  const activeItem = navItems.find(
    (item) =>
      item.href === pathname ||
      (item.href !== "/dashboard" && pathname?.startsWith(item.href))
  );
  const title = activeItem ? activeItem.label : "Dashboard";

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="h-[64px] px-8 border-b border-white/5 bg-[#090909]/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shrink-0 select-none">
      {/* Left Title */}
      <div className="flex items-center">
        <h1 className="text-[22px] font-bold text-[#FAFAFA] font-sans tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Tools Section */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative w-64 max-[880px]:hidden">
          <Search size={15} strokeWidth={1.5} className="absolute left-3.5 top-2.5 text-[#71717A]" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-[#111111] border border-white/5 pl-10 pr-4 h-9 text-[12px] rounded-full text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#E8281E] transition-all"
          />
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleRefresh}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#111111] border border-white/5 hover:bg-[#151515] text-[#71717A] hover:text-[#FAFAFA] transition-all cursor-pointer"
          title="Refresh Page"
        >
          <RefreshCw size={15} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => router.push("/dashboard/analytics")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#111111] border border-white/5 hover:bg-[#151515] text-[#71717A] hover:text-[#FAFAFA] transition-all cursor-pointer max-[640px]:hidden"
          title="Calendar / Analytics"
        >
          <Calendar size={15} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => router.push("/dashboard/inbox")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#111111] border border-white/5 hover:bg-[#151515] text-[#71717A] hover:text-[#FAFAFA] transition-all cursor-pointer relative"
          title="Inbox Messages"
        >
          <Bell size={15} strokeWidth={1.5} />
        </button>

      </div>
    </header>
  );
}
