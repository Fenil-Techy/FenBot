"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bot, Plus, Settings, WifiOff, X, Loader2, Search } from "lucide-react";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ChatbotsPage() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const fetchBots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Unauthorized session");
        setLoading(false);
        return;
      }
      
      const res = await fetch("http://localhost:8000/dashboard/chatbots", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      
      const data = await res.json();
      setBots(data);
    } catch (err: any) {
      console.error(err);
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const res = await fetch("http://localhost:8000/dashboard/chatbots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name: newBotName })
      });

      if (!res.ok) throw new Error("Failed to create chatbot");

      const newBot = await res.json();
      setBots((prev) => [newBot, ...prev]);
      setNewBotName("");
      setIsCreateOpen(false);
      
      // Navigate to the newly created chatbot detail page
      router.push(`/dashboard/chatbots/${newBot.id}`);
    } catch (err: any) {
      setSubmitError(err?.message || "Could not create chatbot");
    } finally {
      setSubmitting(false);
    }
  };

  const mapStatus = (status: string): "online" | "offline" | "training" => {
    if (status === "active" || status === "online") return "online";
    if (status === "paused" || status === "offline") return "offline";
    return "training";
  };

  const filteredBots = bots.filter((bot) =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto text-[#FAFAFA] space-y-6 min-w-0 font-sans tracking-tight">
      {/* Control Bar */}
      {error !== "unreachable" && (
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search chatbots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
              className="w-full bg-[#111111] border border-white/5 pl-9 pr-4 h-9 text-[12px] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 transition-all font-sans disabled:opacity-40"
            />
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            disabled={loading}
            className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-9 text-[12px] font-bold flex items-center gap-1.5 px-4 transition-all cursor-pointer border-none"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create Chatbot</span>
          </Button>
        </div>
      )}

      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#111111] border border-white/5 rounded-[18px] p-6 animate-pulse flex flex-col justify-between h-[216px]">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-white/5 rounded-lg" />
                    <div className="h-3.5 w-24 bg-white/5 rounded-lg" />
                  </div>
                  <div className="h-6 w-16 bg-white/5 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6 py-3 border-y border-white/5">
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="h-3 w-14 bg-white/5 rounded" />
                    <div className="h-4 w-8 bg-white/5 rounded" />
                  </div>
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="h-3 w-20 bg-white/5 rounded" />
                    <div className="h-4 w-10 bg-white/5 rounded" />
                  </div>
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="h-3 w-12 bg-white/5 rounded" />
                    <div className="h-4 w-16 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <div className="h-9 w-20 bg-white/5 rounded-xl" />
                <div className="h-9 w-24 bg-white/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error === "unreachable" ? (
        // Server Unreachable UI State
        <div
          style={{ width: "100%", maxWidth: "32rem" }}
          className="flex flex-col items-center justify-center text-center py-16 px-6 border border-[#EF4444]/20 rounded-[22px] bg-[#EF4444]/5 mx-auto my-8"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
            <WifiOff className="w-6 h-6" />
          </div>
          <h3 className="text-[16px] font-bold text-white mb-1">Server Unreachable</h3>
          <p className="text-[12px] text-[#71717A] max-w-sm mb-6 leading-relaxed">
            The FenBot backend server at <code className="text-[#FAFAFA] bg-[#151515] px-1.5 py-0.5 rounded font-mono text-xs border border-white/5">http://localhost:8000</code> is currently not running. Please start the backend service and try again.
          </p>
          <Button
            onClick={fetchBots}
            className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-9 text-[12px] font-bold transition-all border-none cursor-pointer"
          >
            Retry Connection
          </Button>
        </div>
      ) : bots.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No chatbots yet."
          description="Create your first AI employee to automatically answer customers using your own grounded knowledge documents."
          actionLabel="Create Chatbot"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : filteredBots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 gap-2 border border-white/5 bg-[#111111]/30 rounded-[22px]">
          <Search size={24} className="opacity-30" />
          <p className="text-[13px] italic font-sans">No chatbots found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot) => {
            const formattedDate = bot.created_at
              ? new Date(bot.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "Jul 11, 2026";

            const brandColor = bot.accent_color || bot.bubble_color || '#E8281E';

            return (
              <div 
                key={bot.id} 
                style={{
                  background: `radial-gradient(circle at 100% 0%, ${brandColor}1c, transparent 65%), linear-gradient(180deg, #141416 0%, #0e0e0f 100%)`,
                  borderColor: `${brandColor}22`,
                  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.02)`
                }}
                className="border rounded-[22px] p-6 flex flex-col justify-between min-h-[360px] hover:-translate-y-1 hover:border-white/10 transition-all duration-300 group relative overflow-hidden select-none"
              >
                {/* Top colored brand accent bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: brandColor }}
                />

                <div className="flex-1 flex flex-col justify-between">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                        {bot.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${bot.status === "active" ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                          {bot.status === "active" ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean stats list */}
                  <div className="space-y-4 my-8 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                      <span className="text-[12px] text-zinc-500 font-medium font-sans">Conversations</span>
                      <span className="text-[15px] font-bold text-white font-mono">
                        {bot.conversationsCount || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                      <span className="text-[12px] text-zinc-500 font-medium font-sans">Created</span>
                      <span className="text-[13px] font-semibold text-zinc-300 font-sans">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-zinc-500 font-medium font-sans">Last Updated</span>
                      <span className="text-[13px] font-semibold text-zinc-300 font-sans">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-2 pt-4 border-t border-white/5 shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/chatbots/${bot.id}?tab=Test`)}
                    className="bg-[#151515] border border-white/5 text-[#A1A1AA] hover:bg-[#202020] hover:text-white rounded-xl h-8.5 text-[12px] font-bold px-3.5 transition-all duration-150 cursor-pointer"
                  >
                    Test Bot
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/chatbots/${bot.id}`)}
                    style={{ backgroundColor: brandColor, boxShadow: `0 8px 20px -3px ${brandColor}40` }}
                    className="text-[#FAFAFA] hover:opacity-90 rounded-xl h-8.5 text-[12px] font-bold px-3.5 cursor-pointer flex items-center gap-1.5 border-none transition-all"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Chatbot Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-[calc(100vw-2rem)] sm:w-[440px] shrink-0 bg-[#111111] border border-white/5 rounded-[22px] p-6 shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-[16px] font-bold text-white">Create AI Chatbot</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#71717A] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Chatbot Name
                </label>
                <input
                  type="text"
                  required
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="e.g. Sales Agent, FAQ Bot"
                  className="w-full bg-[#151515] border border-white/5 text-[12px] rounded-xl text-white placeholder-[#71717A] px-4 py-2.5 focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 focus:outline-none transition-all"
                />
              </div>
              {submitError && (
                <div className="text-[#EF4444] text-xs font-semibold">{submitError}</div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="bg-transparent border border-white/5 text-[#A1A1AA] hover:bg-[#202020] hover:text-white rounded-xl h-9 text-[12px] font-bold cursor-pointer transition-colors px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-9 text-[12px] font-bold border-none flex items-center gap-1.5 cursor-pointer px-4"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Chatbot</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
