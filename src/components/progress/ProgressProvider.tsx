"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "guiab.progress.v1";

interface ProgressState {
  temas: string[];
  senales: string[];
}

const EMPTY: ProgressState = { temas: [], senales: [] };

export interface ProgressApi extends ProgressState {
  ready: boolean;
  totalTemas: number;
  isTemaDone: (slug: string) => boolean;
  isSenalSeen: (code: string) => boolean;
  toggleTema: (slug: string) => void;
  toggleSenal: (code: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

function readStorage(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY;
    const candidate = parsed as Partial<ProgressState>;
    return {
      temas: Array.isArray(candidate.temas) ? candidate.temas.filter((item) => typeof item === "string") : [],
      senales: Array.isArray(candidate.senales) ? candidate.senales.filter((item) => typeof item === "string") : [],
    };
  } catch {
    return EMPTY;
  }
}

interface ProgressProviderProps {
  children: ReactNode;
  totalTemas: number;
}

/**
 * Stores study progress in `localStorage` only: no accounts, no cookies, no
 * server. Rendering starts empty and hydrates after mount to keep the static
 * HTML deterministic.
 */
export function ProgressProvider({ children, totalTemas }: ProgressProviderProps) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readStorage());
    setReady(true);
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Storage can be full or blocked; progress is a convenience, not authority. */
    }
  }, []);

  const toggleTema = useCallback(
    (slug: string) => {
      const temas = state.temas.includes(slug) ? state.temas.filter((item) => item !== slug) : [...state.temas, slug];
      persist({ ...state, temas });
    },
    [persist, state],
  );

  const toggleSenal = useCallback(
    (code: string) => {
      const senales = state.senales.includes(code)
        ? state.senales.filter((item) => item !== code)
        : [...state.senales, code];
      persist({ ...state, senales });
    },
    [persist, state],
  );

  const reset = useCallback(() => persist(EMPTY), [persist]);

  const value = useMemo<ProgressApi>(
    () => ({
      ...state,
      ready,
      totalTemas,
      isTemaDone: (slug) => state.temas.includes(slug),
      isSenalSeen: (code) => state.senales.includes(code),
      toggleTema,
      toggleSenal,
      reset,
    }),
    [state, ready, totalTemas, toggleTema, toggleSenal, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside <ProgressProvider>");
  }
  return context;
}
