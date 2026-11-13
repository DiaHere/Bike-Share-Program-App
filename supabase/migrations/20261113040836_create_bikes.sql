-- Sprint 3: bikes table, public reads, test-admin-only writes.
-- Available counts per station are computed from this table, never stored.

create table public.bikes (
  id uuid primary key default gen_random_uuid(),
  number text not null check (btrim(number) <> ''),
  station_id uuid references public.stations (id) on delete restrict,
  status text not null default 'available'
    check (status in ('available', 'in_use', 'maintenance', 'missing')),
  created_at timestamptz not null default now(),
  constraint bikes_station_required
    check (station_id is not null or status in ('in_use', 'missing'))
);

create unique index bikes_number_key on public.bikes (btrim(number));
create index bikes_station_id_idx on public.bikes (station_id);

alter table public.bikes enable row level security;

create policy "Anyone can read bikes"
  on public.bikes for select
  to anon, authenticated
  using (true);

create policy "Admins can add bikes"
  on public.bikes for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update bikes"
  on public.bikes for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- No delete policy: retire a bike by changing its status.
