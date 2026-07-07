"use client";

import { useRef } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import { FileText, Cpu, Globe } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Step data
// ─────────────────────────────────────────────────────────────────

type Step = {
  id: string;
  number: string;
  icon: React.ElementType;
  title: string;
  body: string;
  detail: string | null;
  code?: string;
};

const STEPS: Step[] = [
  {
    id: "step-1",
    number: "01",
    icon: FileText,
    title: "Paste your content",
    body: "FAQ, return policies, product descriptions, pricing. Paste as plain text — no formatting, no uploads, no training queues.",
    detail: "Works with any text you already have.",
  },
  {
    id: "step-2",
    number: "02",
    icon: Cpu,
    title: "FenBot learns it",
    body: "Your content is chunked, embedded, and stored securely. The bot answers only from what you give it — never guesses, never invents.",
    detail: "Grounding prevents hallucinations by design.",
  },
  {
    id: "step-3",
    number: "03",
    icon: Globe,
    title: "Deploy anywhere",
    body: "One script tag on your site. Or connect WhatsApp in 2 minutes. Your customers get answers — you get nothing to maintain.",
    detail: null,
    code: `<script src="https://cdn.fenbot.ai/embed.js"
  data-key="your_api_key">
</script>`,
  },
];


// ─────────────────────────────────────────────────────────────────
// Beam diagram — shows data flowing through FenBot engine
// ─────────────────────────────────────────────────────────────────

function BeamDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const deployRef = useRef<HTMLDivElement>(null);

  const NODE_BASE =
    "size-14 rounded-2xl flex items-center justify-center border text-sm font-semibold shadow-sm";

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-16 py-8"
      aria-hidden="true"
    >
      {/* Node: Your Content */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={contentRef}
          className={cn(NODE_BASE, "bg-[#F4F4F5] border-[#E4E4E7] text-[#0A0A0A]")}
        >
          <FileText className="size-6 text-[#71717A]" />
        </div>
        <span className="text-body-sm text-[#71717A] text-center">
          Your content
        </span>
      </div>

      {/* Node: FenBot Engine */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={engineRef}
          className={cn(
            NODE_BASE,
            "bg-[#0A0A0A] border-[#262626] text-white scale-110"
          )}
        >
          <span className="text-[#E8281E] font-bold text-base">F</span>
        </div>
        <span className="text-body-sm text-[#71717A] text-center">
          FenBot
        </span>
      </div>

      {/* Node: Your Site */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={deployRef}
          className={cn(NODE_BASE, "bg-[#F4F4F5] border-[#E4E4E7] text-[#0A0A0A]")}
        >
          <Globe className="size-6 text-[#71717A]" />
        </div>
        <span className="text-body-sm text-[#71717A] text-center">
          Your site
        </span>
      </div>

      {/* Animated beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={contentRef}
        toRef={engineRef}
        gradientStartColor="#E8281E"
        gradientStopColor="#FF6B5A"
        pathColor="#E4E4E7"
        pathWidth={1.5}
        duration={4}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={engineRef}
        toRef={deployRef}
        gradientStartColor="#E8281E"
        gradientStopColor="#FF6B5A"
        pathColor="#E4E4E7"
        pathWidth={1.5}
        duration={4}
        delay={0.5}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HowItWorksSection
// ─────────────────────────────────────────────────────────────────

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-[#FAFAFA] section-padding"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <p className="text-eyebrow text-[#E8281E] mb-3">How it works</p>
            <h2
              id="how-it-works-heading"
              className="text-display-lg text-[#0A0A0A]"
            >
              Zero setup.{" "}
              <span className="text-[#71717A]">Zero guessing.</span>
            </h2>
          </div>
        </BlurFade>

        {/* Beam diagram */}
        <BlurFade delay={0.2} inView>
          <div className="max-w-lg mx-auto mb-16">
            <BeamDiagram />
          </div>
        </BlurFade>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <BlurFade key={step.id} delay={0.15 * (i + 1)} inView>
                <article className="flex flex-col gap-4">
                  {/* Step number + icon */}
                  <div className="flex items-center gap-3">
                    <span className="text-eyebrow text-[#E8281E]">
                      {step.number}
                    </span>
                    <div className="h-px flex-1 bg-[#E4E4E7]" />
                    <div className="size-9 rounded-xl bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center">
                      <Icon className="size-4 text-[#71717A]" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-headline text-[#0A0A0A]">{step.title}</h3>
                  <p className="text-body text-[#71717A] leading-relaxed">
                    {step.body}
                  </p>

                  {step.detail && (
                    <p className="text-body-sm text-[#A1A1AA]">{step.detail}</p>
                  )}

                  {/* Code snippet for step 3 */}
                  {step.code && (
                    <pre className="text-mono bg-[#0A0A0A] text-[#A3A3A3] rounded-xl p-4 overflow-x-auto border border-[#262626] mt-1">
                      <code>{step.code}</code>
                    </pre>
                  )}
                </article>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
