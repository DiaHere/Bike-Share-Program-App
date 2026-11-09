// Sample data for the interface only. Sprint 2 loads stations, and
// Sprint 3 loads bikes, from Supabase instead.

export type Station = { id: string; name: string; isActive: boolean };

export type BikeStatus = 'available' | 'in_use' | 'maintenance' | 'missing';

export type Bike = { id: string; number: string; stationId: string | null; status: BikeStatus };

const stations: Station[] = [
  { id: 'ST-01', name: 'Olin Hall', isActive: true },
  { id: 'ST-02', name: 'Cleveland Commons', isActive: true },
  { id: 'ST-03', name: 'Penrose Library', isActive: true },
  { id: 'ST-05', name: 'Hall of Science', isActive: true },
  { id: 'ST-04', name: 'Reid Campus Center', isActive: false },
];

const bikes: Bike[] = [
  { id: 'b1', number: '01', stationId: 'ST-01', status: 'available' },
  { id: 'b2', number: '02', stationId: 'ST-01', status: 'available' },
  { id: 'b3', number: '03', stationId: 'ST-01', status: 'available' },
  { id: 'b4', number: '04', stationId: 'ST-01', status: 'maintenance' },
  { id: 'b5', number: '05', stationId: 'ST-02', status: 'available' },
  { id: 'b6', number: '06', stationId: 'ST-02', status: 'available' },
  { id: 'b7', number: '07', stationId: null, status: 'in_use' },
  { id: 'b8', number: '08', stationId: 'ST-03', status: 'missing' },
  { id: 'b9', number: '09', stationId: 'ST-05', status: 'available' },
  { id: 'b10', number: '10', stationId: 'ST-05', status: 'available' },
  { id: 'b11', number: '11', stationId: 'ST-05', status: 'available' },
  { id: 'b12', number: '12', stationId: 'ST-05', status: 'available' },
  { id: 'b13', number: '13', stationId: 'ST-05', status: 'available' },
  { id: 'b14', number: '14', stationId: 'ST-05', status: 'available' },
];

/** Which result the fake loader returns, so the team can preview every state. */
export type PreviewMode = 'normal' | 'empty' | 'offline';

export type StationsResult = { stations: Station[]; bikes: Bike[] };

export async function loadStations(mode: PreviewMode = 'normal'): Promise<StationsResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (mode === 'offline') throw new Error('offline');
  if (mode === 'empty') return { stations: [], bikes: [] };
  // Students only see active stations.
  return { stations: stations.filter((s) => s.isActive), bikes };
}

/** A bike counts as available only when its status is Available and it is at that station. */
export function availableBikes(bikes: Bike[], stationId: string): Bike[] {
  return bikes.filter((b) => b.stationId === stationId && b.status === 'available');
}
