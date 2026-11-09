"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./AdminShell.module.css";

// Sidebar from the sketch: Dashboard, Stations and bikes, Reports.
// Dashboard and Reports are placeholders until their sprints (9 and 8).
const NAV = [
  { label: "Dashboard", href: null, note: "Soon" },
  { label: "Stations & bikes", href: "/stations", match: ["/stations", "/bikes"] },
  { label: "Reports", href: null, note: "Soon" },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`} aria-label="Main">
        <div className={styles.brand}>Whitman Bike Share</div>
        <nav>
          <ul className={styles.nav}>
            {NAV.map((item) => {
              if (!item.href) {
                return (
                  <li key={item.label}>
                    <span className={`${styles.link} ${styles.disabled}`} aria-disabled="true">
                      {item.label}
                      <span className={styles.soon}>{item.note}</span>
                    </span>
                  </li>
                );
              }
              const active = item.match.some((m) => pathname.startsWith(m));
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`${styles.link} ${active ? styles.active : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {open && <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className={styles.main}>
        <div className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
          <span className={styles.admin}>Test admin</span>
        </div>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
