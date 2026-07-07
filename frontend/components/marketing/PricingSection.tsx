"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// Pricing data
// ─────────────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "yearly";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Try FenBot on your site. No credit card.",
    cta: "Get started free",
    ctaHref: "/auth/login",
    featured: false,
    features: [
      "1 bot",
      "500 messages / month",
      "Website widget",
      "Knowledge base (10 entries)",
      "Community support",
    ],
    unavailable: ["WhatsApp", "Shopify integration", "Analytics"],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 24,
    description: "For active stores that need full automation.",
    cta: "Start Pro free",
    ctaHref: "/auth/login",
    featured: true,
    features: [
      "1 bot",
      "5,000 messages / month",
      "Website widget + WhatsApp",
      "Shopify order lookup",
      "Knowledge base (unlimited)",
      "Basic analytics",
      "Email support",
    ],
    unavailable: [],
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 79,
    yearlyPrice: 65,
    description: "For agencies deploying FenBot for multiple clients.",
    cta: "Talk to us",
    ctaHref: "mailto:hello@fenbot.ai",
    featured: false,
    features: [
      "Up to 10 bots",
      "25,000 messages / month",
      "All Pro features",
      "Per-client branding",
      "Priority support",
      "Custom integrations",
    ],
    unavailable: [],
  },
] as const;

// ─────────────────────────────────────────────────────────────────
// Pricing card
// ─────────────────────────────────────────────────────────────────

interface PricingCardProps {
  plan: (typeof PLANS)[number];
  billing: BillingCycle;
  delay: number;
}

function PricingCard({ plan, billing, delay }: PricingCardProps) {
  const price =
    billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <BlurFade delay={delay} inView>
      <article
        className={cn(
          "relative flex flex-col gap-6 rounded-xl p-6 border h-full",
          plan.featured
            ? "bg-white border-[#E4E4E7] shadow-lg shadow-black/8"
            : "bg-[#FAFAFA] border-[#E4E4E7]"
        )}
      >
        {/* Featured: brand red left border */}
        {plan.featured && (
          <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-[#E8281E] rounded-r-full" />
        )}

        {/* Popular badge */}
        {plan.featured && (
          <div className="inline-flex w-fit">
            <span className="text-eyebrow text-[#E8281E] bg-[#FEF2F2] border border-[#FECACA] rounded-full px-2.5 py-1">
              Most popular
            </span>
          </div>
        )}

        {/* Plan name + price */}
        <div>
          <h3 className="text-headline text-[#0A0A0A] mb-1">{plan.name}</h3>
          <p className="text-body-sm text-[#71717A] mb-4">{plan.description}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-display-md text-[#0A0A0A]">
              {price === 0 ? "Free" : `$${price}`}
            </span>
            {price > 0 && (
              <span className="text-body-sm text-[#A1A1AA]">/ mo</span>
            )}
          </div>
          {billing === "yearly" && price > 0 && (
            <p className="text-body-sm text-emerald-600 mt-1">
              Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12} / year
            </p>
          )}
        </div>

        {/* CTA */}
        <Link
          href={plan.ctaHref}
          id={`pricing-cta-${plan.id}`}
          className={cn(
            "w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-btn transition-colors",
            plan.featured
              ? "bg-[#E8281E] text-white hover:bg-[#C41F16]"
              : "bg-white text-[#0A0A0A] border border-[#E4E4E7] hover:bg-[#F4F4F5]"
          )}
        >
          {plan.cta}
        </Link>

        {/* Feature list */}
        <ul className="flex flex-col gap-2.5" role="list">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-body-sm text-[#0A0A0A]"
            >
              <Check className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
          {plan.unavailable.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-body-sm text-[#A1A1AA] line-through"
            >
              <div className="size-4 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </article>
    </BlurFade>
  );
}

// ─────────────────────────────────────────────────────────────────
// PricingSection
// ─────────────────────────────────────────────────────────────────

export function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-[#F4F4F5] section-padding"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-12">
            <p className="text-eyebrow text-[#E8281E] mb-3">Pricing</p>
            <h2
              id="pricing-heading"
              className="text-display-lg text-[#0A0A0A]"
            >
              Simple, honest pricing.
            </h2>
            <p className="text-body-lg text-[#71717A] mt-4">
              No per-seat fees. No per-message surprises. No enterprise sales call.
            </p>
          </div>
        </BlurFade>

        {/* Billing toggle */}
        <BlurFade delay={0.15} inView>
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-[#E4E4E7]">
              {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  id={`billing-${cycle}`}
                  onClick={() => setBilling(cycle)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-btn transition-all duration-200",
                    billing === cycle
                      ? "bg-[#0A0A0A] text-white"
                      : "text-[#71717A] hover:text-[#0A0A0A]"
                  )}
                >
                  {cycle === "yearly" ? "Yearly (–17%)" : "Monthly"}
                </button>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billing={billing}
              delay={0.1 * i}
            />
          ))}
        </div>

        {/* Footer note */}
        <BlurFade delay={0.4} inView>
          <p className="text-center text-body-sm text-[#A1A1AA] mt-10">
            All plans include a 14-day free trial. No credit card required to
            start.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
