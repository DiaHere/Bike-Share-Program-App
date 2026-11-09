"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { sampleBikes, sampleStations } from "@/lib/sample-data";
import type { Bike, Station } from "@/lib/types";
import Toast, { type ToastState } from "./Toast";

// Interface only: data lives in memory and resets on reload.
// Sprints 2 and 3 swap these functions for Supabase calls.

type SaveResult = { ok: true } | { ok: false; message: string };

type DataContextValue = {
  stations: Station[];
  bikes: Bike[];
  saveStation: (station: Station, isNew: boolean) => SaveResult;
  saveBike: (bike: Bike, isNew: boolean) => SaveResult;
  setStationActive: (id: string, isActive: boolean) => void;
  showSaved: () => void;
  showFailed: (message?: string) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const value = useContext(DataContext);
  if (!value) throw new Error("useData must be used inside DataProvider");
  return value;
}

function validateStation(station: Station, stations: Station[]): string | null {
  if (!station.name.trim()) return "Station name is required.";
  if (stations.some((s) => s.id !== station.id && s.name.trim().toLowerCase() === station.name.trim().toLowerCase())) {
    return "A station with that name already exists.";
  }
  if (!Number.isFinite(station.latitude) || station.latitude < 45.9 || station.latitude > 46.2) {
    return "Latitude should be near Walla Walla (about 46.07).";
  }
  if (!Number.isFinite(station.longitude) || station.longitude < -118.5 || station.longitude > -118.2) {
    return "Longitude should be near Walla Walla (about -118.33).";
  }
  if (!Number.isInteger(station.capacity) || station.capacity < 1) return "Capacity must be a whole number of 1 or more.";
  return null;
}

function validateBike(bike: Bike, bikes: Bike[]): string | null {
  if (!bike.number.trim()) return "Bike number is required.";
  if (bikes.some((b) => b.id !== bike.id && b.number.trim() === bike.number.trim())) {
    return `Bike ${bike.number} already exists.`;
  }
  if (bike.status !== "in_use" && bike.status !== "missing" && !bike.stationId) {
    return "Choose a station for this bike.";
  }
  return null;
}

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = useState<Station[]>(sampleStations);
  const [bikes, setBikes] = useState<Bike[]>(sampleBikes);
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: ToastState) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(next);
    timer.current = setTimeout(() => setToast(null), next.kind === "saved" ? 2500 : 5000);
  }, []);

  const showSaved = useCallback(() => show({ kind: "saved" }), [show]);
  const showFailed = useCallback((message?: string) => show({ kind: "failed", message }), [show]);

  const saveStation = useCallback(
    (station: Station, isNew: boolean): SaveResult => {
      const error = validateStation(station, stations);
      if (error) {
        showFailed(error);
        return { ok: false, message: error };
      }
      setStations((prev) => (isNew ? [...prev, station] : prev.map((s) => (s.id === station.id ? station : s))));
      showSaved();
      return { ok: true };
    },
    [stations, showFailed, showSaved],
  );

  const saveBike = useCallback(
    (bike: Bike, isNew: boolean): SaveResult => {
      const error = validateBike(bike, bikes);
      if (error) {
        showFailed(error);
        return { ok: false, message: error };
      }
      setBikes((prev) => (isNew ? [...prev, bike] : prev.map((b) => (b.id === bike.id ? bike : b))));
      showSaved();
      return { ok: true };
    },
    [bikes, showFailed, showSaved],
  );

  const setStationActive = useCallback(
    (id: string, isActive: boolean) => {
      setStations((prev) => prev.map((s) => (s.id === id ? { ...s, isActive } : s)));
      showSaved();
    },
    [showSaved],
  );

  return (
    <DataContext.Provider value={{ stations, bikes, saveStation, saveBike, setStationActive, showSaved, showFailed }}>
      {children}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </DataContext.Provider>
  );
}
