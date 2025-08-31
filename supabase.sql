-- Enable extensions (for gen_random_uuid)
create extension if not exists pgcrypto;

-- Profiles
create table if not exists users_profile (
  id uuid primary key,
  email text unique,
  name text,
  avatar_url text,
  plan text default 'Free',
  created_at timestamp with time zone default now()
);

-- Chats
create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  title text,
  created_at timestamp with time zone default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  role text check (role in ('user','assistant','system')),
  content text,
  created_at timestamp with time zone default now()
);

-- Storage bucket for uploads
-- Create via Supabase Studio: bucket name 'uploads' (public = false recommended).

-- RLS
alter table users_profile enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;

-- Policies
create policy "Users can read/update their profile"
on users_profile for select using (auth.uid() = id);
create policy "Users can upsert own profile"
on users_profile for insert with check (auth.uid() = id);
create policy "Users can update own profile"
on users_profile for update using (auth.uid() = id);

create policy "Owner can select their chats"
on chats for select using (auth.uid() = user_id);
create policy "Owner can insert their chats"
on chats for insert with check (auth.uid() = user_id);
create policy "Owner can delete their chats"
on chats for delete using (auth.uid() = user_id);

create policy "Owner can select messages of their chats"
on messages for select using (exists (select 1 from chats c where c.id = chat_id and c.user_id = auth.uid()));
create policy "Owner can insert messages to their chats"
on messages for insert with check (exists (select 1 from chats c where c.id = chat_id and c.user_id = auth.uid()));
