-- Sprint 2 (#2, #4): stations table, public reads, test-admin-only writes.

create table public.stations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> ''),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  capacity integer not null check (capacity > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index stations_name_key on public.stations (lower(btrim(name)));

alter table public.stations enable row level security;

create policy "Anyone can read stations"
  on public.stations for select
  to anon, authenticated
  using (true);

-- Admins are Supabase Auth users with app_metadata.role = 'admin'.
-- Users cannot edit app_metadata themselves. Sprint 4 replaces this with users.role.
create policy "Admins can add stations"
  on public.stations for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update stations"
  on public.stations for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- No delete policy: stations are deactivated with is_active, never deleted.
