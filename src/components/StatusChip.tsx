import type { JobStatus } from "../types";
import { statusLabel } from "../utils/format";

const styles: Record<JobStatus, string> = {
  open: "text-[var(--color-signal-open)] bg-[var(--color-signal-open-bg)]",
  urgent: "text-[var(--color-signal-urgent)] bg-[var(--color-signal-urgent-bg)]",
  new: "text-[var(--color-signal-new)] bg-[var(--color-signal-new-bg)]",
  closed: "text-[var(--color-signal-closed)] bg-[var(--color-signal-closed-bg)]",
};

export default function StatusChip({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-medium uppercase tracking-wide ${styles[status]}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "currentColor" }}
        aria-hidden
      />
      {statusLabel(status)}
    </span>
  );
}
