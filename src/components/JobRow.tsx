import { Bookmark, MapPin } from "lucide-react";
import type { Job } from "../types";
import { formatSalary, relativeTime } from "../utils/format";
import StatusChip from "./StatusChip";

interface Props {
  job: Job;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}

export default function JobRow({ job, saved, onOpen, onToggleSave }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className="row-settle group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[var(--color-line)] px-4 py-3.5 transition hover:bg-[var(--color-panel)] sm:grid-cols-[72px_1.6fr_1fr_auto_auto_auto] sm:px-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cta)] focus-visible:-outline-offset-2"
    >
      <span className="hidden font-mono text-xs text-[var(--color-muted)] sm:block">
        {job.code}
      </span>

      <div className="min-w-0">
        <p className="truncate font-[var(--font-display)] text-[15px] font-semibold text-[var(--color-ink)]">
          {job.title}
        </p>
        <p className="truncate text-sm text-[var(--color-muted)]">
          {job.company} · {job.type} · {job.level}
        </p>
        <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
          {job.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded bg-[var(--color-panel)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden text-sm text-[var(--color-muted)] sm:flex sm:items-center sm:gap-1">
        <MapPin size={13} />
        {job.remote ? "Remote" : job.location}
      </div>

      <div className="hidden font-mono text-xs text-[var(--color-ink)] sm:block">
        {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
      </div>

      <div className="hidden sm:block">
        <StatusChip status={job.status} />
      </div>

      <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="hidden font-mono text-[11px] text-[var(--color-muted)] sm:inline">
          {relativeTime(job.postedAt)}
        </span>
        <button
          type="button"
          aria-label={saved ? "Remove from saved jobs" : "Save this job"}
          aria-pressed={saved}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className="rounded-md p-1.5 text-[var(--color-muted)] transition hover:bg-[var(--color-board)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cta)]"
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="col-span-3 mt-1 flex items-center gap-2 sm:hidden">
        <StatusChip status={job.status} />
        <span className="font-mono text-[11px] text-[var(--color-muted)]">
          {relativeTime(job.postedAt)}
        </span>
      </div>
    </div>
  );
}
