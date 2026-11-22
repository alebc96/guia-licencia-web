"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useProgress } from "@/components/progress/ProgressProvider";
import type { ProgressState } from "@/components/progress/ProgressProvider";
import { decodeProgress, encodeProgress, type KnownIds } from "@/lib/progress-transfer";

function describe(state: ProgressState): string {
  return `${state.temas.length} ${state.temas.length === 1 ? "tema" : "temas"} y ${state.senales.length} ${
    state.senales.length === 1 ? "señal" : "señales"
  }`;
}

function clearHash() {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

export function ProgressTransfer({ known }: { known: KnownIds }) {
  const { temas, senales, ready, importProgress } = useProgress();
  const inputId = useId();
  const [pending, setPending] = useState<ProgressState | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fallbackLink, setFallbackLink] = useState("");
  const [value, setValue] = useState("");
  const checkedHash = useRef(false);

  const hasProgress = temas.length + senales.length > 0;

  useEffect(() => {
    if (checkedHash.current) return;
    checkedHash.current = true;
    if (!window.location.hash.includes("importar=")) return;
    const decoded = decodeProgress(window.location.hash, known);
    if (decoded) {
      setPending(decoded);
    } else {
      setError("El enlace de importación no es válido.");
      clearHash();
    }
  }, []);

  const buildLink = () =>
    `${window.location.origin}${window.location.pathname}#importar=${encodeProgress({ temas, senales })}`;

  const share = async () => {
    setError("");
    setFallbackLink("");
    const url = buildLink();
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Mi progreso en Autoescuela Guide", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMessage("Enlace copiado");
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setMessage("");
      setFallbackLink(url);
    }
  };

  const copyCode = async () => {
    setError("");
    try {
      await navigator.clipboard.writeText(encodeProgress({ temas, senales }));
      setMessage("Código copiado");
    } catch {
      setMessage("");
      setError("No se ha podido copiar. Prueba con «Compartir enlace».");
    }
  };

  const submit = () => {
    const decoded = decodeProgress(value, known);
    if (!decoded) {
      setMessage("");
      setError("Ese código o enlace no es válido. Cópialo entero e inténtalo otra vez.");
      return;
    }
    importProgress(decoded);
    setError("");
    setValue("");
    setMessage(`Importado: ${describe(decoded)}`);
  };

  const confirmPending = () => {
    if (pending) {
      importProgress(pending);
      setMessage(`Importado: ${describe(pending)}`);
    }
    setPending(null);
    clearHash();
  };

  const discardPending = () => {
    setPending(null);
    clearHash();
  };

  return (
    <div className="card stack">
      <h2 className="t-display-md">Llévate tu progreso a otro dispositivo</h2>
      <p className="muted">
        Genera un enlace, ábrelo en el otro dispositivo y se suma a lo que ya tengas allí. El enlace no pasa por ningún
        servidor: el progreso va tras la # y el navegador no la envía.
      </p>

      {pending ? (
        <div role="status" className="stack">
          <p>¿Sumar este progreso? {describe(pending)}</p>
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={confirmPending}>
              Importar
            </button>
            <button type="button" className="btn btn-ghost" onClick={discardPending}>
              Descartar
            </button>
          </div>
        </div>
      ) : null}

      <div className="row">
        <button type="button" className="btn btn-primary" onClick={share} disabled={!ready || !hasProgress}>
          Compartir enlace
        </button>
        <button type="button" className="btn btn-ghost" onClick={copyCode} disabled={!ready || !hasProgress}>
          Copiar código
        </button>
      </div>

      {fallbackLink ? (
        <div>
          <label className="field-label" htmlFor={`${inputId}-link`}>
            Copia este enlace
          </label>
          <input
            id={`${inputId}-link`}
            className="search-input"
            readOnly
            value={fallbackLink}
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      ) : null}

      <div>
        <h3 className="t-caption-strong" style={{ marginBottom: 12 }}>
          ¿Tienes un código o enlace?
        </h3>
        <label className="field-label" htmlFor={inputId}>
          Pega aquí el código o el enlace
        </label>
        <div className="row">
          <input
            id={inputId}
            className="search-input"
            style={{ flex: 1, minWidth: 200 }}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="btn btn-ghost" onClick={submit} disabled={value.trim() === ""}>
            Importar
          </button>
        </div>
      </div>

      <p className="t-caption muted" aria-live="polite">
        {message}
      </p>
      {error ? (
        <p className="t-caption" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
