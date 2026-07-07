"use client";

import { Suspense } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Skeleton } from "@/components/ui/skeleton";
import WidgetContent from "@/app/widget/WidgetContent";
import { MessageSquare, Shield, Zap } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Demo sidebar — explains what this bot knows
// ─────────────────────────────────────────────────────────────────

const DEMO_FEATURES = [
  {
    icon: MessageSquare,
    label: "Ask about orders",
    detail: "Try: 'Where is order #4821?'",
  },
  {
    icon: Shield,
    label: "Ask about policies",
    detail: "Try: 'What is your return policy?'",
  },
  {
    icon: Zap,
    label: "Ask about products",
    detail: "Try: 'Do you have this in size M?'",
  },
] as const;

// ─────────────────────────────────────────────────────────────────
// LiveDemoSection
// ─────────────────────────────────────────────────────────────────

export function LiveDemoSection() {
  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="bg-white section-padding"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <p className="text-eyebrow text-[#E8281E] mb-3">Try it live</p>
            <h2
              id="demo-heading"
              className="text-display-lg text-[#0A0A0A]"
            >
              Talk to a real FenBot.
            </h2>
            <p className="text-body-lg text-[#71717A] mt-4 max-w-xl mx-auto">
              This isn't a recorded demo. This is a live FenBot instance trained
              on sample e-commerce data. Ask it anything.
            </p>
          </div>
        </BlurFade>

        {/* Two-column: widget left, explanation right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Chat widget — real, live */}
          <BlurFade delay={0.2} inView>
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden border border-[#E4E4E7] shadow-xl shadow-black/8 bg-white min-h-[520px]">
                <Suspense
                  fallback={
                    <div className="p-6 flex flex-col gap-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-8 w-1/2" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  }
                >
                  <WidgetContent />
                </Suspense>
                <BorderBeam
                  size={160}
                  duration={10}
                  colorFrom="#E8281E"
                  colorTo="#FF8C7A"
                />
              </div>
            </div>
          </BlurFade>

          {/* Explanation */}
          <BlurFade delay={0.35} inView direction="left">
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-headline text-[#0A0A0A] mb-3">
                  Grounded in real data. <br />
                  <span className="text-[#71717A]">
                    Not a chatGPT wrapper.
                  </span>
                </h3>
                <p className="text-body text-[#71717A] leading-relaxed">
                  This demo bot is trained on a sample store's FAQ, product
                  catalog, and return policies. Every answer comes from that
                  real data — not a pre-written script, not a hallucinated
                  response.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {DEMO_FEATURES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex gap-4 p-4 rounded-xl bg-[#F4F4F5] border border-[#E4E4E7]"
                    >
                      <div className="size-9 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon className="size-4 text-[#E8281E]" />
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-[#0A0A0A]">
                          {item.label}
                        </p>
                        <p className="text-body-sm text-[#A1A1AA] mt-0.5">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-body-sm text-[#A1A1AA]">
                Your FenBot would be trained on{" "}
                <span className="text-[#71717A] font-medium">your</span> data —
                your products, your policies, your store.
              </p>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
