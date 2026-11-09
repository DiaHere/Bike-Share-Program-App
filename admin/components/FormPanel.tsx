"use client";

import { useEffect } from "react";
import ui from "./ui.module.css";

// Slide-out form used to add a station or a bike.
export default function FormPanel({
  title,
  submitLabel,
  onSubmit,
  onClose,
  children,
}: {
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className={ui.backdrop} onClick={onClose} aria-hidden="true" />
      <form
        className={ui.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-panel-title"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className={ui.panelHeader}>
          <h2 id="form-panel-title">{title}</h2>
        </div>
        <div className={ui.panelBody}>{children}</div>
        <div className={ui.panelFooter}>
          <button type="button" className={ui.secondary} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={ui.primary}>
            {submitLabel}
          </button>
        </div>
      </form>
    </>
  );
}
