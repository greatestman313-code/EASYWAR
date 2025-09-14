
-- Enable extensions
create extension if not exists "uuid-ossp";

-- Profiles (roles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  image text,
  role text check (role in ('guest','user','admin')) default 'user',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner" on public.profiles
for select using (auth.uid() = id);

create policy "Profiles insert for self" on public.profiles
for insert with check (auth.uid() = id);

create policy "Profiles update for self" on public.profiles
for update using (auth.uid() = id);

-- Sessions
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  archived boolean default false,
  share_token text,
  created_at timestamp with time zone default now()
);
alter table public.sessions enable row level security;
create policy "Owner can CRUD sessions" on public.sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Messages
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade,
  role text check (role in ('user','assistant','system')) not null,
  content text,
  meta jsonb,
  created_at timestamp with time zone default now()
);
alter table public.messages enable row level security;
create policy "Session owner can CRUD messages" on public.messages
for all using (
  exists(select 1 from public.sessions s where s.id = session_id and s.user_id = auth.uid())
) with check (
  exists(select 1 from public.sessions s where s.id = session_id and s.user_id = auth.uid())
);

-- Ratings
create table if not exists public.ratings (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references public.messages(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  value int check (value in (-1,1)),
  created_at timestamp with time zone default now()
);
alter table public.ratings enable row level security;
create policy "Owner can rate" on public.ratings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Files (metadata)
create table if not exists public.files (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade,
  url text,
  mime text,
  size int,
  created_at timestamp with time zone default now()
);
alter table public.files enable row level security;
create policy "Owner can CRUD files" on public.files
for all using (exists(select 1 from public.sessions s where s.id = session_id and s.user_id = auth.uid()))
with check (exists(select 1 from public.sessions s where s.id = session_id and s.user_id = auth.uid()));

-- Storage bucket
-- Create bucket manually or via SQL:
insert into storage.buckets (id, name, public) values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read assets" on storage.objects
for select using (bucket_id = 'assets');

create policy "Authenticated upload own path" on storage.objects
for insert with check (
  bucket_id = 'assets' and
  (auth.role() = 'authenticated')
);

create policy "Authenticated update/remove own objects" on storage.objects
for all using (bucket_id = 'assets' and auth.role() = 'authenticated');

-- PRICING SCHEMA
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  sku text unique not null,
  name text,
  category_id text,
  brand text,
  cost numeric,
  tax_rate numeric,
  shipping_cost numeric,
  current_price numeric,
  msrp numeric,
  map_price numeric,
  stock int,
  channel text,
  currency text,
  attrs jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "Owner products" on public.products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists public.competitor_prices (
  id uuid primary key default uuid_generate_v4(),
  product_sku text,
  competitor_name text,
  url text,
  price numeric,
  currency text,
  stock_flag boolean,
  captured_at timestamptz,
  source text
);
alter table public.competitor_prices enable row level security;
create policy "Read competitors" on public.competitor_prices for select using (true);

create table if not exists public.pricing_rules (
  id uuid primary key default uuid_generate_v4(),
  scope text,
  scope_ref text,
  objective text,
  alpha numeric,
  min_margin_pct numeric,
  min_price numeric,
  max_price numeric,
  price_ending text,
  fx_policy text,
  tax_policy_ref text,
  active_from timestamptz,
  active_to timestamptz,
  priority int
);
alter table public.pricing_rules enable row level security;
create policy "Read pricing rules" on public.pricing_rules for select using (true);

create table if not exists public.elasticity_estimates (
  id uuid primary key default uuid_generate_v4(),
  product_sku text,
  method text,
  e numeric,
  quality jsonb,
  window text,
  updated_at timestamptz default now()
);
alter table public.elasticity_estimates enable row level security;
create policy "Read elasticity" on public.elasticity_estimates for select using (true);

create table if not exists public.simulations (
  id uuid primary key default uuid_generate_v4(),
  product_sku text,
  input_json jsonb,
  output_json jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.simulations enable row level security;
create policy "Owner simulations" on public.simulations
for all using (created_by = auth.uid()) with check (created_by = auth.uid());

create table if not exists public.recommendations (
  id uuid primary key default uuid_generate_v4(),
  product_sku text,
  reco_price numeric,
  objective text,
  constraints_applied jsonb,
  expected_demand numeric,
  expected_revenue numeric,
  expected_profit numeric,
  valid_until timestamptz,
  status text
);
alter table public.recommendations enable row level security;
create policy "Read recommendations" on public.recommendations for select using (true);

create table if not exists public.price_updates (
  id uuid primary key default uuid_generate_v4(),
  product_sku text,
  old_price numeric,
  new_price numeric,
  channel text,
  pushed_at timestamptz,
  push_status text,
  response_json jsonb
);
alter table public.price_updates enable row level security;
create policy "Read price updates" on public.price_updates for select using (true);

create table if not exists public.experiments (
  id uuid primary key default uuid_generate_v4(),
  name text,
  product_set jsonb,
  variant_a jsonb,
  variant_b jsonb,
  start_at timestamptz,
  end_at timestamptz,
  kpi text,
  result_json jsonb
);
alter table public.experiments enable row level security;
create policy "Read experiments" on public.experiments for select using (true);

-- ADS SCHEMA
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text,
  brand_id text,
  owner_id uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "Owner projects" on public.projects
for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.assets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  path text,
  mime text,
  width int,
  height int,
  dpi int,
  platform_hint text,
  created_at timestamptz default now()
);
alter table public.assets enable row level security;
create policy "Owner assets" on public.assets
for all using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
) with check (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
);

create table if not exists public.brand_kits (
  id uuid primary key default uuid_generate_v4(),
  name text,
  palette_lab_json jsonb,
  fonts_json jsonb,
  logo_refs jsonb,
  rules_json jsonb
);
alter table public.brand_kits enable row level security;
create policy "Read brand kits" on public.brand_kits for select using (true);

create table if not exists public.detections (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references public.assets(id) on delete cascade,
  type text,
  bbox jsonb,
  text text,
  score numeric,
  extra_json jsonb
);
alter table public.detections enable row level security;
create policy "Owner detections" on public.detections
for all using (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
) with check (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
);

create table if not exists public.analyses (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references public.assets(id) on delete cascade,
  ocr_text text,
  color_palette jsonb,
  contrast_scores jsonb,
  layout_json jsonb,
  saliency_map_ref text,
  metrics_json jsonb
);
alter table public.analyses enable row level security;
create policy "Owner analyses" on public.analyses
for all using (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
) with check (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
);

create table if not exists public.compliance_flags (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references public.assets(id) on delete cascade,
  policy_code text,
  severity text,
  message text,
  evidence_json jsonb
);
alter table public.compliance_flags enable row level security;
create policy "Owner flags" on public.compliance_flags
for all using (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
) with check (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
);

create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references public.assets(id) on delete cascade,
  pdf_ref text,
  summary_json jsonb,
  created_at timestamptz default now()
);
alter table public.reports enable row level security;
create policy "Owner reports" on public.reports
for all using (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
) with check (
  exists(select 1 from public.assets a join public.projects p on a.project_id = p.id where a.id = asset_id and p.owner_id = auth.uid())
);

-- Audit logs (generic)
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid,
  action text,
  entity text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);
alter table public.audit_logs enable row level security;
create policy "Owner can read own logs" on public.audit_logs for select using (true);
