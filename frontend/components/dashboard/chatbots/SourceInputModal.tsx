"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SourceInputModalProps {
  type: "Website" | "File" | "Article" | "FAQ" | "Text";
  onClose: () => void;
  onSubmit: (type: string, title: string, content: string) => Promise<void>;
}

export function SourceInputModal({ type, onClose, onSubmit }: SourceInputModalProps) {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text === "string") {
        setVal2(text);
        setVal1(file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type !== "Text" && !val1.trim()) return;
    if (!val2.trim()) return;
    setLoading(true);
    await onSubmit(type, type === "Text" ? "Raw Text" : val1, val2);
    setLoading(false);
  };

  const LABELS: Record<
    string,
    { title: string; label1: string; placeholder1: string; label2: string; placeholder2: string }
  > = {
    Website: {
      title: "Add Website Source",
      label1: "Website URL",
      placeholder1: "https://example.com/pricing",
      label2: "Scraped Text Content",
      placeholder2: "Paste copy-pasted or scraped page text here...",
    },
    File: {
      title: "Add File Document",
      label1: "Filename",
      placeholder1: "refund-policy.txt",
      label2: "File Content",
      placeholder2: "Or select a .txt file above to auto-fill...",
    },
    Article: {
      title: "Add Article Text",
      label1: "Article Title",
      placeholder1: "Shipping Guidelines",
      label2: "Article Body",
      placeholder2: "Write or paste the full article details here...",
    },
    FAQ: {
      title: "Add Q&A FAQ Pair",
      label1: "Question",
      placeholder1: "Do you offer international shipping?",
      label2: "Answer",
      placeholder2: "Yes, we ship to over 100 countries globally...",
    },
    Text: {
      title: "Add Raw Text Document",
      label1: "",
      placeholder1: "",
      label2: "Text Content",
      placeholder2: "Paste FAQ answers, refund rules, shipping costs, etc...",
    },
  };
  const L = LABELS[type] ?? { title: "Add Document", label1: "", placeholder1: "", label2: "Content", placeholder2: "" };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c0c0e] border border-white/5 w-full max-w-lg rounded-[22px] overflow-hidden shadow-2xl p-6 relative font-sans animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
        >
          <X size={15} />
        </button>

        <h3 className="text-[16px] font-bold text-white mb-6 pr-8">{L.title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "File" && (
            <div className="space-y-1.5 pb-1">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Upload Text File (.txt)
              </label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border file:border-white/5 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer"
              />
            </div>
          )}

          {type !== "Text" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                {L.label1}
              </label>
              <Input
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                placeholder={L.placeholder1}
                required
                className="bg-[#111111] border border-white/5 pl-3 pr-3 text-[13px] rounded-xl text-white placeholder-zinc-500 h-10 w-full focus:outline-none focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              {L.label2}
            </label>
            <Textarea
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
              placeholder={L.placeholder2}
              rows={8}
              required
              className="bg-[#111111] border border-white/5 p-3 text-[13px] rounded-xl text-white placeholder-zinc-500 w-full focus:outline-none focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 transition-all leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-white/5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent hover:bg-white/5 border border-white/5 rounded-xl h-9 text-[12px] font-bold px-4 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-9 text-[12px] font-bold px-4 transition-all cursor-pointer border-none flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Add source</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
