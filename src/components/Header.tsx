import { Moon, Plus, Sun } from "lucide-react";

interface Props {
  dim: boolean;
  onToggleDim: () => void;
  onPostJob: () => void;
}

export default function Header({ dim, onToggleDim, onPostJob }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-board)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-ink)] font-mono text-sm font-semibold text-[var(--color-board)]"
            aria-hidden
          >
            B
          </div>
          <div>
            <h1 className="font-[var(--font-display)] text-lg font-semibold leading-none tracking-tight">
              Board
            </h1>
            <p className="text-[11px] leading-none text-[var(--color-muted)] mt-1">
              open roles, updated live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDim}
            aria-label={dim ? "Switch to light board" : "Switch to dim board"}
            className="rounded-md border border-[var(--color-line)] p-2 text-[var(--color-ink)] transition hover:bg-[var(--color-panel)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cta)]"
          >
            {dim ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            onClick={onPostJob}
            className="flex items-center gap-1.5 rounded-md bg-[var(--color-cta)] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-cta-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)]"
          >
            <Plus size={15} />
            Post a job
          </button>
        </div>
      </div>
    </header>
  );
}
