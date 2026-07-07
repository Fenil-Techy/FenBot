/**
 * FenBot Design Tokens — TypeScript constants
 *
 * Single source of truth for design values used in:
 * - className strings where Tailwind utilities aren't enough
 * - JavaScript logic (e.g. scroll threshold calculations)
 * - Animation keyframe values
 *
 * Rule: never reference raw hex/number values in components.
 * Import from here instead.
 */

// ─────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────

export const colors = {
  /** Brand red — the one chromatic accent. Use scarcely. */
  brand: "#E8281E",
  brandHover: "#C41F16",
  brandSubtle: "#FEF2F2",
  brandMuted: "#FECACA",

  /** Dark hero zone */
  heroCanvas: "#0A0A0A",
  heroSurface: "#141414",
  heroBorder: "#262626",
  heroInk: "#F5F5F5",
  heroInkMuted: "#A3A3A3",

  /** Light body zone */
  canvas: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceRaised: "#F4F4F5",
  border: "#E4E4E7",
  borderStrong: "#D1D1D6",
  ink: "#0A0A0A",
  inkMuted: "#71717A",
  inkSubtle: "#A1A1AA",
  inkInverse: "#FFFFFF",
} as const;

export type ColorKey = keyof typeof colors;

// ─────────────────────────────────────────────────────────────────
// Typography
// ─────────────────────────────────────────────────────────────────

export const typography = {
  /** Maps to .text-display-xl utility class */
  displayXl: "text-display-xl",
  /** Maps to .text-display-lg utility class */
  displayLg: "text-display-lg",
  /** Maps to .text-display-md utility class */
  displayMd: "text-display-md",
  /** Maps to .text-headline utility class */
  headline: "text-headline",
  /** Maps to .text-body-lg utility class */
  bodyLg: "text-body-lg",
  /** Maps to .text-body utility class */
  body: "text-body",
  /** Maps to .text-body-sm utility class */
  bodySm: "text-body-sm",
  /** Maps to .text-eyebrow utility class — uppercase, wide tracking */
  eyebrow: "text-eyebrow",
  /** Maps to .text-btn utility class */
  button: "text-btn",
  /** Maps to .text-mono utility class — JetBrains Mono */
  mono: "text-mono",
} as const;

// ─────────────────────────────────────────────────────────────────
// Spacing
// ─────────────────────────────────────────────────────────────────

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 96,
} as const;

// ─────────────────────────────────────────────────────────────────
// Radius
// ─────────────────────────────────────────────────────────────────

export const radius = {
  sm: "rounded-sm",    /* 4px via calc(var(--radius) * 0.6) */
  md: "rounded-md",   /* 6px */
  lg: "rounded-lg",   /* 8px — default */
  xl: "rounded-xl",   /* 12px */
  "2xl": "rounded-2xl", /* 16px */
  "3xl": "rounded-3xl", /* 24px */
  pill: "rounded-full",
} as const;

// ─────────────────────────────────────────────────────────────────
// Layout constants
// ─────────────────────────────────────────────────────────────────

export const layout = {
  /** Max content width — keeps content readable at large viewports */
  maxWidth: "max-w-7xl",
  /** Section horizontal padding */
  sectionPx: "px-4 sm:px-6 lg:px-8",
  /** Navbar height in px — used for scroll offset calculations */
  navbarHeight: 64,
} as const;

// ─────────────────────────────────────────────────────────────────
// Breakpoints (numeric — for useEffect/resize logic)
// ─────────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ─────────────────────────────────────────────────────────────────
// Animation durations (ms)
// ─────────────────────────────────────────────────────────────────

export const duration = {
  fast: 150,
  base: 300,
  slow: 500,
  verySlow: 800,
} as const;

// ─────────────────────────────────────────────────────────────────
// Z-index scale
// ─────────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  navbar: 300,
  modal: 400,
  toast: 500,
} as const;
