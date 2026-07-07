# FenBot — Product Requirements Document

## Vision
FenBot is a multi-tenant AI chatbot SaaS platform that lets any business (e-commerce, agency, local service) deploy a grounded, tool-using support chatbot on their own website and WhatsApp number — without hiring developers or a support team. It is built and sold by a solo freelancer/small agency to other businesses.

## Core Principle: SLC (Simple, Lovable, Complete)
Every feature shipped must hit all three bars before moving to the next:
- **Simple** — minimal surface area. No feature the target user (a small business owner, not a developer) doesn't immediately need.
- **Lovable** — feels polished and trustworthy, not like a tutorial project. Empty states, onboarding, and micro-copy matter as much as functionality.
- **Complete** — the full loop (sign up → configure → deploy → see it work) must have zero dead ends, even if the feature set is small.

## Target Users
- small-to-mid e-commerce store owners (Shopify) who want automated order/product support without hiring a support team.
- agencies (local service businesses), professional service businesses needing appointment booking, general customer support use cases.

## Problem
Off-the-shelf LLM chatbots hallucinate (invent policies, prices, order statuses) because they aren't grounded in the business's real data or systems. Existing solutions (Intercom, Crisp, ChatBot.com) are built for larger teams and often assume human agent handoff — many small businesses just want reliable automation, no team required.

## Explicitly Out of Scope (v1)
- Human agent handoff / shared inbox (target users have no support team — pure automation is the ask)
- Multi-seat team accounts (single owner per client account for now)
- Native mobile apps
- Non-English language support (not yet addressed)

## Core Features (Built So Far)

### Chat Engine
- Streaming token-by-token responses
- Multi-turn conversation memory
- System-prompt-based persona/guardrails ("don't guess, say you don't know")

### RAG (Retrieval-Augmented Generation)
- Business owners paste/upload their own FAQ, policy, and product text
- Text is chunked, embedded (OpenAI `text-embedding-3-small`), stored in Supabase pgvector
- Every chat query retrieves top-k relevant chunks and injects them as grounding context
- Fixes hallucination: bot answers only from real business data, or admits it doesn't know

### Tool Calling (Real Actions, Not Just Talk)
- Model can call real backend functions mid-conversation:
  - `get_order_status` — real Shopify order lookup
  - `get_product_info` — real Shopify product/stock lookup
  - `book_appointment` — Google Calendar booking (built, not yet wired to a live client)
- Pattern is reusable: any new integration = one new async function + one tool schema entry

### Channels
- **Website widget** — floating bottom-right chat bubble, embeddable via a single `<script>` tag on any website (iframe-based, cross-origin safe)
- **WhatsApp** — Meta Cloud API webhook receives messages, routes through the same `generate()` engine, replies via Graph API

### Multi-Tenant SaaS Layer
- Supabase Auth for business owner accounts (dashboard login)
- Each signup auto-creates a `clients` row (via DB trigger)
- Per-client API keys (hashed, never stored raw) authenticate widget/WhatsApp traffic and resolve which client's data to use
- Row Level Security (RLS) ensures no client can ever see another client's data, even if application code has a bug

### Dashboard (In Progress)
- Knowledge base management: paste text → auto-chunked → embedded → stored; view/delete existing entries
- API key generation/viewing
- **Not yet built:** conversation history/inbox view, analytics, per-client bot config (persona/branding), admin view across all clients

### Landing Page Site (In Progress)
- Landing page: navbar, hero, how-it-works, features, live embedded demo, pricing, final CTA, footer
- Brand: soft blue (#4C6FE5) + coral accent (#FF7A59), chosen to differentiate from competitors' generic-blue or dark-gradient aesthetics
- Trust-building approach: honest claims only (no fabricated logos/testimonials/stats) — primary trust mechanism is letting visitors try the real, live bot

## Competitor Reference Points
- **Intercom** — enterprise-grade, dark/gradient branding, scale-and-proof trust signals, full human+AI shared inbox
- **Crisp** — friendly/colorful, multichannel unified inbox, approachable copy
- **ChatBot.com** — clean traditional SaaS layout, URL-based knowledge base ingestion, simple tiered pricing

FenBot's differentiation: automation-only (no human handoff required), transparent/grounded-by-design positioning, agency-friendly (built by and for freelancers who deploy per-client instances).

## Remaining Roadmap
1. Dashboard: conversation history/inbox view (client visibility into what their bot is saying)
2. Dashboard: basic analytics (volume, top questions)
3. Per-client bot config (persona, brand color, bot name) from dashboard UI
4. Onboarding flow (post-signup guided setup)
5. Parked integrations: Google Calendar (partially built), CRM/HubSpot
6. Founder's admin view (all clients, usage tracking)
7. Production deployment (Vercel + backend host + prod env config + CORS for arbitrary client domains)
8. Pricing/billing enforcement (currently pricing page is static/informational only)