-- PRICING SCHEMA
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  category_id text,
  brand text,
  cost numeric(18,6) not null default 0,
  tax_rate numeric(6,4) not null default 0,
  shipping_cost numeric(18,6) not null default 0,
  current_price numeric(18,6),
  msrp numeric(18,6),
  map_price numeric(18,6),
  stock integer default 0,
  channel text,
  currency text default 'USD',
  attrs jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists competitor_prices (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null references products(sku) on delete cascade,
  competitor_name text not null,
  url text,
  price numeric(18,6) not null,
  currency text default 'USD',
  stock_flag boolean,
  captured_at timestamptz not null default now(),
  source text
);

create table if not exists pricing_rules (
  id uuid primary key default gen_random_uuid(),
  scope text check (scope in ('global','channel','country','category','product')) not null,
  scope_ref text,
  objective text check (objective in ('profit','volume','hybrid')) not null default 'hybrid',
  alpha numeric(6,4) default 0.5,
  min_margin_pct numeric(7,4) default 0,
  min_price numeric(18,6),
  max_price numeric(18,6),
  price_ending text default '.99',
  fx_policy text,
  tax_policy_ref text,
  active_from timestamptz default now(),
  active_to timestamptz,
  priority int not null default 0
);

create table if not exists elasticity_estimates (
  id uuid primary key default gen_random_uuid(),
  product_sku text references products(sku) on delete cascade,
  method text,
  e numeric(12,6),
  quality jsonb,
  window text,
  updated_at timestamptz default now()
);

create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  product_sku text references products(sku) on delete cascade,
  input_json jsonb not null,
  output_json jsonb,
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  product_sku text references products(sku) on delete cascade,
  reco_price numeric(18,6) not null,
  objective text,
  constraints_applied jsonb,
  expected_demand numeric(18,6),
  expected_revenue numeric(18,6),
  expected_profit numeric(18,6),
  valid_until timestamptz,
  status text default 'draft'
);

create table if not exists price_updates (
  id uuid primary key default gen_random_uuid(),
  product_sku text references products(sku) on delete cascade,
  old_price numeric(18,6),
  new_price numeric(18,6),
  channel text,
  pushed_at timestamptz,
  push_status text,
  response_json jsonb
);

create table if not exists experiments (
  id uuid primary key default gen_random_uuid(),
  name text,
  product_set jsonb,
  variant_a jsonb,
  variant_b jsonb,
  start_at timestamptz,
  end_at timestamptz,
  kpi text,
  result_json jsonb
);

create table if not exists audit_logs_pricing (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz default now()
);
