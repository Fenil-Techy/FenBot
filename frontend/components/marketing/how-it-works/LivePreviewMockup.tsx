import React from "react";
import { Send, Smile } from "lucide-react";

export function LivePreviewMockup() {
  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Sandbox Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 shrink-0">
        <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-slate-700">Live Chat Sandbox</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-1 space-y-3.5 overflow-y-auto text-xs bg-white min-h-0">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-slate-100 text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-none max-w-[80%] font-medium">
            Do you offer a free trial?
          </div>
        </div>

        {/* Bot Message */}
        <div className="flex justify-start">
          <div className="bg-red-50 text-slate-850 border border-brand/5 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] space-y-1.5 shadow-sm leading-relaxed">
            Yes, we offer a 14-day free trial with access to all features! No credit card is required to sign up.
          </div>
        </div>

        {/* User Message 2 */}
        <div className="flex justify-end animate-fade-in">
          <div className="bg-slate-100 text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-none max-w-[80%] font-medium">
            Awesome, thank you!
          </div>
        </div>

        {/* Bot Message 2 */}
        <div className="flex justify-start animate-fade-in">
          <div className="bg-red-50 text-slate-850 border border-brand/5 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] space-y-1.5 shadow-sm leading-relaxed">
            You're welcome! Let me know if you have any other questions.
          </div>
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="border-t border-slate-100 pt-3 flex items-center gap-2 shrink-0">
        <div className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-slate-400 text-xs">
          <span>Type a message...</span>
          <Smile className="size-4 text-slate-400 cursor-pointer" />
        </div>
        <button className="size-9 bg-brand hover:bg-brand-hover text-white rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors shadow shadow-red-900/10">
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
