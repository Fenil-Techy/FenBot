"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Copy, Check, Terminal, Sparkles, Loader2, WifiOff } from "lucide-react";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { Button } from "@/components/ui/button";

type Bot = { id: string; name: string };

const PLATFORMS = [
  {
    id: "html",
    label: "Plain HTML / Custom Site",
    instructions: "Paste this snippet right before the closing </body> tag on any page you want the chatbot to appear on.",
  },
  {
    id: "shopify",
    label: "Shopify",
    instructions: "Go to Online Store → Themes → Edit code → theme.liquid. Paste the snippet right before the closing </body> tag, then save.",
  },
  {
    id: "wordpress",
    label: "WordPress",
    instructions: "Install a plugin like 'Insert Headers and Footers', paste the snippet into the Footer section, and save. (Or paste directly into your theme's footer.php before </body>, if you're comfortable editing theme files.)",
  },
  {
    id: "wix",
    label: "Wix",
    instructions: "Go to Settings → Custom Code → Add Custom Code. Paste the snippet, set it to load on 'All pages', place it in the 'Body - end' section, and apply.",
  },
];

export default function DocsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState("");
  const [platform, setPlatform] = useState("html");
  const [copied, setCopied] = useState(false);
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
      }
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

  // Use local host or public url for embed.js
  const host = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const snippet = `<script src="${host}/embed.js" data-bot-id="${selectedBot}"></script>`;
  const activePlatform = PLATFORMS.find((p) => p.id === platform)!;

  const handleCopy = () => {
    if (!selectedBot) return;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[14px] text-[#8B919D]">Loading installation guide...</p>
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
          Failed to fetch chatbot details from the server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code>.
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
    <div className="max-w-3xl mx-auto mt-6 px-6 text-[#F5F5F5]">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] mb-8 shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-[#F5F5F5]">Install Guide</h1>
          <p className="text-[12px] text-[#8B919D] mt-1">
            Add your chatbot to your website in under a minute — no developer required.
          </p>
        </div>
      </div>

      {bots.length === 0 ? (
        <EmptyState
          icon={Terminal}
          title="No chatbots available to install."
          description="Please create a chatbot first before accessing the installation instructions and snippet code."
        />
      ) : (
        <div className="space-y-8">
          {/* Step 1: Choose bot */}
          <div className="dashboard-card border border-[#20232A] rounded-2xl p-6 bg-[#16181D]/30">
            <h3 className="text-card-title text-[#F5F5F5] mb-3">1. Choose a Chatbot</h3>
            <select
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              className="border border-[#20232A] rounded-xl px-3 h-10 text-[13px] bg-[#16181D] text-[#F5F5F5] font-semibold focus:outline-none focus:border-[#E8281E] cursor-pointer w-full max-w-sm"
            >
              {bots.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Choose platform */}
          <div className="dashboard-card border border-[#20232A] rounded-2xl p-6 bg-[#16181D]/30">
            <h3 className="text-card-title text-[#F5F5F5] mb-4">2. Choose Your Platform</h3>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`px-4 h-9 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                    platform === p.id
                      ? "bg-[#E8281E] text-white border-transparent"
                      : "bg-[#16181D] text-[#8B919D] border-[#20232A] hover:bg-[#1D2026] hover:text-[#F5F5F5]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Instructions & snippet */}
          <div className="dashboard-card border border-[#20232A] rounded-2xl p-6 bg-[#16181D]/30">
            <h3 className="text-card-title text-[#F5F5F5] mb-2">3. Install Snippet</h3>
            <p className="text-[13px] text-[#8B919D] mb-4 leading-relaxed">
              {activePlatform.instructions}
            </p>

            <div className="bg-[#101113] border border-[#20232A] rounded-xl p-4 flex items-center justify-between gap-4">
              <code className="text-[12px] text-[#B4BAC5] break-all font-mono select-all">
                {snippet}
              </code>
              <button
                onClick={handleCopy}
                disabled={!selectedBot}
                className="shrink-0 bg-[#252932] border border-[#2A2E36] hover:bg-[#1D2026] text-[#F5F5F5] rounded-xl p-2.5 transition cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Summary / Tips box */}
          <div className="bg-[#16181D]/30 border border-[#20232A] rounded-xl p-4 text-[12px] text-[#8B919D] leading-normal flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F5F5]">That's it!</strong> Once added, the chat bubble will appear
              automatically in the bottom-right corner of your site. You can test how it looks and behaves
              anytime from the <strong>Playground</strong> or the <strong>Test</strong> tab inside each chatbot's settings.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
