"use client";

import styles from "./Toast.module.css";

export type ToastState = { kind: "saved" } | { kind: "failed"; message?: string };

// Top-right message after every action: "Saved" with a check, or "Saving failed" with an X.
export default function Toast({ toast, onClose }: { toast: ToastState | null; onClose: () => void }) {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toast && (
        <div className={`${styles.toast} ${toast.kind === "saved" ? styles.saved : styles.failed}`}>
          <span className={styles.icon} aria-hidden="true">
            {toast.kind === "saved" ? "✓" : "✕"}
          </span>
          <div>
            <strong>{toast.kind === "saved" ? "Saved" : "Saving failed"}</strong>
            {toast.kind === "failed" && toast.message && <p className={styles.message}>{toast.message}</p>}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
