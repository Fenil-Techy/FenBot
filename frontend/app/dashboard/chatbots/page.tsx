"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bot, Plus, Settings, WifiOff, X, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ChatbotsPage() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A]">
        <div>
          <p className="text-[14px] text-[#8B919D]">Manage and configure your AI support employees.</p>
        </div>
        {!loading && error !== "unreachable" && (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-9 text-[13px] font-medium flex items-center gap-1.5 px-4 transition-colors cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Chatbot</span>
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="dashboard-card animate-pulse flex flex-col justify-between h-[216px]">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-[#252932] rounded-lg" />
                    <div className="h-3.5 w-24 bg-[#20232A] rounded-lg" />
                  </div>
                  <div className="h-6 w-16 bg-[#252932] rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6 py-3 border-y border-[#20232A]">
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="h-3 w-14 bg-[#20232A] rounded" />
                    <div className="h-4 w-8 bg-[#252932] rounded" />
                  </div>
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="h-3 w-20 bg-[#20232A] rounded" />
                    <div className="h-4 w-10 bg-[#252932] rounded" />
                  </div>
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="h-3 w-12 bg-[#20232A] rounded" />
                    <div className="h-4 w-16 bg-[#252932] rounded" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <div className="h-9 w-20 bg-[#20232A] rounded-xl" />
                <div className="h-9 w-24 bg-[#252932] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error === "unreachable" ? (
        // Server Unreachable UI State
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-[#EF4444]/20 rounded-2xl bg-[#EF4444]/5 max-w-lg mx-auto my-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
            <WifiOff className="w-6 h-6" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#F5F5F5] mb-1">Server Unreachable</h3>
          <p className="text-[14px] text-[#8B919D] max-w-sm mb-6">
            The FenBot backend server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code> is currently not running. Please start the backend service and try again.
          </p>
          <Button
            onClick={fetchBots}
            className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium transition-colors border-none cursor-pointer"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bots.map((bot) => {
            const formattedDate = bot.created_at
              ? new Date(bot.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "Jul 11, 2026";

            return (
              <DashboardCard key={bot.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
                        {bot.name}
                      </h3>
                      <p className="text-[12px] text-[#8B919D] mt-1 font-mono flex items-center">
                        {bot.brand_color ? (
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 border border-[#20232A] shrink-0"
                            style={{ backgroundColor: bot.brand_color }}
                          />
                        ) : null}
                        FenBot-Core-v2
                      </p>
                    </div>
                    <StatusBadge
                      status={mapStatus(bot.status)}
                      label={bot.status === "active" ? "Active" : bot.status === "paused" ? "Paused" : "Training"}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-6 py-3 border-y border-[#20232A] text-center">
                    <div>
                      <span className="text-[11px] text-[#8B919D] block">Conversations</span>
                      <span className="text-[15px] font-bold text-[#F5F5F5] mt-1 block">
                        {bot.conversationsCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#8B919D] block">Resolution Rate</span>
                      <span className="text-[15px] font-bold text-[#F5F5F5] mt-1 block">
                        {bot.resolutionRate || "0.0%"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#8B919D] block">Created</span>
                      <span className="text-[13px] font-semibold text-[#F5F5F5] mt-1 block">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/chatbots/${bot.id}?tab=Test`)}
                    className="bg-transparent border border-[#2A2E36] text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl h-9 text-[13px] font-medium px-4 cursor-pointer"
                  >
                    Test Bot
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/chatbots/${bot.id}`)}
                    className="bg-[#252932] text-[#F5F5F5] hover:bg-[#1D2026] border border-[#2A2E36] rounded-xl h-9 text-[13px] font-medium px-4 cursor-pointer flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </Button>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}

      {/* Create Chatbot Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-[calc(100vw-2rem)] sm:w-[440px] shrink-0 bg-[#16181D] border border-[#2A2E36] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-[#F5F5F5]">
            <div className="flex items-center justify-between pb-2 border-b border-[#20232A]">
              <h3 className="text-[16px] font-bold text-white">Create AI Chatbot</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1D2026] text-[#8B919D] hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                  Chatbot Name
                </label>
                <input
                  type="text"
                  required
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="e.g. Sales Agent, FAQ Bot"
                  className="w-full bg-[#101113] border border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] px-4 py-2.5 focus:border-[#E8281E]/60 focus:outline-none transition-colors"
                />
              </div>
              {submitError && (
                <div className="text-red-400 text-xs font-semibold">{submitError}</div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="bg-transparent border border-[#2A2E36] text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl h-9 text-[13px] cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-9 text-[13px] font-medium border-none flex items-center gap-1.5 cursor-pointer"
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
