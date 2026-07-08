import React from "react";
import { Globe, Upload, Loader2, CheckCircle2 } from "lucide-react";

export function ImportMockup() {
  return (
    <div className="w-full h-full flex flex-col justify-between space-y-5">
      {/* Title */}
      <div>
        <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Globe className="size-5 text-brand" />
          Sync Knowledge Base
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          Scan and learn FAQ, policies, and products from your live site.
        </p>
      </div>

      {/* Input section */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value="www.fenbot.ai"
            className="flex-1 h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          />
          <button className="h-10 px-4 text-xs font-semibold bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors shrink-0">
            Import my site
          </button>
        </div>
      </div>

      {/* Crawled URL log list */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Crawler Progress Log</span>
          <span className="text-brand">2/3 Synced</span>
        </div>
        <div className="border border-slate-100 rounded-xl bg-slate-50/50 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-650 font-mono font-medium">https://www.fenbot.ai/</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              <CheckCircle2 className="size-3" /> Synced
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-650 font-mono font-medium">https://www.fenbot.ai/pricing</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              <CheckCircle2 className="size-3" /> Synced
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-650 font-mono font-medium">https://www.fenbot.ai/features</span>
            <span className="flex items-center gap-1 text-brand font-semibold bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
              <Loader2 className="size-3 animate-spin" /> Crawling...
            </span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-4 flex items-center justify-center gap-3 text-center cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center">
          <Upload className="size-4.5 text-brand" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-slate-700">Upload document guides</p>
          <p className="text-[10px] text-slate-450">Drop PDFs, TXT, or CSV files here</p>
        </div>
      </div>
    </div>
  );
}
