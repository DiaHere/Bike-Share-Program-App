"use client";

import { useEffect, useRef, useState } from "react";
import ui from "./ui.module.css";

export type RowMenuItem = { label: string; onSelect: () => void; danger?: boolean };

// The options button at the end of each row.
export default function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
  // The menu is placed with fixed coordinates so the table card's scroll area can't clip it.
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const open = pos !== null;
  const setOpen = (next: false) => setPos(next || null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onScroll() {
      setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  return (
    <div className={ui.menuWrap} ref={ref}>
      <button
        type="button"
        className={ui.menuButton}
        aria-label={`Options for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos(open ? null : { top: rect.bottom + 4, right: window.innerWidth - rect.right });
        }}
      >
        ⋯
      </button>
      {open && (
        <ul className={ui.menu} role="menu" style={pos}>
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={`${ui.menuItem} ${item.danger ? ui.menuItemDanger : ""}`}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
