# FenBot — Technical Requirements Document

## Stack Overview
- **Frontend:** Next.js + Tailwind CSS, Vercel AI SDK (`@ai-sdk/react`, `ai`)
- **Backend:** FastAPI (Python), async throughout
- **Database / Vector Store:** Supabase (Postgres + pgvector extension)
- **Auth:** Supabase Auth (dashboard/owner login), custom hashed API keys (widget/channel traffic)
- **LLM Provider:** OpenAI (`gpt-4o-mini` for chat, `text-embedding-3-small` for embeddings)
- **Integrations:** Shopify Admin REST API, WhatsApp Cloud API (Meta Graph API), Google Calendar API (OAuth2)

## Architecture Summary

```
[Website Widget / WhatsApp] --X-API-Key/webhook--> [FastAPI backend]
                                                          |
                                          resolves client_id from API key
                                                          |
                                    +---------------------+---------------------+
                                    |                                           |
                            [Supabase pgvector]                         [OpenAI Responses API]
                            RAG retrieval scoped                        streaming + tool calling
                            to client_id                                          |
                                    |                                             |
                                    +---------------> injected as context <-------+
                                                          |
                                              [Tool functions, if called]
                                        Shopify / Calendar / (future: CRM)
                                                          |
                                                  streamed reply back
```

## Core Request Flow (`POST /chat`)
1. `X-API-Key` header required (FastAPI `Depends`)
2. Key is SHA-256 hashed and looked up in `api_keys` table → resolves `client_id`
3. Incoming message list (AI SDK's `parts`-based format) is normalized via `message_formatter` into `{role, content}` pairs, filtering only `type: "text"` parts (ignores `step-start` and future tool-call parts)
4. Last user message is embedded and used to query `documents` table (pgvector cosine distance `<=>`), filtered `WHERE client_id = $1`
5. Retrieved chunks are injected into a system prompt template
6. Full message list (system + history) sent to OpenAI Responses API with `tools=TOOLS`, `stream=True`
7. If the model emits a `function_call`, backend executes the matching real async function, appends `function_call` + `function_call_output` to the input, and makes a second streaming call for the final answer
8. Response streamed back as raw text (`StreamingResponse`, `media_type="text/plain"`)

## RAG Pipeline
- **Chunking:** paragraph-based split (`\n\n`), falls back to sentence-based splitting if a paragraph exceeds `max_chars` (default 500). See `app/utils/chunking.py`.
- **Embedding:** OpenAI `text-embedding-3-small` (1536 dimensions)
- **Storage:** `documents` table, `vector(1536)` column, `ivfflat` index with `vector_cosine_ops`
- **Retrieval:** top-k (default 2) nearest neighbors by cosine distance, scoped by `client_id`
- Originally prototyped with raw in-memory cosine similarity (Python lists) before migrating to Supabase pgvector — the migration was a drop-in replacement of the storage/retrieval layer only; the surrounding `generate()` logic was unchanged.

## Tool Calling Pattern
Each integration follows an identical shape:
1. A `TOOLS` schema entry (name, description, JSON-schema parameters) — this is what the model reads to decide when/how to call it
2. A real async Python function performing the actual API call (Shopify REST, WhatsApp Graph API, Google Calendar API)
3. Registration in `TOOL_FUNCTIONS` dict, mapping tool name → function
4. No special-casing in `generate()` — the function-call detection/execution loop is integration-agnostic

This means adding a new integration (e.g. CRM/HubSpot) requires no changes to the core engine — only a new service file + tool schema entry.

## Channels

### Website Widget
- React component (`ChatWidget.tsx`) rendered standalone at `/widget?key=<api_key>` (a dedicated Next.js route, no other page content)
- Embedded on third-party sites via `public/embed.js`: a vanilla-JS loader that injects an `<iframe>` pointing at the hosted `/widget` route
- Widget posts `postMessage({type: "fenbot:toggle", open: bool})` to resize the iframe from a small launcher button to a full chat panel and back — solves the "iframe blocks page clicks" problem without a persistent full-size iframe
- Loader validates `event.origin` on incoming postMessage to prevent cross-origin spoofing

### WhatsApp
- Meta Cloud API (On-Premise API deprecated Oct 2025 — Cloud API is the only supported path)
- `GET /webhook/whatsapp` — verification handshake (`hub.mode`, `hub.verify_token`, `hub.challenge`)
- `POST /webhook/whatsapp` — receives incoming messages, maintains an in-memory `conversations` dict keyed by WhatsApp number (⚠️ resets on server restart — needs migration to Postgres for production), runs the message through `generate()` (collecting the full streamed text, since WhatsApp has no streaming UI concept), sends the reply via `send_whatsapp_message()`
- Requires a permanent System User access token in production (temporary tokens expire in 24h)

### Google Calendar (partially built, not yet live for a real client)
- One-time OAuth2 consent flow (`get_refresh_token.py`) produces a long-lived refresh token, stored in `.env`
- `book_appointment()` checks `freebusy` before inserting an event
- ⚠️ Uses the synchronous `google-api-python-client` — blocking calls inside an async route. Acceptable for learning/dev; needs `run_in_executor` wrapping before production scale.

## Multi-Tenancy & Security
- **Two separate trust mechanisms, do not conflate:**
  - `get_client_id_from_api_key` — validates `X-API-Key` header (SHA-256 hash lookup) for anonymous widget/WhatsApp traffic
  - `get_current_owner_id` — validates Supabase session JWT (`Authorization: Bearer`) for logged-in dashboard owners, verified via `python-jose` against `SUPABASE_JWT_SECRET`
- API keys are never stored raw — only `key_hash` (SHA-256) + `key_prefix` (first 10 chars, for display/identification) are persisted
- Row Level Security (RLS) enabled on `clients`, `api_keys`, `documents` — database-level tenant isolation as defense-in-depth beyond application code
- Dashboard document delete endpoint double-checks `client_id` in the `DELETE ... WHERE id = $1 AND client_id = $2` query, even though RLS already covers this

## Known Technical Debt / Things to Fix Before Production
- WhatsApp conversation history is in-memory only — must move to Postgres (a `conversations` or `messages` table) before deploying, or restarts silently wipe active conversations
- Google Calendar client is synchronous — wrap blocking calls with `run_in_executor` or move to an async-compatible client
- No rate limiting on `/chat` endpoint — needed before public exposure to prevent abuse/cost overrun
- No conversation persistence for the website widget either — currently only exists client-side in React state per session; needed for the planned "conversation history/inbox" dashboard feature
- CORS is currently configured for `localhost:3000` only — must be updated to allow arbitrary client domains (or a dynamic allowlist) once widget is embedded on real client sites