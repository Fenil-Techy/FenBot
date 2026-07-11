"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/dashboard/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#1D2026] text-left transition-colors cursor-pointer select-none group focus:outline-none" />
        }
      >
        <Avatar className="w-9 h-9 border border-[#2A2E36] shrink-0">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback className="bg-[#252932] text-[#F5F5F5] text-[13px] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 leading-none">
          <div className="font-semibold text-[13px] text-[#F5F5F5] truncate group-hover:text-white">
            {currentUser.name}
          </div>
          <div className="text-[11px] text-[#8B919D] truncate mt-1">
            {currentUser.email}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[228px] bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] p-1 rounded-xl shadow-2xl">
        <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#1D2026] focus:text-[#F5F5F5] transition-colors">
          <User className="w-4 h-4 text-[#8B919D] shrink-0" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#1D2026] focus:text-[#F5F5F5] transition-colors">
          <Settings className="w-4 h-4 text-[#8B919D] shrink-0" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#1D2026] focus:text-[#F5F5F5] transition-colors">
          <Sparkles className="w-4 h-4 text-[#E8281E] shrink-0" />
          <span>Upgrade to Pro</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#24262D]" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-red-400 rounded-lg cursor-pointer focus:bg-[#1D2026] focus:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
