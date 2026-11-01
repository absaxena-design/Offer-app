-- ARXA initial secure cloud sync. Apply in Supabase SQL Editor.
-- Supabase Auth manages accounts; never create a public user-password table.
create table if not exists public.watchlist_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id,id),
  constraint watchlist_payload_object check (jsonb_typeof(payload) = 'object')
);
create index if not exists watchlist_records_user_created_idx on public.watchlist_records (user_id,created_at desc);
alter table public.watchlist_records enable row level security;
revoke all on public.watchlist_records from anon;
grant select,insert,update,delete on public.watchlist_records to authenticated;
drop policy if exists "arxa_select_own" on public.watchlist_records;
create policy "arxa_select_own" on public.watchlist_records for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "arxa_insert_own" on public.watchlist_records;
create policy "arxa_insert_own" on public.watchlist_records for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "arxa_update_own" on public.watchlist_records;
create policy "arxa_update_own" on public.watchlist_records for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "arxa_delete_own" on public.watchlist_records;
create policy "arxa_delete_own" on public.watchlist_records for delete to authenticated using ((select auth.uid()) = user_id);
-- This is the initial secure data-sync foundation. Normalize products, offers,
-- shared price observations and purchases in a subsequent migration.
