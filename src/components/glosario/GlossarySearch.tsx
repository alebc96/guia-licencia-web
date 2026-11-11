"use client";

import { useMemo, useState } from "react";
import { normalize } from "@/lib/catalog";

export interface GlossaryItem {
  slug: string;
  term: string;
  definition: string;
  related: string[];
}

export function GlossarySearch({ items }: { items: GlossaryItem[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = normalize(query);
    if (needle.length === 0) return items;
    return items.filter((item) => normalize(`${item.term} ${item.definition}`).includes(needle));
  }, [items, query]);

  return (
    <div className="stack-lg">
      <div className="stack">
        <label className="field-label" htmlFor="glossary-search">
          Buscar un término
        </label>
        <input
          id="glossary-search"
          type="search"
          className="search-input"
          placeholder="Por ejemplo: MMA, aquaplaning, glorieta"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
      </div>

      <p className="t-caption muted" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? "término" : "términos"}.
      </p>

      {visible.length === 0 ? (
        <div className="card">
          <p className="t-body-strong">No hay ningún término con ese texto.</p>
          <button type="button" className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => setQuery("")}>
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <dl className="glossary">
          {visible.map((item) => (
            <div key={item.slug} className="glossary__item" id={item.slug}>
              <dt className="glossary__term">{item.term}</dt>
              <dd className="glossary__definition">
                {item.definition}
                {item.related.length > 0 ? (
                  <span className="glossary__related">
                    {" "}
                    Ver también:{" "}
                    {item.related.map((related, index) => (
                      <span key={related}>
                        {index > 0 ? ", " : ""}
                        <a href={`#${related}`}>{related.replace(/-/g, " ")}</a>
                      </span>
                    ))}
                    .
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
