"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  const loadKeys = async () => {
    const token = await getToken();
    const res = await fetch("http://localhost:8000/dashboard/api-keys", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setKeys(await res.json());
  };

  const generateKey = async () => {
    const token = await getToken();
    const res = await fetch("http://localhost:8000/dashboard/api-keys", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNewKey(data.api_key);
    loadKeys();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("onboarding_completed");
      if (!completed) {
        router.push("/onboarding");
        return;
      }
    }
    loadKeys();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-16">
      <h1 className="text-xl font-semibold text-slate-800 mb-4">API Keys</h1>

      <button
        onClick={generateKey}
        className="bg-[#1E3A5F] text-white rounded-lg px-4 py-2 text-sm font-medium mb-4"
      >
        Generate new key
      </button>

      {newKey && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4 text-sm">
          <p className="font-medium mb-1">Copy this now — it won't be shown again:</p>
          <code className="break-all">{newKey}</code>
        </div>
      )}

      <div className="space-y-2">
        {keys.map((k, i) => (
          <div key={i} className="flex justify-between text-sm border border-slate-200 rounded-lg px-3 py-2">
            <span>{k.key_prefix}...</span>
            <span className="text-slate-400">{new Date(k.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}