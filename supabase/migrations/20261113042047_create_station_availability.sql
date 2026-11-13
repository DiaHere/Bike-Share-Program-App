-- Read-only view: every station with its live count of available bikes.
-- The count is computed from bikes on each read, never stored.
-- security_invoker makes the view follow the RLS policies of stations and bikes.

create view public.station_availability
with (security_invoker = on) as
select
  s.*,
  (count(b.id) filter (where b.status = 'available'))::integer as available_bikes
from public.stations s
left join public.bikes b on b.station_id = s.id
group by s.id;

grant select on public.station_availability to anon, authenticated;
