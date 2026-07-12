"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, Sparkles, Loader2, WifiOff } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Button } from "@/components/ui/button";

function guessIsIndia() {
  if (typeof window === "undefined") return false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === "Asia/Calcutta" || tz === "Asia/Kolkata" || navigator.language === "en-IN";
  } catch {
    return false;
  }
}

export default function BillingPage() {
  const [data, setData] = useState<any>(null);
  const [isIndia, setIsIndia] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBilling = useCallback(async () => {
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

      const res = await fetch("http://localhost:8000/dashboard/billing", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch billing data");
      }

      const billingData = await res.json();
      setData(billingData);
    } catch (e) {
      console.error(e);
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsIndia(guessIsIndia());
    loadBilling();
  }, [loadBilling]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[14px] text-[#8B919D]">Loading subscription details...</p>
      </div>
    );
  }

  if (error === "unreachable") {
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
          Failed to fetch subscription details from the server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code>.
        </p>
        <Button
          onClick={loadBilling}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium border-none cursor-pointer"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const limit = data.plan_info.conversation_limit;
  const usagePercent = limit ? Math.min(100, Math.round((data.conversations_used / limit) * 100)) : 0;
  const priceKey = isIndia ? "price_inr" : "price_usd";

  return (
    <div className="max-w-4xl mx-auto mt-6 px-6 text-[#F5F5F5] space-y-8">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-[#F5F5F5]">Billing</h1>
          <p className="text-[12px] text-[#8B919D] mt-1">
            Manage your subscription plan, usage limits, and invoices.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 bg-[#16181D] border border-[#20232A] rounded-xl p-1 shrink-0">
          <button
            onClick={() => setIsIndia(false)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              !isIndia
                ? "bg-[#E8281E] text-white"
                : "text-[#8B919D] hover:text-[#F5F5F5]"
            }`}
          >
            USD
          </button>
          <button
            onClick={() => setIsIndia(true)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              isIndia
                ? "bg-[#E8281E] text-white"
                : "text-[#8B919D] hover:text-[#F5F5F5]"
            }`}
          >
            INR
          </button>
        </div>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active plan card */}
        <DashboardCard className="relative overflow-hidden bg-gradient-to-br from-[#16181D] to-[#101113] border border-[#20232A] flex flex-col justify-between p-6">
          <div className="space-y-2 z-10">
            <span className="text-[10px] font-bold text-[#E8281E] uppercase tracking-wider">
              Active Subscription
            </span>
            <h3 className="text-[22px] font-bold text-[#F5F5F5]">{data.plan_info.label}</h3>
            <p className="text-[26px] font-extrabold text-[#F5F5F5] mt-1">
              {data.plan_info[priceKey]}
            </p>
            <p className="text-[12px] text-[#8B919D]">
              Renews automatically. Cancel or upgrade anytime.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Active
            </span>
          </div>
          {/* Neon background blur */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#E8281E]/10 rounded-full blur-2xl pointer-events-none" />
        </DashboardCard>

        {/* Meters Card */}
        <DashboardCard className="md:col-span-2 border border-[#20232A] bg-[#16181D]/30 p-6 flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-[14px] font-semibold text-[#F5F5F5] mb-4">
              Usage This Period
            </h3>

            {/* Conversation usage */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-[12px]">
                <span className="font-semibold text-[#B4BAC5]">Conversations</span>
                <span className="text-[#8B919D]">
                  <strong className="text-[#F5F5F5]">{data.conversations_used}</strong>{" "}
                  {limit ? `/ ${limit} limit` : " (unlimited)"}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full bg-[#101113] rounded-full overflow-hidden border border-[#20232A]/50">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    usagePercent >= 90 ? "bg-red-500" : "bg-[#E8281E]"
                  }`}
                  style={{ width: `${limit ? usagePercent : 100}%` }}
                />
              </div>
              {limit && usagePercent >= 90 && (
                <p className="text-[10px] text-red-500 font-medium">
                  Close to subscription limits. Upgrade to avoid message interruptions.
                </p>
              )}
            </div>

            {/* Chatbot count */}
            <div className="flex justify-between items-center text-[12px] pt-1">
              <span className="font-semibold text-[#B4BAC5]">Chatbots Active</span>
              <span className="text-[#8B919D]">
                <strong className="text-[#F5F5F5]">{data.chatbots_used}</strong>{" "}
                {data.plan_info.chatbot_limit ? `/ ${data.plan_info.chatbot_limit}` : " (unlimited)"}
              </span>
            </div>
          </div>

          <div className="bg-[#101113] border border-[#20232A] rounded-xl p-3 flex items-start gap-2 text-[11px] text-[#8B919D] leading-normal">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <span>
              Usage limits refresh automatically at the start of each billing cycle.
            </span>
          </div>
        </DashboardCard>
      </div>

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-bold text-[#F5F5F5]">Available Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data.all_plans).map(([key, plan]: [string, any]) => {
            const isCurrent = key === data.current_plan;
            return (
              <DashboardCard
                key={key}
                className={`flex flex-col justify-between border transition-all ${
                  isCurrent
                    ? "border-[#E8281E] bg-[#E8281E]/5"
                    : "border-[#20232A] bg-[#16181D]/30 hover:border-[#2A2E36]"
                }`}
              >
                <div>
                  <h3 className="font-bold text-[15px] text-[#F5F5F5]">{plan.label}</h3>
                  <p className="text-[20px] font-extrabold text-[#F5F5F5] mt-1.5">
                    {plan[priceKey]}
                  </p>
                  <p className="text-[11px] text-[#8B919D] mt-2 leading-relaxed">
                    {plan.conversation_limit
                      ? `${plan.conversation_limit} conversations/mo`
                      : "Unlimited conversations"}{" "}
                    · {plan.chatbot_limit ? `${plan.chatbot_limit} chatbot(s)` : "Unlimited chatbots"}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#20232A]/50">
                  {isCurrent ? (
                    <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#E8281E] font-bold uppercase tracking-wider py-2">
                      <Check size={14} className="text-[#E8281E]" /> Current Plan
                    </div>
                  ) : (
                    <a
                      href={`mailto:hello@fenbot.com?subject=Plan%20Change%20Request:%20${plan.label}`}
                      className="block text-center bg-[#E8281E] hover:bg-[#C41F16] text-white text-[12px] font-semibold rounded-xl py-2 transition-all cursor-pointer border-none"
                    >
                      {key === "free" ? "Downgrade" : "Upgrade"}
                    </a>
                  )}
                </div>
              </DashboardCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
