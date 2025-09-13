-- ===============================
-- CHAT EASY WAR - Supabase Schema
-- ===============================

-- Extensions (if needed)
-- create extension if not exists "uuid-ossp";

-- USERS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text not null default 'user',              -- 'user' | 'admin'
  plan text not null default 'free',              -- 'free' | 'pro'
  picture text,
  last_login timestamptz default now(),
  created_at timestamptz default now()
);

-- SESSIONS
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  started_at timestamptz default now(),
  ended_at timestamptz,
  archived boolean default false
);
create index if not exists idx_sessions_user_id on public.sessions(user_id);

-- MESSAGES
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  role text not null,                              -- 'user' | 'assistant' | 'system'
  content text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_messages_session_id on public.messages(session_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

-- REPORTS
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  reason text,
  note text,
  created_at timestamptz default now()
);
create index if not exists idx_reports_created_at on public.reports(created_at);

-- SHARES
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  created_at timestamptz default now()
);
create index if not exists idx_shares_message_id on public.shares(message_id);

-- Simple view for admin analytics (logins per day)
create or replace view public.v_logins_daily as
select date_trunc('day', last_login) as day, count(*) as users_logged
from public.users
where last_login is not null
group by 1
order by 1 desc;

-- ===============================
-- Row Level Security (RLS)
-- ===============================
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.shares enable row level security;

-- Helper: create a function to map auth.uid() → users.id (by email).
-- In real projects, you'd sync auth.users → public.users on signup webhook.
create or replace function public.uid_for_email(email_input text)
returns uuid language sql stable as $$
  select id from public.users where email = email_input limit 1;
$$;

-- POLICY: Users table
drop policy if exists "users_read_own" on public.users;
create policy "users_read_own"
on public.users for select
using ( auth.email() = email );

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self"
on public.users for update
using ( auth.email() = email );

-- Sessions (owner-only)
drop policy if exists "sessions_owner_rw" on public.sessions;
create policy "sessions_owner_rw"
on public.sessions for all
using ( user_id = public.uid_for_email(auth.email()) )
with check ( user_id = public.uid_for_email(auth.email()) );

-- Messages (by session)
drop policy if exists "messages_by_session_owner" on public.messages;
create policy "messages_by_session_owner"
on public.messages for all
using ( session_id in (select id from public.sessions where user_id = public.uid_for_email(auth.email())) )
with check ( session_id in (select id from public.sessions where user_id = public.uid_for_email(auth.email())) );

-- Reports (owner read/insert; admins can read all via service key)
drop policy if exists "reports_owner_rw" on public.reports;
create policy "reports_owner_rw"
on public.reports for all
using (
  coalesce(user_id, public.uid_for_email(auth.email())) = public.uid_for_email(auth.email())
)
with check ( coalesce(user_id, public.uid_for_email(auth.email())) = public.uid_for_email(auth.email()) );

-- Shares (public read; owner create/delete)
drop policy if exists "shares_public_read" on public.shares;
create policy "shares_public_read"
on public.shares for select
using ( true );

drop policy if exists "shares_owner_write" on public.shares;
create policy "shares_owner_write"
on public.shares for all
using (
  message_id in (
    select m.id from public.messages m
    join public.sessions s on s.id = m.session_id
    where s.user_id = public.uid_for_email(auth.email())
  )
)
with check (
  message_id in (
    select m.id from public.messages m
    join public.sessions s on s.id = m.session_id
    where s.user_id = public.uid_for_email(auth.email())
  )
);

-- ===============================
-- Seed (اختياري للتجربة محلياً)
-- ===============================
insert into public.users (email, name, role, plan)
values
  ('admin@example.com','Admin','admin','pro'),
  ('user@example.com','User','user','free')
on conflict (email) do nothing;

-- جلسة اختبار للمستخدم
do $$
declare u uuid;
begin
  select id into u from public.users where email='user@example.com';
  if u is not null then
    insert into public.sessions (user_id) values (u) on conflict do nothing;
  end if;
end; $$;
