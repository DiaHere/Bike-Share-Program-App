-- Sprint 2 (#3): two test stations. Safe to rerun; existing names are skipped.

insert into public.stations (name, latitude, longitude, capacity, is_active)
values
  ('Test Station: Olin Hall', 46.0711, -118.3305, 8, true),
  ('Test Station: Penrose Library', 46.0703, -118.3291, 6, true)
on conflict do nothing;
