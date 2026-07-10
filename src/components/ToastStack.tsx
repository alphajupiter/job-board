import { CheckCircle2, Info, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  tone: "success" | "info";
}

export default function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="row-settle flex items-center gap-2 rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] shadow-lg"
        >
          {t.tone === "success" ? (
            <CheckCircle2 size={16} className="text-[var(--color-signal-open)]" />
          ) : (
            <Info size={16} className="text-[var(--color-muted)]" />
          )}
          {t.message}
          <button
            aria-label="Dismiss notification"
            onClick={() => onDismiss(t.id)}
            className="ml-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
