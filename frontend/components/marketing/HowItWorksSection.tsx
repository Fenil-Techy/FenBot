"use client";

import React, { useState, useEffect } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { FileText, Cpu, Eye, Globe, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { ImportMockup } from "@/components/marketing/how-it-works/ImportMockup";
import { CustomizeMockup } from "@/components/marketing/how-it-works/CustomizeMockup";
import { LivePreviewMockup } from "@/components/marketing/how-it-works/LivePreviewMockup";
import { DeployMockup } from "@/components/marketing/how-it-works/DeployMockup";
import { motion, AnimatePresence } from "motion/react";

type WalkthroughStep = {
  id: number;
  number: string;
  title: string;
  body: string;
  icon: React.ElementType;
};

const STEPS: WalkthroughStep[] = [
  {
    id: 0,
    number: "01",
    title: "Train your AI",
    body: "Feed FenBot your website URL, PDF support guides, FAQs, or raw text. It learns your business policies instantly with zero training queues.",
    icon: FileText,
  },
  {
    id: 1,
    number: "02",
    title: "Customize",
    body: "Customize your bot's system prompts, Tone of Voice, instructions, and name. Fine-tune your AI agent to align with your brand guidelines.",
    icon: Cpu,
  },
  {
    id: 2,
    number: "03",
    title: "Live preview",
    body: "Test your agent inside our live preview sandbox. Ask questions and verify that answers are grounded in your data before going public.",
    icon: Eye,
  },
  {
    id: 3,
    number: "04",
    title: "Deploy in your website",
    body: "Embed the live widget on any site with a single line of script tag, or connect direct messaging channels like WhatsApp Cloud API.",
    icon: Globe,
  },
];

export function HowItWorksSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-slideshow step changes
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentStep, autoPlay]);

  const handleStepClick = (id: number) => {
    setCurrentStep(id);
    setAutoPlay(false); // Stop autoplay when a step is manually clicked
  };

  return (
    <section
      id="build-your-agent"
      aria-labelledby="build-your-agent-heading"
      className="bg-canvas pb-28 md:pb-40"
      style={{ paddingTop: 'calc(var(--spacing-section, 5rem) + 180px)' }}
    >
      {/* CSS Keyframe definition for smooth, hardware-accelerated progress animation */}
      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      {/* Single BlurFade for the entire section content */}
      <BlurFade delay={0.1} inView className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 lg:items-stretch items-start">
          
          {/* Left Column: Header + Vertical Step Selector + CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              {/* Left-aligned Header above the steps list */}
              <div className="text-left">
                
                <h2
                  id="build-your-agent-heading"
                  className="text-4xl sm:text-5xl lg:text-[2.75rem] font-extrabold tracking-tight text-ink leading-tight"
                >
                  Build your perfect{" "}
                  <span className="text-brand block sm:inline">AI Agent in 4 steps</span>
                </h2>
              </div>

              {/* Steps list */}
              <div className="space-y-3">
                {STEPS.map((step) => {
                  const isActive = currentStep === step.id;
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 relative overflow-hidden focus:outline-none cursor-pointer flex flex-col ${
                        isActive
                          ? "bg-white border-brand/20 shadow-md shadow-red-900/5"
                          : "bg-white/50 border-slate-200/60 hover:bg-white/80 hover:border-slate-300/60"
                      }`}
                    >
                      {/* Badge + Big Title + Icon on a single row */}
                      <div className="flex items-center gap-4 w-full">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isActive ? "bg-brand text-white" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          Step {step.number}
                        </span>
                        
                        <h3 className={`text-lg font-bold sm:text-xl ${isActive ? "text-slate-800" : "text-slate-500"} flex-1`}>
                          {step.title}
                        </h3>
                        
                        <Icon className={`size-5 ${isActive ? "text-brand" : "text-slate-400"}`} />
                      </div>

                      {/* Body description with smooth height expand animation */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden w-full"
                          >
                            <p className="text-sm text-slate-500 leading-relaxed pl-2 pt-2.5 pb-1">
                              {step.body}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Progress bar on active tab */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                          <div
                            key={currentStep}
                            className={`h-full bg-brand ${autoPlay ? "animate-progress-fill" : "w-full"}`}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Left Column Call-To-Action (aligns height with the right column) */}
            <div className="pt-2">
              <button
                onClick={() => window.location.href = "/auth/login"}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-red-950/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Build your chatbot
              </button>
            </div>
          </div>

          {/* Right Column: Visual Mockup Viewport */}
          <div className="lg:col-span-7 w-full lg:mt-6 flex flex-col">
            {/* Premium red brand glow border frame */}
            <div className="bg-gradient-to-tr from-brand/5 via-brand/10 to-transparent p-6 md:p-8 rounded-[32px] border border-brand/10 shadow-xl relative w-full flex-1 flex flex-col">
              
              {/* High-Fidelity Browser Shell */}
              <div className="w-full h-[470px] lg:h-auto lg:flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-lg flex flex-col overflow-hidden">
                
                {/* Top Browser Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70 shrink-0">
                  {/* Browser window controls */}
                  <div className="flex items-center gap-1.5 w-16">
                    <div className="size-2.5 rounded-full bg-slate-200" />
                    <div className="size-2.5 rounded-full bg-slate-200" />
                    <div className="size-2.5 rounded-full bg-slate-200" />
                  </div>

                  {/* Navigation controls */}
                  <div className="hidden sm:flex items-center gap-1.5 text-slate-350 mr-4">
                    <ChevronLeft className="size-3.5" />
                    <ChevronRight className="size-3.5" />
                    <RotateCw className="size-3" />
                  </div>

                  {/* Dynamic address bar */}
                  <div className="flex-1 max-w-sm h-6 px-3 rounded-md border border-slate-200/80 bg-white flex items-center gap-1.5 text-[10px] text-slate-400 select-none">
                    <span className="text-emerald-500">🔒</span>
                    <span className="text-slate-500 font-medium truncate">
                      {currentStep === 0 && "app.fenbot.ai/train"}
                      {currentStep === 1 && "app.fenbot.ai/customize"}
                      {currentStep === 2 && "app.fenbot.ai/preview"}
                      {currentStep === 3 && "app.fenbot.ai/deploy"}
                    </span>
                  </div>

                  {/* Spacer to balance */}
                  <div className="w-16 hidden sm:block" />
                </div>

                {/* Mockup viewport container (fixed scrollable height) */}
                <div className="flex-1 p-6 overflow-y-auto bg-white min-h-0 scrollbar-none relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, scale: 0.98, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      {currentStep === 0 && <ImportMockup />}
                      {currentStep === 1 && <CustomizeMockup />}
                      {currentStep === 2 && <LivePreviewMockup />}
                      {currentStep === 3 && <DeployMockup />}
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

            </div>
          </div>

        </div>
      </BlurFade>
    </section>
  );
}
