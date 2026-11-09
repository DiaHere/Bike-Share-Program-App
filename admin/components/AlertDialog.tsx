"use client";

import { useEffect, useRef } from "react";
import ui from "./ui.module.css";

// Blocking warning with a single OK button.
export default function AlertDialog({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    okRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className={ui.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={ui.dialog} role="alertdialog" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-message">
        <h2 id="alert-title">{title}</h2>
        <p id="alert-message">{message}</p>
        <div className={ui.dialogActions}>
          <button type="button" className={ui.primary} onClick={onClose} ref={okRef}>
            OK
          </button>
        </div>
      </div>
    </>
  );
}
