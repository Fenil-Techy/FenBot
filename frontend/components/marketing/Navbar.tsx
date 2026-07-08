"use client";

import Link from "next/link";
import { useRef, useState, createContext, useContext, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { zIndex } from "@/lib/design-tokens";
import { MobileNav } from "@/components/ui/navbar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

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
// Nav links matching prompt style and format
// ─────────────────────────────────────────────────────────────────

const NAVIGATION_LINKS = [
  {
    name: "Menu",
    items: [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#pricing", label: "Pricing" },
      { href: "#demo", label: "Live demo" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// FenBot wordmark — "Fen" inherits nav ink, "Bot" always brand red
// ─────────────────────────────────────────────────────────────────

function FenBotLogo({ zone }: { zone: "dark" | "light" }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 font-display text-lg font-700 tracking-tight"
      aria-label="FenBot home"
    >
      <img
        src="/logo/apple-touch-icon.png"
        alt=""
        className={cn(
          "h-7 w-auto rotate-[20deg] transition-all duration-300",
          zone === "dark" ? "" : "invert"
        )}
      />
      <div className="flex items-center gap-0.5">
        <span
          className={cn(
            "transition-colors duration-300",
            zone === "dark" ? "text-[#F5F5F5]" : "text-[#0A0A0A]"
          )}
        >
          Fen
        </span>
        <span className="text-red-500">Bot</span>
      </div>
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
 */
export function Navbar({ zone = "light" }: NavbarProps) {
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
        isDark
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 border-b border-[#E4E4E7] shadow-sm backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Left: MobileNav (hidden on desktop) + Logo */}
        <div className="flex items-center justify-start gap-2">
          <MobileNav nav={NAVIGATION_LINKS} className={navInkClass} />
          <FenBotLogo zone={zone} />
        </div>

        {/* Center: Desktop Navigation Menu */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList>
            {NAVIGATION_LINKS[0].items.map((link, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  className={cn(
                    "rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-white/10",
                    navInkClass
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: CTAs */}
        <div className="flex flex-1 items-center justify-end gap-2">
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
            className="text-btn px-3.5 py-1.5 rounded-lg bg-[#E8281E] text-white hover:bg-[#C41F16] nav-transition"
          >
            Get started free →
          </Link>
        </div>
      </div>
    </header>
  );
}
