import React from "react";
import { Sparkles, MessageCircle } from "lucide-react";

export function AutomationVisual() {
  return (
    <div className="w-full h-[380px] bg-slate-50/50 rounded-2xl border border-slate-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-150 shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800">Support Chat Widget</span>
        </div>
        <MessageCircle className="size-4 text-brand" />
      </div>

      {/* Messages */}
      <div className="flex-1 py-4 space-y-4 overflow-y-auto text-xs sm:text-sm min-h-0">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-slate-100 text-slate-800 px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%] font-medium">
            My verification code has expired. Could you help me with that?
          </div>
        </div>

        {/* Bot Message */}
        <div className="flex justify-start">
          <div className="bg-red-50 text-slate-850 border border-brand/5 p-4 rounded-2xl rounded-tl-none max-w-[85%] space-y-2 shadow-sm leading-relaxed relative">
            <p>
              Sure! Choose the "request new code" option. Then check your email or phone messages.
            </p>
            
            {/* Answered by AI badge */}
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand uppercase tracking-wider bg-white border border-brand/10 px-2 py-0.5 rounded-full w-fit">
              <Sparkles className="size-2.5 text-brand" />
              Answered by AI
            </div>
          </div>
        </div>
      </div>

      {/* Fake Input Area */}
      <div className="border-t border-slate-150 pt-3 flex items-center justify-between text-xs text-slate-400 select-none shrink-0">
        <span>Type a message...</span>
        <div className="size-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
          +
        </div>
      </div>
    </div>
  );
}
