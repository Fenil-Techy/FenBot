"use client";
import { useRouter } from "next/navigation";
import { HelpCircle, BookOpen, MessageSquare, Terminal, Server, ArrowRight, Code2 } from "lucide-react";
import { helpFaqs } from "@/lib/dashboard/mock-data";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  const router = useRouter();

  const cards = [
    {
      title: "Install Guide",
      desc: "Get embedding scripts for HTML, Shopify, WordPress, and Wix sites.",
      icon: Code2,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      href: "/dashboard/docs",
    },
    {
      title: "Knowledge Base Docs",
      desc: "Learn how to format website indexes, pdf files, and text manuals.",
      icon: BookOpen,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "API Reference",
      desc: "Understand how to query active chatbot models and log transcripts.",
      icon: Terminal,
      color: "text-[#E8281E] bg-[#E8281E]/10 border-[#E8281E]/20",
    },
    {
      title: "System Status",
      desc: "Check active engines, latency, uptime, and incident logs.",
      icon: Server,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const handleCardClick = (c: any) => {
    if (c.href) {
      router.push(c.href);
    } else {
      alert(`Redirecting to ${c.title}...`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#20232A]">
        <p className="text-[14px] text-[#8B919D]">Access user guides, API docs, and direct contact options.</p>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <DashboardCard
              key={c.title}
              onClick={() => handleCardClick(c)}
              className="group flex flex-col justify-between min-h-[140px] cursor-pointer"
            >
              <div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-[15px] font-semibold text-[#F5F5F5] mt-4 group-hover:text-white transition-colors">
                  {c.title}
                </h4>
                <p className="text-[12px] text-[#8B919D] mt-1.5 leading-normal">
                  {c.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] text-[#E8281E] font-semibold tracking-wide uppercase select-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </DashboardCard>
          );
        })}
      </div>

      {/* FAQs Section */}
      <DashboardCard className="space-y-4">
        <h3 className="text-card-title text-[#F5F5F5] pb-2 border-b border-[#24262D]">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {helpFaqs.map((faq, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-[14px] font-semibold text-[#F5F5F5] leading-normal flex items-start gap-2">
                <span className="text-[#E8281E] font-bold">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-[12px] text-[#8B919D] leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Founder contact CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#16181D] to-[#101113] border border-[#262A32] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h3 className="text-[18px] font-bold text-[#F5F5F5] tracking-tight font-display">
            Still need assistance?
          </h3>
          <p className="text-[13px] text-[#8B919D] mt-1 leading-normal max-w-lg">
            We are dedicated to your customer service success. Speak to our team of product developers or get in touch with our founder directly.
          </p>
        </div>
        <Button
          onClick={() => alert("Launching support thread composer...")}
          className="bg-[#E8281E] text-white hover:bg-[#C41F16] rounded-xl h-10 text-[13px] font-semibold px-5 flex items-center gap-1.5 shrink-0 transition-colors border-none cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>Contact Support</span>
        </Button>
      </div>
    </div>
  );
}
