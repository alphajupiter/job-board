import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { ExperienceLevel, JobType, SortOption } from "../types";

export interface FilterState {
  query: string;
  type: JobType | "All";
  level: ExperienceLevel | "All";
  remoteOnly: boolean;
  savedOnly: boolean;
  sort: SortOption;
}

interface Props {
  state: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
}

const types: (JobType | "All")[] = ["All", "Full-time", "Part-time", "Contract", "Internship"];
const levels: (ExperienceLevel | "All")[] = ["All", "Entry", "Mid", "Senior", "Lead"];

export default function Filters({ state, onChange, resultCount }: Props) {
  const [open, setOpen] = useState(false);

  const set = (patch: Partial<FilterState>) => onChange({ ...state, ...patch });

  const activeCount =
    (state.type !== "All" ? 1 : 0) +
    (state.level !== "All" ? 1 : 0) +
    (state.remoteOnly ? 1 : 0) +
    (state.savedOnly ? 1 : 0);

  const body = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <label className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">
        Job type
        <select
          value={state.type}
          onChange={(e) => set({ type: e.target.value as FilterState["type"] })}
          className="rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">
        Experience
        <select
          value={state.level}
          onChange={(e) => set({ level: e.target.value as FilterState["level"] })}
          className="rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
        >
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">
        Sort by
        <select
          value={state.sort}
          onChange={(e) => set({ sort: e.target.value as SortOption })}
          className="rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
        >
          <option value="newest">Newest</option>
          <option value="salary-desc">Salary: high to low</option>
          <option value="salary-asc">Salary: low to high</option>
        </select>
      </label>

      <div className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">
        Quick filters
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => set({ remoteOnly: !state.remoteOnly })}
            aria-pressed={state.remoteOnly}
            className={`flex-1 rounded-md border px-2 py-1.5 text-sm transition ${
              state.remoteOnly
                ? "border-[var(--color-cta)] bg-[var(--color-cta)] text-white"
                : "border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-ink)]"
            }`}
          >
            Remote
          </button>
          <button
            type="button"
            onClick={() => set({ savedOnly: !state.savedOnly })}
            aria-pressed={state.savedOnly}
            className={`flex-1 rounded-md border px-2 py-1.5 text-sm transition ${
              state.savedOnly
                ? "border-[var(--color-cta)] bg-[var(--color-cta)] text-white"
                : "border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-ink)]"
            }`}
          >
            Saved
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-board)]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
            <input
              value={state.query}
              onChange={(e) => set({ query: e.target.value })}
              placeholder="Search by role, company, or tag"
              aria-label="Search jobs"
              className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] py-2 pl-9 pr-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cta)]"
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2 text-sm text-[var(--color-ink)] sm:hidden"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-[var(--color-cta)] px-1.5 text-[11px] text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        <div className={`${open ? "mt-3 block" : "hidden"} sm:mt-3 sm:block`}>{body}</div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[var(--color-muted)] font-mono">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  query: state.query,
                  type: "All",
                  level: "All",
                  remoteOnly: false,
                  savedOnly: false,
                  sort: state.sort,
                })
              }
              className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
