import React, { useState } from "react";
import { Code, Check, Copy, MessageCircle, Store } from "lucide-react";

export function DeployMockup() {
  const [copied, setCopied] = useState(false);
  const code = `<script src="https://cdn.fenbot.ai/embed.js"
  data-key="fb_live_fenbot_7f39">
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Title */}
      <div>
        <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Code className="size-5 text-brand" />
          Deploy Code Snippet
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          Paste this snippet inside the header of your website to install.
        </p>
      </div>

      {/* Code window */}
      <div className="relative rounded-xl border border-slate-200 bg-slate-900 text-slate-300 font-mono text-[11px] p-4 pt-8 overflow-x-auto">
        {/* Terminal Header */}
        <div className="absolute top-2.5 left-4 flex gap-1">
          <div className="size-1.5 rounded-full bg-slate-700" />
          <div className="size-1.5 rounded-full bg-slate-700" />
          <div className="size-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-1.5 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors cursor-pointer border-none outline-none"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>

        <pre>
          <code>{code}</code>
        </pre>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Integrations Grid */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Or Connect Direct Channels</span>
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded bg-emerald-50 flex items-center justify-center">
                <MessageCircle className="size-4 text-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700">WhatsApp</span>
            </div>
            <button className="text-xs px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-medium cursor-pointer">
              Connect
            </button>
          </div>

          {/* Shopify */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded bg-lime-50 flex items-center justify-center">
                <Store className="size-4 text-lime-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Shopify</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Installed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
