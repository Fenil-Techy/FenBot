"use client";
import { useState } from "react";
import { ChevronsUpDown, Check, Plus, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function WorkspaceSwitcher() {
  const workspaces = ["Acme Support", "Fenil Personal", "Test Sandbox"];
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="w-full justify-between h-[44px] px-3 text-[#F5F5F5] hover:bg-[#1D2026] hover:text-[#F5F5F5] border border-[#20232A] rounded-xl flex items-center gap-2 cursor-pointer focus:ring-0 focus-visible:ring-0"
          />
        }
      >
        <div className="flex items-center gap-2 text-left min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#E8281E]/10 flex items-center justify-center text-[#E8281E] shrink-0 font-bold text-xs border border-[#E8281E]/20">
            A
          </div>
          <div className="font-semibold text-[14px] truncate leading-none">
            {activeWorkspace}
          </div>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-[#8B919D] shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[236px] bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] p-1 rounded-xl shadow-2xl">
        <div className="text-[10px] font-semibold text-[#8B919D] px-2.5 py-1.5 uppercase tracking-wider select-none">
          Workspaces
        </div>
        {workspaces.map((w) => (
          <DropdownMenuItem
            key={w}
            onClick={() => setActiveWorkspace(w)}
            className="flex items-center justify-between px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#1D2026] focus:text-[#F5F5F5] transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Building className="w-4 h-4 text-[#8B919D] shrink-0" />
              <span className="truncate">{w}</span>
            </div>
            {activeWorkspace === w && <Check className="w-4 h-4 text-[#E8281E] shrink-0" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-[#24262D]" />
        <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-lg cursor-pointer focus:bg-[#1D2026] focus:text-[#F5F5F5] transition-colors">
          <Plus className="w-4 h-4 text-[#8B919D]" />
          <span>Create Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
