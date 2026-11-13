"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Bike, Station, StationInput } from "@/lib/types";
import Toast, { type ToastState } from "./Toast";

// Stations and bikes come from Supabase. The checks below give friendly messages;
// the database constraints and row-level security are the real guard.

type SaveResult = { ok: true } | { ok: false; message: string };

type DataContextValue = {
  stations: Station[];
  bikes: Bike[];
  loading: boolean;
  saveStation: (station: StationInput, isNew: boolean) => Promise<SaveResult>;
  saveBike: (bike: Bike, isNew: boolean) => Promise<SaveResult>;
  setStationActive: (id: string, isActive: boolean) => Promise<void>;
  showSaved: () => void;
  showFailed: (message?: string) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const value = useContext(DataContext);
  if (!value) throw new Error("useData must be used inside DataProvider");
  return value;
}

function validateStation(station: StationInput, stations: Station[]): string | null {
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

async function fetchAll(): Promise<{ stations: Station[]; bikes: Bike[] }> {
  const [stations, bikes] = await Promise.all([
    // Active stations first, then by name.
    supabase.from("station_availability").select("*").order("is_active", { ascending: false }).order("name"),
    supabase.from("bikes").select("id, number, station_id, status").order("number"),
  ]);
  if (stations.error) throw stations.error;
  if (bikes.error) throw bikes.error;
  return {
    stations: stations.data.map((s) => ({
      id: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      capacity: s.capacity,
      isActive: s.is_active,
      availableBikes: s.available_bikes,
    })),
    bikes: bikes.data.map((b) => ({ id: b.id, number: b.number, stationId: b.station_id, status: b.status })),
  };
}

function saveErrorMessage(error: { code?: string }): string {
  if (error.code === "23505") return "That name or number is already in use.";
  if (error.code === "42501") return "Only admins can make changes.";
  return "Could not reach the database. Check your connection and try again.";
}

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: ToastState) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(next);
    timer.current = setTimeout(() => setToast(null), next.kind === "saved" ? 2500 : 5000);
  }, []);

  const showSaved = useCallback(() => show({ kind: "saved" }), [show]);
  const showFailed = useCallback((message?: string) => show({ kind: "failed", message }), [show]);

  const reload = useCallback(async () => {
    try {
      const data = await fetchAll();
      setStations(data.stations);
      setBikes(data.bikes);
    } catch {
      show({ kind: "failed", message: "Could not load stations and bikes. Reload the page to try again." });
    }
    setLoading(false);
  }, [show]);

  useEffect(() => {
    let cancelled = false;
    fetchAll().then(
      (data) => {
        if (cancelled) return;
        setStations(data.stations);
        setBikes(data.bikes);
        setLoading(false);
      },
      () => {
        if (cancelled) return;
        show({ kind: "failed", message: "Could not load stations and bikes. Reload the page to try again." });
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [show]);

  // Every save goes to the database, then the tables reload so counts stay correct.
  const finish = useCallback(
    async (error: { code?: string } | null): Promise<SaveResult> => {
      if (error) {
        const message = saveErrorMessage(error);
        showFailed(message);
        return { ok: false, message };
      }
      await reload();
      showSaved();
      return { ok: true };
    },
    [reload, showFailed, showSaved],
  );

  const saveStation = useCallback(
    async (station: StationInput, isNew: boolean): Promise<SaveResult> => {
      const invalid = validateStation(station, stations);
      if (invalid) {
        showFailed(invalid);
        return { ok: false, message: invalid };
      }
      const row = {
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude,
        capacity: station.capacity,
        is_active: station.isActive,
      };
      const { error } = isNew
        ? await supabase.from("stations").insert(row)
        : await supabase.from("stations").update(row).eq("id", station.id);
      return finish(error);
    },
    [stations, showFailed, finish],
  );

  const saveBike = useCallback(
    async (bike: Bike, isNew: boolean): Promise<SaveResult> => {
      const invalid = validateBike(bike, bikes);
      if (invalid) {
        showFailed(invalid);
        return { ok: false, message: invalid };
      }
      const row = { number: bike.number, station_id: bike.stationId, status: bike.status };
      const { error } = isNew
        ? await supabase.from("bikes").insert(row)
        : await supabase.from("bikes").update(row).eq("id", bike.id);
      return finish(error);
    },
    [bikes, showFailed, finish],
  );

  const setStationActive = useCallback(
    async (id: string, isActive: boolean) => {
      const { error } = await supabase.from("stations").update({ is_active: isActive }).eq("id", id);
      await finish(error);
    },
    [finish],
  );

  return (
    <DataContext.Provider
      value={{ stations, bikes, loading, saveStation, saveBike, setStationActive, showSaved, showFailed }}
    >
      {children}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </DataContext.Provider>
  );
}
