import React from "react";
import { Inbox, Compass, Laptop, DollarSign, User } from "lucide-react";

export function InboxVisual() {
  return (
    <div className="w-full h-[380px] bg-white rounded-2xl border border-slate-200/80 shadow-md flex overflow-hidden">
      {/* Sidebar: Chat Inbox Lists */}
      <div className="w-[30%] bg-slate-50 border-r border-slate-200/80 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-150 flex items-center gap-1.5 bg-slate-100/50">
          <Inbox className="size-3.5 text-brand" />
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Inbox (2)</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Active Chat */}
          <div className="p-2.5 bg-white border-b border-slate-150 border-l-[3px] border-l-brand">
            <p className="text-[10px] font-bold text-slate-800 truncate">Sarah Jenkins</p>
            <p className="text-[9px] text-slate-400 truncate mt-0.5">I need help with my refund...</p>
          </div>
          {/* Inactive Chat */}
          <div className="p-2.5 border-b border-slate-150 hover:bg-slate-100/30 transition-colors">
            <p className="text-[10px] font-semibold text-slate-650 truncate">Michael Chen</p>
            <p className="text-[9px] text-slate-400 truncate mt-0.5">Can you update my shipping...</p>
          </div>
        </div>
      </div>

      {/* Main Conversation Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat header */}
        <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <span className="text-[11px] font-bold text-slate-800">Sarah Jenkins</span>
          <span className="text-[8px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
            Waiting on Agent
          </span>
        </div>

        {/* Chat log */}
        <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto text-[10px] sm:text-[11px]">
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-800 px-3 py-2 rounded-xl rounded-tl-none max-w-[90%] font-medium">
              I need help with my refund request.
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-brand text-white px-3 py-2 rounded-xl rounded-tr-none max-w-[90%] font-medium shadow shadow-red-900/10">
              Hi Sarah, I see your refund request for order #1084. I have processed it now, you will see it in 3-5 days.
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Visitor details */}
      <div className="w-[30%] bg-slate-50 border-l border-slate-200/80 p-3 space-y-3.5 shrink-0 hidden sm:block">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Session Details</span>
        
        {/* Detail Items */}
        <div className="space-y-2.5 text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Compass className="size-3.5 text-slate-400" />
            <span className="truncate">London, UK</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Laptop className="size-3.5 text-slate-400" />
            <span className="truncate">macOS · Chrome</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <DollarSign className="size-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">$149.00 Cart</span>
          </div>
        </div>

        {/* User Card */}
        <div className="border border-slate-200/80 rounded-lg p-2 bg-white flex items-center gap-1.5">
          <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <User className="size-3" />
          </div>
          <div className="truncate">
            <p className="text-[9px] font-bold text-slate-800">Sarah Jenkins</p>
            <p className="text-[8px] text-slate-400">sarah@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
