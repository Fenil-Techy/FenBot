"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WidgetPreview } from "@/components/WidgetPreview";
import { useChatAi } from "@/hooks/useChatAi";
import { Trash2, ArrowLeft, Loader2, Save, Check, FileText, WifiOff, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const TABS = ["Knowledge Base", "Persona", "Widget", "Test"] as const;
type Tab = (typeof TABS)[number];

export default function ManageChatbotPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("Knowledge Base");
  const [bot, setBot] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [newDoc, setNewDoc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [docSubmitting, setDocSubmitting] = useState(false);

  const supabase = createClient();

  const getToken = useCallback(async () => {
    return (await supabase.auth.getSession()).data.session?.access_token;
  }, [supabase]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      const [botRes, docsRes] = await Promise.all([
        fetch(`http://localhost:8000/dashboard/chatbots/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8000/dashboard/chatbots/${id}/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!botRes.ok || !docsRes.ok) {
        throw new Error("Server returned error response");
      }

      const botData = await botRes.json();
      const docsData = await docsRes.json();

      setBot(botData);
      setDocs(docsData);
    } catch (err) {
      console.error(err);
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => {
    load();
  }, [load]);

  // Set tab from query parameters if present
  useEffect(() => {
    const queryTab = searchParams.get("tab");
    if (queryTab && TABS.includes(queryTab as any)) {
      setTab(queryTab as Tab);
    }
  }, [searchParams]);

  const updateField = (field: string, value: string) => {
    setBot((b: any) => ({ ...b, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/dashboard/chatbots/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: bot.name,
          persona: bot.persona,
          welcome_message: bot.welcome_message,
          tone: bot.tone,
          language: bot.language,
          input_placeholder: bot.input_placeholder,
          bubble_color: bot.bubble_color,
          header_color: bot.header_color,
          accent_color: bot.accent_color,
          status: bot.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to update chatbot");
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAddDoc = async () => {
    if (!newDoc.trim()) return;
    setDocSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/dashboard/chatbots/${id}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newDoc }),
      });

      if (!res.ok) throw new Error("Failed to add document");

      setNewDoc("");
      // Reload documents
      const docsRes = await fetch(`http://localhost:8000/dashboard/chatbots/${id}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (docsRes.ok) {
        setDocs(await docsRes.json());
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add to knowledge base");
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

      if (!res.ok) throw new Error("Failed to delete document");

      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (e) {
      console.error(e);
      alert("Failed to delete document");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[14px] text-[#8B919D]">Loading chatbot details...</p>
      </div>
    );
  }

  if (error === "unreachable" || !bot) {
    return (
      <div
        style={{ width: "100%", maxWidth: "32rem" }}
        className="flex flex-col items-center justify-center text-center py-16 px-6 border border-[#EF4444]/20 rounded-2xl bg-[#EF4444]/5 mx-auto my-8"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
          <WifiOff className="w-6 h-6" />
        </div>
        <h3 className="text-[16px] font-semibold text-[#F5F5F5] mb-1">Server Unreachable</h3>
        <p className="text-[14px] text-[#8B919D] max-w-sm mb-6">
          Failed to fetch chatbot details from the server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code>.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/dashboard/chatbots")}
            variant="outline"
            className="border-[#2A2E36] text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl h-10 px-5 cursor-pointer"
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

  return (
    <div className="flex flex-col gap-6 text-[#F5F5F5] font-sans antialiased max-w-6xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-[#20232A]">
        <button
          onClick={() => router.push("/dashboard/chatbots")}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#16181D] border border-[#2A2E36] text-[#8B919D] hover:text-[#F5F5F5] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-[#F5F5F5] leading-none">{bot.name}</h1>
          <p className="text-[12px] text-[#8B919D] mt-1.5">
            Manage training docs, persona parameters, widget appearance, and live test.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-[#101113] p-1 border border-[#20232A] rounded-xl self-start">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all select-none cursor-pointer border-none ${
              tab === t
                ? "bg-[#252932] text-[#F5F5F5]"
                : "text-[#8B919D] hover:text-[#F5F5F5]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="mt-2">
        {tab === "Knowledge Base" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Input Box */}
            <div className="lg:col-span-1">
              <div className="dashboard-card flex flex-col gap-4">
                <h3 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D]">
                  Add Knowledge Text
                </h3>
                <Textarea
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  placeholder="Paste FAQ questions and answers, refund rules, shipping costs, or policy documents here..."
                  rows={8}
                  className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] p-3 focus:ring-1 focus:ring-[#E8281E] focus:outline-none leading-relaxed"
                />
                <Button
                  onClick={handleAddDoc}
                  disabled={!newDoc.trim() || docSubmitting}
                  className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-10 text-[13px] font-medium transition-colors w-full cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  {docSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add to knowledge base</span>
                </Button>
              </div>
            </div>

            {/* Document List */}
            <div className="lg:col-span-2">
              <div className="dashboard-card flex flex-col gap-4">
                <div className="pb-2 border-b border-[#24262D] flex justify-between items-center">
                  <h3 className="text-card-title text-[#F5F5F5]">Active Documents</h3>
                  <span className="text-[11px] text-[#8B919D] font-mono">{docs.length} segments</span>
                </div>

                {docs.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-[#8B919D]">
                    <FileText className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-[13px]">No documents found for this chatbot.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#20232A] max-h-[500px] overflow-y-auto pr-1 space-y-3">
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className="py-3 flex items-start justify-between gap-4 first:pt-0"
                      >
                        <p className="text-[13px] text-[#F5F5F5] leading-relaxed whitespace-pre-wrap flex-1">
                          {doc.content}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="w-8 h-8 text-[#8B919D] hover:text-red-400 hover:bg-[#1D2026] rounded-lg shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "Persona" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Persona Settings */}
            <div className="lg:col-span-2 dashboard-card flex flex-col gap-4">
              <div className="pb-2 border-b border-[#24262D]">
                <h3 className="text-card-title text-[#F5F5F5]">Persona Customization</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bot Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                    Bot Name
                  </label>
                  <Input
                    value={bot.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] h-9 focus:ring-1 focus:ring-[#E8281E]"
                  />
                </div>

                {/* Tone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider block">
                    Response Tone
                  </label>
                  <select
                    value={bot.tone || "friendly"}
                    onChange={(e) => updateField("tone", e.target.value)}
                    className="w-full bg-[#101113] border border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] h-9 px-3 focus:ring-1 focus:ring-[#E8281E] focus:outline-none cursor-pointer"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                {/* Welcome Message */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                    Welcome Message
                  </label>
                  <Input
                    value={bot.welcome_message || ""}
                    onChange={(e) => updateField("welcome_message", e.target.value)}
                    className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] h-9 focus:ring-1 focus:ring-[#E8281E]"
                  />
                </div>

                {/* Input Placeholder */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                    Input Field Placeholder
                  </label>
                  <Input
                    value={bot.input_placeholder || ""}
                    onChange={(e) => updateField("input_placeholder", e.target.value)}
                    className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] h-9 focus:ring-1 focus:ring-[#E8281E]"
                  />
                </div>

                {/* Language */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                    Output Language
                  </label>
                  <Input
                    value={bot.language || "English"}
                    onChange={(e) => updateField("language", e.target.value)}
                    className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] h-9 focus:ring-1 focus:ring-[#E8281E]"
                  />
                </div>

                {/* System Persona Instructions */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider block">
                    System Guidelines / Instruction Persona
                  </label>
                  <Textarea
                    rows={4}
                    value={bot.persona || ""}
                    onChange={(e) => updateField("persona", e.target.value)}
                    placeholder="Instructions to control the bot's tone and behavior..."
                    className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] placeholder-[#8B919D] p-3 focus:ring-1 focus:ring-[#E8281E] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-2 border-t border-[#24262D]">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-10 px-5 text-[13px] font-medium transition-colors border-none flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saving ? "Saving changes..." : "Save changes"}</span>
                </Button>
                {saveSuccess && (
                  <span className="text-[12px] text-green-400 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Saved successfully
                  </span>
                )}
              </div>
            </div>

            {/* Widget Preview Column */}
            <div className="lg:col-span-1">
              <WidgetPreview
                bubbleColor={bot.bubble_color}
                headerColor={bot.header_color}
                accentColor={bot.accent_color}
                welcomeMessage={bot.welcome_message}
                inputPlaceholder={bot.input_placeholder}
                botName={bot.name}
              />
            </div>
          </div>
        )}

        {tab === "Widget" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Widget Styling */}
            <div className="lg:col-span-2 dashboard-card flex flex-col gap-4">
              <div className="pb-2 border-b border-[#24262D]">
                <h3 className="text-card-title text-[#F5F5F5]">Widget Customization</h3>
              </div>

              <div className="space-y-4">
                {[
                  { key: "bubble_color", label: "Launcher Bubble Color" },
                  { key: "header_color", label: "Chat Header Color" },
                  { key: "accent_color", label: "Input / Send Accent Color" },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider block">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bot[field.key] || "#E8281E"}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="w-10 h-10 rounded-xl border border-[#2A2E36] bg-[#101113] cursor-pointer shrink-0"
                      />
                      <Input
                        value={bot[field.key] || ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] h-10 focus:ring-1 focus:ring-[#E8281E]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-4 pt-2 border-t border-[#24262D]">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 rounded-xl h-10 px-5 text-[13px] font-medium transition-colors border-none flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saving ? "Saving changes..." : "Save changes"}</span>
                </Button>
                {saveSuccess && (
                  <span className="text-[12px] text-green-400 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Saved successfully
                  </span>
                )}
              </div>
            </div>

            {/* Widget Preview Column */}
            <div className="lg:col-span-1">
              <WidgetPreview
                bubbleColor={bot.bubble_color}
                headerColor={bot.header_color}
                accentColor={bot.accent_color}
                welcomeMessage={bot.welcome_message}
                inputPlaceholder={bot.input_placeholder}
                botName={bot.name}
              />
            </div>
          </div>
        )}

        {tab === "Test" && (
          <div className="dashboard-card flex flex-col gap-4">
            <div className="pb-2 border-b border-[#24262D]">
              <h3 className="text-card-title text-[#F5F5F5]">Live Chat Sandbox</h3>
            </div>
            <p className="text-[13px] text-[#8B919D] leading-relaxed max-w-2xl">
              This sandbox tests your actual chatbot grounded with RAG context, tone, and brand persona configuration.
            </p>
            <div className="mt-2">
              <ChatSandbox chatbot_id={id} chatbot_name={bot.name} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatSandbox({ chatbot_id, chatbot_name }: { chatbot_id: string; chatbot_name: string }) {
  const { messages, sendMessage, status } = useChatAi(chatbot_id);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;
    sendMessage({ text: input });
    setInput("");
  };

  const getMessageText = (message: any) => {
    if (message.content) return message.content;
    if (Array.isArray(message.parts)) {
      return message.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join(" ");
    }
    return "";
  };

  return (
    <div className="flex flex-col h-[560px] w-[calc(100vw-4rem)] sm:w-[480px] shrink-0 mx-auto bg-[#101113] border border-[#20232A] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="h-14 px-4 border-b border-[#20232A] flex items-center gap-3 shrink-0 bg-[#16181D]">
        <div className="w-8 h-8 rounded-lg bg-[#20232A] border border-[#2A2E36] flex items-center justify-center text-[#E8281E]">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-[#F5F5F5]">{chatbot_name} Sandbox</h4>
          <span className="text-[10px] text-[#8B919D] block">Live testing panel</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#16181D] border border-[#2A2E36] flex items-center justify-center text-[#8B919D]">
              <Bot className="w-5 h-5" />
            </div>
            <p className="text-[12px] text-[#8B919D] leading-relaxed">
              Send a message to test how your chatbot answers questions based on your knowledge base and tone.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const text = getMessageText(m);
            if (!text) return null;
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-[#E8281E] text-white rounded-br-none"
                    : "self-start bg-[#16181D] border border-[#2A2E36] text-[#F5F5F5] rounded-bl-none"
                }`}
              >
                <span className="whitespace-pre-wrap">{text}</span>
              </div>
            );
          })
        )}
        {status === "streaming" && (
          <div className="self-start bg-[#16181D] border border-[#2A2E36] rounded-2xl rounded-bl-none px-4 py-2.5 text-[13px] flex items-center gap-2 text-[#8B919D]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#20232A] bg-[#16181D] shrink-0">
        <div className="flex items-center gap-2 bg-[#101113] border border-[#2A2E36] rounded-xl p-1.5 focus-within:border-[#E8281E]/60 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status === "streaming"}
            placeholder={`Message ${chatbot_name}...`}
            className="flex-1 bg-transparent border-none text-[13px] text-[#F5F5F5] placeholder-[#8B919D] px-2 py-1.5 focus:outline-none disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!input.trim() || status === "streaming"}
            size="icon"
            className="w-8 h-8 rounded-lg bg-[#E8281E] text-white hover:bg-[#C41F16] disabled:opacity-40 flex items-center justify-center border-none cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
