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
import { User, Settings, LogOut, PanelLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfileProps {
  isCollapsed: boolean;
  onToggle?: () => void;
}

export function UserProfile({ isCollapsed, onToggle }: UserProfileProps) {
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
          <button className={`w-full flex items-center rounded-xl hover:bg-[#111111] border border-transparent hover:border-white/5 text-left transition-all duration-200 cursor-pointer select-none group focus:outline-none ${
            isCollapsed ? "justify-center p-0 w-12 h-12 mx-auto" : "gap-3 p-2"
          }`} />
        }
      >
        <Avatar className="w-9 h-9 border border-white/5 shrink-0 transition-transform duration-200 group-hover:scale-105">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback className="bg-[#111111] text-[#FAFAFA] text-[12px] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="min-w-0 flex-1 leading-tight">
            <div className="font-semibold text-[14px] text-[#FAFAFA] truncate group-hover:text-white transition-colors">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-[#71717A] truncate mt-0.5">
              #OWN-9f6d40d9
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[228px] bg-[#111111] border border-white/5 text-[#FAFAFA] p-1 rounded-xl shadow-2xl">
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#151515] focus:text-[#FAFAFA] transition-colors"
        >
          <User size={16} strokeWidth={1.5} className="text-[#71717A]" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#151515] focus:text-[#FAFAFA] transition-colors"
        >
          <Settings size={16} strokeWidth={1.5} className="text-[#71717A]" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        {onToggle && (
          <DropdownMenuItem
            onClick={onToggle}
            className="flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#151515] focus:text-[#FAFAFA] transition-colors"
          >
            <PanelLeft size={16} strokeWidth={1.5} className="text-[#71717A]" />
            <span>Expand Sidebar</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-red-400 rounded-lg cursor-pointer focus:bg-[#151515] focus:text-red-300 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} className="text-red-400" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
