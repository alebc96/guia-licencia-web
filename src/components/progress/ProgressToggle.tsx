"use client";

import { useProgress } from "./ProgressProvider";
import { CheckIcon } from "@/components/ui/icons";

interface ProgressToggleProps {
  kind: "tema" | "senal";
  id: string;
  doneLabel: string;
  pendingLabel: string;
}

/**
 * Single control for "I have read/reviewed this". Used by topics and sign
 * fichas; the state lives in localStorage only.
 */
export function ProgressToggle({ kind, id, doneLabel, pendingLabel }: ProgressToggleProps) {
  const progress = useProgress();
  const done = progress.ready && (kind === "tema" ? progress.isTemaDone(id) : progress.isSenalSeen(id));

  return (
    <button
      type="button"
      className="progress-toggle"
      data-done={done}
      aria-pressed={done}
      onClick={() => (kind === "tema" ? progress.toggleTema(id) : progress.toggleSenal(id))}
    >
      {done ? <CheckIcon /> : null}
      {done ? doneLabel : pendingLabel}
    </button>
  );
}
