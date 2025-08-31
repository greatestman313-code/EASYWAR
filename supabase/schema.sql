-- Minimal schema draft for projects/threads/messages
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null,
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text,
  created_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references threads(id) on delete cascade,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- TODO: RLS policies
