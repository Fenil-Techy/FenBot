"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, ShieldAlert, Key, Loader2, WifiOff, Trash2 } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const getToken = async () => (await supabase.auth.getSession()).data.session?.access_token;

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData.user?.email ?? "");

      const token = await getToken();
      const res = await fetch("http://localhost:8000/dashboard/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch settings");
      }

      const settings = await res.json();
      setBusinessName(settings.business_name || "");
    } catch (e) {
      console.error(e);
      setError("unreachable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/dashboard/settings", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ business_name: businessName }),
      });
      if (!res.ok) throw new Error();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    setSavingPassword(true);
    setPasswordMsg("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    setPasswordMsg(error ? error.message : "Password updated successfully.");
    if (!error) setNewPassword("");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account, chatbots, and all data. This cannot be undone. Continue?"
    );
    if (!confirmed) return;
    alert("Account deletion isn't wired up yet — email hello@fenbot.com and we'll handle it manually for now.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-8 h-8 text-[#E8281E] animate-spin" />
        <p className="text-[14px] text-[#8B919D]">Loading account settings...</p>
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
          Failed to fetch settings details from the server at <code className="text-[#F5F5F5] bg-[#16181D] px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:8000</code>.
        </p>
        <Button
          onClick={loadSettings}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl px-5 h-10 text-[14px] font-medium border-none cursor-pointer"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 px-6 pb-16 text-[#F5F5F5] space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-[#F5F5F5]">Settings</h1>
          <p className="text-[12px] text-[#8B919D] mt-1">
            Manage your account details and business profile.
          </p>
        </div>
      </div>

      {/* Business profile */}
      <DashboardCard className="border border-[#20232A] bg-[#16181D]/30 p-6 space-y-4">
        <h2 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D]">
          Business Profile
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
              Business Name
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-[#20232A] rounded-xl px-3 h-10 text-[13px] bg-[#16181D] text-[#F5F5F5] focus:outline-none focus:border-[#E8281E] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
              Email
            </label>
            <input
              value={email}
              disabled
              className="w-full border border-[#20232A] rounded-xl px-3 h-10 text-[13px] bg-[#101113] text-[#8B919D] cursor-not-allowed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile || !businessName.trim()}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-9 text-[13px] font-medium px-5 cursor-pointer border-none disabled:opacity-50"
            >
              {savingProfile ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </span>
              ) : profileSaved ? (
                "Saved ✓"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Change password */}
      <DashboardCard className="border border-[#20232A] bg-[#16181D]/30 p-6 space-y-4">
        <h2 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D] flex items-center gap-1.5">
          <Key className="w-4 h-4 text-[#E8281E]" />
          <span>Change Password</span>
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full border border-[#20232A] rounded-xl px-3 h-10 text-[13px] bg-[#16181D] text-[#F5F5F5] focus:outline-none focus:border-[#E8281E] transition-all"
            />
          </div>

          {passwordMsg && (
            <p className={`text-[12px] font-semibold ${passwordMsg.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {passwordMsg}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={savingPassword || !newPassword}
              className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-9 text-[13px] font-medium px-5 cursor-pointer border-none disabled:opacity-50"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Danger zone */}
      <DashboardCard className="border border-red-500/20 bg-red-500/5 p-6 space-y-4">
        <h2 className="text-card-title text-red-500 pb-2 border-b border-red-500/10 flex items-center gap-1.5">
          <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          <span>Danger Zone</span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-[#F5F5F5]">Delete Account</p>
            <p className="text-[12px] text-[#8B919D] leading-normal max-w-md">
              Permanently delete your account, configuration settings, chatbots, and all historical user conversation transcripts.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="sm:shrink-0 bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all rounded-xl h-9 px-4 text-[12px] font-semibold cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </DashboardCard>
    </div>
  );
}
