# FenBot — Database Schema (Supabase / Postgres)

## Extensions
```sql
create extension if not exists vector;
```

## Tables

### `auth.users` (Supabase-managed)
Standard Supabase Auth table. Business owners sign up here. `raw_user_meta_data->>'business_name'` is passed at signup and read by the `handle_new_user` trigger.

### `clients`
One row per tenant business (a FenBot customer, e.g. a Shopify store owner).

```sql
create table clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) not null,
  business_name text not null,
  created_at timestamptz default now()
);

alter table clients enable row level security;

create policy "Owners see their own client record"
  on clients for select using (auth.uid() = owner_id);
```

Auto-created via trigger on every new `auth.users` signup:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.clients (owner_id, business_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'business_name', 'My Business'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### `api_keys`
One or more API keys per client. Used to authenticate widget/WhatsApp traffic (not dashboard logins).

```sql
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) not null,
  key_hash text not null,       -- SHA-256 hash; raw key is NEVER stored
  key_prefix text not null,     -- first ~10 chars, for display/identification only
  created_at timestamptz default now(),
  revoked boolean default false
);

alter table api_keys enable row level security;

create policy "Owners manage their own api keys"
  on api_keys for all using (
    client_id in (select id from clients where owner_id = auth.uid())
  );
```

Raw key format: `fb_<32-byte-urlsafe-token>`, generated via `secrets.token_urlsafe(32)`. Shown to the owner exactly once at creation time.

### `documents`
The RAG knowledge base. One row per chunk of business-provided text (FAQ, policy, product info).

```sql
create table documents (
  id bigint primary key generated always as identity,
  client_id uuid references clients(id),
  content text not null,
  embedding vector(1536),  -- text-embedding-3-small output size
  created_at timestamptz default now()
);

create index on documents using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

alter table documents enable row level security;

create policy "Owners manage their own documents"
  on documents for all using (
    client_id in (select id from clients where owner_id = auth.uid())
  );
```

**Note:** `client_id` was originally a loose `text` field (used during early single-tenant RAG prototyping with a hardcoded `"default"` value) and was later migrated to a proper `uuid` foreign key once the `clients` table existed. If reading old code/commits, expect this evolution.

**Retrieval query pattern:**
```sql
select content
from documents
where client_id = $1
order by embedding <=> $2
limit $3;
```
`<=>` is pgvector's cosine distance operator.

## Tables Planned But Not Yet Built
- `conversations` / `messages` — needed for: (a) dashboard conversation history/inbox view, (b) persisting WhatsApp conversation state across server restarts (currently in-memory), (c) analytics (volume, top questions)
- `bot_config` — per-client persona/system-prompt text, brand color, bot display name (for the planned Phase 4c dashboard config page)
- `usage_events` — for founder's admin view / future billing enforcement (token usage, conversation counts per client per period)

## Security Notes
- Row Level Security is enabled on every tenant-scoped table. This is a deliberate defense-in-depth layer: even if application code has a bug that forgets a `WHERE client_id = ...` clause, Postgres itself will not return another tenant's rows to a session it doesn't belong to.
- The backend's `asyncpg` connection currently uses a service-level connection (not per-user Supabase sessions), so RLS policies keyed to `auth.uid()` apply to *dashboard-originated* queries made through Supabase client libraries — the FastAPI backend's direct Postgres access should still manually filter by `client_id` in every query (as already done in `dashboard.py` and `rag.py`), since it does not carry a Supabase session context.