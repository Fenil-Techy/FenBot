"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2, WifiOff, Bot, Sparkles, ArrowRight, MessageSquare, ShieldCheck, Compass, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSkipped(localStorage.getItem("dashboard_onboarding_skipped") === "true");
    }
  }, []);

  const handleSkipOnboarding = () => {
    localStorage.setItem("dashboard_onboarding_skipped", "true");
    setSkipped(true);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/dashboard/home-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load dashboard summary");
      }

      const summaryData = await res.json();
      setData(summaryData);
    } catch (e) {
      console.error(e);
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[14px] text-[#8B919D]">Loading dashboard...</p>
      </div>
    );
  }

  if (error === "unreachable" || !data) {
    return (
      <div
        style={{ width: "100%", maxWidth: "32rem" }}
        className="flex flex-col items-center justify-center text-center py-16 px-6 border border-[#EF4444]/20 rounded-2xl bg-[#EF4444]/5 mx-auto my-8 text-[#F5F5F5]"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
          <WifiOff className="w-6 h-6" />
        </div>
        <h3 className="text-[16px] font-semibold text-[#F5F5F5] mb-1">Server Unreachable</h3>
        <p className="text-[14px] text-[#8B919D] max-w-sm mb-6">
          Failed to fetch dashboard data from the server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code>.
        </p>
        <Button
          onClick={load}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium border-none cursor-pointer"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  // Onboarding screen until all steps are complete (or skipped)
  const isOnboardingComplete = (data.has_bot && data.has_docs && data.has_convs) || skipped;

  if (!isOnboardingComplete) {
    const step1Complete = data.has_bot;
    const step2Complete = data.has_docs;
    const step3Complete = data.has_convs;

    return (
      <div
        style={{ width: "100%", maxWidth: "42rem" }}
        className="mx-auto mt-12 px-6 text-[#F5F5F5]"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#16181D] border border-[#2A2E36] flex items-center justify-center text-[#E8281E] mx-auto mb-4 shadow-xl">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-[22px] font-bold text-[#F5F5F5] mb-2">Welcome to FenBot 👋</h1>
          <p className="text-[14px] text-[#8B919D] mx-auto">
            Let's get your first AI commerce chatbot trained, styled, and live in just a few minutes.
          </p>
        </div>

        <div className="space-y-4">
          {/* Step 1: Create your chatbot */}
          <div className={`bg-[#16181D] border rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-md ${
            step1Complete ? "border-green-500/20 bg-green-500/5" : "border-[#2A2E36] hover:border-[#E8281E]/30"
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
              step1Complete ? "bg-green-500 text-white" : "bg-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
            }`}>
              {step1Complete ? <CheckCircle2 className="w-5 h-5" /> : "1"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-[14px] ${step1Complete ? "text-green-400" : "text-[#F5F5F5]"}`}>
                Create your chatbot {step1Complete && "✓"}
              </p>
              <p className="text-[12px] text-[#8B919D] mt-0.5">Give your agent a name and customize its tone.</p>
            </div>
            {!step1Complete && (
              <Link
                href="/dashboard/chatbots"
                className="bg-[#E8281E] text-white text-[12px] font-semibold rounded-xl px-4 py-2 hover:bg-[#C41F16] transition-colors shrink-0"
              >
                Create Bot
              </Link>
            )}
          </div>

          {/* Step 2: Add knowledge base */}
          <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-md ${
            step2Complete
              ? "border-green-500/20 bg-green-500/5"
              : step1Complete
              ? "border-[#2A2E36] bg-[#16181D] hover:border-[#E8281E]/30"
              : "border-[#20232A] bg-[#16181D]/40 opacity-50 select-none"
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
              step2Complete
                ? "bg-green-500 text-white"
                : step1Complete
                ? "bg-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
                : "bg-[#2A2E36] text-[#8B919D]"
            }`}>
              {step2Complete ? <CheckCircle2 className="w-5 h-5" /> : "2"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-[14px] ${step2Complete ? "text-green-400" : "text-[#F5F5F5]"}`}>
                Add knowledge base {step2Complete && "✓"}
              </p>
              <p className="text-[12px] text-[#8B919D] mt-0.5">Train your chatbot on policies, QAs, and business guidelines.</p>
            </div>
            {!step2Complete && step1Complete && (
              <Link
                href={`/dashboard/chatbots/${data.bots[0]?.id}`}
                className="bg-[#E8281E] text-white text-[12px] font-semibold rounded-xl px-4 py-2 hover:bg-[#C41F16] transition-colors shrink-0"
              >
                Add Knowledge
              </Link>
            )}
          </div>

          {/* Step 3: Embed on your website */}
          <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-md ${
            step3Complete
              ? "border-green-500/20 bg-green-500/5"
              : (step1Complete && step2Complete)
              ? "border-[#2A2E36] bg-[#16181D] hover:border-[#E8281E]/30"
              : "border-[#20232A] bg-[#16181D]/40 opacity-50 select-none"
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
              step3Complete
                ? "bg-green-500 text-white"
                : (step1Complete && step2Complete)
                ? "bg-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
                : "bg-[#2A2E36] text-[#8B919D]"
            }`}>
              {step3Complete ? <CheckCircle2 className="w-5 h-5" /> : "3"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-[14px] ${step3Complete ? "text-green-400" : "text-[#F5F5F5]"}`}>
                Embed on your website {step3Complete && "✓"}
              </p>
              <p className="text-[12px] text-[#8B919D] mt-0.5">Copy a single HTML script tag to start interacting with users.</p>
            </div>
            {!step3Complete && step1Complete && step2Complete && (
              <div className="flex gap-2 shrink-0">
                <Link
                  href="/dashboard/docs"
                  className="bg-[#E8281E] text-white text-[12px] font-semibold rounded-xl px-3 py-2 hover:bg-[#C41F16] transition-colors flex items-center justify-center border-none"
                >
                  Install Guide
                </Link>
                <Link
                  href={`/dashboard/chatbots/${data.bots[0]?.id}?tab=Test`}
                  className="bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] hover:bg-[#1D2026] text-[12px] font-semibold rounded-xl px-3 py-2 transition-colors flex items-center justify-center"
                >
                  Test Sandbox
                </Link>
                <button
                  onClick={handleSkipOnboarding}
                  className="bg-transparent border border-transparent text-[#8B919D] hover:text-[#F5F5F5] text-[12px] font-semibold rounded-xl px-2.5 py-2 transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // standard dashboard display
  return (
    <div className="max-w-5xl mx-auto mt-6 px-6 text-[#F5F5F5]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#20232A]">
        <div>
          <h1 className="text-[20px] font-bold text-[#F5F5F5]">Home</h1>
          <p className="text-[12px] text-[#8B919D] mt-1">
            Overview of your active chatbots, conversation volume, and subscription metrics.
          </p>
        </div>
        <Link
          href="/dashboard/chatbots"
          className="flex items-center gap-1.5 bg-[#E8281E] text-white text-[13px] font-semibold rounded-xl px-4 py-2 hover:bg-[#C41F16] transition-colors border-none"
        >
          <Plus size={15} /> New Chatbot
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Chatbots */}
        <div className="dashboard-card flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[#8B919D]">
            <p className="text-[11px] font-semibold uppercase tracking-wider">Active Chatbots</p>
            <Bot className="w-4 h-4 text-[#E8281E]" />
          </div>
          <p className="text-[24px] font-bold text-[#F5F5F5] mt-1 font-mono">
            {data.bots.filter((b: any) => b.status === "active").length}
          </p>
          <span className="text-[11px] text-[#8B919D] mt-1">
            out of {data.bots.length} total bots
          </span>
        </div>

        {/* Conversations Today */}
        <div className="dashboard-card flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[#8B919D]">
            <p className="text-[11px] font-semibold uppercase tracking-wider">Conversations Today</p>
            <MessageSquare className="w-4 h-4 text-[#E8281E]" />
          </div>
          <p className="text-[24px] font-bold text-[#F5F5F5] mt-1 font-mono">
            {data.conversations_today}
          </p>
          <span className="text-[11px] text-[#8B919D] mt-1">
            updated in real-time
          </span>
        </div>

        {/* Subscription Plan */}
        <div className="dashboard-card flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[#8B919D]">
            <p className="text-[11px] font-semibold uppercase tracking-wider">Current Plan</p>
            <ShieldCheck className="w-4 h-4 text-[#E8281E]" />
          </div>
          <p className="text-[24px] font-bold text-[#F5F5F5] mt-1">
            Starter
          </p>
          <Link
            href="/dashboard/billing"
            className="text-[11px] text-[#E8281E] hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
          >
            <span>View usage</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="dashboard-card flex flex-col gap-4">
        <div className="pb-3 border-b border-[#24262D]">
          <h2 className="text-card-title text-[#F5F5F5]">Recent Conversations</h2>
        </div>

        {data.recent_conversations.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-[#8B919D] gap-2">
            <MessageSquare className="w-8 h-8 opacity-40" />
            <p className="text-[13px]">No conversations recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#20232A] space-y-3">
            {data.recent_conversations.map((c: any) => (
              <div
                key={c.id}
                onClick={() => router.push(`/dashboard/inbox?id=${c.id}`)}
                className="py-3 flex items-center justify-between gap-4 cursor-pointer group hover:bg-[#1D2026]/40 px-3 rounded-xl transition-all duration-150 first:pt-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#F5F5F5] group-hover:text-white truncate">
                    {c.bot_name}
                  </p>
                  <p className="text-[12px] text-[#8B919D] truncate mt-1">
                    {c.last_message || <span className="italic opacity-60">No messages yet</span>}
                  </p>
                </div>
                <div className="text-[11px] text-[#8B919D] shrink-0 font-mono">
                  {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}