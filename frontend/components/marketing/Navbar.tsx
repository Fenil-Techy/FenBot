"use client";

import Link from "next/link";
import { useRef, useState, createContext, useContext, type RefObject } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { zIndex } from "@/lib/design-tokens";

// ─────────────────────────────────────────────────────────────────
// Scroll zone context — lets the HeroSection register its ref
// without prop-drilling through the marketing layout.
// ─────────────────────────────────────────────────────────────────

type HeroRefContextValue = {
  heroRef: RefObject<HTMLElement | null>;
};

export const HeroRefContext = createContext<HeroRefContextValue>({
  heroRef: { current: null },
});

export function useHeroRef() {
  return useContext(HeroRefContext);
}

// ─────────────────────────────────────────────────────────────────
// Nav links
// ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Live demo", href: "#demo" },
] as const;

// ─────────────────────────────────────────────────────────────────
// FenBot wordmark — "Fen" inherits nav ink, "Bot" always brand red
// ─────────────────────────────────────────────────────────────────

function FenBotLogo({ zone }: { zone: "dark" | "light" }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-0.5 font-display text-lg font-700 tracking-tight"
      aria-label="FenBot home"
    >
      <span
        className={cn(
          "transition-colors duration-300",
          zone === "dark" ? "text-[#F5F5F5]" : "text-[#0A0A0A]"
        )}
      >
        Fen
      </span>
      <span className="text-[#E8281E]">Bot</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────

interface NavbarProps {
  zone?: "dark" | "light";
}

/**
 * Navbar — the chameleon navigation bar.
 *
 * When in the "dark" zone (hero section visible): transparent background,
 * light text, no shadow. When in the "light" zone (scrolled past hero):
 * white background, dark text, subtle shadow — all with a smooth 300ms transition.
 *
 * The zone is passed down from the landing page via context (HeroRefContext).
 * On other pages (auth, dashboard) it defaults to "light".
 */
export function Navbar({ zone = "light" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = zone === "dark";

  const navInkClass = isDark
    ? "text-[#F5F5F5] hover:text-white"
    : "text-[#71717A] hover:text-[#0A0A0A]";

  return (
    <header
      role="banner"
      style={{ zIndex: zIndex.navbar }}
      className={cn(
        "fixed top-0 left-0 right-0 h-16 nav-transition",
        // Background
        isDark
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 border-b border-[#E4E4E7] shadow-sm backdrop-blur-sm",
      )}
    >
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <FenBotLogo zone={zone} />

        {/* Desktop nav links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-6"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-body-sm font-medium nav-transition",
                navInkClass
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/auth/login"
            className={cn(
              "text-btn px-3 py-1.5 rounded-lg nav-transition hover:bg-white/10",
              navInkClass
            )}
          >
            Sign in
          </Link>
          <Link
            href="/auth/login"
            className="text-btn px-3 py-1.5 rounded-lg bg-[#E8281E] text-white hover:bg-[#C41F16] nav-transition"
          >
            Get started free →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className={cn(
            "md:hidden p-2 rounded-md nav-transition",
            isDark ? "text-[#F5F5F5]" : "text-[#0A0A0A]"
          )}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent id="mobile-menu" side="right" className="w-72 bg-white">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="flex flex-col gap-6 pt-6">
            <FenBotLogo zone="light" />
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body font-medium text-[#71717A] hover:text-[#0A0A0A] px-3 py-2.5 rounded-lg hover:bg-[#F4F4F5] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-[#E4E4E7]">
              <Link
                href="/auth/login"
                className="w-full text-btn px-4 py-2 rounded-lg border border-[#E4E4E7] text-[#0A0A0A] hover:bg-[#F4F4F5] transition-colors text-center"
              >
                Sign in
              </Link>
              <Link
                href="/auth/login"
                className="w-full text-btn px-4 py-2 rounded-lg bg-[#E8281E] text-white hover:bg-[#C41F16] transition-colors text-center"
              >
                Get started free →
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
