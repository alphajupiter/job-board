import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Job } from "../types";

interface Props {
  job: Job | null;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; resumeLink: string; note: string }) => void;
}

export default function ApplyModal({ job, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (job) {
      firstRef.current?.focus();
      setName("");
      setEmail("");
      setResumeLink("");
      setNote("");
      setErrors({});
    }
  }, [job]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && job && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [job, onClose]);

  if (!job) return null;

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!resumeLink.trim()) next.resumeLink = "Add a link to your resume or portfolio.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name, email, resumeLink, note });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Apply to ${job.title}`}>
      <button
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative w-full max-w-md rounded-lg bg-[var(--color-board)] shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[var(--color-line)] px-5 py-4">
          <div>
            <p className="text-xs text-[var(--color-muted)]">Applying for</p>
            <h2 className="font-[var(--font-display)] text-lg font-semibold">{job.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-panel)]">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3.5 px-5 py-4">
          <Field label="Full name" error={errors.name}>
            <input
              ref={firstRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="board-input"
              placeholder="Aanya Sharma"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="board-input"
              placeholder="you@example.com"
              type="email"
            />
          </Field>
          <Field label="Resume or portfolio link" error={errors.resumeLink}>
            <input
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              className="board-input"
              placeholder="https://"
            />
          </Field>
          <Field label="Note to the hiring team (optional)">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="board-input resize-none"
              placeholder="Anything you'd like them to know first"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-[var(--color-line)] px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-[var(--color-line)] px-3.5 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-panel)]">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-[var(--color-cta)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[var(--color-cta-hover)]">
            Submit application
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
