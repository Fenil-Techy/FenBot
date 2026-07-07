"use client";

import { useRef, useState, useEffect } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { LiveDemoSection } from "@/components/marketing/LiveDemoSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { layout } from "@/lib/design-tokens";

/**
 * FenBot Landing Page
 *
 * Architecture notes:
 * - heroRef is forwarded to both HeroSection (attaches to the DOM element)
 *   and Navbar (reads scroll position to determine dark/light zone).
 * - The Navbar is rendered here (not in the layout) so it can receive the zone prop.
 *   The marketing layout.tsx only handles metadata — the Navbar is co-located with
 *   the page that owns the hero section.
 * - All sections are independently scroll-animated via BlurFade(inView).
 */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [zone, setZone] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroBounds = heroRef.current.getBoundingClientRect();
      setZone(heroBounds.bottom > layout.navbarHeight ? "dark" : "light");
    };

    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar sits outside sections — overlays everything via position:fixed */}
      <Navbar zone={zone} />

      {/* Hero — dark zone */}
      <HeroSection sectionRef={heroRef} />

      {/* Light zone sections */}
      <HowItWorksSection />
      <FeaturesSection />
      <LiveDemoSection />
      <PricingSection />
      <CTASection />

      {/* Footer — back to dark */}
      <Footer />
    </>
  );
}
