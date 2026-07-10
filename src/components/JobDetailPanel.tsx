import { Bookmark, MapPin, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Job } from "../types";
import { formatSalary, relativeTime } from "../utils/format";
import StatusChip from "./StatusChip";

interface Props {
  job: Job | null;
  saved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  onApply: () => void;
}

export default function JobDetailPanel({ job, saved, onClose, onToggleSave, onApply }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!job) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [job, onClose]);

  if (!job) return null;
  const isClosed = job.status === "closed";

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label={`${job.title} details`}>
      <button
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-[var(--color-board)] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[var(--color-line)] px-6 py-5">
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)]">{job.code}</p>
            <h2 className="mt-1 font-[var(--font-display)] text-xl font-semibold">{job.title}</h2>
            <p className="mt-0.5 text-sm text-[var(--color-muted)]">{job.company}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-panel)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cta)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={job.status} />
            <span className="flex items-center gap-1 text-sm text-[var(--color-muted)]">
              <MapPin size={14} />
              {job.remote ? "Remote" : job.location}
            </span>
            <span className="font-mono text-xs text-[var(--color-muted)]">
              posted {relativeTime(job.postedAt)}
            </span>
          </div>

          <p className="mt-3 font-mono text-sm text-[var(--color-ink)]">
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}{" "}
            <span className="text-[var(--color-muted)]">· {job.type} · {job.level} level</span>
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--color-line)] px-2.5 py-1 text-xs text-[var(--color-muted)]"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[var(--color-ink)]">{job.description}</p>

          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              What you'll do
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ink)]">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-muted)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              What we're looking for
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ink)]">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-muted)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[var(--color-line)] px-6 py-4">
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            className="flex items-center gap-1.5 rounded-md border border-[var(--color-line)] px-3 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-panel)]"
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            disabled={isClosed}
            onClick={onApply}
            className="flex-1 rounded-md bg-[var(--color-cta)] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-cta-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isClosed ? "Position filled" : "Apply now"}
          </button>
        </div>
      </div>
    </div>
  );
}
