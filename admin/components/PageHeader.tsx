"use client";

import { useRouter } from "next/navigation";
import ui from "./ui.module.css";

// The "Stations or Bikes" dropdown from the sketch, with the page's Add button on the right.
export default function PageHeader({
  current,
  addLabel,
  onAdd,
}: {
  current: "stations" | "bikes";
  addLabel: string;
  onAdd: () => void;
}) {
  const router = useRouter();
  return (
    <div className={ui.header}>
      <h1>
        <label htmlFor="table-switch" className="visually-hidden">
          Show table
        </label>
        <select
          id="table-switch"
          className={ui.switch}
          value={current}
          onChange={(e) => router.push(`/${e.target.value}`)}
        >
          <option value="stations">Stations</option>
          <option value="bikes">Bikes</option>
        </select>
      </h1>
      <button type="button" className={ui.primary} onClick={onAdd}>
        <span aria-hidden="true">+</span> {addLabel}
      </button>
    </div>
  );
}
