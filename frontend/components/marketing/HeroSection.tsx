"use client";

import { useRef, type RefObject } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// Trust strip items — below CTA buttons, above fold break
// ─────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  "Works on any website",
  "WhatsApp ready",
  "5-minute setup",
  "Zero hallucinations",
] as const;

// ─────────────────────────────────────────────────────────────────
// Mock chat preview — shows FenBot in action without a live widget
// This is a styled component, not a screenshot — it's real pixels
// ─────────────────────────────────────────────────────────────────

function ChatPreviewMock() {
  const messages = [
    { role: "user", text: "Where is my order #4821?" },
    {
      role: "bot",
      text: "Order #4821 shipped yesterday via FedEx. Estimated delivery: tomorrow by 8pm. Tracking: FX94821903.",
    },
    { role: "user", text: "Can I return it after 30 days?" },
    {
      role: "bot",
      text: "Yes! Our policy allows returns within 60 days of purchase, no questions asked.",
    },
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div
        className={cn(
          "relative rounded-[2rem] overflow-hidden",
          "bg-[#141414] border border-[#262626]",
          "shadow-2xl shadow-black/60"
        )}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[#A3A3A3] text-xs font-mono">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#262626]" />
            <div className="w-8 h-3 rounded-sm bg-[#262626]" />
          </div>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#262626]">
          <div className="size-8 rounded-full bg-[#E8281E] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <div>
            <p className="text-[#F5F5F5] text-sm font-semibold leading-tight">
              FenBot
            </p>
            <p className="text-[#A3A3A3] text-xs">Always online</p>
          </div>
          <div className="ml-auto size-2 rounded-full bg-emerald-400" />
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-3 p-4 min-h-[280px]">
          {messages.map((msg, i) => (
            <BlurFade key={i} delay={0.15 * i} inView>
              <div
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#E8281E] text-white rounded-br-sm"
                      : "bg-[#262626] text-[#F5F5F5] rounded-bl-sm"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            </BlurFade>
          ))}

          {/* Typing indicator */}
          <BlurFade delay={0.7} inView>
            <div className="flex justify-start">
              <div className="bg-[#262626] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((dot) => (
                    <div
                      key={dot}
                      className="size-1.5 rounded-full bg-[#A3A3A3] animate-bounce"
                      style={{ animationDelay: `${dot * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 px-4 pb-6 pt-2 border-t border-[#262626]">
          <div className="flex-1 bg-[#0A0A0A] rounded-full px-4 py-2.5 text-xs text-[#4A4A4A]">
            Ask anything...
          </div>
          <div className="size-8 rounded-full bg-[#E8281E] flex items-center justify-center flex-shrink-0">
            <ArrowRight className="size-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Border beam on the phone */}
      <BorderBeam
        size={120}
        duration={8}
        colorFrom="#E8281E"
        colorTo="#FF6B5A"
        className="rounded-[2rem]"
      />

      {/* Floating label badges */}
      <BlurFade delay={0.5} inView direction="left">
        <div className="absolute -left-8 top-1/3 bg-white rounded-xl px-3 py-2 shadow-lg shadow-black/20 border border-[#E4E4E7]">
          <p className="text-[#0A0A0A] text-xs font-semibold">✓ Real data</p>
          <p className="text-[#71717A] text-[10px]">Not hallucinated</p>
        </div>
      </BlurFade>

      <BlurFade delay={0.65} inView direction="right">
        <div className="absolute -right-6 bottom-1/3 bg-white rounded-xl px-3 py-2 shadow-lg shadow-black/20 border border-[#E4E4E7]">
          <p className="text-[#0A0A0A] text-xs font-semibold">⚡ Instant</p>
          <p className="text-[#71717A] text-[10px]">Streaming replies</p>
        </div>
      </BlurFade>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  /** Ref forwarded from landing page — used by useScrollZone in Navbar */
  sectionRef?: RefObject<HTMLElement | null>;
}

export function HeroSection({ sectionRef }: HeroSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero — FenBot AI customer support"
      className="hero-zone relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle dot-grid background texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #262626 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />

      {/* Diagonal brand accent line — hidden on mobile to avoid clipping */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-px h-full opacity-20 hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #E8281E 40%, transparent 100%)",
          transform: "translateX(-320px)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — headline + CTAs */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <BlurFade delay={0.1} inView>
              <div className="inline-flex">
                <AnimatedShinyText className="text-eyebrow text-[#A3A3A3] border border-[#262626] rounded-full px-3 py-1">
                  Customer support, on autopilot
                </AnimatedShinyText>
              </div>
            </BlurFade>

            {/* Headline */}
            <BlurFade delay={0.25} inView>
              <h1 className="text-display-xl text-[#F5F5F5]">
                Your AI agent.{" "}
                <span className="text-[#E8281E]">Grounded</span> in
                <br className="hidden sm:block" /> your data.
              </h1>
            </BlurFade>

            {/* Subhead */}
            <BlurFade delay={0.4} inView>
              <p className="text-body-lg text-[#A3A3A3] max-w-lg">
                FenBot answers real questions from real business data — orders,
                products, policies. No hallucinations. No support team needed.
              </p>
            </BlurFade>

            {/* CTAs */}
            <BlurFade delay={0.55} inView>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/login"
                  id="hero-cta-primary"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-[#E8281E] text-white hover:bg-[#C41F16] transition-colors text-base font-semibold"
                >
                  Launch FenBot free
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#demo"
                  id="hero-cta-secondary"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#141414] border border-[#262626] transition-colors text-base"
                >
                  <Play className="size-4" />
                  Watch it work
                </Link>
              </div>
            </BlurFade>

            {/* Trust strip */}
            <BlurFade delay={0.7} inView>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {TRUST_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-body-sm text-[#71717A]"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </BlurFade>
          </div>

          {/* Right — chat preview */}
          <BlurFade delay={0.35} inView direction="left">
            <ChatPreviewMock />
          </BlurFade>
        </div>
      </div>

      {/* Fold break — sharp horizontal line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1A1A]"
      />
    </section>
  );
}
