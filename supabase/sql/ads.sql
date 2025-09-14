-- ADS/ANALYZER SCHEMA
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_id text,
  owner_id uuid,
  created_at timestamptz default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  path text not null,
  mime text not null,
  width int,
  height int,
  dpi int,
  platform_hint text,
  created_at timestamptz default now()
);

create table if not exists brand_kits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  palette_lab_json jsonb,
  fonts_json jsonb,
  logo_refs jsonb,
  rules_json jsonb
);

create table if not exists detections (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references assets(id) on delete cascade,
  type text check (type in ('text','logo','cta','object')),
  bbox jsonb,
  text text,
  score numeric(6,4),
  extra_json jsonb
);

create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references assets(id) on delete cascade,
  ocr_text text,
  color_palette jsonb,
  contrast_scores jsonb,
  layout_json jsonb,
  saliency_map_ref text,
  metrics_json jsonb
);

create table if not exists compliance_flags (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references assets(id) on delete cascade,
  policy_code text,
  severity text,
  message text,
  evidence_json jsonb
);

create table if not exists recommendations_ads (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references assets(id) on delete cascade,
  items_json jsonb,
  score_overall numeric(6,2),
  score_breakdown jsonb,
  version text
);

create table if not exists ab_simulations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  asset_a uuid references assets(id) on delete cascade,
  asset_b uuid references assets(id) on delete cascade,
  features_json jsonb,
  expected_delta_ctr numeric(6,2),
  confidence numeric(6,2)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references assets(id) on delete cascade,
  pdf_ref text,
  summary_json jsonb,
  created_at timestamptz default now()
);

create table if not exists audit_logs_ads (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz default now()
);
