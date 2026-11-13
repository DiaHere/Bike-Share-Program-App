"use client";

import { useState } from "react";
import { useData } from "@/components/DataProvider";
import FormPanel from "@/components/FormPanel";
import PageHeader from "@/components/PageHeader";
import RowMenu from "@/components/RowMenu";
import StatusBadge from "@/components/StatusBadge";
import ui from "@/components/ui.module.css";
import { BIKE_STATUSES, bikeStatusLabel, type Bike, type BikeStatus } from "@/lib/types";

type Draft = { number: string; stationId: string; status: BikeStatus };

const EMPTY_DRAFT: Draft = { number: "", stationId: "", status: "available" };

export default function BikesPage() {
  const { stations, bikes, loading, saveBike } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY_DRAFT);

  const activeStations = stations.filter((s) => s.isActive);
  const stationName = (id: string | null) => stations.find((s) => s.id === id)?.name ?? "No station";

  function toBike(id: string, d: Draft): Bike {
    return { id, number: d.number.trim(), stationId: d.stationId || null, status: d.status };
  }

  function startEdit(b: Bike) {
    setEditingId(b.id);
    setDraft({ number: b.number, stationId: b.stationId ?? "", status: b.status });
  }

  async function saveEdit(b: Bike) {
    if ((await saveBike(toBike(b.id, draft), false)).ok) setEditingId(null);
  }

  async function saveNew() {
    if ((await saveBike(toBike("", newDraft), true)).ok) {
      setAdding(false);
      setNewDraft(EMPTY_DRAFT);
    }
  }

  function stationOptions() {
    return (
      <>
        <option value="">No station</option>
        {activeStations.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </>
    );
  }

  return (
    <>
      <PageHeader current="bikes" addLabel="Add bike" onAdd={() => setAdding(true)} />
      <p className={ui.hint}>Double-click a row to edit it, or use the ⋯ options at the end of the row.</p>

      <div className={ui.card}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th scope="col">Bike number</th>
              <th scope="col">Station</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="visually-hidden">Options</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {bikes.length === 0 && (
              <tr>
                <td colSpan={4} className={ui.empty}>
                  {loading ? "Loading bikes…" : "No bikes yet. Add the first one."}
                </td>
              </tr>
            )}
            {bikes.map((b) => {
              const editing = editingId === b.id;
              return (
                <tr
                  key={b.id}
                  className={editing ? ui.editingRow : undefined}
                  onDoubleClick={() => !editing && startEdit(b)}
                  onKeyDown={(e) => {
                    if (!editing) return;
                    if (e.key === "Enter") saveEdit(b);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                >
                  <td className="tabular">
                    {editing ? (
                      <input
                        className={ui.cellInput}
                        aria-label="Bike number"
                        value={draft.number}
                        autoFocus
                        onChange={(e) => setDraft({ ...draft, number: e.target.value })}
                      />
                    ) : (
                      b.number
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <select
                        className={ui.cellInput}
                        aria-label="Station"
                        value={draft.stationId}
                        onChange={(e) => setDraft({ ...draft, stationId: e.target.value })}
                      >
                        {stationOptions()}
                      </select>
                    ) : (
                      stationName(b.stationId)
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <select
                        className={ui.cellInput}
                        aria-label="Status"
                        value={draft.status}
                        onChange={(e) => setDraft({ ...draft, status: e.target.value as BikeStatus })}
                      >
                        {BIKE_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge tone={b.status} label={bikeStatusLabel(b.status)} />
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <div className={ui.rowActions}>
                        <button type="button" className={ui.ghost} onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                        <button type="button" className={ui.primary} onClick={() => saveEdit(b)}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className={ui.rowActions}>
                        <RowMenu label={`bike ${b.number}`} items={[{ label: "Edit", onSelect: () => startEdit(b) }]} />
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
        <FormPanel title="Add bike" submitLabel="Add bike" onSubmit={saveNew} onClose={() => setAdding(false)}>
          <div className={ui.field}>
            <label htmlFor="bike-number">Bike number</label>
            <input
              id="bike-number"
              value={newDraft.number}
              autoFocus
              onChange={(e) => setNewDraft({ ...newDraft, number: e.target.value })}
              placeholder="09"
            />
            <span className={ui.fieldHint}>The short number painted on the bike.</span>
          </div>
          <div className={ui.field}>
            <label htmlFor="bike-station">Station</label>
            <select
              id="bike-station"
              value={newDraft.stationId}
              onChange={(e) => setNewDraft({ ...newDraft, stationId: e.target.value })}
            >
              {stationOptions()}
            </select>
            <span className={ui.fieldHint}>Only active stations are listed.</span>
          </div>
          <div className={ui.field}>
            <label htmlFor="bike-status">Status</label>
            <select
              id="bike-status"
              value={newDraft.status}
              onChange={(e) => setNewDraft({ ...newDraft, status: e.target.value as BikeStatus })}
            >
              {BIKE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </FormPanel>
      )}
    </>
  );
}
