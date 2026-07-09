"use client";

import React, { type RefObject } from "react";
import { Play, Check } from "lucide-react";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { STARS_SHADOW_1, STARS_SHADOW_2, STARS_SHADOW_3 } from "@/components/marketing/hero/starfield";
import { DashboardMockup } from "@/components/marketing/hero/DashboardMockup";

// ─────────────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  sectionRef?: RefObject<HTMLElement | null>;
}

export function HeroSection({ sectionRef }: HeroSectionProps) {
  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero — FenBot AI customer support"
      className="relative min-h-screen flex flex-col overflow-visible bg-hero-canvas text-hero-ink"
    >
      {/* ── Animated starfield background ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <style>{`
          @keyframes animStar {
            from { transform: translateY(0px); }
            to   { transform: translateY(-2000px); }
          }
          #stars  { width:1px; height:1px; background:transparent; box-shadow:${STARS_SHADOW_1}; animation:animStar 50s  linear infinite; }
          #stars:after  { content:" "; position:absolute; top:2000px; width:1px; height:1px; background:transparent; box-shadow:${STARS_SHADOW_1}; }
          #stars2 { width:2px; height:2px; background:transparent; box-shadow:${STARS_SHADOW_2}; animation:animStar 100s linear infinite; }
          #stars2:after { content:" "; position:absolute; top:2000px; width:2px; height:2px; background:transparent; box-shadow:${STARS_SHADOW_2}; }
          #stars3 { width:3px; height:3px; background:transparent; box-shadow:${STARS_SHADOW_3}; animation:animStar 150s linear infinite; }
          #stars3:after { content:" "; position:absolute; top:2000px; width:3px; height:3px; background:transparent; box-shadow:${STARS_SHADOW_3}; }
        `}</style>
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />

        {/* Radial glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand/6 blur-[120px]" />
        <div className="absolute top-[30%] left-[15%] w-[300px] h-[300px] rounded-full bg-indigo-900/20 blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-brand/5 blur-[80px]" />
      </div>

      {/* ── Main content ── */}
      <div className="relative flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Eyebrow badge */}
        <div className="mb-8 text-center">
          <AnimatedShinyText className="inline-flex text-gray-400 items-center gap-xs text-eyebrow border border-white/10 rounded-pill px-4 py-1.5 bg-white/[0.03]">
            <span className="size-1.5 rounded-pill bg-brand animate-pulse" />
            Build your AI agent, available 24/7
          </AnimatedShinyText>
        </div>

        {/* Headline */}
        <div className="mb-6 w-full max-w-5xl mx-auto text-center">
          <h1 className="font-display font-bold tracking-tight text-white text-4xl sm:text-6xl lg:text-[4.5rem] leading-[1.06] tracking-[-0.04em]">
            AI chatbot that turn every visitor into a{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #E8281E 0%, #ff6b6b 50%, #E8281E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              happy customer
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <div className="mb-10 w-full max-w-2xl mx-auto text-center">
          <p className="text-hero-ink-muted text-lg leading-relaxed font-normal">
            FenBot answers questions instantly, captures qualified leads, and
            handles customer support 24/7.
          </p>
        </div>

        {/* CTA — email form */}
        <div className=" mx-auto mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
              window.location.href = `/auth/signup?email=${encodeURIComponent(emailInput?.value || "")}`;
            }}
            className="flex flex-row gap-xs w-full mb-sm"
          >
            <input
              type="email"
              placeholder="Enter your business email"
              className="h-11  px-4 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand/70 transition-colors flex-1 min-w-0"
              required
            />
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 whitespace-nowrap"
            >
              Sign up free
            </button>
          </form>

          <div className="flex items-center justify-center mt-8 gap-x-6 gap-y-3 flex-wrap text-xs sm:text-sm font-medium text-hero-ink-muted">
            <span className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white">
              <Check className="size-3.5 text-white" strokeWidth={3} />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white">
              <Check className="size-3.5 text-white" strokeWidth={3} />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white">
              <Check className="size-3.5 text-white" strokeWidth={3} />
              Custom-trained on your business data
            </span>
          </div>
        </div>

        {/* Dashboard preview card */}
        <div
          className="w-full max-w-5xl mx-auto relative mt-10 z-20 px-4 sm:px-6 lg:px-8"
          style={{ marginBottom: "-220px" }}
        >
          <div className="relative group hover:scale-[1.01] transition-transform duration-500">
            {/* Red frame */}
            <div className="absolute -top-3 -left-3 -right-3 md:-top-4 md:-left-4 md:-right-4 bottom-[40%] rounded-t-3xl md:rounded-t-[32px] bg-brand z-0" />

            <div className="relative rounded-2xl overflow-hidden aspect-video bg-canvas border border-slate-200/50 shadow-2xl">
              <div className="absolute inset-0 translate-y-16 scale-[1.02]">
                <DashboardMockup />
              </div>

              <div
                className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none z-20"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(250,250,250,0) 0%, rgba(250,250,250,.35) 45%, rgba(250,250,250,.85) 75%, #FAFAFA 100%)",
                }}
              />

              {/* Play */}
              <Dialog>
                <DialogTrigger
                  className="absolute inset-0 flex items-center justify-center z-30"
                >
                  <div className="size-16 rounded-pill bg-black/85 hover:bg-brand flex items-center justify-center transition-all duration-300 shadow-xl">
                    <Play className="size-6 fill-current text-white ml-0.5" />
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-3xl bg-[#13151f] border-white/10 text-white rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>FenBot In Action</DialogTitle>
                  </DialogHeader>

                  <div className="aspect-video rounded-xl bg-[#0f1117] flex items-center justify-center">
                    Demo video coming soon
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
