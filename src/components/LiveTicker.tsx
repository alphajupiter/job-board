import { useEffect, useState } from "react";

export default function LiveTicker({ count }: { count: number }) {
  const [display, setDisplay] = useState(count);
  const [flip, setFlip] = useState(0);

  useEffect(() => {
    setDisplay(count);
    setFlip((f) => f + 1);
  }, [count]);

  const digits = String(display).padStart(2, "0").split("");

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <div className="flex gap-0.5">
        {digits.map((d, i) => (
          <span
            key={`${flip}-${i}`}
            className="flap-in inline-block rounded-sm bg-[var(--color-ink)] px-1.5 py-0.5 font-mono text-sm font-medium text-[var(--color-board)] [perspective:200px]"
          >
            {d}
          </span>
        ))}
      </div>
      <span className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
        {count === 1 ? "opening matches" : "openings match"}
      </span>
    </div>
  );
}
