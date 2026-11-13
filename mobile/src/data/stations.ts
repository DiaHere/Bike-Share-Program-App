import { supabase } from '@/lib/supabase';

export type Station = { id: string; name: string; availableBikes: number };

export type Bike = { id: string; number: string; stationId: string };

/** Which result the loader returns, so the team can preview every state. */
export type PreviewMode = 'normal' | 'empty' | 'offline';

export type StationsResult = { stations: Station[]; bikes: Bike[] };

/** Active stations with their live available count, and every available bike. */
export async function loadStations(mode: PreviewMode = 'normal'): Promise<StationsResult> {
  if (mode === 'offline') throw new Error('offline');
  if (mode === 'empty') return { stations: [], bikes: [] };

  const [stations, bikes] = await Promise.all([
    supabase.from('station_availability').select('id, name, available_bikes').eq('is_active', true).order('name'),
    supabase.from('bikes').select('id, number, station_id').eq('status', 'available').order('number'),
  ]);
  if (stations.error) throw stations.error;
  if (bikes.error) throw bikes.error;

  return {
    stations: stations.data.map((s) => ({ id: s.id, name: s.name, availableBikes: s.available_bikes })),
    bikes: bikes.data.map((b) => ({ id: b.id, number: b.number, stationId: b.station_id })),
  };
}
