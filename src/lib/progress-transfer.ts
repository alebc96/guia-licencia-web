import type { ProgressState } from "@/components/progress/ProgressProvider";

const VERSION = 1;
const HASH_KEY = "importar=";
// ~400 signs and 17 topics fit in a few KB; anything far larger is not ours.
const MAX_CODE_LENGTH = 20_000;

/** Ids the site actually has; imported entries outside these are dropped. */
export interface KnownIds {
  temas: readonly string[];
  senales: readonly string[];
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): Uint8Array {
  const base64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeProgress(state: ProgressState): string {
  const json = JSON.stringify({ v: VERSION, t: state.temas, s: state.senales });
  return toBase64Url(new TextEncoder().encode(json));
}

function cleanList(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) return null;
  return Array.from(new Set(value as string[]));
}

/**
 * Accepts a bare code or any text containing `importar=CODE` (a full link).
 * With `known`, keeps only topic slugs and sign codes that exist.
 */
export function decodeProgress(input: string, known?: KnownIds): ProgressState | null {
  try {
    let code = input.trim();
    const at = code.indexOf(HASH_KEY);
    if (at !== -1) code = code.slice(at + HASH_KEY.length).trim();
    if (code.length > MAX_CODE_LENGTH || !/^[A-Za-z0-9_-]+$/.test(code)) return null;
    const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(fromBase64Url(code)));
    if (typeof parsed !== "object" || parsed === null) return null;
    const data = parsed as { v?: unknown; t?: unknown; s?: unknown };
    if (data.v !== VERSION) return null;
    const temas = cleanList(data.t);
    const senales = cleanList(data.s);
    if (!temas || !senales) return null;
    if (!known) return { temas, senales };
    const knownTemas = new Set(known.temas);
    const knownSenales = new Set(known.senales);
    const kept = {
      temas: temas.filter((slug) => knownTemas.has(slug)),
      senales: senales.filter((code) => knownSenales.has(code)),
    };
    // Nothing recognisable left: treat it as a bad code rather than "imported 0".
    return kept.temas.length + kept.senales.length > 0 ? kept : null;
  } catch {
    return null;
  }
}
