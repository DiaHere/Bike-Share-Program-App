import type { Bike, Station } from "./types";

// Sample data for the interface only. Sprint 2 replaces stations, and
// Sprint 3 replaces bikes, with rows from Supabase.
export const sampleStations: Station[] = [
  { id: "ST-01", name: "Olin Hall", latitude: 46.0711, longitude: -118.3305, capacity: 8, isActive: true },
  { id: "ST-02", name: "Cleveland Commons", latitude: 46.0698, longitude: -118.3327, capacity: 6, isActive: true },
  { id: "ST-03", name: "Penrose Library", latitude: 46.0703, longitude: -118.3291, capacity: 6, isActive: true },
  { id: "ST-04", name: "Reid Campus Center", latitude: 46.0716, longitude: -118.3281, capacity: 8, isActive: false },
];

export const sampleBikes: Bike[] = [
  { id: "b1", number: "01", stationId: "ST-01", status: "available" },
  { id: "b2", number: "02", stationId: "ST-01", status: "available" },
  { id: "b3", number: "03", stationId: "ST-01", status: "available" },
  { id: "b4", number: "04", stationId: "ST-01", status: "maintenance" },
  { id: "b5", number: "05", stationId: "ST-02", status: "available" },
  { id: "b6", number: "06", stationId: "ST-02", status: "available" },
  { id: "b7", number: "07", stationId: null, status: "in_use" },
  { id: "b8", number: "08", stationId: "ST-03", status: "missing" },
];

/** A bike counts as available only when its status is Available and it is at that station. */
export function availableCount(bikes: Bike[], stationId: string): number {
  return bikes.filter((b) => b.stationId === stationId && b.status === "available").length;
}
