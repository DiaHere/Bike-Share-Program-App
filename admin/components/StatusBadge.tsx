import ui from "./ui.module.css";

const COLORS = {
  available: "var(--color-status-available)",
  in_use: "var(--color-status-in-use)",
  maintenance: "var(--color-status-maintenance)",
  missing: "var(--color-status-alert)",
  active: "var(--color-status-available)",
  inactive: "var(--color-status-inactive)",
} as const;

export default function StatusBadge({ tone, label }: { tone: keyof typeof COLORS; label: string }) {
  return (
    <span className={ui.badge} style={{ color: COLORS[tone] }}>
      {label}
    </span>
  );
}
