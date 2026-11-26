-- Sprint 2 (#3): two test stations. Safe to rerun; existing names are skipped.

insert into public.stations (name, latitude, longitude, capacity, is_active)
values
  ('Test Station: Olin Hall', 46.0711, -118.3305, 8, true),
  ('Test Station: Penrose Library', 46.0703, -118.3291, 6, true)
on conflict do nothing;

-- Sprint 3 (#19): test bikes at both stations. Existing bike numbers are skipped.
insert into public.bikes (number, station_id, status)
select seed.number, stations.id, seed.status
from (values
  ('TEST-OLIN-01', 'Test Station: Olin Hall', 'available'),
  ('TEST-OLIN-02', 'Test Station: Olin Hall', 'maintenance'),
  ('TEST-PENROSE-01', 'Test Station: Penrose Library', 'available'),
  ('TEST-PENROSE-02', 'Test Station: Penrose Library', 'maintenance')
) as seed(number, station_name, status)
join public.stations as stations
  on lower(btrim(stations.name)) = lower(btrim(seed.station_name))
on conflict do nothing;
