"use client";
import { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3, TrendingUp, MessageSquare, Clock, HelpCircle, Loader2, WifiOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { Button } from "@/components/ui/button";

type Bot = { id: string; name: string };
type Analytics = {
  total_conversations: number;
  total_messages: number;
  total_duration_seconds: number;
  daily_volume: { day: string; count: number }[];
  top_questions: { question: string; count: number }[];
};

function formatDuration(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export default function AnalyticsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>("");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBots = useCallback(async () => {
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

      const res = await fetch("http://localhost:8000/dashboard/chatbots", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch chatbots");
      }

      const botList = await res.json();
      setBots(botList);
      if (botList.length > 0) {
        setSelectedBot(botList[0].id);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("unreachable");
      setLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async (botId: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return;

      const res = await fetch(`http://localhost:8000/dashboard/analytics/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }

      setData(await res.json());
    } catch (e) {
      console.error(e);
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBots();
  }, [loadBots]);

  useEffect(() => {
    if (selectedBot) {
      loadAnalytics(selectedBot);
    }
  }, [selectedBot, loadAnalytics]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] text-[12px] p-3 rounded-xl shadow-2xl leading-normal">
          <p className="font-mono text-[#8B919D] mb-1">{payload[0].payload.day}</p>
          <p className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#E8281E]" />
            <span>Conversations: <strong className="text-white">{payload[0].value}</strong></span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading && bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[14px] text-[#8B919D]">Loading analytics...</p>
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
          Failed to fetch analytics from the server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code>.
        </p>
        <Button
          onClick={loadBots}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium border-none cursor-pointer"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <p className="text-[14px] text-[#8B919D]">Understand how effectively the AI resolves customer inquiries.</p>
        </div>
        {bots.length > 0 && (
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="border border-[#20232A] rounded-xl px-3 h-8 text-[12px] bg-[#16181D] text-[#F5F5F5] font-semibold focus:outline-none focus:border-[#E8281E] cursor-pointer"
          >
            {bots.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {bots.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics insights yet."
          description="Insights on automation rates, CSAT score, and average resolution times will populate here once your chatbots interact with customers."
        />
      ) : (
        <div className="space-y-6">
          {data && (
            <>
              {/* KPI Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[#8B919D]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider">Total Conversations</p>
                    <TrendingUp className="w-4 h-4 text-[#E8281E]" />
                  </div>
                  <p className="text-metric text-[#F5F5F5]">{data.total_conversations}</p>
                  <p className="text-[12px] text-[#8B919D]">All interactions recorded</p>
                </div>

                <div className="dashboard-card flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[#8B919D]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider">Total Messages</p>
                    <MessageSquare className="w-4 h-4 text-[#E8281E]" />
                  </div>
                  <p className="text-metric text-[#F5F5F5]">{data.total_messages}</p>
                  <p className="text-[12px] text-[#8B919D]">Sent and received messages</p>
                </div>

                <div className="dashboard-card flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[#8B919D]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider">Conversation Time</p>
                    <Clock className="w-4 h-4 text-[#E8281E]" />
                  </div>
                  <p className="text-metric text-[#F5F5F5]">{formatDuration(data.total_duration_seconds)}</p>
                  <p className="text-[12px] text-[#8B919D]">Active support duration</p>
                </div>
              </div>

              {/* Charts & Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversations Chart */}
                <div className="dashboard-card lg:col-span-2 flex flex-col justify-between p-6">
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#24262D] mb-6">
                      <h3 className="text-card-title text-[#F5F5F5] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#E8281E]" />
                        <span>Daily Conversations (Last 14 days)</span>
                      </h3>
                    </div>

                    <div className="h-60 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.daily_volume}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#E8281E" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="#E8281E" stopOpacity={0.2} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="day"
                            tick={{ fontSize: 10, fill: "#8B919D" }}
                            tickFormatter={(d) => {
                              try {
                                return d.slice(5); // Format YYYY-MM-DD -> MM-DD
                              } catch {
                                return d;
                              }
                            }}
                            axisLine={{ stroke: "#20232A" }}
                            tickLine={{ stroke: "#20232A" }}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: "#8B919D" }}
                            allowDecimals={false}
                            axisLine={{ stroke: "#20232A" }}
                            tickLine={{ stroke: "#20232A" }}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1D2026", opacity: 0.4 }} />
                          <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top Questions */}
                <div className="dashboard-card flex flex-col justify-between p-6">
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#24262D] mb-6">
                      <h3 className="text-card-title text-[#F5F5F5] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#E8281E]" />
                        <span>Top Questions</span>
                      </h3>
                    </div>

                    {data.top_questions.length === 0 ? (
                      <p className="text-[13px] text-[#8B919D] py-12 text-center">Not enough data yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {data.top_questions.map((q, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[13px] py-1.5 border-b border-[#20232A]/30 last:border-0"
                          >
                            <p className="text-[#F5F5F5] truncate max-w-[80%] font-medium" title={q.question}>
                              {q.question}
                            </p>
                            <span className="text-[#E8281E] bg-[#E8281E]/10 border border-[#E8281E]/20 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold">
                              {q.count}×
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
