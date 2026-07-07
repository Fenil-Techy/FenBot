# FenBot UI/UX Overhaul — Implementation Plan v2 (LOCKED)

## Decisions Confirmed ✅

| Decision | Confirmed |
|----------|-----------|
| Layout | **Option B** — Dark hero section → scrolls into light "mission control" body |
| Typography | **Space Grotesk** (display) + **Inter** (body) + **JetBrains Mono** (code) |
| Navbar | **Chameleon nav** — black/white text on dark hero, switches to dark ink on light sections on scroll |
| Execution | **One phase at a time**, reviewed between phases |
| Brand mark | `Fen` black · `Bot` red — wordmark only for now |
| Get Started CTA | Links to existing Supabase auth (`/auth/login`) |

---

## Tool Arsenal (What We'll Use)

### shadcn/ui (MCP: `shadcn` server)
- Project has **no `components.json`** yet — we'll `npx shadcn@latest init` first
- Used for: Button, Card, Badge, Input, Separator, Skeleton, Sheet (mobile nav drawer), NavigationMenu, Accordion (mobile pricing), Dialog (demo modal)
- Workflow: always `npx shadcn@latest search` before writing custom UI

### MagicUI (`magicuidesign-mcp` server)
- 247 components available. Key ones identified for FenBot:
  - **`blur-fade`** — section entrance animations (content fades in on scroll)
  - **`border-beam`** — animated border on the live demo chat widget card
  - **`animated-shiny-text`** — eyebrow label in hero section
  - **`hyper-text`** — hero headline letter scramble on load
  - **`animated-beam`** — How It Works section, showing data flow from user → FenBot → your site
  - **`animated-list`** — Feature notifications/events showcase
  - **`hero-video-dialog`** — "Watch it work" secondary CTA (opens a demo video)

### Neon MCP (`mcp-server-neon`)
- Not relevant for Phase 1/2 (UI only, no DB changes)

### Frontend Design Skill (`frontend-design/SKILL.md`)
- Enforces: spend boldness in ONE place, critique before shipping, no AI-default patterns
- Our signature element: **the chameleon navbar** + **the dark/light page split at the fold**

---

## The Visual Brief (Locked)

### The Concept: "Launch Sequence"
The page tells a story in two acts:
1. **Above the fold (dark):** You're at mission control, pre-launch. Black canvas, white text, the red launch button.
2. **Below the fold (light):** The rocket is up. Clean daylight, precision documentation. White canvas, structured, clinical.

The navbar follows you between both worlds — white text in the dark zone, dark ink in the light zone. This is the signature UI detail.

### Palette (Locked)
```
— DARK ZONE (hero) —
hero-canvas:     #0A0A0A  (near-black, slightly warm — avoids pure #000)
hero-surface:    #141414  (card lift on dark)
hero-border:     #262626  (hairline on dark)
hero-ink:        #F5F5F5  (headlines on dark)
hero-ink-muted:  #A3A3A3  (subtext on dark)

— LIGHT ZONE (rest of page) —
canvas:          #FAFAFA  (off-white, warm — not clinical white)
surface:         #FFFFFF  (card surface)
surface-raised:  #F4F4F5  (slightly elevated panels)
border:          #E4E4E7  (default borders)
border-strong:   #D1D1D6  (emphasized borders)
ink:             #0A0A0A  (same dark as hero canvas — unified)
ink-muted:       #71717A  (secondary text)
ink-subtle:      #A1A1AA  (tertiary / placeholders)

— BRAND (appears in BOTH zones) —
brand:           #E8281E  (mission-critical red)
brand-hover:     #C41F16  (pressed/hover)
brand-subtle:    #FEF2F2  (tint background)
brand-muted:     #FECACA  (soft red border/badge)
```

