"use client";

import { useState } from "react";
import { BookOpen, Plus, Trash2, Globe, File, Heading, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function parseDocument(content: string) {
  const m = content.match(/^\[(Website|File|Article|FAQ):\s*(.*?)\]\s*([\s\S]*)$/i);
  if (m) {
    return { type: m[1] as "Website" | "File" | "Article" | "FAQ", title: m[2], body: m[3] };
  }
  return { type: "Article" as const, title: "Text Document", body: content };
}

interface KnowledgeBaseTabProps {
  docs: any[];
  onAddSource: (content: string) => Promise<void>;
  handleDeleteDoc: (id: string) => void;
}

export function KnowledgeBaseTab({
  docs, onAddSource, handleDeleteDoc,
}: KnowledgeBaseTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const parsedDocs = docs.map((d) => ({ ...d, ...parseDocument(d.content) }));

  if (isAdding) {
    return (
      <div className="bg-gradient-to-b from-[#141416] to-[#0e0e0f] border border-white/5 rounded-2xl p-6 w-full min-w-0 space-y-4">
        <div>
          <h3 className="text-[16px] font-bold text-white">Add Raw Text Document</h3>
          <p className="text-[12px] text-zinc-500 mt-1">Ground your AI chatbot with custom text, FAQ answers, or instructions.</p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!textContent.trim()) return;
            setSubmitting(true);
            try {
              await onAddSource(textContent);
              setTextContent("");
              setIsAdding(false);
            } catch (err) {
              console.error(err);
            } finally {
              setSubmitting(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Text Content
            </label>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste FAQ answers, refund rules, shipping costs, etc..."
              rows={10}
              required
              className="bg-[#111111] border border-white/5 p-3 text-[13px] rounded-xl text-white placeholder-zinc-500 w-full focus:outline-none focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 transition-all leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-white/5 mt-6">
            <button
              type="button"
              onClick={() => {
                setTextContent("");
                setIsAdding(false);
              }}
              className="bg-transparent hover:bg-white/5 border border-white/5 rounded-xl h-9 text-[12px] font-bold px-4 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-9 text-[12px] font-bold px-4 transition-all cursor-pointer border-none flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Add source</span>
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-white/5">
        <div>
          <h3 className="text-[16px] font-bold text-white">Sources</h3>
          <p className="text-[12px] text-zinc-500 mt-1">Grounding documents for your AI chatbot.</p>
        </div>

        {/* Add source button */}
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-white text-[#090909] hover:bg-[#FAFAFA] rounded-xl h-9 text-[12px] font-bold flex items-center gap-1.5 px-4 transition-all cursor-pointer border-none"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add source</span>
        </Button>
      </div>

      {/* Document list or empty state */}
      {parsedDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6 border border-white/5 bg-[#101012]/30 rounded-[22px] w-full space-y-5">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
            <BookOpen size={24} strokeWidth={1.5} />
          </div>
          <div className="space-y-2 w-full flex flex-col items-center">
            <h3 className="text-[17px] font-bold text-white">Teach AI your business</h3>
            <p className="text-[13px] text-zinc-500 w-full leading-relaxed">
              Add your docs, FAQs, or policies. AI Agent will use your content to answer questions.
            </p>
          </div>
          
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
          {parsedDocs.map((doc) => {
            const Icon =
              doc.type === "Website" ? Globe
              : doc.type === "File" ? File
              : doc.type === "FAQ" ? MessageSquare
              : Heading;

            const formattedTime = doc.created_at
              ? new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
              : "—";

            return (
              <div
                key={doc.id}
                className="bg-gradient-to-b from-[#141416] to-[#0e0e0f] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[140px] hover:border-white/10 transition-all duration-200 group w-full min-w-0"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 w-full">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 shrink-0">
                        <Icon size={14} />
                      </div>
                      <h4 className="text-[13px] font-bold text-white truncate flex-1" title={doc.title}>
                        {doc.title}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="w-7 h-7 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-[12px] text-zinc-400 line-clamp-3 mt-3 leading-relaxed w-full break-words">
                    {doc.body}
                  </p>
                </div>
                <div className="text-[10px] text-zinc-600 mt-4 font-mono">Synced {formattedTime}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
