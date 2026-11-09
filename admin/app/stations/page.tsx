"use client";

import { useState } from "react";
import AlertDialog from "@/components/AlertDialog";
import { useData } from "@/components/DataProvider";
import FormPanel from "@/components/FormPanel";
import PageHeader from "@/components/PageHeader";
import RowMenu from "@/components/RowMenu";
import StatusBadge from "@/components/StatusBadge";
import ui from "@/components/ui.module.css";
import { availableCount } from "@/lib/sample-data";
import type { Station } from "@/lib/types";

type Draft = { name: string; latitude: string; longitude: string; capacity: string };

const EMPTY_DRAFT: Draft = { name: "", latitude: "", longitude: "", capacity: "" };

function toDraft(s: Station): Draft {
  return { name: s.name, latitude: String(s.latitude), longitude: String(s.longitude), capacity: String(s.capacity) };
}

function fromDraft(base: Pick<Station, "id" | "isActive">, d: Draft): Station {
  return {
    ...base,
    name: d.name.trim(),
    latitude: Number.parseFloat(d.latitude),
    longitude: Number.parseFloat(d.longitude),
    capacity: Number(d.capacity),
  };
}

function nextStationId(stations: Station[]): string {
  const max = stations.reduce((m, s) => Math.max(m, Number(s.id.replace(/\D/g, "")) || 0), 0);
  return `ST-${String(max + 1).padStart(2, "0")}`;
}

export default function StationsPage() {
  const { stations, bikes, saveStation, setStationActive } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY_DRAFT);
  const [blocked, setBlocked] = useState<Station | null>(null);

  function startEdit(s: Station) {
    setEditingId(s.id);
    setDraft(toDraft(s));
  }

  function saveEdit(s: Station) {
    if (saveStation(fromDraft(s, draft), false).ok) setEditingId(null);
  }

  function deactivate(s: Station) {
    if (availableCount(bikes, s.id) > 0) {
      setBlocked(s);
      return;
    }
    setStationActive(s.id, false);
  }

  function saveNew() {
    const station = fromDraft({ id: nextStationId(stations), isActive: true }, newDraft);
    if (saveStation(station, true).ok) {
      setAdding(false);
      setNewDraft(EMPTY_DRAFT);
    }
  }

  return (
    <>
      <PageHeader current="stations" addLabel="Add station" onAdd={() => setAdding(true)} />
      <p className={ui.hint}>Double-click a row to edit it, or use the ⋯ options at the end of the row.</p>

      <div className={ui.card}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th scope="col">Station ID</th>
              <th scope="col">Name</th>
              <th scope="col" className={ui.num}>Available bikes</th>
              <th scope="col" className={ui.num}>Capacity</th>
              <th scope="col">Latitude</th>
              <th scope="col">Longitude</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="visually-hidden">Options</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {stations.length === 0 && (
              <tr>
                <td colSpan={8} className={ui.empty}>
                  No stations yet. Add the first one.
                </td>
              </tr>
            )}
            {stations.map((s) => {
              const editing = editingId === s.id;
              const available = availableCount(bikes, s.id);
              return (
                <tr
                  key={s.id}
                  className={`${!s.isActive ? ui.inactiveRow : ""} ${editing ? ui.editingRow : ""}`}
                  onDoubleClick={() => !editing && startEdit(s)}
                  onKeyDown={(e) => {
                    if (!editing) return;
                    if (e.key === "Enter") saveEdit(s);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                >
                  <td className="tabular">{s.id}</td>
                  <td>
                    {editing ? (
                      <input
                        className={ui.cellInput}
                        aria-label="Name"
                        value={draft.name}
                        autoFocus
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      />
                    ) : (
                      s.name
                    )}
                  </td>
                  <td className={`${ui.num} tabular`}>
                    {available} of {s.capacity}
                  </td>
                  <td className={`${ui.num} tabular`}>
                    {editing ? (
                      <input
                        className={`${ui.cellInput} ${ui.cellInputTiny}`}
                        aria-label="Capacity"
                        inputMode="numeric"
                        value={draft.capacity}
                        onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
                      />
                    ) : (
                      s.capacity
                    )}
                  </td>
                  <td className="tabular">
                    {editing ? (
                      <input
                        className={`${ui.cellInput} ${ui.cellInputNum}`}
                        aria-label="Latitude"
                        inputMode="decimal"
                        value={draft.latitude}
                        onChange={(e) => setDraft({ ...draft, latitude: e.target.value })}
                      />
                    ) : (
                      s.latitude.toFixed(4)
                    )}
                  </td>
                  <td className="tabular">
                    {editing ? (
                      <input
                        className={`${ui.cellInput} ${ui.cellInputNum}`}
                        aria-label="Longitude"
                        inputMode="decimal"
                        value={draft.longitude}
                        onChange={(e) => setDraft({ ...draft, longitude: e.target.value })}
                      />
                    ) : (
                      s.longitude.toFixed(4)
                    )}
                  </td>
                  <td>
                    <StatusBadge tone={s.isActive ? "active" : "inactive"} label={s.isActive ? "Active" : "Inactive"} />
                  </td>
                  <td>
                    {editing ? (
                      <div className={ui.rowActions}>
                        <button type="button" className={ui.ghost} onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                        <button type="button" className={ui.primary} onClick={() => saveEdit(s)}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className={ui.rowActions}>
                        <RowMenu
                          label={s.name}
                          items={[
                            { label: "Edit", onSelect: () => startEdit(s) },
                            s.isActive
                              ? { label: "Deactivate", onSelect: () => deactivate(s), danger: true }
                              : { label: "Reactivate", onSelect: () => setStationActive(s.id, true) },
                          ]}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {adding && (
        <FormPanel
          title="Add station"
          submitLabel="Add station"
          onSubmit={saveNew}
          onClose={() => setAdding(false)}
        >
          <div className={ui.field}>
            <label htmlFor="station-name">Name</label>
            <input
              id="station-name"
              value={newDraft.name}
              autoFocus
              onChange={(e) => setNewDraft({ ...newDraft, name: e.target.value })}
              placeholder="Olin Hall"
            />
          </div>
          <div className={ui.fieldRow}>
            <div className={ui.field}>
              <label htmlFor="station-lat">Latitude</label>
              <input
                id="station-lat"
                inputMode="decimal"
                value={newDraft.latitude}
                onChange={(e) => setNewDraft({ ...newDraft, latitude: e.target.value })}
                placeholder="46.0711"
              />
            </div>
            <div className={ui.field}>
              <label htmlFor="station-lng">Longitude</label>
              <input
                id="station-lng"
                inputMode="decimal"
                value={newDraft.longitude}
                onChange={(e) => setNewDraft({ ...newDraft, longitude: e.target.value })}
                placeholder="-118.3305"
              />
            </div>
          </div>
          <p className={ui.fieldHint}>Tip: right-click the spot in Google Maps and copy the two numbers.</p>
          <div className={ui.field}>
            <label htmlFor="station-capacity">Capacity</label>
            <input
              id="station-capacity"
              inputMode="numeric"
              value={newDraft.capacity}
              onChange={(e) => setNewDraft({ ...newDraft, capacity: e.target.value })}
              placeholder="8"
            />
            <span className={ui.fieldHint}>How many bikes the rack holds.</span>
          </div>
        </FormPanel>
      )}

      {blocked && (
        <AlertDialog
          title={`Can't deactivate ${blocked.name}`}
          message="You cannot deactivate a station with available bikes. Move the bikes to a different station before deactivating."
          onClose={() => setBlocked(null)}
        />
      )}
    </>
  );
}
