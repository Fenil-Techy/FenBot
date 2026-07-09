"use client";

import React from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ChevronRight } from "lucide-react";
import { IntegrationVisual } from "@/components/marketing/features/IntegrationVisual";
import { AutomationVisual } from "@/components/marketing/features/AutomationVisual";
import { InboxVisual } from "@/components/marketing/features/InboxVisual";
import { AnalyticsVisual } from "@/components/marketing/features/AnalyticsVisual";

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="bg-canvas py-24 md:py-36 border-t border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-36">
        
        

        {/* ── Row 1: Integration Platform (Visual Left, Copy Right) ── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual wrapper */}
          <div className="lg:col-span-6 w-full order-last lg:order-first">
            <BlurFade delay={0.15} inView>
              <IntegrationVisual />
            </BlurFade>
          </div>

          {/* Copy wrapper */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-8">
            <BlurFade delay={0.2} inView className="space-y-5">
              {/* Channel logos strip */}
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-50/60 border border-rose-100 px-2.5 py-1 rounded text-rose-800">Shopify</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-50/60 border border-rose-100 px-2.5 py-1 rounded text-rose-800">Messenger</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-50/60 border border-rose-100 px-2.5 py-1 rounded text-rose-800">Slack</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-50/60 border border-rose-100 px-2.5 py-1 rounded text-rose-800">SMS</span>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Support customers on multiple channels
              </h3>
              
              <p className="text-base sm:text-lg text-rose-950/80 leading-relaxed font-medium">
                Your customers are everywhere. Now your chatbot is too. One AI agent handles support 
                across your website, Facebook Messenger, Slack, and SMS Cloud API concurrently.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => window.location.href = "/auth/signup"}
                  className="w-full flex items-center justify-center gap-3 sm:w-auto px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-red-950/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Sign up free
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* ── Row 2: AI Automation (Copy Left, Visual Right) ── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy wrapper */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:pr-8">
            <BlurFade delay={0.15} inView className="space-y-5">
              <span className="text-sm font-bold uppercase tracking-wider text-brand">AI Deflection</span>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Deliver on-point answers with AI automation
              </h3>
              
              <p className="text-base sm:text-lg text-rose-950/80 leading-relaxed font-medium">
                Answer customer questions 24/7. Your chatbot learns from your website, help center, and 
                product guides so every response matches your business policies. Zero hallucinations, zero delays.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => window.location.href = "/auth/signup"}
                  className="w-full flex items-center justify-center gap-3 sm:w-auto px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-red-950/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Sign up free
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </BlurFade>
          </div>

          {/* Visual wrapper */}
          <div className="lg:col-span-6 w-full">
            <BlurFade delay={0.2} inView>
              <AutomationVisual />
            </BlurFade>
          </div>
        </div>

        {/* ── Row 3: Collaborative Inbox (Visual Left, Copy Right) ── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual wrapper */}
          <div className="lg:col-span-6 w-full order-last lg:order-first">
            <BlurFade delay={0.15} inView>
              <InboxVisual />
            </BlurFade>
          </div>

          {/* Copy wrapper */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-8">
            <BlurFade delay={0.2} inView className="space-y-5">
              <span className="text-sm font-bold uppercase tracking-wider text-brand">Unified Inbox</span>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Never lose track of a conversation
              </h3>
              
              <p className="text-base sm:text-lg text-rose-950/80 leading-relaxed font-medium">
                A unified support inbox for all customer channels. Switch seamlessly between AI automation 
                and human agent mode when a customer asks to speak with a member of your team.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => window.location.href = "/auth/signup"}
                  className="w-full flex items-center justify-center gap-3 sm:w-auto px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-red-950/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Sign up free
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* ── Row 4: Analytics (Copy Left, Visual Right) ── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy wrapper */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:pr-8">
            <BlurFade delay={0.15} inView className="space-y-5">
              <span className="text-sm font-bold uppercase tracking-wider text-brand">Insights</span>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Measure and optimize deflection performance
              </h3>
              
              <p className="text-base sm:text-lg text-rose-950/80 leading-relaxed font-medium">
                Track resolution rates, response times, and customer satisfaction in real-time. 
                Identify trends in user queries to continuously improve your chatbot's knowledge base.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => window.location.href = "/auth/signup"}
                  className="w-full flex items-center justify-center gap-3 sm:w-auto px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-red-950/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Sign up free
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </BlurFade>
          </div>

          {/* Visual wrapper */}
          <div className="lg:col-span-6 w-full">
            <BlurFade delay={0.2} inView>
              <AnalyticsVisual />
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
