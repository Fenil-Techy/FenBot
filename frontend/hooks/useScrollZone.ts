"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { layout } from "@/lib/design-tokens";

type ScrollZone = "dark" | "light";

/**
 * useScrollZone — detects whether the user has scrolled past the hero section.
 *
 * Returns 'dark' when the hero is still in the viewport (navbar should be transparent
 * with light text), and 'light' once the user has scrolled past it (navbar should be
 * white with dark text).
 *
 * The threshold is the bottom of the heroRef element minus the navbar height,
 * so the transition fires just as the hero exits the sticky navbar area.
 *
 * @param heroRef - ref attached to the hero section element
 */
export function useScrollZone(
  heroRef: RefObject<HTMLElement | null>
): ScrollZone {
  const [zone, setZone] = useState<ScrollZone>("dark");

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroBounds = heroRef.current.getBoundingClientRect();
      // Transition fires when hero bottom passes the navbar bottom edge
      setZone(heroBounds.bottom > layout.navbarHeight ? "dark" : "light");
    };

    // Run once on mount to handle pre-scrolled state (e.g. browser back)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  return zone;
}
