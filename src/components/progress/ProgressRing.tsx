"use client";

import { useProgress } from "./ProgressProvider";

const RADIUS = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Compact progress indicator used in the global navigation. */
export function ProgressRing({ label = "Progreso" }: { label?: string }) {
  const { temas, totalTemas, ready } = useProgress();
  const done = ready ? temas.length : 0;
  const ratio = totalTemas > 0 ? Math.min(1, done / totalTemas) : 0;
  const percent = Math.round(ratio * 100);

  return (
    <span className="progress-ring" title={`${label}: ${done} de ${totalTemas} temas`}>
      <svg className="progress-ring__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle className="progress-ring__track" cx="12" cy="12" r={RADIUS} fill="none" strokeWidth="2" />
        <circle
          className="progress-ring__value"
          cx="12"
          cy="12"
          r={RADIUS}
          fill="none"
          strokeWidth="2"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
        />
      </svg>
      <span aria-hidden="true">{percent}%</span>
      <span className="visually-hidden">
        {label}: {done} de {totalTemas} temas completados
      </span>
    </span>
  );
}
