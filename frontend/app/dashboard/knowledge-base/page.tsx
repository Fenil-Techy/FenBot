"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

type Doc = { id: string; content: string; created_at: string };

export default function KnowledgeBasePage() {
  const [text, setText] = useState("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  const loadDocs = async () => {
    const token = await getToken();
    const res = await fetch("http://localhost:8000/dashboard/documents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDocs(await res.json());
  };

  const handleAdd = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const token = await getToken();
    await fetch("http://localhost:8000/dashboard/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    setText("");
    setLoading(false);
    loadDocs();
  };

  const handleDelete = async (id: string) => {
    const token = await getToken();
    await fetch(`http://localhost:8000/dashboard/documents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadDocs();
  };

  useEffect(() => {
    loadDocs();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">Knowledge Base</h1>
      <p className="text-slate-500 text-sm mb-4">
        Paste your FAQs, policies, or product info. This is what your bot uses to answer accurately.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your FAQ or policy text here..."
        rows={8}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-2"
      />

      <button
        onClick={handleAdd}
        disabled={loading || !text.trim()}
        className="bg-[#1E3A5F] text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40 mb-6"
      >
        {loading ? "Adding..." : "Add to knowledge base"}
      </button>

      <h2 className="text-sm font-medium text-slate-600 mb-2">
        Current entries ({docs.length})
      </h2>
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between items-start gap-3 border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <p className="text-slate-700">{doc.content}</p>
            <button
              onClick={() => handleDelete(doc.id)}
              className="text-slate-400 hover:text-red-500 shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}