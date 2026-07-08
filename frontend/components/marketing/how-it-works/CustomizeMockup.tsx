import React from "react";
import { Palette, Check } from "lucide-react";

export function CustomizeMockup() {
  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Title */}
      <div>
        <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Palette className="size-5 text-brand" />
          Chatbot Theme Settings
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          Customize the chat widget appearance to match your brand style.
        </p>
      </div>

      {/* Form Settings */}
      <div className="space-y-4 text-xs">
        {/* Name & Theme */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chatbot Name</label>
            <input
              type="text"
              readOnly
              value="FenBot Support"
              className="mt-1.5 w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Mode</label>
            <div className="mt-1.5 grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg text-center font-semibold text-slate-650 h-9">
              <span className="bg-white text-slate-800 shadow-sm rounded-md flex items-center justify-center text-[10px]">Light</span>
              <span className="text-slate-500 flex items-center justify-center text-[10px]">Dark</span>
            </div>
          </div>
        </div>

        {/* Brand Theme Color dots */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brand Theme Color</label>
          <div className="mt-2 flex items-center gap-3">
            {/* Brand Red */}
            <div className="size-7 rounded-full bg-brand flex items-center justify-center cursor-pointer shadow-sm relative ring-2 ring-brand ring-offset-2">
              <Check className="size-3.5 text-white" strokeWidth={3} />
            </div>
            {/* Ocean Blue */}
            <div className="size-7 rounded-full bg-blue-500 cursor-pointer shadow-sm" />
            {/* Emerald Green */}
            <div className="size-7 rounded-full bg-emerald-500 cursor-pointer shadow-sm" />
            {/* Obsidian Black */}
            <div className="size-7 rounded-full bg-slate-900 cursor-pointer shadow-sm" />
          </div>
        </div>

        {/* Welcome Message */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Welcome Greeting</label>
          <input
            type="text"
            readOnly
            value="Hello! How can I help you today?"
            className="mt-1.5 w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Mini Widget Preview Block */}
      <div className="border border-slate-150 rounded-xl bg-slate-50 p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-brand flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            F
          </div>
          <div>
            <p className="font-bold text-slate-800 text-[11px]">FenBot Support</p>
            <p className="text-[9px] text-slate-400">Usually replies instantly</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-brand bg-red-50 border border-brand/10 px-2.5 py-0.5 rounded-full">
          Theme Applied
        </span>
      </div>
    </div>
  );
}
