"use client";
import { useState } from "react";
import { BookOpen, Sliders, Trash2, Globe, FileText, FileCode } from "lucide-react";
import { hasData as initialHasData, knowledgeSources } from "@/lib/dashboard/mock-data";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function KnowledgePage() {
  const [demoHasData, setDemoHasData] = useState(initialHasData.knowledge);
  const [sources, setSources] = useState(knowledgeSources);
  const [sourceType, setSourceType] = useState<"website" | "pdf" | "manual">("website");
  const [sourceName, setSourceName] = useState("");
  const [sourceValue, setSourceValue] = useState("");

  const handleAddSource = () => {
    if (!sourceName.trim()) return;

    const newSource = {
      id: `ks-new-${Date.now()}`,
      type: sourceType,
      name: sourceName,
      value: sourceValue || (sourceType === "website" ? "https://..." : sourceType === "pdf" ? "1.2 MB" : "Custom QA"),
      status: "training" as const,
      dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    };

    setSources([newSource, ...sources]);
    setSourceName("");
    setSourceValue("");
    setDemoHasData(true);
  };

  const handleDelete = (id: string) => {
    const updated = sources.filter((s) => s.id !== id);
    setSources(updated);
    if (updated.length === 0) {
      setDemoHasData(false);
    }
  };

  const getStatusType = (status: "ready" | "training" | "failed"): "online" | "training" | "offline" => {
    if (status === "ready") return "online";
    if (status === "training") return "training";
    return "offline";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <p className="text-[14px] text-[#8B919D]">Ground your AI support agents in your documents and policies.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setDemoHasData(!demoHasData)}
          className="text-[12px] h-8 text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl flex items-center gap-1.5 px-3 border border-[#2A2E36] cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>State: {demoHasData ? "Populated" : "Empty"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form input to add knowledge */}
        <div className="lg:col-span-1">
          <DashboardCard className="flex flex-col gap-4">
            <h3 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D]">
              Add Knowledge Source
            </h3>

            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                Source Type
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#101113] p-1 border border-[#20232A] rounded-xl">
                {(["website", "pdf", "manual"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSourceType(t)}
                    className={`py-1.5 rounded-lg text-[11px] font-semibold uppercase transition-colors cursor-pointer select-none border-none ${
                      sourceType === t
                        ? "bg-[#252932] text-[#F5F5F5]"
                        : "text-[#8B919D] hover:text-[#F5F5F5]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                Source Title
              </label>
              <Input
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder={
                  sourceType === "website"
                    ? "Acme Help Center"
                    : sourceType === "pdf"
                    ? "Refund_Policy.pdf"
                    : "FAQ Setup FAQ"
                }
                className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] h-9 focus:ring-1 focus:ring-[#E8281E] focus:outline-none"
              />
            </div>

            {/* Source Value Details */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                {sourceType === "website"
                  ? "URL Path"
                  : sourceType === "pdf"
                  ? "File Size Detail"
                  : "FAQ Content Details"}
              </label>
              {sourceType === "manual" ? (
                <Textarea
                  value={sourceValue}
                  onChange={(e) => setSourceValue(e.target.value)}
                  placeholder="Paste your QA faq lines or guidelines here..."
                  rows={4}
                  className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] p-3 focus:ring-1 focus:ring-[#E8281E] focus:outline-none"
                />
              ) : (
                <Input
                  value={sourceValue}
                  onChange={(e) => setSourceValue(e.target.value)}
                  placeholder={
                    sourceType === "website" ? "https://docs.acme.com" : "1.8 MB"
                  }
                  className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] h-9 focus:ring-1 focus:ring-[#E8281E] focus:outline-none"
                />
              )}
            </div>

            <Button
              onClick={handleAddSource}
              disabled={!sourceName.trim()}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-10 text-[13px] font-medium transition-colors w-full mt-2 cursor-pointer border-none"
            >
              Add Source
            </Button>
          </DashboardCard>
        </div>

        {/* Right Column: Source List */}
        <div className="lg:col-span-2">
          {!demoHasData ? (
            <EmptyState
              icon={BookOpen}
              title="No knowledge sources found."
              description="Add websites, PDF files, or manual QA sets to train your AI and allow it to answer customer support queries."
            />
          ) : (
            <DashboardCard className="space-y-4">
              <div className="pb-3 border-b border-[#24262D] flex justify-between items-center">
                <h3 className="text-card-title text-[#F5F5F5]">Active Sources</h3>
                <span className="text-[12px] text-[#8B919D] font-mono">
                  {sources.length} sources active
                </span>
              </div>

              <div className="divide-y divide-[#20232A] space-y-2">
                {sources.map((s) => {
                  return (
                    <div
                      key={s.id}
                      className="py-3 flex items-center justify-between gap-4 first:pt-0"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Type Icon */}
                        <div className="w-8 h-8 rounded-lg bg-[#20232A] border border-[#2A2E36] flex items-center justify-center shrink-0 text-[#8B919D]">
                          {s.type === "website" ? (
                            <Globe className="w-4 h-4 text-blue-400" />
                          ) : s.type === "pdf" ? (
                            <FileText className="w-4 h-4 text-amber-400" />
                          ) : (
                            <FileCode className="w-4 h-4 text-purple-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <span className="font-semibold text-[13px] text-[#F5F5F5] block truncate">
                            {s.name}
                          </span>
                          <span className="text-[11px] text-[#8B919D] truncate block mt-0.5">
                            {s.value}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-[#8B919D] font-mono">{s.dateAdded}</span>
                        <StatusBadge status={getStatusType(s.status)} label={s.status} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(s.id)}
                          className="w-8 h-8 text-[#8B919D] hover:text-red-400 hover:bg-[#1D2026] rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}
