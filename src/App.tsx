import { useEffect, useMemo, useState } from "react";
import ApplyModal from "./components/ApplyModal";
import Filters, { type FilterState } from "./components/Filters";
import Header from "./components/Header";
import JobDetailPanel from "./components/JobDetailPanel";
import JobList from "./components/JobList";
import LiveTicker from "./components/LiveTicker";
import PostJobModal from "./components/PostJobModal";
import ToastStack from "./components/ToastStack";
import { useBoard } from "./context/BoardContext";
import { useLocalStorage } from "./hooks/useLocalStorage";

const defaultFilters: FilterState = {
  query: "",
  type: "All",
  level: "All",
  remoteOnly: false,
  savedOnly: false,
  sort: "newest",
};

export default function App() {
  const { jobs, savedIds, toggleSaved, addJob, addApplication, toasts, pushToast, dismissToast } =
    useBoard();

  const [dim, setDim] = useLocalStorage("board:dim", false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applyJobId, setApplyJobId] = useState<string | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dim", dim);
  }, [dim]);

  const filtered = useMemo(() => {
    let list = jobs.filter((job) => {
      if (filters.savedOnly && !savedIds.includes(job.id)) return false;
      if (filters.type !== "All" && job.type !== filters.type) return false;
      if (filters.level !== "All" && job.level !== filters.level) return false;
      if (filters.remoteOnly && !job.remote) return false;
      if (filters.query.trim()) {
        const q = filters.query.trim().toLowerCase();
        const haystack = `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (filters.sort === "salary-desc") return b.salaryMax - a.salaryMax;
      if (filters.sort === "salary-asc") return a.salaryMin - b.salaryMin;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });

    return list;
  }, [jobs, filters, savedIds]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;
  const applyJob = jobs.find((j) => j.id === applyJobId) ?? null;

  return (
    <div className="min-h-screen">
      <Header dim={dim} onToggleDim={() => setDim((d) => !d)} onPostJob={() => setPostOpen(true)} />
      <Filters state={filters} onChange={setFilters} resultCount={filtered.length} />

      <main className="py-6">
        <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <LiveTicker count={filtered.length} />
        </div>
        <JobList
          jobs={filtered}
          savedIds={savedIds}
          onOpen={setSelectedJobId}
          onToggleSave={(id) => {
            toggleSaved(id);
            pushToast(
              savedIds.includes(id) ? "Removed from saved jobs" : "Saved to your list",
              "info"
            );
          }}
          onClearFilters={() => setFilters(defaultFilters)}
        />
      </main>

      <footer className="border-t border-[var(--color-line)] py-6 text-center text-xs text-[var(--color-muted)]">
        Built as a demo job board · data stays in your browser
      </footer>

      <JobDetailPanel
        job={selectedJob}
        saved={selectedJob ? savedIds.includes(selectedJob.id) : false}
        onClose={() => setSelectedJobId(null)}
        onToggleSave={() => selectedJob && toggleSaved(selectedJob.id)}
        onApply={() => selectedJob && setApplyJobId(selectedJob.id)}
      />

      <ApplyModal
        job={applyJob}
        onClose={() => setApplyJobId(null)}
        onSubmit={(data) => {
          if (!applyJob) return;
          addApplication({
            id: `app-${Date.now()}`,
            jobId: applyJob.id,
            submittedAt: new Date().toISOString(),
            ...data,
          });
          setApplyJobId(null);
          setSelectedJobId(null);
          pushToast(`Application sent for ${applyJob.title}`);
        }}
      />

      <PostJobModal
        open={postOpen}
        onClose={() => setPostOpen(false)}
        onSubmit={(job) => {
          addJob(job);
          setPostOpen(false);
          pushToast(`${job.title} is live on the board`);
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
