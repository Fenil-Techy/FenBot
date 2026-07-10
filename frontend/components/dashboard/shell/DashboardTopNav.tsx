"use client";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";
import { navItems } from "@/lib/dashboard/nav-config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/dashboard/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header className="h-[64px] px-8 border-b border-[#20232A] bg-[#0B0B0C] flex items-center justify-between sticky top-0 z-30 shrink-0 select-none">
      {/* Title */}
      <h1 className="text-[18px] font-semibold text-[#F5F5F5] font-display">
        {title}
      </h1>

      {/* Right Tools Section */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-64 max-[880px]:hidden">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8B919D]" />
          <Input
            type="search"
            placeholder="Search console..."
            className="w-full bg-[#16181D] border-[#2A2E36] pl-9 pr-4 h-9 text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] focus:ring-1 focus:ring-[#E8281E] focus:border-[#E8281E] focus:outline-none"
          />
        </div>

        {/* Notifications Dropdown Placeholder */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl relative shrink-0 cursor-pointer"
              />
            }
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8281E]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] p-2 rounded-xl shadow-2xl">
            <div className="font-semibold text-[13px] text-[#F5F5F5] px-2 py-1.5 border-b border-[#24262D]">
              Recent Alerts
            </div>
            <div className="py-8 px-4 text-[12px] text-[#8B919D] text-center">
              No unread notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create Chatbot CTA */}
        <Button
          onClick={() => router.push("/dashboard/chatbots")}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-9 text-[13px] font-medium flex items-center gap-1.5 px-4 transition-colors cursor-pointer border-none"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Create Chatbot</span>
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-[#24262D]" />

        {/* Quick Profile Avatar */}
        <Avatar className="w-8 h-8 border border-[#2A2E36] shrink-0">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback className="bg-[#252932] text-[#F5F5F5] text-[11px] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