### Typography Scale
```
Display XL:  64px / Space Grotesk 700 / -2.5px  → Hero headline
Display LG:  48px / Space Grotesk 600 / -1.8px  → Section headlines
Display MD:  36px / Space Grotesk 600 / -1.0px  → Sub-section
Headline:    24px / Space Grotesk 600 / -0.5px  → Card titles, pricing tiers
Body LG:     18px / Inter 400      / -0.1px  → Lead paragraphs
Body:        16px / Inter 400      /  0px    → Default body
Body SM:     14px / Inter 400      /  0px    → Captions, meta
Button:      14px / Inter 500      /  0px    → All button labels
Eyebrow:     11px / Inter 600      / +1.2px  → Section labels, UPPERCASE
Mono:        13px / JetBrains Mono 400 / 0px → Embed code, API keys
```

---

## Project Folder Structure After Phase 1+2

```
e:\FenBot\frontend\
├── app/
│   ├── (marketing)/           ← NEW route group
│   │   ├── layout.tsx         ← Navbar + Footer, no auth
│   │   └── page.tsx           ← Landing page (8 sections)
│   ├── auth/                  ← Existing (untouched)
│   ├── dashboard/             ← Existing (Phase 3 later)
│   └── widget/                ← Existing (untouched)
├── components/
│   ├── ui/                    ← shadcn primitives (Button, Card, Badge…)
│   ├── marketing/             ← Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── LiveDemoSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── CTASection.tsx
│   │   └── Footer.tsx
│   └── magicui/               ← MagicUI components (added via CLI)
├── lib/
│   ├── supabase/              ← Existing
│   └── design-tokens.ts       ← NEW: TS-safe token constants
└── app/globals.css            ← Full @theme block (Tailwind v4)
```

---

## Phase 1 — Design System Foundation

**Goal:** Zero visual output, pure infrastructure. Every future component leans on this.

### Step 1.1 — Init shadcn
```bash
npx shadcn@latest init --defaults
```
- This creates `components.json`, sets up `components/ui/`, configures aliases
- We'll then apply our custom theme on top

### Step 1.2 — `globals.css` — Full @theme Block
Tailwind v4 `@theme` replaces `tailwind.config.js`. All tokens as CSS variables.

Key tokens:
- All color tokens from palette above
- Font families: `--font-space-grotesk`, `--font-inter`, `--font-mono`
- Spacing: 4px base grid (xs/sm/md/lg/xl/xxl/section)
- Radius: sm/md/lg/xl/pill

### Step 1.3 — `layout.tsx` — Add Space Grotesk + JetBrains Mono
Using `next/font/google`:
```ts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
```

### Step 1.4 — shadcn components to add
```bash
npx shadcn@latest add button card badge input separator skeleton sheet navigation-menu accordion dialog
```

### Step 1.5 — `lib/design-tokens.ts`
TypeScript constants for all colors, spacing, radius — so component code never has magic strings.

---

## Phase 2 — Landing Page (8 Sections)

> ✅ Phase 1 must be complete and reviewed before starting here.

### Section 1 — Navbar (`Navbar.tsx`)

**Behavior:**
- Default state (hero zone): transparent bg, white/light text
- Scrolled state (entering light zone): white bg + `shadow-sm` + dark ink text
- Transition: CSS transition on `background-color` + `color`, triggered by `useEffect` scroll listener
- Mobile: hamburger → `Sheet` (shadcn slide-in drawer)

**Content:**
```
[FenBot logo]     Features  Pricing  How it Works     [Sign In]  [→ Get Started]
```

**Logo:** `Fen` in current text color · `Bot` always in `brand` red — acts as constant brand anchor across both zones.

---

### Section 2 — Hero (`HeroSection.tsx`)
**Zone:** Dark (`hero-canvas` background)

**MagicUI:**
- `animated-shiny-text` on the eyebrow label → subtle shimmer on "CUSTOMER SUPPORT ON AUTOPILOT"
- `blur-fade` on headline + subhead — staggered entrance (delay 0.1s, 0.3s, 0.5s)
- Possibly `hyper-text` on one word in headline (e.g. "Grounded" scrambles to reveal)

