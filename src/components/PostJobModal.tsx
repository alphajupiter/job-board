import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ExperienceLevel, Job, JobType } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (job: Job) => void;
}

const types: JobType[] = ["Full-time", "Part-time", "Contract", "Internship"];
const levels: ExperienceLevel[] = ["Entry", "Mid", "Senior", "Lead"];

export default function PostJobModal({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [type, setType] = useState<JobType>("Full-time");
  const [level, setLevel] = useState<ExperienceLevel>("Mid");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) firstRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function validate() {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Give the role a title.";
    if (!company.trim()) next.company = "Add a company name.";
    if (!remote && !location.trim()) next.location = "Add a location, or mark this remote.";
    if (!salaryMin || !salaryMax || Number(salaryMin) > Number(salaryMax))
      next.salary = "Enter a valid salary range.";
    if (!description.trim()) next.description = "Add a short description of the role.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function reset() {
    setTitle("");
    setCompany("");
    setLocation("");
    setRemote(false);
    setType("Full-time");
    setLevel("Mid");
    setSalaryMin("");
    setSalaryMax("");
    setTags("");
    setDescription("");
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const id = `custom-${Date.now()}`;
    const code = `NEW-${String(Math.floor(Math.random() * 900) + 100)}`;
    const job: Job = {
      id,
      code,
      title: title.trim(),
      company: company.trim(),
      location: remote ? "Remote" : location.trim(),
      remote,
      type,
      level,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      currency: "INR",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      postedAt: new Date().toISOString(),
      status: "new",
      description: description.trim(),
      responsibilities: [],
      requirements: [],
    };
    onSubmit(job);
    reset();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Post a new job">
      <button
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-[var(--color-board)] shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[var(--color-line)] px-5 py-4">
          <div>
            <p className="text-xs text-[var(--color-muted)]">New listing</p>
            <h2 className="font-[var(--font-display)] text-lg font-semibold">Post a job</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-panel)]">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3.5 overflow-y-auto thin-scroll px-5 py-4">
          <Field label="Job title" error={errors.title}>
            <input ref={firstRef} value={title} onChange={(e) => setTitle(e.target.value)} className="board-input" placeholder="Senior Backend Engineer" />
          </Field>
          <Field label="Company" error={errors.company}>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="board-input" placeholder="Your company" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Location" error={errors.location}>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="board-input"
                placeholder="City, country"
                disabled={remote}
              />
            </Field>
            <label className="flex items-end gap-2 pb-2.5 text-sm text-[var(--color-ink)]">
              <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} className="h-4 w-4" />
              Remote friendly
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Job type">
              <select value={type} onChange={(e) => setType(e.target.value as JobType)} className="board-input">
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Experience level">
              <select value={level} onChange={(e) => setLevel(e.target.value as ExperienceLevel)} className="board-input">
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Salary range (INR / year)" error={errors.salary}>
            <div className="flex items-center gap-2">
              <input
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value.replace(/\D/g, ""))}
                className="board-input"
                placeholder="Min, e.g. 1200000"
                inputMode="numeric"
              />
              <span className="text-[var(--color-muted)]">–</span>
              <input
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value.replace(/\D/g, ""))}
                className="board-input"
                placeholder="Max, e.g. 1800000"
                inputMode="numeric"
              />
            </div>
          </Field>

          <Field label="Tags (comma separated)">
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="board-input" placeholder="React, GraphQL, Remote-first" />
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="board-input resize-none"
              placeholder="What will this person own in their first quarter?"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-[var(--color-line)] px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-[var(--color-line)] px-3.5 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-panel)]">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-[var(--color-cta)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[var(--color-cta-hover)]">
            Publish listing
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs text-[var(--color-muted)]">
      {label}
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-[var(--color-signal-urgent)]">{error}</p>}
    </label>
  );
}
