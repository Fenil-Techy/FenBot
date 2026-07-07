"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

/**
 * CTASection — the closing call to action before the footer.
 * Light zone panel. One clear message, one clear action.
 */
export function CTASection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="bg-white section-padding"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1} inView>
          <div className="relative rounded-2xl bg-[#0A0A0A] px-8 py-16 md:px-16 overflow-hidden text-center">
            {/* Background dot grid */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #262626 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                opacity: 0.6,
              }}
            />

            {/* Brand accent — subtle rocket arc */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-10"
              style={{
                background:
                  "radial-gradient(ellipse at center bottom, #E8281E, transparent 70%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <p className="text-eyebrow text-[#E8281E]">Ready to launch?</p>
              <h2
                id="cta-heading"
                className="text-display-lg text-[#F5F5F5]"
              >
                Your customers are waiting for answers.
              </h2>
              <p className="text-body-lg text-[#A3A3A3]">
                Set up FenBot in 5 minutes. No team required. No hallucinations.
                No guessing.
              </p>
              <Link
                href="/auth/login"
                id="final-cta"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-[#E8281E] text-white hover:bg-[#C41F16] transition-colors text-base font-semibold mt-2"
              >
                Start free — 5 minutes
                <ArrowRight className="size-4" />
              </Link>
              <p className="text-body-sm text-[#4A4A4A]">
                No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
