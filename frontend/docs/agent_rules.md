# FenBot — Agent Rules (for AI IDE / coding assistant)

These rules apply to any AI coding agent (Cursor, Claude Code, Copilot Workspace, etc.) working on this codebase. Read `prd.md`, `trd.md`, `database.md`, and `component_rules.md` before making changes — they contain the full product/technical context.

## Golden Rules

1. **Never break the multi-tenant boundary.** Every query touching `documents`, `api_keys`, or any future tenant-scoped table MUST filter by `client_id`, even when RLS is also enabled. Defense-in-depth is a hard requirement here, not a suggestion — assume RLS could be misconfigured and application-level filtering is the real safety net.

2. **Never store secrets in plaintext.** API keys are hashed (SHA-256) before storage — see `app/utils/apikeys.py`. If adding new secret-like credentials (new integration tokens, etc.), follow the same pattern or store as encrypted env vars, never as a raw DB column.

3. **Never conflate the two auth mechanisms.**
   - `get_client_id_from_api_key` = anonymous widget/WhatsApp traffic, trusts `X-API-Key` header
   - `get_current_owner_id` = logged-in dashboard owner, trusts Supabase session JWT
   A route serving dashboard functionality should never accept a bare API key as sufficient auth, and vice versa.

4. **New integrations follow the existing tool-calling pattern exactly:**
   - One new async function in `app/services/<integration>.py` performing the real API call
   - One new entry in the `TOOLS` schema list (name, description, JSON-schema parameters)
   - One new entry in `TOOL_FUNCTIONS` dict
   - Do NOT modify the core `generate()` function-call detection loop — it is intentionally integration-agnostic. If you find yourself editing that loop for a "one-off" case, stop and reconsider the tool's design instead.

5. **Do not add LangChain, LlamaIndex, or similar heavy frameworks** without an explicit product decision to do so. The project deliberately uses raw `asyncpg` + OpenAI SDK calls for RAG and tool calling, prioritizing debuggability and minimal dependency surface over framework convenience. This may be revisited only if genuine multi-step agent orchestration (not simple single tool calls) becomes a requirement.

6. **Respect the copyright/hallucination-prevention design intent.** The system prompt instructs the model to answer only from retrieved context and admit uncertainty otherwise. Do not weaken this instruction when tuning prompts for "better" answers — hallucination resistance is a core product requirement, not an incidental behavior.

7. **Design tokens are canonical, not per-component choices.** Use the palette defined in `component_rules.md` (soft blue `#4C6FE5` + coral `#FF7A59`). Do not introduce ad-hoc colors in new components. If a new color is genuinely needed (e.g. a new status state), propose it as a token addition, not an inline one-off.

8. **Never fabricate social proof.** No placeholder testimonials, fake client logos, or invented statistics in marketing copy or components — even as "temporary" placeholders, since these have a habit of shipping. Use honest, verifiable claims or an explicit "coming soon" treatment instead.

## Known Technical Debt (do not "fix" silently without flagging)
- WhatsApp conversation history is in-memory (`conversations` dict in `whatsapp.py`) — resets on restart. Migrating this to Postgres is expected but should be called out explicitly as a schema change (new `conversations`/`messages` table), not silently patched.
- Google Calendar client (`app/services/calendar.py`) uses a synchronous Google API client inside async routes — functional but blocking. Flag before scaling; don't silently leave it or silently "fix" it without noting the behavior change (e.g. wrapping in `run_in_executor`).
- No rate limiting on `/chat`. Any production deployment work must add this before going live — treat its absence as a blocking issue for deployment tasks specifically, not for local dev work.

## Testing Expectations
- No formal test suite exists yet. When adding new backend logic (especially tool functions, auth dependencies, or RAG retrieval changes), prefer adding basic `pytest` coverage over none, but do not block on building a full testing framework unprompted — confirm with the human first if a testing overhaul seems warranted.

## Style
- Backend: FastAPI + `asyncpg`, async/await throughout, Pydantic models for all request schemas (see `app/schemas/`)
- Frontend: Next.js App Router, Tailwind utility classes only (no CSS modules/styled-components), `lucide-react` for icons, functional components with hooks (no class components)
- Keep new files consistent with existing folder structure: `app/routes/`, `app/services/`, `app/schemas/`, `app/dependencies/`, `app/utils/` on the backend; `components/`, `components/marketing/`, `hooks/`, `lib/` on the frontend

## When Unsure
Prefer asking the human (or leaving a clear `# TODO:` comment explaining the ambiguity) over guessing silently on:
- Anything touching the multi-tenant data boundary
- Anything touching stored credentials or auth
- Pricing/billing logic (not yet implemented — do not invent billing enforcement behavior)