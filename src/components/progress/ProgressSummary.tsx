"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProgress } from "@/components/progress/ProgressProvider";

interface ProgressItem {
  slug: string;
  title: string;
  order: number;
}

export function ProgressSummary({ temas }: { temas: ProgressItem[] }) {
  const { temas: doneSlugs, ready, reset } = useProgress();

  const done = useMemo(() => new Set(doneSlugs), [doneSlugs]);
  const completed = temas.filter((tema) => done.has(tema.slug)).length;
  const percent = temas.length > 0 ? Math.round((completed / temas.length) * 100) : 0;
  const nextTopic = temas.find((tema) => !done.has(tema.slug));

  return (
    <div className="stack-lg">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="t-display-md">
            {ready ? `${completed} de ${temas.length}` : `0 de ${temas.length}`} temas
          </h2>
          <span className="t-tagline">{ready ? `${percent}%` : "0%"}</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 16 }} role="img" aria-label={`Progreso: ${percent}%`}>
          <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="t-caption muted" style={{ marginTop: 12 }}>
          Se guarda solo en este navegador. No hay cuentas, no hay servidor y nada sale de tu dispositivo.
        </p>
      </div>

      <div>
        <h3 className="t-caption-strong" style={{ marginBottom: 12 }}>
          Temas
        </h3>
        <ul className="progress-list">
          {temas.map((tema) => (
            <li key={tema.slug} className="progress-list__item" data-done={ready && done.has(tema.slug)}>
              <span className="progress-list__index">{String(tema.order).padStart(2, "0")}</span>
              <Link href={`/temario/${tema.slug}`} className="progress-list__title">
                {tema.title}
              </Link>
              <span className="progress-list__state">{ready && done.has(tema.slug) ? "Leído" : "Pendiente"}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="row">
        {nextTopic ? (
          <Link href={`/temario/${nextTopic.slug}`} className="btn btn-primary">
            Continuar por el tema {String(nextTopic.order).padStart(2, "0")}
          </Link>
        ) : (
          <Link href="/examen" className="btn btn-primary">
            Repasar el formato del examen
          </Link>
        )}
        <button type="button" className="btn btn-ghost" onClick={reset} disabled={!ready || doneSlugs.length === 0}>
          Borrar el progreso
        </button>
      </div>
    </div>
  );
}
