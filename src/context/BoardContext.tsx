import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { seedJobs } from "../data/jobs";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Application, Job } from "../types";

interface Toast {
  id: string;
  message: string;
  tone: "success" | "info";
}

interface BoardContextValue {
  jobs: Job[];
  savedIds: string[];
  applications: Application[];
  toggleSaved: (id: string) => void;
  addJob: (job: Job) => void;
  addApplication: (app: Application) => void;
  toasts: Toast[];
  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: string) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [customJobs, setCustomJobs] = useLocalStorage<Job[]>("board:custom-jobs", []);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("board:saved", []);
  const [applications, setApplications] = useLocalStorage<Application[]>(
    "board:applications",
    []
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  const jobs = useMemo(() => [...customJobs, ...seedJobs], [customJobs]);

  function toggleSaved(id: string) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function addJob(job: Job) {
    setCustomJobs((prev) => [job, ...prev]);
  }

  function addApplication(app: Application) {
    setApplications((prev) => [app, ...prev]);
  }

  function pushToast(message: string, tone: Toast["tone"] = "success") {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 3200);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const value: BoardContextValue = {
    jobs,
    savedIds,
    applications,
    toggleSaved,
    addJob,
    addApplication,
    toasts,
    pushToast,
    dismissToast,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within BoardProvider");
  return ctx;
}
