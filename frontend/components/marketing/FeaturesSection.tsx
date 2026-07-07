"use client";

import { ShoppingCart, Brain, MessageCircle, Zap, BookOpen, Code2 } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// Feature data
// ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: "real-order-lookup",
    icon: ShoppingCart,
    title: "Real order lookup",
    body: "Live Shopify integration. Customer types an order number — FenBot fetches the real status, not a canned response.",
    accent: true,
  },
  {
    id: "zero-hallucinations",
    icon: Brain,
    title: "Zero hallucinations",
    body: "Bot answers only from the content you gave it. If it doesn't know, it says so. No invented policies, no fabricated data.",
    accent: false,
  },
  {
    id: "whatsapp-channel",
    icon: MessageCircle,
    title: "WhatsApp channel",
    body: "Same bot, same knowledge base. Connects to WhatsApp Cloud API — no third-party bridge, no per-message fees.",
    accent: false,
  },
  {
    id: "streaming-responses",
    icon: Zap,
    title: "Streaming responses",
    body: "Token-by-token output via the Vercel AI SDK. Feels instant, not like waiting on a spinner for 3 seconds.",
    accent: false,
  },
  {
    id: "knowledge-base",
    icon: BookOpen,
    title: "Knowledge base",
    body: "Paste your FAQ, policies, product info. Done. No file uploads, no training queues, no ML expertise needed.",
    accent: false,
  },
  {
    id: "embed-60-seconds",
    icon: Code2,
    title: "Embed in 60 seconds",
    body: "One <script> tag. Works on Shopify, Wix, WordPress, Webflow, or any custom site — no developer required.",
    accent: false,
  },
] as const;

// ─────────────────────────────────────────────────────────────────
// Feature card
// ─────────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  body: string;
  accent?: boolean;
  delay: number;
}

function FeatureCard({ icon: Icon, title, body, accent = false, delay }: FeatureCardProps) {
  return (
    <BlurFade delay={delay} inView>
      <article
        className={cn(
          "group relative flex flex-col gap-4 rounded-xl p-6 border transition-shadow duration-200",
          "hover:shadow-md hover:shadow-black/5",
          accent
            ? "bg-[#0A0A0A] border-[#262626]"
            : "bg-white border-[#E4E4E7]"
        )}
      >
        {/* Accent card: brand red left border strip */}
        {accent && (
          <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-[#E8281E] rounded-r-full" />
        )}

        {/* Icon */}
        <div
          className={cn(
            "size-10 rounded-lg flex items-center justify-center flex-shrink-0",
            accent
              ? "bg-[#E8281E]/10 text-[#E8281E]"
              : "bg-[#F4F4F5] text-[#71717A]"
          )}
        >
          <Icon className="size-5" />
        </div>

        {/* Text */}
        <h3
          className={cn(
            "text-headline",
            accent ? "text-[#F5F5F5]" : "text-[#0A0A0A]"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-body",
            accent ? "text-[#A3A3A3]" : "text-[#71717A]"
          )}
        >
          {body}
        </p>
      </article>
    </BlurFade>
  );
}

// ─────────────────────────────────────────────────────────────────
// FeaturesSection
// ─────────────────────────────────────────────────────────────────

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="bg-[#F4F4F5] section-padding"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <p className="text-eyebrow text-[#E8281E] mb-3">Features</p>
            <h2
              id="features-heading"
              className="text-display-lg text-[#0A0A0A]"
            >
              Built for automation,{" "}
              <span className="text-[#71717A]">not for teams.</span>
            </h2>
            <p className="text-body-lg text-[#71717A] mt-4 max-w-xl mx-auto">
              Every feature ships toward one goal: your customers get accurate
              answers, automatically. No human handoff required.
            </p>
          </div>
        </BlurFade>

        {/* 3×2 grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              body={feature.body}
              accent={feature.accent}
              delay={0.08 * i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
