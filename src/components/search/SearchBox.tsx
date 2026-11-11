"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_PATH } from "@/lib/constants";

interface SearchHit {
  url: string;
  title: string;
  excerpt: string;
}

interface PagefindModule {
  options?: (options: { basePath?: string }) => Promise<void>;
  search: (query: string) => Promise<{ results: Array<{ data: () => Promise<SearchHit> }> }>;
}

type Status = "loading-index" | "ready" | "unavailable";

/**
 * Pagefind full-text search. The index only exists in the built site
 * (`out/pagefind`), so during development the box reports that it is
 * unavailable instead of failing silently.
 */
export function SearchBox() {
  const pagefind = useRef<PagefindModule | null>(null);
  const [status, setStatus] = useState<Status>("loading-index");
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Kept out of the bundler on purpose: Pagefind ships its own ES module that
    // only exists after `npm run build`.
    const dynImport = new Function("path", "return import(path)") as (path: string) => Promise<PagefindModule>;

    dynImport(`${BASE_PATH}/pagefind/pagefind.js`)
      .then(async (module) => {
        if (cancelled) return;
        if (BASE_PATH && typeof module.options === "function") {
          await module.options({ basePath: `${BASE_PATH}/` });
        }
        pagefind.current = module;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = useCallback(async (value: string) => {
    const module = pagefind.current;
    if (!module) return;
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setHits([]);
      return;
    }

    setSearching(true);
    try {
      const response = await module.search(trimmed);
      const data = await Promise.all(response.results.slice(0, 12).map((result) => result.data()));
      setHits(data);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    const timer = setTimeout(() => {
      void runSearch(query);
    }, 180);
    return () => clearTimeout(timer);
  }, [query, status, runSearch]);

  return (
    <div className="stack-lg">
      <div className="stack">
        <label className="field-label" htmlFor="site-search">
          Buscar en toda la guía
        </label>
        <input
          id="site-search"
          type="search"
          className="search-input"
          placeholder="Temas, señales, glosario…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          aria-describedby="site-search-status"
        />
      </div>

      <p id="site-search-status" className="t-caption muted" role="status" aria-live="polite">
        {status === "loading-index" ? "Cargando el índice de búsqueda…" : null}
        {status === "unavailable"
          ? "La búsqueda solo funciona en la versión compilada del sitio (npm run build). En desarrollo no hay índice."
          : null}
        {status === "ready" && searching ? "Buscando…" : null}
        {status === "ready" && !searching
          ? `${hits.length} ${hits.length === 1 ? "resultado" : "resultados"}${query.trim().length >= 2 ? "" : " (escribe al menos dos letras)"}.`
          : null}
      </p>

      {hits.length > 0 ? (
        <ul className="search-results">
          {hits.map((hit) => (
            <li key={hit.url} className="search-results__item">
              <a href={hit.url} className="t-body-strong">
                {hit.title}
              </a>
              <p
                className="t-caption"
                style={{ marginTop: 4 }}
                dangerouslySetInnerHTML={{ __html: hit.excerpt }}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
