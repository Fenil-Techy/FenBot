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
      <BlurFade delay={0.1} inView className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-12 lg:gap-16">
          
          {/* Left Column: Header + Vertical Step Selector + CTA */}
          <div className="w-full lg:w-[480px] shrink-0 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              {/* Left-aligned Header above the steps list */}
              <div className="text-left">
                
                <h2
                  id="build-your-agent-heading"
                  className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-ink leading-[1.1]"
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
                      className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 relative overflow-hidden focus:outline-none cursor-pointer flex flex-col ${
                        isActive
                          ? "bg-white border-brand/15 shadow-[0_4px_24px_-6px_rgba(220,38,38,0.08)]"
                          : "bg-white/40 border-slate-100 hover:bg-white/70 hover:border-slate-200/80"
                      }`}
                    >
                      {/* Badge + Big Title + Icon on a single row */}
                      <div className="flex items-center gap-4 w-full">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isActive
                              ? "bg-brand text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          Step {step.number}
                        </span>
                        
                        <h3 className={`text-[15px] font-semibold sm:text-base ${isActive ? "text-slate-800" : "text-slate-500"} flex-1`}>
                          {step.title}
                        </h3>
                        
                        <Icon className={`size-4 ${isActive ? "text-brand" : "text-slate-300"}`} />
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
                            <p className="text-[13px] text-slate-500 leading-relaxed pl-0 pt-3 pb-0.5">
                              {step.body}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Progress bar on active tab */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100">
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
            <div className="pt-3">
              <button
                onClick={() => window.location.href = "/auth/signup"}
                className="w-full flex items-center gap-3 sm:w-auto px-7 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm transition-all duration-200 shadow-[0_4px_20px_-4px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_28px_-4px_rgba(220,38,38,0.45)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Create my chatbot
                <ChevronRight className="size-4 text-white/80"/>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Mockup Viewport */}
          <div className="w-full lg:w-[450px] shrink-0 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {currentStep === 0 ? (
                <motion.div
                  key="import-video-view"
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <ImportMockup />
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full aspect-[448/516] rounded-[32px] overflow-hidden bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)] border border-slate-100 p-6 flex flex-col justify-between"
                >
                  {currentStep === 1 && <CustomizeMockup />}
                  {currentStep === 2 && <LivePreviewMockup />}
                  {currentStep === 3 && <DeployMockup />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </BlurFade>
    </section>
  );
}
