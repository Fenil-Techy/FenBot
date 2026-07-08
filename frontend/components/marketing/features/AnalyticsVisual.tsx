import React from "react";
import { TrendingUp, Clock, Star } from "lucide-react";

export function AnalyticsVisual() {
  return (
    <div className="w-full h-[380px] bg-slate-50/50 rounded-2xl border border-slate-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden">
      {/* Metrics Strip */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <TrendingUp className="size-3.5 text-brand" />
            <span>Deflection</span>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">94.2%</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Clock className="size-3.5 text-brand" />
            <span>Resp. Time</span>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">&lt; 1s</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Star className="size-3.5 text-amber-500 fill-amber-500" />
            <span>CSAT</span>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">4.8/5</p>
        </div>
      </div>

      {/* SVG Deflection Trend Graph */}
      <div className="flex-1 min-h-0 bg-white border border-slate-150 rounded-xl mt-4 p-4 flex flex-col justify-between relative shadow-inner">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block shrink-0">Support Deflection Trend</span>
        
        {/* SVG Path */}
        <div className="flex-1 w-full relative min-h-0 flex items-end">
          <svg className="w-full h-full max-h-[140px]" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8281E" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#E8281E" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />

            {/* Filled area */}
            <path
              d="M0,90 Q50,85 100,70 T200,30 T300,10 L300,100 L0,100 Z"
              fill="url(#chartGrad)"
            />
            {/* Trend line */}
            <path
              d="M0,90 Q50,85 100,70 T200,30 T300,10"
              fill="none"
              stroke="#E8281E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Dot at the end */}
            <circle cx="300" cy="10" r="4.5" fill="#E8281E" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* X-Axis labels */}
        <div className="flex justify-between text-[9px] font-semibold text-slate-400 mt-2 shrink-0 border-t border-slate-100 pt-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4 (AI Live)</span>
        </div>
      </div>
    </div>
  );
}
