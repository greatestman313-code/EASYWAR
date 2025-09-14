-- PRICING SCHEMA
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  category_id text,
  brand text,
  cost numeric,
  tax_rate numeric,
  shipping_cost numeric,
  current_price numeric,
  msrp numeric,
  map_price numeric,
  stock integer,
  channel text,
  currency text default 'USD',
  attrs jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists competitor_prices (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null references products(sku),
  competitor_name text,
  url text,
  price numeric,
  currency text default 'USD',
  stock_flag boolean,
  captured_at timestamptz default now(),
  source text
);

create table if not exists pricing_rules (
  id uuid primary key default gen_random_uuid(),
  scope text check (scope in ('global','channel','country','category','product')),
  scope_ref text,
  objective text check (objective in ('profit','volume','hybrid')) default 'hybrid',
  alpha numeric default 0.6,
  min_margin_pct numeric default 0,
  min_price numeric,
  max_price numeric,
  price_ending text, -- .99/.95/round
  fx_policy text,
  tax_policy_ref text,
  active_from timestamptz default now(),
  active_to timestamptz,
  priority int default 100
);

create table if not exists elasticity_estimates (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null references products(sku),
  method text,
  e float8,
  quality jsonb,
  window text,
  updated_at timestamptz default now()
);

create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  product_sku text references products(sku),
  input_json jsonb,
  output_json jsonb,
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  product_sku text references products(sku),
  reco_price numeric,
  objective text,
  constraints_applied jsonb,
  expected_demand numeric,
  expected_revenue numeric,
  expected_profit numeric,
  valid_until timestamptz,
  status text default 'draft'
);

create table if not exists price_updates (
  id uuid primary key default gen_random_uuid(),
  product_sku text references products(sku),
  old_price numeric,
  new_price numeric,
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

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz default now()
);
