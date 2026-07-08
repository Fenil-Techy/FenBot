import React from "react";

export function DashboardMockup() {
  return (
    <div className="w-full h-[135%] flex flex-col bg-white rounded-xl shadow-inner overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-red-400" />
          <div className="size-2.5 rounded-full bg-yellow-400" />
          <div className="size-2.5 rounded-full bg-green-400" />
        </div>

        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full bg-slate-200" />
          <div className="h-4 w-10 rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-36 bg-slate-50 border-r border-slate-200 p-3 space-y-2">
          <div className="h-6 rounded bg-red-100" />
          <div className="h-6 rounded bg-slate-200" />
          <div className="h-6 rounded bg-slate-200" />
          <div className="h-6 rounded bg-slate-200" />
        </div>

        {/* Main */}
        <div className="flex-1 p-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg border bg-slate-50"
              />
            ))}
          </div>

          {/* Chart */}
          <div className="relative h-[520px] rounded-lg border bg-slate-50 overflow-hidden">
            <div className="absolute inset-x-4 bottom-0 flex items-end gap-2 h-[520px]">
              {[30, 45, 60, 55, 80, 72, 92, 88, 100, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-[#E8281E]/20 border border-[#E8281E]/20"
                  style={{
                    height: `${h}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
