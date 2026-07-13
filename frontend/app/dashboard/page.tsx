"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Bot,
  MessageSquare,
  Zap,
  ArrowRight,
  ChevronRight,
  Plus,
  CheckCircle2,
  Check,
  HelpCircle,
  Clock,
  Send,
  ListTodo,
  Tag,
  MoreVertical
} from "lucide-react";

export default function DashboardHomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [skipped, setSkipped] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [queries, setQueries] = useState<string[]>([]);
  const [newQuery, setNewQuery] = useState("");

  // Local state for interactive chat feed
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{sender: "user" | "bot" | "agent", text: string, time: string}>>>({});
  const [replyText, setReplyText] = useState("");
  const [selectedBotId, setSelectedBotId] = useState<string>("");
  const [chatbotConfig, setChatbotConfig] = useState<any>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Map backend conversations to client representation (no mock items)
  const conversationsList = data?.recent_conversations?.map((c: any) => ({
    id: c.id,
    chatbot_id: c.chatbot_id,
    name: c.visitor_id ? `Visitor ${c.visitor_id.slice(0, 8)}` : `${c.bot_name || "Fenbot"} Customer`,
    initials: c.bot_name ? c.bot_name.slice(0, 2).toUpperCase() : "FC",
    lastMessage: c.last_message || "No messages yet",
    time: c.last_message_at 
      ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "10:39 AM",
    botName: c.bot_name || "Fenbot",
    unread: 0
  })) || [];

  // Automatically update the selected conversation when the selected chatbot changes
  useEffect(() => {
    const filtered = conversationsList.filter((c: any) => c.chatbot_id === selectedBotId);
    if (filtered.length > 0) {
      const exists = filtered.some((c: any) => c.id === selectedConvId);
      if (!exists) {
        setSelectedConvId(filtered[0].id);
      }
    } else {
      setSelectedConvId(null);
    }
  }, [selectedBotId, data, selectedConvId]);

  // Load messages dynamically from the backend for real conversations
  useEffect(() => {
    if (!selectedConvId) return;
    if (selectedConvId.startsWith("mock-")) return;

    const convId = selectedConvId;

    async function loadBackendMessages() {
      setLoadingMessages(true);
      try {
        const supabase = createClient();
        const { data: session } = await supabase.auth.getSession();
        const token = session.session?.access_token;
        if (!token) return;

        const res = await fetch(`http://localhost:8000/dashboard/conversations/${convId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const msgs = await res.json();
          // Map backend message schema to chat message format
          const formatted = msgs.map((m: any) => ({
            sender: m.role === "user" ? "user" : m.role === "assistant" || m.role === "ai" ? "bot" : "agent",
            text: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          
          setChatMessages(prev => ({
            ...prev,
            [convId]: formatted
          }));
        }
      } catch (e) {
        console.error("Failed to load backend messages", e);
      } finally {
        setLoadingMessages(false);
      }
    }
    loadBackendMessages();
  }, [selectedConvId]);

  // Fetch chatbot config to apply widget styling dynamically
  useEffect(() => {
    if (!selectedBotId || selectedBotId === "all") {
      setChatbotConfig(null);
      return;
    }

    async function loadWidgetConfig() {
      try {
        const res = await fetch(`http://localhost:8000/chat/${selectedBotId}/config`);
        if (res.ok) {
          const configData = await res.json();
          setChatbotConfig(configData);
        } else {
          setChatbotConfig(null);
        }
      } catch (e) {
        console.error("Failed to load widget config", e);
        setChatbotConfig(null);
      }
    }
    loadWidgetConfig();
  }, [selectedBotId]);

  // Load queries from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_queries_to_solve");
      if (stored) {
        try {
          setQueries(JSON.parse(stored));
        } catch (e) {
          const initial = ["Verify refund status for #1094", "Check webhook connection issue"];
          setQueries(initial);
          localStorage.setItem("dashboard_queries_to_solve", JSON.stringify(initial));
        }
      } else {
        const initial = ["Verify refund status for #1094", "Check webhook connection issue"];
        setQueries(initial);
        localStorage.setItem("dashboard_queries_to_solve", JSON.stringify(initial));
      }
    }
  }, []);

  const handleAddQuery = () => {
    if (newQuery.trim()) {
      const updated = [...queries, newQuery.trim()];
      setQueries(updated);
      localStorage.setItem("dashboard_queries_to_solve", JSON.stringify(updated));
      setNewQuery("");
    }
  };

  const handleRemoveQuery = (index: number) => {
    const updated = queries.filter((_, i) => i !== index);
    setQueries(updated);
    localStorage.setItem("dashboard_queries_to_solve", JSON.stringify(updated));
  };

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

  // Set default chatbot filter when data loads
  useEffect(() => {
    if (data?.bots?.length > 0 && !selectedBotId) {
      setSelectedBotId(data.bots[0].id);
    }
  }, [data, selectedBotId]);

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConvId) return;
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const currentList = chatMessages[selectedConvId] || [];
    setChatMessages({
      ...chatMessages,
      [selectedConvId]: [
        ...currentList,
        { sender: "agent", text: replyText.trim(), time: nowStr }
      ]
    });
    setReplyText("");
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto text-[#FAFAFA] space-y-8 min-w-0 font-sans tracking-tight animate-pulse">
        {/* Top Header Block (Two Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Greeting Banner Card Skeleton */}
          <div className="lg:col-span-8 bg-[#111111] border border-white/5 rounded-[18px] p-6 flex flex-col justify-center min-h-[190px] gap-4">
            <div className="w-24 h-5 bg-white/5 rounded-full" />
            <div className="w-64 h-8 bg-white/5 rounded-lg" />
            <div className="w-full max-w-xl h-4 bg-white/5 rounded-md" />
          </div>

          {/* Right Column: Queries to Solve Skeleton */}
          <div className="lg:col-span-4 bg-[#111111] border border-white/5 rounded-[18px] p-5 flex flex-col justify-between min-h-[190px] gap-4">
            <div className="flex items-center justify-between">
              <div className="w-28 h-5 bg-white/5 rounded-md" />
              <div className="w-12 h-5 bg-white/5 rounded-full" />
            </div>
            <div className="w-full h-8 bg-white/5 rounded-xl" />
            <div className="flex flex-col gap-2">
              <div className="w-full h-9 bg-white/5 rounded-xl" />
              <div className="w-full h-9 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>

        {/* KPI Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111111] border border-white/5 rounded-[18px] p-6 flex flex-col justify-between min-h-[200px] gap-4">
              <div className="flex items-center justify-between">
                <div className="w-24 h-5 bg-white/5 rounded-md" />
                <div className="w-5 h-5 bg-white/5 rounded-full" />
              </div>
              <div className="w-16 h-10 bg-white/5 rounded-lg mt-2" />
              <div className="flex justify-end mt-4">
                <div className="w-20 h-9 bg-white/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Conversations Skeleton */}
        <div className="w-full bg-[#111111] border border-white/5 rounded-[18px] p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="w-48 h-6 bg-white/5 rounded-md" />
            <div className="w-16 h-5 bg-white/5 rounded-md" />
          </div>

          <div className="flex border border-white/5 rounded-xl overflow-hidden bg-[#0e0e10] min-h-[420px] max-h-[500px]">
            {/* Left Pane */}
            <div className="w-[240px] sm:w-[280px] border-r border-white/5 flex flex-col bg-[#111112] shrink-0 gap-3 p-4">
              <div className="w-28 h-4 bg-white/5 rounded-md" />
              <div className="flex flex-col gap-3 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="w-16 h-3 bg-white/5 rounded" />
                      <div className="w-24 h-2 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Pane */}
            <div className="flex-1 flex flex-col justify-between bg-[#121214]/40 p-4 gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/5" />
                  <div className="w-16 h-4 bg-white/5 rounded" />
                </div>
                <div className="w-24 h-6 bg-white/5 rounded" />
              </div>

              <div className="flex-1 flex flex-col gap-4 py-4">
                <div className="w-48 h-10 bg-white/5 rounded-2xl rounded-tl-none mr-auto" />
                <div className="w-64 h-12 bg-white/5 rounded-2xl rounded-tr-none ml-auto" />
                <div className="w-32 h-10 bg-white/5 rounded-2xl rounded-tl-none mr-auto" />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <div className="flex-1 h-10 bg-white/5 rounded-xl" />
                <div className="w-10 h-10 bg-white/5 rounded-xl shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === "unreachable" || !data) {
    return (
      <div
        style={{ width: "100%", maxWidth: "32rem" }}
        className="flex flex-col items-center justify-center text-center py-16 px-6 border border-white/5 rounded-[18px] bg-[#111111] mx-auto my-16 text-[#FAFAFA]"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-[#E8281E] mb-4">
          <HelpCircle size={24} />
        </div>
        <h3 className="text-[16px] font-semibold text-[#FAFAFA] mb-1 font-sans">Server Unreachable</h3>
        <p className="text-[14px] text-[#A1A1AA] max-w-sm mb-6 font-sans">
          Failed to fetch dashboard data. Verify your backend server is running.
        </p>
        <Button
          onClick={load}
          className="bg-[#E8281E] hover:bg-[#FF3B30] text-white rounded-xl px-5 h-10 text-[14px] font-semibold border-none cursor-pointer"
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
      <div className="w-full max-w-[1200px] mx-auto text-[#FAFAFA]">
        {/* Header Title Grid (Image 3 UI style) */}
        <div className="mb-12">
          <h1 className="text-[36px] font-bold text-white tracking-tight font-sans">
            Solve your first cases with FenBot
          </h1>
          <p className="text-[15px] text-[#A1A1AA] mt-2 font-sans">
            Set this up to make support effortless at any scale.
          </p>
        </div>

        {/* Guided Flow Column Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          {/* Steps List Column */}
          <div className="xl:col-span-7 flex flex-col gap-6 relative">
            {/* Step 1: Create your AI Agent */}
            <div
              className="relative pl-12 transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveStep(1)}
            >
              {/* Vertical line connector */}
              <div className="absolute left-[17px] top-10 bottom-[-28px] w-0.5 border-l-2 border-dashed border-white/5 group-last:hidden" />
              
              <div className="absolute left-0 top-0.5">
                {step1Complete ? (
                  <div className="w-9 h-9 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border transition-colors ${
                    activeStep === 1
                      ? "bg-[#E8281E] border-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
                      : "bg-[#111111] border-white/5 text-[#71717A]"
                  }`}>
                    1
                  </div>
                )}
              </div>

              <div>
                <h3 className={`text-[16px] font-semibold transition-colors ${activeStep === 1 ? "text-white" : "text-[#A1A1AA]"}`}>
                  Fine-tune your AI Agent
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mt-1 leading-relaxed">
                  Shape its skills and knowledge before it starts solving cases.
                </p>
                {activeStep === 1 && !step1Complete && (
                  <Link
                    href="/dashboard/chatbots"
                    className="inline-flex items-center gap-1 bg-white text-black text-[12px] font-bold rounded-xl px-4 py-2 hover:bg-neutral-200 transition-colors mt-3 border-none"
                  >
                    <span>AI Agent settings</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>

            {/* Step 2: Add knowledge base */}
            <div
              className="relative pl-12 transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveStep(2)}
            >
              {/* Vertical line connector */}
              <div className="absolute left-[17px] top-10 bottom-[-28px] w-0.5 border-l-2 border-dashed border-white/5 group-last:hidden" />

              <div className="absolute left-0 top-0.5">
                {step2Complete ? (
                  <div className="w-9 h-9 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border transition-colors ${
                    activeStep === 2
                      ? "bg-[#E8281E] border-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
                      : "bg-[#111111] border-white/5 text-[#71717A]"
                  }`}>
                    2
                  </div>
                )}
              </div>

              <div>
                <h3 className={`text-[16px] font-semibold transition-colors ${activeStep === 2 ? "text-white" : "text-[#A1A1AA]"}`}>
                  Train on your Knowledge Base
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mt-1 leading-relaxed">
                  Train your chatbot on policies, QAs, and business guidelines.
                </p>
                {activeStep === 2 && !step2Complete && (
                  <div className="flex gap-3 mt-3">
                    {step1Complete ? (
                      <Link
                        href={`/dashboard/chatbots/${data.bots[0]?.id}`}
                        className="inline-flex items-center gap-1 bg-white text-black text-[12px] font-bold rounded-xl px-4 py-2 hover:bg-neutral-200 transition-colors border-none"
                      >
                        <span>Add Knowledge</span>
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <p className="text-[11px] text-[#E8281E] bg-[#E8281E]/10 px-3 py-1.5 rounded-lg border border-[#E8281E]/20">
                        Create an AI agent first before training.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Place widget on your website */}
            <div
              className="relative pl-12 transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveStep(3)}
            >
              {/* Vertical line connector */}
              <div className="absolute left-[17px] top-10 bottom-[-28px] w-0.5 border-l-2 border-dashed border-white/5 group-last:hidden" />

              <div className="absolute left-0 top-0.5">
                {step3Complete ? (
                  <div className="w-9 h-9 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border transition-colors ${
                    activeStep === 3
                      ? "bg-[#E8281E] border-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
                      : "bg-[#111111] border-white/5 text-[#71717A]"
                  }`}>
                    3
                  </div>
                )}
              </div>

              <div>
                <h3 className={`text-[16px] font-semibold transition-colors ${activeStep === 3 ? "text-white" : "text-[#A1A1AA]"}`}>
                  Place widget on your website
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mt-1 leading-relaxed">
                  Copy a single HTML script tag to start interacting with users.
                </p>
                {activeStep === 3 && !step3Complete && (
                  <div className="flex gap-2.5 mt-3">
                    {step1Complete && step2Complete ? (
                      <>
                        <Link
                          href="/dashboard/docs"
                          className="bg-white text-black text-[12px] font-bold rounded-xl px-4 py-2 hover:bg-neutral-200 transition-colors border-none"
                        >
                          Install Guide
                        </Link>
                        <Link
                          href={`/dashboard/chatbots/${data.bots[0]?.id}?tab=Test`}
                          className="bg-[#151515] border border-white/5 text-[#FAFAFA] hover:bg-[#202020] text-[12px] font-bold rounded-xl px-4 py-2 transition-colors border-none"
                        >
                          Test Sandbox
                        </Link>
                        <button
                          onClick={handleSkipOnboarding}
                          className="bg-transparent border border-transparent text-[#71717A] hover:text-[#FAFAFA] text-[12px] font-bold rounded-xl px-3 py-2 transition-colors cursor-pointer"
                        >
                          Skip Setup
                        </button>
                      </>
                    ) : (
                      <p className="text-[11px] text-[#E8281E] bg-[#E8281E]/10 px-3 py-1.5 rounded-lg border border-[#E8281E]/20">
                        Complete previous steps before website embedding.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Invite your team */}
            <div
              className="relative pl-12 transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveStep(4)}
            >
              {/* Vertical line connector */}
              <div className="absolute left-[17px] top-10 bottom-[-28px] w-0.5 border-l-2 border-dashed border-white/5 group-last:hidden" />

              <div className="absolute left-0 top-0.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border transition-colors ${
                  activeStep === 4
                    ? "bg-[#E8281E] border-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
                    : "bg-[#111111] border-white/5 text-[#71717A]"
                }`}>
                  4
                </div>
              </div>

              <div>
                <h3 className={`text-[16px] font-semibold transition-colors ${activeStep === 4 ? "text-white" : "text-[#A1A1AA]"}`}>
                  Invite your team
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mt-1 leading-relaxed">
                  Add support agents to handle complex customer queries.
                </p>
                {activeStep === 4 && (
                  <p className="text-[11px] text-[#A1A1AA] bg-[#111111] px-3.5 py-2 rounded-lg border border-white/5 mt-3 max-w-max">
                    Optional: Will unlock after initial chatbot integration setup.
                  </p>
                )}
              </div>
            </div>

            {/* Step 5: Add messaging channels */}
            <div
              className="relative pl-12 transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveStep(5)}
            >
              <div className="absolute left-0 top-0.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border transition-colors ${
                  activeStep === 5
                    ? "bg-[#E8281E] border-[#E8281E] text-white shadow-lg shadow-[#E8281E]/20"
                    : "bg-[#111111] border-white/5 text-[#71717A]"
                }`}>
                  5
                </div>
              </div>

              <div>
                <h3 className={`text-[16px] font-semibold transition-colors ${activeStep === 5 ? "text-white" : "text-[#A1A1AA]"}`}>
                  Add messaging channels
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mt-1 leading-relaxed">
                  Connect your AI agent to WhatsApp, Messenger, and Instagram.
                </p>
                {activeStep === 5 && (
                  <p className="text-[11px] text-[#A1A1AA] bg-[#111111] px-3.5 py-2 rounded-lg border border-white/5 mt-3 max-w-max">
                    Optional: Multi-channel support settings coming soon!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Preview Column (Image 3 UI Mock Visuals) */}
          <div className="xl:col-span-5 flex justify-center items-center xl:sticky xl:top-8">
            <div className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-3xl p-6 shadow-2xl flex items-center justify-center min-h-[420px] w-full relative overflow-hidden border border-[#232152]">
              {/* Radial gradient backing overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#E8281E/10,transparent_50%)]" />

              {/* Mobile Phone Mock frame */}
              <div className="bg-[#0B0B0C] border border-[#1C1C21] rounded-[28px] shadow-2xl p-4 flex flex-col gap-3 w-[260px] relative z-10 select-none">
                {/* Header */}
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#161719]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8281E] to-[#FF7A59] flex items-center justify-center text-white font-extrabold text-[11px] shrink-0">
                    F
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-white">Alex</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] text-[#A1A1AA]">Online</span>
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 flex flex-col gap-2.5 overflow-hidden justify-end py-1">
                  {/* Bot Welcome Bubble */}
                  <div className="bg-[#1C1D21] text-[#FAFAFA] text-[11px] rounded-2xl rounded-tl-none p-2.5 max-w-[85%] self-start leading-normal">
                    Hi! Anything specific on your mind, or just browsing?
                  </div>

                  {/* User query */}
                  <div className="bg-[#E8281E] text-white text-[11px] rounded-2xl rounded-tr-none p-2.5 max-w-[85%] self-end leading-normal mt-0.5">
                    I want an e-bike, but I'm worried about leaving it outside.
                  </div>

                  {/* Bot reply bubble */}
                  <div className="bg-[#1C1D21] text-[#FAFAFA] text-[11px] rounded-2xl rounded-tl-none p-2.5 max-w-[85%] self-start leading-normal mt-0.5">
                    Honestly, both the Urban Pro ST and Urban Lite have an integrated lock and GPS tracking.
                  </div>

                  {/* Embedded product item widget attachment */}
                  <div className="bg-[#121214] border border-[#1C1C21] rounded-xl p-2.5 mt-0.5 self-start max-w-[90%] flex flex-col gap-1.5">
                    <div className="w-full h-20 bg-[#1C1D21] rounded-lg flex items-center justify-center text-[22px]">
                      🚲
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-white">Urban Pro ST</h5>
                      <p className="text-[10px] text-[#A1A1AA] mt-0.5">$4,199</p>
                    </div>
                    <button className="bg-[#E8281E] hover:bg-[#FF3B30] text-white text-[10px] font-bold py-1.5 rounded-lg w-full text-center mt-1 border-none cursor-pointer">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // standard dashboard display: Linear/Stripe/Vercel spec redesign
  return (
    <div className="w-full max-w-[1600px] mx-auto text-[#FAFAFA] space-y-8 min-w-0 font-sans tracking-tight">
      {/* Top Header Block (Two Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Hello / Greeting Banner Card */}
        {/* Left Column: Hello / Greeting Banner Card */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#A31D1D] via-[#4A1B1B] to-[#111111] border border-white/5 rounded-[18px] p-6 relative overflow-hidden flex flex-col justify-center min-h-[190px]">
          {/* Subtle radial background glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right_center,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-[12px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              System Online
            </span>
            <h1 className="text-[32px] font-bold text-white tracking-tight font-sans mt-3">
              Good evening, Fenil 👋
            </h1>
            <p className="text-[14px] text-white/80 mt-2 font-normal leading-relaxed">
              Your customized FenBot agent is running normally. Support query accuracy reached <span className="text-white font-semibold">98%</span> over the last 24 hours across all channels.
            </p>
          </div>
        </div>

        {/* Right Column: Queries to Solve */}
        <div className="lg:col-span-4 bg-[#111111] border border-white/5 rounded-[18px] p-5 flex flex-col justify-between min-h-[190px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#A1A1AA]">
                  <ListTodo size={13} strokeWidth={2.5} />
                </div>
                <h3 className="text-[14px] font-bold text-white tracking-tight font-sans">
                  Queries to Solve
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#E8281E] bg-[#E8281E]/10 border border-[#E8281E]/20 px-2 py-0.5 rounded-full font-mono">
                {queries.length} active
              </span>
            </div>

            {/* Input to add query */}
            <div className="relative flex items-center w-full group">
              <input
                type="text"
                placeholder="Add a customer query to solve..."
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddQuery();
                }}
                className="w-full bg-[#151515] border border-white/5 pl-3 pr-10 py-2 rounded-xl text-[12px] text-white placeholder-[#71717A] focus:outline-none focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 font-sans transition-all duration-150"
              />
              <button
                onClick={handleAddQuery}
                className="absolute right-2 p-1.5 rounded-lg bg-white/5 hover:bg-[#E8281E]/15 text-[#71717A] hover:text-[#E8281E] border-none cursor-pointer shrink-0 transition-colors"
                title="Add Query"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* List of active queries */}
          <div className="flex-1 flex flex-col gap-2 mt-4 overflow-y-auto max-h-[105px] pr-1 scrollbar-none">
            {queries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-4 gap-1 select-none">
                <div className="w-6 h-6 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                  <Check size={12} strokeWidth={3} />
                </div>
                <p className="text-[11px] text-[#71717A] italic mt-1">All queries resolved</p>
              </div>
            ) : (
              queries.map((q, idx) => {
                // Dynamically assign tag styles based on query content
                const qLower = q.toLowerCase();
                let tagLabel = "Task";
                let tagClass = "text-[#A1A1AA] bg-white/5 border-white/5";
                
                if (qLower.includes("refund") || qLower.includes("bill") || qLower.includes("price")) {
                  tagLabel = "Billing";
                  tagClass = "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
                } else if (qLower.includes("webhook") || qLower.includes("dev") || qLower.includes("code")) {
                  tagLabel = "Dev";
                  tagClass = "text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/20";
                } else if (qLower.includes("api") || qLower.includes("token") || qLower.includes("key")) {
                  tagLabel = "API";
                  tagClass = "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20";
                }

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 bg-gradient-to-b from-[#151515] to-[#121212] px-3.5 py-2 rounded-xl border border-white/5 transition-all duration-200 hover:border-white/10 hover:translate-x-0.5 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Circle Check button */}
                      <button
                        onClick={() => handleRemoveQuery(idx)}
                        className="w-4 h-4 rounded-full border border-white/20 hover:border-[#22C55E] hover:bg-[#22C55E]/10 flex items-center justify-center text-transparent hover:text-[#22C55E] cursor-pointer shrink-0 transition-all"
                        title="Solve Task"
                      >
                        <Check size={10} strokeWidth={3} />
                      </button>
                      <span className="text-[12px] text-[#FAFAFA] group-hover:text-white truncate font-sans font-medium">{q}</span>
                    </div>

                    <span className={`text-[9px] border rounded-md px-1.5 py-0.5 font-bold uppercase tracking-wider shrink-0 transition-colors ${tagClass}`}>
                      {tagLabel}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Chatbots */}
        <Link
          href="/dashboard/chatbots"
          className="bg-gradient-to-b from-[#141414] to-[#101010] border border-white/5 rounded-[18px] p-6 flex flex-col justify-between min-h-[200px] hover:-translate-y-0.5 hover:border-white/10 transition-all duration-200 group relative select-none"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#A1A1AA] group-hover:text-white transition-colors tracking-tight">Active Chatbots</h3>
            <Bot size={18} className="text-[#71717A] group-hover:text-[#FAFAFA] transition-colors shrink-0" />
          </div>

          <div className="flex items-start gap-2 mt-4">
            <span className="relative flex h-1.5 w-1.5 mt-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]"></span>
            </span>
            <span className="text-[48px] font-extrabold text-white leading-none tracking-tighter">
              {data.bots.filter((b: any) => b.status === "active").length}
            </span>
          </div>
          
          <div className="mt-5 flex justify-end">
            <span className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-[#151515] border border-white/5 text-[#A1A1AA] group-hover:text-white font-bold text-[13px] hover:bg-[#202020] transition-all duration-200">
              Customize
            </span>
          </div>
        </Link>

        {/* Card 2: Conversations Today */}
        <Link
          href="/dashboard/inbox"
          className="bg-gradient-to-b from-[#141414] to-[#101010] border border-white/5 rounded-[18px] p-6 flex flex-col justify-between min-h-[200px] hover:-translate-y-0.5 hover:border-white/10 transition-all duration-200 group relative select-none"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#A1A1AA] group-hover:text-white transition-colors tracking-tight">Conversations Today</h3>
            <MessageSquare size={18} className="text-[#71717A] group-hover:text-[#FAFAFA] transition-colors shrink-0" />
          </div>

          <div className="flex items-start mt-4">
            <span className="text-[48px] font-extrabold text-white leading-none tracking-tighter font-mono">
              {data.conversations_today || 127}
            </span>
          </div>

          <div className="mt-5 flex justify-end">
            <span className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-[#151515] border border-white/5 text-[#A1A1AA] group-hover:text-white font-bold text-[13px] hover:bg-[#202020] transition-all duration-200">
              Open Inbox
            </span>
          </div>
        </Link>

        {/* Card 3: Hours Reclaimed */}
        <Link
          href="/dashboard/analytics"
          className="bg-gradient-to-b from-[#141414] to-[#101010] border border-white/5 rounded-[18px] p-6 flex flex-col justify-between min-h-[200px] hover:-translate-y-0.5 hover:border-white/10 transition-all duration-200 group relative select-none"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#A1A1AA] group-hover:text-white transition-colors tracking-tight">Hours Reclaimed</h3>
            <Clock size={18} className="text-[#71717A] group-hover:text-[#FAFAFA] transition-colors shrink-0" />
          </div>

          <div className="flex items-start mt-4">
            <span className="text-[48px] font-extrabold text-white leading-none tracking-tighter">
              24.8h
            </span>
          </div>

          <div className="mt-5 flex justify-end">
            <span className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-[#151515] border border-white/5 text-[#A1A1AA] group-hover:text-white font-bold text-[13px] hover:bg-[#202020] transition-all duration-200">
              View Analytics
            </span>
          </div>
        </Link>

        {/* Card 4: Subscription Plan */}
        <Link
          href="/dashboard/billing"
          className="bg-gradient-to-b from-[#141414] to-[#101010] border border-white/5 rounded-[18px] p-6 flex flex-col justify-between min-h-[200px] hover:-translate-y-0.5 hover:border-white/10 transition-all duration-200 group relative select-none"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#A1A1AA] group-hover:text-white transition-colors tracking-tight">Monthly Usage</h3>
            <Zap size={18} className="text-[#71717A] group-hover:text-[#FAFAFA] transition-colors shrink-0" />
          </div>

          <div className="flex items-start mt-4">
            <span className="text-[38px] font-extrabold text-white leading-none tracking-tighter font-mono">
              840 / 2000
            </span>
          </div>

          <div className="mt-5 flex justify-end">
            <span className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-[#151515] border border-white/5 text-[#A1A1AA] group-hover:text-white font-bold text-[13px] hover:bg-[#202020] transition-all duration-200">
              Upgrade
            </span>
          </div>
        </Link>
      </div>

      {/* Separation Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 pt-4">
        <div>
          <h2 className="text-[20px] font-bold text-white tracking-tight">Recent Conversations</h2>
          <p className="text-[12px] text-[#71717A] mt-0.5 font-normal leading-none font-sans">Step in to assist or monitor your AI agents in real time.</p>
        </div>
        
        {/* Dropdown Filter Option */}
        <div className="flex items-center gap-2 select-none">
          <span className="text-[11px] text-[#71717A] font-bold uppercase tracking-wider shrink-0 font-sans">Filter by Chatbot:</span>
          <select
            value={selectedBotId}
            onChange={(e) => {
              setSelectedBotId(e.target.value);
              setSelectedConvId(null);
            }}
            className="bg-[#111111] border border-white/5 text-white text-[12px] font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 transition-all cursor-pointer font-sans"
          >
            {data?.bots?.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recent Conversations Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Messages List (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#141415] to-[#0e0e0f] border border-white/5 rounded-[22px] p-5 flex flex-col gap-4 min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="text-[15px] font-bold text-white tracking-tight">Visitors</h2>
            <button
              onClick={() => router.push("/dashboard/inbox")}
              className="text-[10px] font-bold text-[#A1A1AA] hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>More</span>
              <ArrowRight size={10} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none max-h-[420px]">
            {(() => {
              const filtered = conversationsList.filter((c: any) => {
                if (selectedBotId === "all") return true;
                return c.chatbot_id === selectedBotId;
              });

              if (filtered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-[#71717A] gap-2">
                    <MessageSquare size={24} className="opacity-30" />
                    <p className="text-[12px] italic">No active conversations found for this filter.</p>
                  </div>
                );
              }

              return filtered.map((c: any) => {
                const isActive = selectedConvId === c.id;
                const lastMsg = chatMessages[c.id]?.slice(-1)[0]?.text || c.lastMessage;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    style={isActive ? (chatbotConfig?.accent_color ? { backgroundColor: chatbotConfig.accent_color, boxShadow: `0 10px 15px -3px ${chatbotConfig.accent_color}40` } : { backgroundColor: '#1F1F23' }) : {}}
                    className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 rounded-[16px] ${
                      isActive
                        ? "text-white"
                        : "hover:bg-white/[0.03] text-[#71717A] hover:text-[#FAFAFA]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Round Avatar with clean border */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 border ${
                        isActive ? "bg-white/15 border-white/20 text-white" : "bg-[#1c1c1e] border-white/5 text-[#FAFAFA]"
                      }`}>
                        {c.initials}
                      </div>

                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="flex items-center gap-2 justify-between">
                          <span className={`text-[13px] font-bold truncate ${isActive ? "text-white" : "text-[#FAFAFA]"}`}>
                            {c.name}
                          </span>
                          <span className={`text-[9px] shrink-0 font-mono ${isActive ? "text-white/80" : "text-[#71717A]"}`}>
                            {c.time}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate mt-1 ${isActive ? "text-white/85" : "text-[#71717A]"}`}>
                          {lastMsg}
                        </p>
                      </div>
                    </div>

                    {c.unread > 0 && !isActive && (
                      <span 
                        style={{ backgroundColor: chatbotConfig?.accent_color || '#1F1F23' }}
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                      >
                        {c.unread}
                      </span>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Right Column: Chat Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-gradient-to-b from-[#141415] to-[#0e0e0f] border border-white/5 rounded-[22px] p-5 flex flex-col justify-between min-h-[500px]">
          {selectedConvId ? (
            <>
              {/* Header */}
              <div 
                style={chatbotConfig?.header_color ? { backgroundColor: chatbotConfig.header_color } : {}}
                className={`p-4 flex items-center justify-between shrink-0 rounded-t-[22px] -mx-5 -mt-5 mb-3 transition-colors duration-300 border-b border-white/5 ${
                  chatbotConfig?.header_color ? "text-white" : "bg-[#141416]/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#1c1c1e] border border-white/5 flex items-center justify-center text-[12px] font-bold text-[#FAFAFA] shrink-0">
                    {conversationsList.find((c: any) => c.id === selectedConvId)?.initials || "FC"}
                  </div>
                  <div>
                    <h3 className={`text-[15px] font-bold leading-tight ${chatbotConfig?.header_color ? "text-white" : "text-white"}`}>
                      {conversationsList.find((c: any) => c.id === selectedConvId)?.name || "Visitor"}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${chatbotConfig?.header_color ? "bg-white" : "bg-[#22C55E]"}`} />
                      <span className={`text-[11px] ${chatbotConfig?.header_color ? "text-white/80" : "text-[#71717A]"}`}>Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Streams Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 flex flex-col scrollbar-none max-h-[340px]">
                {loadingMessages ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="flex flex-col items-start max-w-[60%] mr-auto gap-2">
                      <div className="h-10 w-48 bg-white/5 rounded-2xl rounded-tl-none" />
                      <div className="h-3 w-16 bg-white/5 rounded" />
                    </div>
                    <div className="flex flex-col items-end max-w-[60%] ml-auto gap-2">
                      <div className="h-12 w-64 bg-white/5 rounded-2xl rounded-tr-none" />
                      <div className="h-3 w-16 bg-white/5 rounded" />
                    </div>
                    <div className="flex flex-col items-start max-w-[60%] mr-auto gap-2">
                      <div className="h-8 w-32 bg-white/5 rounded-2xl rounded-tl-none" />
                      <div className="h-3 w-16 bg-white/5 rounded" />
                    </div>
                  </div>
                ) : (chatMessages[selectedConvId] || []).length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-[#71717A] py-16 gap-2">
                    <MessageSquare size={24} className="opacity-30" />
                    <p className="text-[12px] italic font-sans">No messages in this conversation yet.</p>
                  </div>
                ) : (
                  (chatMessages[selectedConvId] || []).map((m, idx) => {
                    const isUser = m.sender === "user";
                    const isBot = m.sender === "bot";
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isUser ? "items-start" : "items-end"} max-w-[80%] ${
                          isUser ? "mr-auto" : "ml-auto"
                        }`}
                      >
                        <div
                          style={
                            isUser
                              ? {}
                              : isBot
                              ? {
                                  backgroundColor: `${chatbotConfig?.accent_color || '#E8281E'}1a`,
                                  borderColor: `${chatbotConfig?.accent_color || '#E8281E'}33`
                                }
                              : { backgroundColor: chatbotConfig?.accent_color || '#1F1F23' }
                          }
                          className={`p-3.5 rounded-[18px] text-[12px] leading-relaxed ${
                            isUser
                              ? "bg-white text-black rounded-tl-none font-medium"
                              : isBot
                              ? "border text-white rounded-tr-none"
                              : "text-white rounded-tr-none font-medium"
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[9px] text-[#71717A] mt-1 px-1 font-mono">
                          {isUser ? "User" : isBot ? "FenBot (AI)" : "You"} • {m.time}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Input Bar */}
              <div className="pt-3 border-t border-white/5 flex items-center gap-3 shrink-0">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendReply();
                  }}
                  className="flex-1 bg-[#18181b]/50 border border-white/5 px-4 py-3 rounded-xl text-[12px] text-white placeholder-[#71717A] focus:outline-none focus:border-[#E8281E]/40 focus:ring-1 focus:ring-[#E8281E]/20 font-sans transition-all duration-150"
                />
                <button
                  onClick={handleSendReply}
                  style={
                    chatbotConfig?.bubble_color
                      ? { backgroundColor: chatbotConfig.bubble_color, boxShadow: `0 10px 15px -3px ${chatbotConfig.bubble_color}40` }
                      : { backgroundColor: '#1F1F23' }
                  }
                  className="w-10 h-10 rounded-xl text-white border-none cursor-pointer shrink-0 transition-all flex items-center justify-center"
                  title="Send Reply"
                >
                  <Send size={14} strokeWidth={2.5} className="transform rotate-45 mr-0.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[#71717A] gap-2">
              <MessageSquare size={32} className="opacity-30" />
              <p className="text-[13px] italic">Select a conversation from the list to begin chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}