**Content:**
```
[eyebrow: shiny] CUSTOMER SUPPORT, ON AUTOPILOT

[display-xl]  Your AI support agent.
              Grounded in your data.

[body-lg muted]  FenBot answers real questions from real business data —
                 orders, products, policies. No hallucinations.
                 No support team needed.

[→ Launch FenBot Free]   [▶ Watch it work]
```

**Visual:** Right side — a floating "phone in dark frame" showing the chat widget mock. The phone has a subtle `border-beam` (MagicUI) running along its border — the one theatrical moment.

**Trust strip** (below hero CTAs, before the fold break):
```
✓ Works on any website   ✓ WhatsApp ready   ✓ 5-minute setup   ✓ No hallucinations
```

**Fold break:** A thin, sharp horizontal line where dark meets light — not a gradient, not a wave. A crisp cut. Like a mission briefing document page break.

---

### Section 3 — How It Works (`HowItWorksSection.tsx`)
**Zone:** Light

**MagicUI:**
- `animated-beam` connecting the 3 steps visually — a beam of light travels: `Your Content` → `FenBot Engine` → `Your Website/WhatsApp`
- `blur-fade` on each step card (staggered on scroll)

**Content:**
```
[eyebrow] HOW IT WORKS

[display-lg]  Zero setup. Zero guessing.

[3-column grid]
Step 1: Paste your content
        FAQ, policies, product descriptions — paste as text, no formatting needed.

Step 2: FenBot learns it
        Chunked, embedded, grounded. Your bot answers only from what you give it.

Step 3: Deploy anywhere
        Drop one script tag on your site. Or connect WhatsApp in 2 minutes.
        [code block in mono: <script src="..." data-key="..."></script>]
```

---

### Section 4 — Features (`FeaturesSection.tsx`)
**Zone:** Light, with `surface-raised` card background

**MagicUI:**
- `animated-list` for the "Real Order Lookup" card — shows animated incoming order queries
- `blur-fade` on the grid cards (scroll-triggered, staggered)

**6-card grid (3×2 desktop):**
| Icon | Title | Body |
|------|-------|------|
| 🛒 | Real Order Lookup | Live Shopify queries. Your customer types an order number, FenBot fetches the real status. |
| 🧠 | Zero Hallucinations | Bot answers only from your content, or says it doesn't know. No invented policies. |
| 📱 | WhatsApp Channel | Same bot. Same knowledge. Works via WhatsApp Cloud API with one config. |
| ⚡ | Streaming Responses | Token-by-token output. Feels instant, not like waiting on a spinner. |
| 📚 | Knowledge Base | Paste your FAQ, policies, product info. Done. No uploads, no training queues. |
| 🔑 | Embed in 60 Seconds | One `<script>` tag. Works on Shopify, Wix, WordPress, custom sites. |

---

### Section 5 — Live Demo (`LiveDemoSection.tsx`)
**Zone:** Light, full-width panel with `surface-raised` bg

