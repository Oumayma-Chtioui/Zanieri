-- ============================================================================
-- Zanieri — Database schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE where possible.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  icon text not null default 'Shirt',      -- Lucide icon component name
  display_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  category text not null,                  -- matches categories.slug (free text, not FK)
  price numeric(10, 2) not null default 0,
  old_price numeric(10, 2),
  fabric text,
  fit text,
  sizes text[] not null default '{}',
  image_url text,
  gallery text[] not null default '{}',
  badge text,
  rating numeric(2, 1) not null default 0,
  reviews_count integer not null default 0,
  stock integer not null default 0,
  description text,
  is_featured boolean not null default false,
  promotion_start date,
  promotion_end date,
  promotion_label text,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_is_featured_idx on products (is_featured);

-- ---------------------------------------------------------------------------
-- store_settings (single row, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists store_settings (
  id integer primary key default 1,
  store_name text not null default 'Zanieri',
  phone text,
  email text,
  address text,
  facebook text,
  instagram text,
  whatsapp text,
  opening_hours text,
  delivery_fee numeric(10, 2) not null default 0,
  minimum_order numeric(10, 2) not null default 0,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  google_rating numeric(2, 1),
  google_rating_count integer,
  google_maps_url text,
  constraint store_settings_single_row check (id = 1)
);

-- ---------------------------------------------------------------------------
-- stores (physical locations / points of sale)
-- ---------------------------------------------------------------------------
create table if not exists stores (
  id bigint generated always as identity primary key,
  name text not null,
  address text,
  phone text,
  opening_hours text,
  maps_url text,
  display_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id bigint generated always as identity primary key,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_approved_idx on reviews (approved);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table store_settings enable row level security;
alter table stores enable row level security;
alter table reviews enable row level security;

-- Public (anon) read access — storefront only ever reads through these.
drop policy if exists "Public read categories" on categories;
create policy "Public read categories" on categories for select using (true);

drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (true);

drop policy if exists "Public read store_settings" on store_settings;
create policy "Public read store_settings" on store_settings for select using (true);

drop policy if exists "Public read stores" on stores;
create policy "Public read stores" on stores for select using (true);

drop policy if exists "Public read approved reviews" on reviews;
create policy "Public read approved reviews" on reviews for select using (approved = true);

-- Public insert on reviews — anyone can submit a review, but it must land
-- as unapproved; moderation happens in /admin/reviews.
drop policy if exists "Public insert reviews" on reviews;
create policy "Public insert reviews" on reviews for insert with check (approved = false);

-- Authenticated (admin) full access — the admin panel is gated by
-- Supabase Auth, so any signed-in user has full CRUD. If you need
-- multiple admin accounts with different roles later, tighten these
-- policies with a role check instead of `authenticated`.
drop policy if exists "Admin manage categories" on categories;
create policy "Admin manage categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin manage products" on products;
create policy "Admin manage products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin manage store_settings" on store_settings;
create policy "Admin manage store_settings" on store_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin manage stores" on stores;
create policy "Admin manage stores" on stores for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin manage reviews" on reviews;
create policy "Admin manage reviews" on reviews for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- Default row for store_settings so the storefront has sane fallbacks
-- before the admin fills in real info.
-- ============================================================================
insert into store_settings (id, store_name, hero_title, hero_subtitle)
values (
  1,
  'Zanieri',
  'L''élégance masculine, taillée pour la Tunisie.',
  'Costumes, chemises et pièces sur-mesure — commandez en un message.'
)
on conflict (id) do nothing;

-- ============================================================================
-- Starter categories (menswear)
-- ============================================================================
insert into categories (slug, name, icon, display_order) values
  ('costumes',   'Costumes',        'Briefcase', 1),
  ('blazers',    'Blazers',         'Layers',    2),
  ('chemises',   'Chemises',        'Shirt',     3),
  ('pantalons',  'Pantalons',       'Ruler',     4),
  ('mailles',    'Pulls & Gilets',  'Snowflake', 5),
  ('accessoires','Accessoires',     'Watch',     6)
on conflict (slug) do nothing;
