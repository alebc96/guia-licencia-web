"use client";

import { useEffect, useMemo, useState } from "react";
import { FAMILY_LABELS } from "@/lib/constants";
import { filterSenales, countByFamily, type SignalFilter } from "@/lib/catalog";
import { SignalCard, type SignalCardData } from "./SignalCard";

export interface ExplorerSignal extends SignalCardData {
  subfamily: string;
  meaning: string;
}

const FAMILY_OPTIONS: Array<{ value: SignalFilter["family"]; label: string }> = [
  { value: "todas", label: "Todas" },
  ...Object.entries(FAMILY_LABELS).map(([value, label]) => ({
    value: value as SignalFilter["family"],
    label,
  })),
];

const PAGE_SIZE = 48;

/** Client-side catalogue filter: no reload, keyboard friendly, no hidden state. */
export function SignalExplorer({ signals }: { signals: ExplorerSignal[] }) {
  const [family, setFamily] = useState<SignalFilter["family"]>("todas");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const counts = useMemo(() => countByFamily(signals), [signals]);

  const matched = useMemo(() => filterSenales(signals, { family, query }), [signals, family, query]);

  // A new filter starts from the first page again.
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [family, query]);

  const visible = matched.slice(0, limit);

  return (
    <div className="stack-lg">
      <div className="stack">
        <label className="field-label" htmlFor="signal-search">
          Buscar por código o nombre
        </label>
        <input
          id="signal-search"
          type="search"
          className="search-input"
          placeholder="Por ejemplo: R-301, ceda el paso, autopista"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="row" role="group" aria-label="Filtrar por familia">
        {FAMILY_OPTIONS.filter((option) => option.value === "todas" || (counts[option.value as string] ?? 0) > 0).map(
          (option) => (
            <button
              key={option.value}
              type="button"
              className="chip"
              aria-pressed={family === option.value}
              onClick={() => setFamily(option.value)}
            >
              {option.label}
              {option.value !== "todas" ? ` · ${counts[option.value as string] ?? 0}` : ` · ${signals.length}`}
            </button>
          ),
        )}
      </div>

      <p className="t-caption muted" role="status" aria-live="polite">
        {matched.length} {matched.length === 1 ? "señal" : "señales"}
        {family !== "todas" ? ` en ${FAMILY_LABELS[family as keyof typeof FAMILY_LABELS]}` : ""}
        {query ? ` para «${query}»` : ""}.
      </p>

      {visible.length === 0 ? (
        <div className="card">
          <p className="t-body-strong">No hay señales con ese criterio.</p>
          <p style={{ marginTop: 8 }}>
            Prueba con el código oficial (por ejemplo <code>R-301</code>) o borra la búsqueda.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: 16 }}
            onClick={() => {
              setQuery("");
              setFamily("todas");
              setLimit(PAGE_SIZE);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="sign-grid">
            {visible.map((senal) => (
              <SignalCard key={senal.code} senal={senal} />
            ))}
          </div>

          {matched.length > visible.length ? (
            <div className="row" style={{ justifyContent: "center" }}>
              <button type="button" className="btn btn-ghost" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
                Ver más señales ({matched.length - visible.length} restantes)
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
