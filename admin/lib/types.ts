export type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  isActive: boolean;
};

export type BikeStatus = "available" | "in_use" | "maintenance" | "missing";

export type Bike = {
  id: string;
  /** Short number painted on the bike, such as "07". */
  number: string;
  stationId: string | null;
  status: BikeStatus;
};

export const BIKE_STATUSES: { value: BikeStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "in_use", label: "In use" },
  { value: "maintenance", label: "Maintenance" },
  { value: "missing", label: "Missing" },
];

export function bikeStatusLabel(status: BikeStatus): string {
  return BIKE_STATUSES.find((s) => s.value === status)?.label ?? status;
}