**MagicUI:**
- `border-beam` on the chat widget frame (same effect as hero phone, but here it's the real widget)

**Layout:** Two-column
- Left: `ChatWidget` component (the real, live bot — already built)
- Right: Explanation copy + "what this bot knows" description

**Copy:**
```
[eyebrow] TRY IT LIVE

[headline] Talk to a real FenBot.

[body] This isn't a fake demo.
       This is a real FenBot instance trained on sample e-commerce data.
       Ask it about orders, products, return policies.
```

---

### Section 6 — Pricing (`PricingSection.tsx`)
**Zone:** Light

**shadcn:** `Accordion` for mobile feature comparison, `Card` for pricing tiers

**Content:**
```
[eyebrow] PRICING

[headline] Simple, honest pricing.

[Monthly / Yearly toggle — shadcn ToggleGroup]

[3 cards: Free · Pro · Agency]
```
Featured card (Pro) has a `2px brand-red left border` — not a color fill. Surgical.

Below cards: Feature comparison table (3 tiers × 8 features grid). Collapses to Accordion on mobile.

---

### Section 7 — CTA Banner (`CTASection.tsx`)
**Zone:** Light with `surface-raised` panel

**Copy:**
```
[display-lg]  Your customers are waiting for answers.

[body-lg]     Set up FenBot in 5 minutes.
              No team required. No hallucinations. No guessing.

[→ Start Free — It takes 5 minutes]
```

---

### Section 8 — Footer (`Footer.tsx`)
**Zone:** Dark (back to dark — bookends the page)

**4-column grid:**
- Brand + one-line tagline
- Product: Features · Pricing · How it Works · Live Demo
- Company: About · Contact · Blog (placeholder)
- Legal: Privacy · Terms

---

## Chameleon Navbar — Technical Spec

```tsx
// hooks/useScrollZone.ts
// Returns 'dark' | 'light' based on scroll position relative to hero height

export function useScrollZone(heroRef: RefObject<HTMLElement>): 'dark' | 'light' {
  const [zone, setZone] = useState<'dark' | 'light'>('dark');
  
  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setZone(heroBottom > 60 ? 'dark' : 'light'); // 60 = navbar height
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroRef]);
  
  return zone;
}
```

The `Navbar` receives `zone` and applies CSS classes:
- `zone === 'dark'`: `bg-transparent text-hero-ink`
- `zone === 'light'`: `bg-surface shadow-sm text-ink`
- Transition: `transition-all duration-300 ease-in-out`

---

## MagicUI Integration — Install Commands

```bash
# After shadcn init:
npx shadcn@latest add @magicui/blur-fade
npx shadcn@latest add @magicui/border-beam
npx shadcn@latest add @magicui/animated-shiny-text
npx shadcn@latest add @magicui/animated-beam
npx shadcn@latest add @magicui/animated-list
npx shadcn@latest add @magicui/hero-video-dialog
npx shadcn@latest add @magicui/hyper-text
```

---

## Rules We're Enforcing (from component_rules.md + agent_rules.md)

- ✅ Design tokens only — zero ad-hoc colors (`bg-[#1E3A5F]` style is banned)
- ✅ No `any` in TypeScript
- ✅ No component > 300 lines — split into sub-components
- ✅ No `fetch()` directly in components — services layer
- ✅ No fake testimonials, logos, or fabricated stats
- ✅ No inline styles
- ✅ Semantic HTML throughout (single `<h1>`, proper `<nav>`, `<section>`, `<footer>`)
- ✅ No hardcoded API URLs — use `NEXT_PUBLIC_*` env vars

---

## What We Are NOT Doing in This Phase

- No backend changes
- No new features
- No auth flow changes  
- No widget logic changes
- No database changes (Neon MCP not needed until Phase 3+)

---

## Execution Order (Phase 1 starts next)

```
Phase 1: Design System
  └─ Step 1.1: shadcn init
  └─ Step 1.2: globals.css @theme tokens
  └─ Step 1.3: layout.tsx fonts (Space Grotesk + JetBrains Mono)
  └─ Step 1.4: shadcn components install
  └─ Step 1.5: lib/design-tokens.ts
  └─ Step 1.6: Install MagicUI components
  
  → Review & approve

Phase 2: Landing Page
  └─ Step 2.1: (marketing) route group + layout
  └─ Step 2.2: Navbar + useScrollZone hook
  └─ Step 2.3: Hero section
  └─ Step 2.4: How It Works
  └─ Step 2.5: Features grid
  └─ Step 2.6: Live Demo section
  └─ Step 2.7: Pricing section
  └─ Step 2.8: CTA Banner
  └─ Step 2.9: Footer
  └─ Step 2.10: Wire (marketing)/page.tsx together

  → Review & approve

Phase 3: Dashboard Redesign (later sprint)
```
