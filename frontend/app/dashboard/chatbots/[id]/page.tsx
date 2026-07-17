"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WidgetPreview } from "@/components/WidgetPreview";
import { useChatAi } from "@/hooks/useChatAi";
import {
  ArrowLeft, Loader2, Save, Check, WifiOff, Send, Bot,
  BookOpen, Compass, Palette, Play, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Extracted Components
import { KnowledgeBaseTab } from "@/components/dashboard/chatbots/KnowledgeBaseTab";
import { ChatSandbox } from "@/components/dashboard/chatbots/ChatSandbox";

// ─── Constants ──────────────────────────────────────────────────────────────

const TABS_WITH_META = [
  { name: "Knowledge Base", icon: BookOpen, desc: "Manage grounding documents" },
  { name: "Persona",        icon: Compass,  desc: "Tweak AI behavior instructions" },
  { name: "Widget",         icon: Palette,  desc: "Brand appearance & theme" },
  { name: "Test",           icon: Play,     desc: "Run live simulator sandbox" },
] as const;

type Tab = (typeof TABS_WITH_META)[number]["name"];

const WIDGET_PRESETS = [
  "#FAFAFA", "#8B5CF6", "#3B82F6", "#06B6D4",
  "#22C55E", "#FBBF24", "#F97316", "#EF4444", "#EC4899",
];

function isHeaderColorLight(hex?: string) {
  if (!hex) return false;
  const c = hex.replace("#", "");
  if (c.toLowerCase() === "ffffff" || c.toLowerCase() === "fafafa") return true;
  if (c.length === 6) {
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 180;
  }
  return false;
}

// ─── ManageChatbotPage ───────────────────────────────────────────────────────

export default function ManageChatbotPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("Knowledge Base");
  const [bot, setBot] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [docSubmitting, setDocSubmitting] = useState(false);



  // Widget customizer state
  const [widgetSubTab, setWidgetSubTab] = useState<"menu" | "appearance" | "language" | "visibility">("menu");
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [widgetPlacement, setWidgetPlacement] = useState<"left" | "right">("right");
  const [widgetSpacing, setWidgetSpacing] = useState(20);
  const [widgetMobileShow, setWidgetMobileShow] = useState(true);

  const supabase = createClient();

  const getToken = useCallback(async () => {
    return (await supabase.auth.getSession()).data.session?.access_token;
  }, [supabase]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) { setError("Unauthorized"); setLoading(false); return; }

      const [botRes, docsRes] = await Promise.all([
        fetch(`http://localhost:8000/dashboard/chatbots/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:8000/dashboard/chatbots/${id}/documents`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!botRes.ok || !docsRes.ok) throw new Error("Server returned error response");

      setBot(await botRes.json());
      setDocs(await docsRes.json());
    } catch {
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const q = searchParams.get("tab");
    if (q && (TABS_WITH_META.map((t) => t.name) as string[]).includes(q)) {
      setTab(q as Tab);
    }
  }, [searchParams]);

  const updateField = (key: string, val: string) => setBot((prev: any) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/dashboard/chatbots/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(bot),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSource = async (type: string, titleVal: string, contentVal: string) => {
    if (!contentVal.trim()) return;
    setDocSubmitting(true);
    try {
      const token = await getToken();
      const text = type === "Text" ? contentVal.trim() : `[${type}: ${titleVal.trim()}] ${contentVal.trim()}`;
      const res = await fetch(`http://localhost:8000/dashboard/chatbots/${id}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to add document");
      const docsRes = await fetch(`http://localhost:8000/dashboard/chatbots/${id}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (docsRes.ok) setDocs(await docsRes.json());
    } catch {
      alert("Failed to add source to knowledge base");
    } finally {
      setDocSubmitting(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/dashboard/chatbots/${id}/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      alert("Failed to delete document");
    }
  };

  // ── Loading / Error states ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[13px] text-zinc-500 font-sans">Loading chatbot configuration...</p>
      </div>
    );
  }

  if (error === "unreachable" || !bot) {
    return (
      <div
        style={{ width: "100%", maxWidth: "32rem" }}
        className="flex flex-col items-center justify-center text-center py-16 px-6 border border-[#EF4444]/20 rounded-2xl bg-[#EF4444]/5 mx-auto my-8 font-sans"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
          <WifiOff className="w-6 h-6" />
        </div>
        <h3 className="text-[16px] font-semibold text-[#F5F5F5] mb-1">Server Unreachable</h3>
        <p className="text-[14px] text-zinc-500 max-w-sm mb-6 leading-relaxed">
          Failed to fetch chatbot details from{" "}
          <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs border border-white/5">
            http://localhost:8000
          </code>.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/dashboard/chatbots")}
            variant="outline"
            className="border-white/5 text-[#F5F5F5] hover:bg-[#111113] rounded-xl h-10 px-5 cursor-pointer bg-[#0e0e10]"
          >
            Go Back
          </Button>
          <Button
            onClick={load}
            className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium border-none cursor-pointer"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderPersonaTab = () => (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Left panel (sidebar): Persona settings */}
      <div className="w-full lg:w-80 shrink-0 bg-[#0e0e10]/40 border border-white/5 rounded-[22px] p-5 flex flex-col gap-5">
        <div className="pb-3 border-b border-white/5">
          <h3 className="text-[16px] font-bold text-white">Persona Customization</h3>
          <p className="text-[12px] text-zinc-500 mt-1">Control your bot's behavior, tone, and active guidelines.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Bot Name</label>
            <Input value={bot.name || ""} onChange={(e) => updateField("name", e.target.value)}
              className="bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 w-full focus:outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Response Tone</label>
            <select value={bot.tone || "friendly"} onChange={(e) => updateField("tone", e.target.value)}
              className="w-full bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 px-2 focus:outline-none cursor-pointer font-sans">
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Welcome Message</label>
            <Input value={bot.welcome_message || ""} onChange={(e) => updateField("welcome_message", e.target.value)}
              className="bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 w-full focus:outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Input Placeholder</label>
            <Input value={bot.input_placeholder || ""} onChange={(e) => updateField("input_placeholder", e.target.value)}
              className="bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 w-full focus:outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Output Language</label>
            <Input value={bot.language || "English"} onChange={(e) => updateField("language", e.target.value)}
              className="bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 w-full focus:outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Guidelines / Instruction</label>
            <Textarea rows={4} value={bot.persona || ""} onChange={(e) => updateField("persona", e.target.value)}
              placeholder="Instructions to control tone, behavior..."
              className="bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white placeholder-zinc-500 p-2.5 focus:outline-none leading-relaxed font-sans" />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-white/5 mt-2">
          <Button onClick={handleSave} disabled={saving}
            className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-9 text-[12px] font-bold px-4 transition-all border-none flex items-center gap-1.5 cursor-pointer justify-center">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? "Saving..." : "Save changes"}</span>
          </Button>
          {saveSuccess && (
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1 justify-center font-sans">
              <Check className="w-3.5 h-3.5" /> Saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Right panel: Live browser preview */}
      <div className="flex-1 min-w-0 w-full">
        {renderWidgetViewport()}
      </div>
    </div>
  );

  const renderWidgetSettings = () => (
    <div className="w-full lg:w-80 shrink-0 bg-[#0e0e10]/40 border border-white/5 rounded-[22px] p-5">
      {widgetSubTab === "menu" ? (
        <div className="space-y-5">
          <div className="pb-3 border-b border-white/5">
            <h3 className="text-[16px] font-bold text-white font-sans">Customize Widget</h3>
            <p className="text-[12px] text-zinc-500 mt-1 font-sans">Brand and style the chatbot widget appearance.</p>
          </div>
          <div className="space-y-3">
            {[
              { id: "appearance" as const, title: "Appearance", desc: "Customize widget theme and colors.", icon: Palette },
              { id: "language"   as const, title: "Language",   desc: "Set language and default phrases.",  icon: Globe },
              { id: "visibility" as const, title: "Visibility", desc: "Adjust alignment and offset.",        icon: Play },
            ].map((item) => (
              <button key={item.id} onClick={() => setWidgetSubTab(item.id)}
                className="bg-[#111113]/30 border border-white/5 rounded-2xl p-4 hover:border-white/10 hover:bg-[#161619]/40 text-left w-full transition-all cursor-pointer flex gap-3.5 items-start group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 shrink-0 group-hover:text-white transition-colors">
                  <item.icon size={14} />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-white leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal font-sans">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <button onClick={() => setWidgetSubTab("menu")}
            className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-white border-none bg-transparent cursor-pointer font-sans">
            <ArrowLeft size={13} />
            <span className="capitalize">{widgetSubTab} Settings</span>
          </button>

          {widgetSubTab === "appearance" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => { updateField("header_color", "#FFFFFF"); updateField("bubble_color", "#FAFAFA"); }}
                    className={`border rounded-xl p-2.5 text-left transition-all relative overflow-hidden h-20 flex flex-col justify-between cursor-pointer ${
                      isHeaderColorLight(bot.header_color) ? "bg-[#161619] border-white/10 text-white" : "bg-[#111113]/30 border-white/5 text-zinc-500 hover:text-zinc-300"
                    }`}>
                    {isHeaderColorLight(bot.header_color) && <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#E8281E] rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</span>}
                    <div className="w-full h-6 bg-white border border-slate-100 rounded-md opacity-30" />
                    <span className="text-[11px] font-bold">Light</span>
                  </button>
                  <button type="button" onClick={() => { updateField("header_color", "#101113"); updateField("bubble_color", "#E8281E"); }}
                    className={`border rounded-xl p-2.5 text-left transition-all relative overflow-hidden h-20 flex flex-col justify-between cursor-pointer ${
                      !isHeaderColorLight(bot.header_color) ? "bg-[#161619] border-white/10 text-white" : "bg-[#111113]/30 border-white/5 text-zinc-500 hover:text-zinc-300"
                    }`}>
                    {!isHeaderColorLight(bot.header_color) && <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#E8281E] rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</span>}
                    <div className="w-full h-6 bg-[#1a1a1f] border border-white/5 rounded-md opacity-30" />
                    <span className="text-[11px] font-bold">Dark</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Primary Color</label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {WIDGET_PRESETS.map((color) => {
                    const sel = bot.accent_color === color;
                    return (
                      <button key={color} type="button"
                        onClick={() => { updateField("accent_color", color); updateField("bubble_color", color); }}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-full border cursor-pointer transition-all flex items-center justify-center ${sel ? "scale-105 border-white" : "border-white/10 hover:scale-105"}`}>
                        {sel && <span className={`text-[8px] font-bold ${color === "#FAFAFA" ? "text-slate-900" : "text-white"}`}>✓</span>}
                      </button>
                    );
                  })}
                  <div className="relative w-7 h-7 rounded-full border border-white/10 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{ background: "conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)" }}>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] pointer-events-none drop-shadow">🎨</span>
                    <input type="color" value={bot.accent_color || "#E8281E"}
                      onChange={(e) => { updateField("accent_color", e.target.value); updateField("bubble_color", e.target.value); }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button type="button" onClick={() => setShowMoreColors(!showMoreColors)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-[#111113]/30 border border-white/5 rounded-xl text-[11px] font-bold text-zinc-400 hover:text-white transition-all cursor-pointer font-sans">
                  <span>More colors</span>
                  <span className={`transition-transform duration-200 text-[9px] ${showMoreColors ? "rotate-180" : ""}`}>▼</span>
                </button>
                {showMoreColors && (
                  <div className="bg-[#111113]/20 border border-white/5 rounded-xl p-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                    {[
                      { key: "bubble_color", label: "Bubble Color" },
                      { key: "header_color", label: "Header Color" },
                      { key: "accent_color", label: "Accent Color" },
                    ].map((field) => (
                      <div key={field.key} className="space-y-0.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">{field.label}</label>
                        <div className="flex items-center gap-1.5">
                          <input type="color" value={bot[field.key] || "#E8281E"} onChange={(e) => updateField(field.key, e.target.value)}
                            className="w-6 h-6 rounded border border-white/5 bg-[#111111] cursor-pointer shrink-0" />
                          <Input value={bot[field.key] || ""} onChange={(e) => updateField(field.key, e.target.value)}
                            className="bg-[#111111] border border-white/5 text-[11px] rounded-lg text-white h-7 px-2 focus:outline-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {widgetSubTab === "language" && (
            <div className="space-y-4">
              {[
                { key: "language",          label: "Output Language"    },
                { key: "welcome_message",   label: "Welcome Greeting"   },
                { key: "input_placeholder", label: "Input Placeholder"  },
              ].map((f) => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">{f.label}</label>
                  <Input value={bot[f.key] || ""} onChange={(e) => updateField(f.key, e.target.value)}
                    className="bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 focus:outline-none" />
                </div>
              ))}
            </div>
          )}

          {widgetSubTab === "visibility" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Placement Alignment</label>
                <select value={widgetPlacement} onChange={(e) => setWidgetPlacement(e.target.value as any)}
                  className="w-full bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 px-2 cursor-pointer focus:outline-none font-sans">
                  <option value="right">Right Side (Default)</option>
                  <option value="left">Left Side</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Spacing Offset (px)</label>
                <Input type="number" value={widgetSpacing} onChange={(e) => setWidgetSpacing(Number(e.target.value))}
                  min={10} max={100}
                  className="bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Mobile Viewport</label>
                <select value={widgetMobileShow ? "show" : "hide"} onChange={(e) => setWidgetMobileShow(e.target.value === "show")}
                  className="w-full bg-[#111111] border border-white/5 text-[12px] rounded-xl text-white h-9 px-2 cursor-pointer focus:outline-none font-sans">
                  <option value="show">Show on Mobile viewports</option>
                  <option value="hide">Hide Widget on Mobile</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4 border-t border-white/5 mt-4">
            <Button onClick={handleSave} disabled={saving}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-9 text-[12px] font-bold px-4 transition-all border-none flex items-center gap-1.5 cursor-pointer justify-center">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? "Saving..." : "Save changes"}</span>
            </Button>
            {saveSuccess && (
              <p className="text-[10px] text-green-400 font-semibold flex items-center gap-1 justify-center font-sans">
                <Check className="w-3.5 h-3.5" /> Saved successfully
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderWidgetViewport = () => (
    <div className="w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full h-[580px] bg-[#16161a] border border-white/5 rounded-[22px] overflow-hidden flex flex-col relative">
        {/* macOS browser top bar */}
        <div className="bg-[#0e0e10] border-b border-white/5 px-4 h-12 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <span>Preview on</span>
            <div className="relative w-64">
              <input type="text" readOnly value="localhost:3000"
                className="bg-[#1a1a1f] border border-white/5 rounded-lg pl-3 pr-8 py-1 h-7 w-full text-white placeholder-zinc-600 focus:outline-none" />
              <span className="absolute right-2.5 top-1.5 text-zinc-600">→</span>
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* Viewport */}
        <div className="flex-1 bg-[#0c0c0e] relative p-6 overflow-hidden select-none">
          <div className="w-full h-full opacity-10 pointer-events-none flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="flex gap-4">
                <div className="h-3 w-12 bg-white/10 rounded" />
                <div className="h-3 w-12 bg-white/10 rounded" />
                <div className="h-3 w-12 bg-white/10 rounded" />
              </div>
            </div>
            <div className="h-28 bg-white/5 rounded-xl flex items-center justify-center">
              <div className="h-3.5 w-48 bg-white/10 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-white/5 rounded-xl" />
              <div className="h-24 bg-white/5 rounded-xl" />
              <div className="h-24 bg-white/5 rounded-xl" />
            </div>
          </div>

          {/* Widget preview */}
          <div
            style={{
              bottom: `${widgetSpacing}px`,
              left:  widgetPlacement === "left"  ? `${widgetSpacing}px` : "auto",
              right: widgetPlacement === "right" ? `${widgetSpacing}px` : "auto",
            }}
            className={`absolute z-10 w-[295px] h-[395px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-all duration-200 ${
              isHeaderColorLight(bot.header_color)
                ? "bg-white text-slate-900 border-slate-200"
                : "bg-[#101012] text-white border-white/5"
            }`}
          >
            <div className="px-3.5 py-3 flex items-center gap-2.5 transition-colors text-white shrink-0"
              style={{ backgroundColor: bot.header_color || "#101113" }}>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
                {bot.name ? bot.name.slice(0, 2).toUpperCase() : "FB"}
              </div>
              <div>
                <p className="text-[13px] font-bold leading-none">{bot.name || "FenBot"}</p>
                <span className="text-[9px] opacity-75 mt-0.5 block leading-none">Online now</span>
              </div>
            </div>
            <div className={`flex-1 p-3 overflow-y-auto ${isHeaderColorLight(bot.header_color) ? "bg-[#F5F7FF]" : "bg-[#161619]"}`}>
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: bot.header_color || "#101113" }}>
                  {bot.name ? bot.name.slice(0, 2).toUpperCase() : "FB"}
                </div>
                <div className={`rounded-xl rounded-bl-md px-3 py-2 text-[12px] shadow-sm max-w-[80%] leading-relaxed ${
                  isHeaderColorLight(bot.header_color) ? "bg-white text-slate-800" : "bg-white/5 text-[#F5F5F5] border border-white/5"
                }`}>
                  {bot.welcome_message || "Hello! How can I help you today?"}
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-2 p-2.5 border-t shrink-0 ${
              isHeaderColorLight(bot.header_color) ? "border-slate-100 bg-white" : "border-white/5 bg-[#101012]"
            }`}>
              <div className={`flex-1 rounded-full px-3 py-1.5 text-[11px] truncate ${
                isHeaderColorLight(bot.header_color) ? "bg-[#F5F7FF] border border-slate-100 text-slate-400" : "bg-white/5 border border-white/5 text-zinc-500"
              }`}>
                {bot.input_placeholder || "Type your message..."}
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: bot.accent_color || "#E8281E" }}>
                <Send className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestTab = () => (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Left panel (sidebar): Live sandbox instructions / reset control */}
      <div className="w-full lg:w-80 shrink-0 bg-[#0e0e10]/40 border border-white/5 rounded-[22px] p-5 flex flex-col gap-5">
        <div className="pb-3 border-b border-white/5">
          <h3 className="text-[16px] font-bold text-white font-sans">Live Chat Sandbox</h3>
          <p className="text-[12px] text-zinc-500 mt-1 font-sans">
            Test how your AI chatbot responds in real-time with your knowledge grounding and persona guidelines.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111113]/30 border border-white/5 rounded-2xl p-4 text-[12px] leading-relaxed text-zinc-400 space-y-2">
            <h4 className="font-bold text-white">How it works:</h4>
            <ul className="list-disc pl-4 space-y-1.5 font-sans">
              <li>Answers are grounded in documents from your <strong>Knowledge Base</strong>.</li>
              <li>Responses adopt the selected tone and custom guidelines configured in <strong>Persona</strong>.</li>
              <li>Simulates the embedded widget behavior.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 mt-2 flex flex-col gap-2">
          <Button
            onClick={() => {
              // Reload page to reset chat session
              window.location.reload();
            }}
            className="bg-[#151515] border border-white/5 text-[#A1A1AA] hover:bg-[#202020] hover:text-white rounded-xl h-9 text-[12px] font-bold px-4 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Reset Chat Session</span>
          </Button>
        </div>
      </div>

      {/* Right panel: Browser Mockup containing the Live Sandbox */}
      <div className="flex-1 min-w-0 w-full">
        <div className="w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full h-[580px] bg-[#16161a] border border-white/5 rounded-[22px] overflow-hidden flex flex-col relative">
            {/* macOS browser top bar */}
            <div className="bg-[#0e0e10] border-b border-white/5 px-4 h-12 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                <span>Testing Sandbox on</span>
                <div className="relative w-64">
                  <input type="text" readOnly value="localhost:3000/sandbox"
                    className="bg-[#1a1a1f] border border-white/5 rounded-lg pl-3 pr-8 py-1 h-7 w-full text-white placeholder-zinc-600 focus:outline-none" />
                  <span className="absolute right-2.5 top-1.5 text-zinc-600">→</span>
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* Viewport rendering ChatSandbox */}
            <div className="flex-1 bg-[#0c0c0e] relative p-6 overflow-hidden select-text">
              {/* Mock website background */}
              <div className="w-full h-full opacity-10 pointer-events-none flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="flex gap-4">
                    <div className="h-3 w-12 bg-white/10 rounded" />
                    <div className="h-3 w-12 bg-white/10 rounded" />
                    <div className="h-3 w-12 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="h-28 bg-white/5 rounded-xl flex items-center justify-center">
                  <div className="h-3.5 w-48 bg-white/10 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-white/5 rounded-xl" />
                  <div className="h-24 bg-white/5 rounded-xl" />
                  <div className="h-24 bg-white/5 rounded-xl" />
                </div>
              </div>

              {/* ChatSandbox styled as the floating widget */}
              <ChatSandbox
                chatbot_id={id}
                chatbot_name={bot.name}
                header_color={bot.header_color}
                bubble_color={bot.bubble_color}
                accent_color={bot.accent_color}
                welcome_message={bot.welcome_message}
                input_placeholder={bot.input_placeholder}
                widget_spacing={widgetSpacing}
                widget_placement={widgetPlacement}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Main render ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-[1600px] mx-auto text-[#FAFAFA] min-w-0 font-sans tracking-tight">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/5 mb-6">
        <button onClick={() => router.push("/dashboard/chatbots")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#111111] border border-white/5 text-[#71717A] hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-[20px] font-bold text-white leading-none">{bot.name}</h2>
          <p className="text-[12px] text-zinc-500 mt-1.5">
            Configure training knowledge, system behavior instructions, widget styling, and run live sandbox tests.
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-white/5 pb-6 mb-8 select-none">
        <div className="bg-[#111113]/80 border border-white/5 p-1 rounded-2xl inline-flex flex-wrap gap-1">
          {TABS_WITH_META.map((t) => {
            const active = tab === t.name;
            return (
              <button
                key={t.name}
                onClick={() => { setTab(t.name); if (t.name !== "Widget") setWidgetSubTab("menu"); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all border cursor-pointer select-none ${
                  active
                    ? "bg-[#18181b] border-white/5 text-white animate-in fade-in duration-200"
                    : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-[#161619]/45"
                }`}
              >
                <t.icon size={14} className={active ? "text-[#E8281E]" : "text-zinc-500"} />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {tab === "Widget" ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {renderWidgetSettings()}
          <div className="flex-1 min-w-0 w-full">{renderWidgetViewport()}</div>
        </div>
      ) : (
        <div className="w-full animate-in fade-in duration-200">
          {tab === "Knowledge Base" && (
            <KnowledgeBaseTab
              docs={docs}
              onAddSource={(content) => handleAddSource("Text", "Raw Text", content)}
              handleDeleteDoc={handleDeleteDoc}
            />
          )}
          {tab === "Persona" && renderPersonaTab()}
          {tab === "Test"    && renderTestTab()}
        </div>
      )}
    </div>
  );
}


