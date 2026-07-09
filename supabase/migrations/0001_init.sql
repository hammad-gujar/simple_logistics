-- ============================================================================
-- Simple Logistics Limited — initial schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums ----
create type public.division as enum ('logistics', 'healthcare');
create type public.job_type as enum ('Full-time', 'Part-time', 'Temporary', 'Contract');
create type public.inquiry_status as enum ('new', 'in_review', 'closed');
create type public.workforce_urgency as enum ('standard', 'priority', 'critical');
create type public.workforce_status as enum ('new', 'contacted', 'fulfilled', 'closed');

-- ------------------------------------------------------- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------- site_settings
-- Single-row global settings engine: id is constrained to 1 so business
-- details are never duplicated and never hardcoded in the application.
create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'Simple Logistics Limited',
  tagline text,
  meta_title text,
  meta_description text,
  logo_url text,
  logo_dark_url text,
  favicon_url text,
  og_image_url text,
  phone text,
  email text,
  address_line1 text,
  address_line2 text,
  city text,
  postcode text,
  country text not null default 'United Kingdom',
  opening_hours jsonb not null default '[]'::jsonb,
  contact_email text,
  workforce_email text,
  applications_email text,
  linkedin_url text,
  facebook_url text,
  companies_house_number text,
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  division public.division not null,
  slug text not null,
  title text not null,
  excerpt text not null,
  body_html text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  icon text,
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (division, slug)
);

create index services_published_idx on public.services (division, is_published, sort_order);

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------------- jobs
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  reference text not null unique,
  title text not null,
  division public.division not null,
  location text not null,
  job_type public.job_type not null default 'Full-time',
  industry text not null,
  salary_text text,
  summary text not null,
  body_html text not null default '',
  application_email text,          -- overrides settings.applications_email when set
  application_instructions text,   -- overrides the default instruction template when set
  is_published boolean not null default false,
  closes_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_published_idx on public.jobs (is_published, created_at desc);
create index jobs_filters_idx on public.jobs (division, job_type, location);

create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------- posts
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body_html text not null default '',
  cover_image_url text,
  category text not null default 'Insights',
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_published_idx on public.posts (is_published, published_at desc);
create index posts_tags_idx on public.posts using gin (tags);

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------ testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text not null,
  division public.division,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------- contact_inquiries
create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create index contact_inquiries_status_idx on public.contact_inquiries (status, created_at desc);

-- ------------------------------------------------------ workforce_requests
create table public.workforce_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  sector text not null,
  site_location text not null,
  headcount integer not null check (headcount between 1 and 5000),
  roles_needed text[] not null default '{}',
  skills text,
  shift_pattern text not null,
  start_date date,
  duration text not null,
  urgency public.workforce_urgency not null default 'standard',
  notes text,
  status public.workforce_status not null default 'new',
  created_at timestamptz not null default now()
);

create index workforce_requests_status_idx on public.workforce_requests (status, created_at desc);

-- ============================================================================
-- Row Level Security
--   * anon:           read published content + settings; insert leads only
--   * authenticated:  full CMS access (the admin portal)
-- ============================================================================

alter table public.site_settings      enable row level security;
alter table public.services           enable row level security;
alter table public.jobs               enable row level security;
alter table public.posts              enable row level security;
alter table public.testimonials       enable row level security;
alter table public.contact_inquiries  enable row level security;
alter table public.workforce_requests enable row level security;

-- settings: world-readable, admin-writable
create policy "settings public read"
  on public.site_settings for select
  using (true);

create policy "settings admin write"
  on public.site_settings for all
  to authenticated
  using (true) with check (true);

-- published-content pattern for services / jobs / posts / testimonials
create policy "services public read"
  on public.services for select
  using (is_published or (select auth.role()) = 'authenticated');

create policy "services admin write"
  on public.services for all
  to authenticated
  using (true) with check (true);

create policy "jobs public read"
  on public.jobs for select
  using (is_published or (select auth.role()) = 'authenticated');

create policy "jobs admin write"
  on public.jobs for all
  to authenticated
  using (true) with check (true);

create policy "posts public read"
  on public.posts for select
  using (is_published or (select auth.role()) = 'authenticated');

create policy "posts admin write"
  on public.posts for all
  to authenticated
  using (true) with check (true);

create policy "testimonials public read"
  on public.testimonials for select
  using (is_published or (select auth.role()) = 'authenticated');

create policy "testimonials admin write"
  on public.testimonials for all
  to authenticated
  using (true) with check (true);

-- lead tables: anonymous visitors may only insert; only admins may read/manage
create policy "contact inquiries public insert"
  on public.contact_inquiries for insert
  to anon, authenticated
  with check (true);

create policy "contact inquiries admin read"
  on public.contact_inquiries for select
  to authenticated
  using (true);

create policy "contact inquiries admin update"
  on public.contact_inquiries for update
  to authenticated
  using (true) with check (true);

create policy "contact inquiries admin delete"
  on public.contact_inquiries for delete
  to authenticated
  using (true);

create policy "workforce requests public insert"
  on public.workforce_requests for insert
  to anon, authenticated
  with check (true);

create policy "workforce requests admin read"
  on public.workforce_requests for select
  to authenticated
  using (true);

create policy "workforce requests admin update"
  on public.workforce_requests for update
  to authenticated
  using (true) with check (true);

create policy "workforce requests admin delete"
  on public.workforce_requests for delete
  to authenticated
  using (true);
