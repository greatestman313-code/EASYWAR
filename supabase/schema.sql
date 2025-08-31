create table if not exists users_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  font_size int not null default 12
);

create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text,
  created_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references threads(id) on delete cascade,
  user_id uuid not null,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table users_settings enable row level security;
alter table threads enable row level security;
alter table messages enable row level security;

-- Policies: owner-only
create policy "users_settings_owner"
  on users_settings for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

create policy "threads_owner"
  on threads for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

create policy "messages_owner"
  on messages for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );
