-- Sendy initial schema: markets, shops, bikes, reservations, storage

-- Extensions
create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null default '',
  role text not null check (role in ('rider', 'shop')) default 'rider',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Markets (curated destinations)
-- ---------------------------------------------------------------------------
create table public.markets (
  id text primary key,
  label text not null,
  trip_types text[] not null default '{}',
  delivery_available boolean not null default false
);

alter table public.markets enable row level security;

create policy "markets_public_read"
  on public.markets for select
  using (true);

insert into public.markets (id, label, trip_types, delivery_available) values
  ('moab', 'Moab, UT', array['Mountain', 'Gravel'], true),
  ('bend', 'Bend, OR', array['Gravel', 'Road'], false),
  ('boulder', 'Boulder, CO', array['Road', 'Mountain', 'Gravel'], true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Shops
-- ---------------------------------------------------------------------------
create table public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  market_id text references public.markets (id),
  shop_name text not null default '',
  shop_email text not null default '',
  address_line1 text not null default '',
  city text not null default '',
  state text not null default '',
  postal_code text not null default '',
  logo_url text not null default '',
  website_url text not null default '',
  support_phone text not null default '',
  service_area_notes text not null default '',
  payment_provider text not null default 'stripe' check (payment_provider in ('stripe', 'square')),
  payment_status text not null default 'not_connected'
    check (payment_status in ('not_connected', 'pending', 'connected', 'restricted')),
  payouts_enabled boolean not null default false,
  payment_account_label text not null default '',
  stripe_account_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id)
);

alter table public.shops enable row level security;

create policy "shops_select_own"
  on public.shops for select
  using (auth.uid() = owner_id);

create policy "shops_select_public_for_listings"
  on public.shops for select
  using (true);

create policy "shops_insert_own"
  on public.shops for insert
  with check (auth.uid() = owner_id);

create policy "shops_update_own"
  on public.shops for update
  using (auth.uid() = owner_id);

-- Auto-create profile (+ shop row for merchants) on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'rider');
  if user_role not in ('rider', 'shop') then
    user_role := 'rider';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    user_role
  );

  if user_role = 'shop' then
    insert into public.shops (owner_id, shop_email, shop_name)
    values (new.id, coalesce(new.email, ''), '');
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Bikes
-- ---------------------------------------------------------------------------
create table public.bikes (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  market_id text references public.markets (id),
  title text not null,
  brand text not null default '',
  model text not null default '',
  bike_type text not null check (bike_type in ('Road', 'Mountain', 'Gravel', 'E-Bike')),
  size text not null default '',
  description text not null default '',
  image_url text not null default '',
  photo_urls text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'inactive')),
  daily_rate numeric(10, 2) not null default 0,
  half_day_rate numeric(10, 2),
  weekly_rate numeric(10, 2) not null default 0,
  deposit numeric(10, 2) not null default 0,
  seasonal_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bikes_shop_id_idx on public.bikes (shop_id);
create index bikes_market_id_idx on public.bikes (market_id);
create index bikes_status_idx on public.bikes (status);

alter table public.bikes enable row level security;

create policy "bikes_public_read_active"
  on public.bikes for select
  using (status = 'active' or exists (
    select 1 from public.shops s
    where s.id = bikes.shop_id and s.owner_id = auth.uid()
  ));

create policy "bikes_insert_shop_owner"
  on public.bikes for insert
  with check (exists (
    select 1 from public.shops s
    where s.id = shop_id and s.owner_id = auth.uid()
  ));

create policy "bikes_update_shop_owner"
  on public.bikes for update
  using (exists (
    select 1 from public.shops s
    where s.id = bikes.shop_id and s.owner_id = auth.uid()
  ));

create policy "bikes_delete_shop_owner"
  on public.bikes for delete
  using (exists (
    select 1 from public.shops s
    where s.id = bikes.shop_id and s.owner_id = auth.uid()
  ));

-- ---------------------------------------------------------------------------
-- Blocked dates
-- ---------------------------------------------------------------------------
create table public.bike_blocked_dates (
  bike_id uuid not null references public.bikes (id) on delete cascade,
  blocked_date date not null,
  reason text not null default '',
  primary key (bike_id, blocked_date)
);

alter table public.bike_blocked_dates enable row level security;

create policy "blocked_dates_public_read"
  on public.bike_blocked_dates for select
  using (true);

create policy "blocked_dates_shop_write"
  on public.bike_blocked_dates for all
  using (exists (
    select 1 from public.bikes b
    join public.shops s on s.id = b.shop_id
    where b.id = bike_id and s.owner_id = auth.uid()
  ));

-- ---------------------------------------------------------------------------
-- Reservations
-- ---------------------------------------------------------------------------
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes (id),
  shop_id uuid not null references public.shops (id),
  rider_id uuid not null references public.profiles (id),
  start_date date not null,
  end_date date not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'confirmed', 'cancelled')),
  total_cents integer not null default 0,
  stripe_payment_intent_id text,
  delivery_mode text,
  add_ons jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index reservations_bike_id_idx on public.reservations (bike_id);
create index reservations_rider_id_idx on public.reservations (rider_id);
create index reservations_shop_id_idx on public.reservations (shop_id);

-- Prevent double-booking for active reservations
alter table public.reservations
  add constraint reservations_no_overlap
  exclude using gist (
    bike_id with =,
    daterange(start_date, end_date, '[]') with &&
  )
  where (status in ('pending_payment', 'confirmed'));

alter table public.reservations enable row level security;

create policy "reservations_select_rider"
  on public.reservations for select
  using (auth.uid() = rider_id);

create policy "reservations_select_shop"
  on public.reservations for select
  using (exists (
    select 1 from public.shops s
    where s.id = shop_id and s.owner_id = auth.uid()
  ));

create policy "reservations_insert_rider"
  on public.reservations for insert
  with check (auth.uid() = rider_id);

create policy "reservations_update_rider_own"
  on public.reservations for update
  using (auth.uid() = rider_id);

create policy "reservations_update_shop"
  on public.reservations for update
  using (exists (
    select 1 from public.shops s
    where s.id = shop_id and s.owner_id = auth.uid()
  ));

-- ---------------------------------------------------------------------------
-- Storage: bike photos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('bike-photos', 'bike-photos', true)
on conflict (id) do nothing;

create policy "bike_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'bike-photos');

create policy "bike_photos_authenticated_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'bike-photos'
    and auth.role() = 'authenticated'
  );

create policy "bike_photos_owner_update"
  on storage.objects for update
  using (bucket_id = 'bike-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "bike_photos_owner_delete"
  on storage.objects for delete
  using (bucket_id = 'bike-photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- ---------------------------------------------------------------------------
-- Seed demo shop bikes (optional — run after creating a shop in app)
-- ---------------------------------------------------------------------------
-- Demo seed is applied via supabase/seed.sql
