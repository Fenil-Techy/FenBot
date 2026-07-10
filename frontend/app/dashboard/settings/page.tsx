"use client";
import { useState } from "react";
import { Settings as SettingsIcon, Sliders, Copy, Key, Users, MessageSquare, Plus, RefreshCw } from "lucide-react";
import { hasData as initialHasData, mockApiKeys, currentUser } from "@/lib/dashboard/mock-data";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [demoHasData, setDemoHasData] = useState(initialHasData.settings);
  const [workspaceName, setWorkspaceName] = useState("Acme Support");
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [teamMembers] = useState([
    { name: currentUser.name, email: currentUser.email, role: "Owner" },
    { name: "Sarah Jenkins", email: "sarah.j@gmail.com", role: "Developer" }
  ]);

  const handleGenerateKey = () => {
    const newKey = {
      id: `key-new-${Date.now()}`,
      name: `Sandbox API Key #${apiKeys.length + 1}`,
      prefix: `fb_test_${Math.random().toString(36).substring(2, 6)}`,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-[#20232A] shrink-0">
        <div>
          <p className="text-[14px] text-[#8B919D]">Manage workspace profiles, API keys, widget codes, and teams.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setDemoHasData(!demoHasData)}
          className="text-[12px] h-8 text-[#8B919D] hover:text-[#F5F5F5] hover:bg-[#1D2026] rounded-xl flex items-center gap-1.5 px-3 border border-[#2A2E36] cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>State: {demoHasData ? "Populated" : "Empty"}</span>
        </Button>
      </div>

      {!demoHasData ? (
        <EmptyState
          icon={SettingsIcon}
          title="No workspace settings configured."
          description="Initialize your workspace profile and generate your API keys to begin developer integrations."
          actionLabel="Initialize Settings"
          onAction={() => setDemoHasData(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Profile & Widget settings */}
          <div className="space-y-6">
            {/* Workspace Profile */}
            <DashboardCard className="space-y-4">
              <h3 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D]">
                Workspace Profile
              </h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                    Workspace Name
                  </label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="bg-[#101113] border-[#2A2E36] text-[13px] rounded-xl text-[#F5F5F5] focus:ring-1 focus:ring-[#E8281E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#8B919D] uppercase tracking-wider">
                    Workspace Domain
                  </label>
                  <Input
                    value="acme-support.fenbot.ai"
                    disabled
                    className="bg-[#101113]/50 border-[#2A2E36] text-[13px] rounded-xl text-[#8B919D] cursor-not-allowed"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={() => alert("Settings saved successfully!")}
                    className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-9 text-[13px] font-medium px-4 cursor-pointer border-none"
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </DashboardCard>

            {/* Widget Embed Code */}
            <DashboardCard className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <MessageSquare className="w-5 h-5" />
                <h3 className="text-card-title text-[#F5F5F5]">Chat Widget Integration</h3>
              </div>
              <p className="text-[12px] text-[#8B919D] leading-normal">
                Paste this script tag inside your website's HTML headers or before the body close tag to embed the FenBot chat console.
              </p>
              
              {/* Code Snippet Box */}
              <div className="relative bg-[#101113] border border-[#20232A] rounded-xl p-3.5 font-mono text-[11px] text-[#B4BAC5] break-all select-all">
                <code>
                  {`<script src="https://cdn.fenbot.ai/widget.js" data-id="fb_live_4j93"></script>`}
                </code>
                <button
                  onClick={() => handleCopyCode(`<script src="https://cdn.fenbot.ai/widget.js" data-id="fb_live_4j93"></script>`)}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#16181D] hover:bg-[#252932] border border-[#2A2E36] text-[#8B919D] hover:text-[#F5F5F5] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </DashboardCard>
          </div>

          {/* Right Column: Teams and API Keys */}
          <div className="space-y-6">
            {/* API Keys */}
            <DashboardCard className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#24262D]">
                <h3 className="text-card-title text-[#F5F5F5] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#E8281E]" />
                  <span>API Keys</span>
                </h3>
                <Button
                  onClick={handleGenerateKey}
                  variant="outline"
                  className="bg-[#252932] border border-[#2A2E36] hover:bg-[#1D2026] text-[#F5F5F5] rounded-xl h-8 text-[11px] px-2.5 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Generate</span>
                </Button>
              </div>

              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-3 bg-[#101113] border border-[#20232A] rounded-xl flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] text-[#F5F5F5] truncate">{k.name}</div>
                      <div className="text-[11px] text-[#8B919D] font-mono mt-1">
                        <code>{k.prefix}...</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyCode(`${k.prefix}xxxxxxxxxxxxxxxxxxxx`)}
                        className="p-1.5 rounded-lg hover:bg-[#1D2026] text-[#8B919D] hover:text-[#F5F5F5] cursor-pointer"
                        title="Copy Key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteKey(k.id)}
                        className="p-1.5 rounded-lg hover:bg-[#1D2026] text-[#8B919D] hover:text-red-400 cursor-pointer"
                        title="Revoke Key"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Team Management */}
            <DashboardCard className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#24262D]">
                <h3 className="text-card-title text-[#F5F5F5] flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Team Members</span>
                </h3>
                <Button
                  onClick={() => alert("Invite link generated!")}
                  variant="outline"
                  className="bg-[#252932] border border-[#2A2E36] hover:bg-[#1D2026] text-[#F5F5F5] rounded-xl h-8 text-[11px] px-2.5 cursor-pointer"
                >
                  Invite
                </Button>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member, i) => (
                  <div key={i} className="flex items-center justify-between py-1 first:pt-0">
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] text-[#F5F5F5] truncate">{member.name}</div>
                      <div className="text-[11px] text-[#8B919D] truncate">{member.email}</div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#20232A] border border-[#2A2E36] text-[#B4BAC5] font-semibold">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>
      )}
    </div>
  );
}
