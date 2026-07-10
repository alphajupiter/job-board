import { Inbox } from "lucide-react";
import type { Job } from "../types";
import JobRow from "./JobRow";

interface Props {
  jobs: Job[];
  savedIds: string[];
  onOpen: (id: string) => void;
  onToggleSave: (id: string) => void;
  onClearFilters: () => void;
}

export default function JobList({ jobs, savedIds, onOpen, onToggleSave, onClearFilters }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-24 text-center">
        <Inbox size={28} className="text-[var(--color-muted)]" />
        <p className="font-[var(--font-display)] text-lg font-semibold">
          No roles match this search
        </p>
        <p className="max-w-sm text-sm text-[var(--color-muted)]">
          Try a broader keyword, or clear your filters to see everything on the board.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-1 rounded-md border border-[var(--color-line)] px-3 py-1.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-panel)]"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-0 sm:px-6">
      <div className="hidden grid-cols-[72px_1.6fr_1fr_auto_auto_auto] gap-3 px-6 py-2 text-[11px] uppercase tracking-wider text-[var(--color-muted)] sm:grid">
        <span>Code</span>
        <span>Role</span>
        <span>Location</span>
        <span>Salary</span>
        <span>Status</span>
        <span className="text-right">Posted</span>
      </div>
      <div className="overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-board)] sm:rounded-lg sm:border">
        {jobs.map((job) => (
          <JobRow
            key={job.id}
            job={job}
            saved={savedIds.includes(job.id)}
            onOpen={() => onOpen(job.id)}
            onToggleSave={() => onToggleSave(job.id)}
          />
        ))}
      </div>
    </div>
  );
}
