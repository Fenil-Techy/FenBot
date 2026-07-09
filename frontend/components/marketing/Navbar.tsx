"use client";

import Link from "next/link";
import { useRef, createContext, useContext, type RefObject } from "react";
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
// Scroll zone context — shared so HeroSection can register its ref
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
// Desktop nav links (anchor-scrolled sections)
// ─────────────────────────────────────────────────────────────────

// Links map 1:1 to the real section IDs on the page
const NAV_LINKS = [
  { href: "#build-your-agent", label: "How it works" },
  { href: "#features",        label: "Features" },
  { href: "#for-whom",        label: "Use cases" },
  { href: "#pricing",         label: "Pricing" },
];

// Mobile hamburger nav shape (grouped)
const MOBILE_NAV = [
  {
    name: "Menu",
    items: NAV_LINKS,
  },
];

// ─────────────────────────────────────────────────────────────────
// FenBot wordmark — "Fen" adapts to zone, "Bot" is always brand red
// ─────────────────────────────────────────────────────────────────

function FenBotLogo({ zone }: { zone: "dark" | "light" }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 font-display tracking-tight"
      aria-label="FenBot home"
    >
      <img
        src="/logo/apple-touch-icon.png"
        alt=""
        className={cn(
          "h-8 w-auto rotate-[20deg] transition-all duration-300",
          zone === "dark" ? "" : "invert"
        )}
      />
      <span className="text-xl font-bold leading-none">
        <span
          className={cn(
            "transition-colors duration-300",
            zone === "dark" ? "text-[#F5F5F5]" : "text-[#0A0A0A]"
          )}
        >
          Fen
        </span>
        <span className="text-red-500">Bot</span>
      </span>
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
 * Navbar — adaptive chameleon navigation bar.
 *
 * "dark" zone: transparent, light text (hero section is visible).
 * "light" zone: frosted white, dark text (scrolled past hero).
 * 300ms smooth transition between both states.
 */
export function Navbar({ zone = "light" }: NavbarProps) {
  const isDark = zone === "dark";

  const navInkClass = isDark
    ? "text-white/80 hover:text-white"
    : "text-slate-600 hover:text-slate-900";

  return (
    <header
      role="banner"
      style={{ zIndex: zIndex.navbar }}
      className={cn(
        "fixed top-0 left-0 right-0 h-18 nav-transition",
        isDark
          ? "bg-black/30 border-b border-white/10 backdrop-blur-md"
          : "bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur-md"
      )}
    >
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">

        {/* Left: Logo + Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <MobileNav nav={MOBILE_NAV} className={navInkClass} />
          <FenBotLogo zone={zone} />
        </div>

        {/* Center: Desktop Navigation */}
        <NavigationMenu className="max-md:hidden flex-1 justify-center">
          <NavigationMenuList className="gap-1">
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                    isDark
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/auth/login"
            className={cn(
              "hidden sm:inline-block text-sm font-semibold px-4 py-2 rounded-lg nav-transition border",
              isDark
                ? "text-white/80 border-slate-200 hover:text-white hover:bg-white/10"
                : "text-slate-600 border-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            )}
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#E8281E] text-white hover:bg-[#C41F16] nav-transition shadow-sm shadow-red-900/20 hover:shadow-md hover:shadow-red-900/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start for free
          </Link>
        </div>

      </div>
    </header>
  );
}
