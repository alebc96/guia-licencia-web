import { FAMILY_LABELS } from "./constants";
import type { SignFamily } from "./schemas";

export const FAMILY_ORDER: SignFamily[] = [
  "peligro",
  "reglamentacion",
  "indicacion",
  "marca",
  "balizamiento",
  "semaforo",
  "agente",
  "vehiculo",
];

/** Accent- and case-insensitive normalisation used by every text search. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** The subset of a sign that search, filtering and sorting actually needs. */
export interface FilterableSenal {
  code: string;
  name: string;
  meaning: string;
  subfamily: string;
  family: string;
  tier: string;
}

export function sortSenales<T extends { code: string; family: string }>(senales: readonly T[]): T[] {
  return [...senales].sort((a, b) => {
    const familyDelta =
      FAMILY_ORDER.indexOf(a.family as SignFamily) - FAMILY_ORDER.indexOf(b.family as SignFamily);
    if (familyDelta !== 0) return familyDelta;
    return a.code.localeCompare(b.code, "es", { numeric: true });
  });
}

export function groupByFamily<T extends { code: string; family: string }>(
  senales: readonly T[],
): Array<{ family: SignFamily; label: string; items: T[] }> {
  const groups: Array<{ family: SignFamily; label: string; items: T[] }> = [];
  for (const family of FAMILY_ORDER) {
    const items = senales.filter((senal) => senal.family === family);
    if (items.length === 0) continue;
    groups.push({ family, label: FAMILY_LABELS[family], items: sortSenales(items) });
  }
  return groups;
}

export function countByFamily(senales: readonly { family: string }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const senal of senales) {
    counts[senal.family] = (counts[senal.family] ?? 0) + 1;
  }
  return counts;
}

export interface SignalFilter {
  family?: SignFamily | "todas";
  query?: string;
  tier?: "A" | "B" | "C" | "todas";
}

export function filterSenales<T extends FilterableSenal>(
  senales: readonly T[],
  filter: SignalFilter = {},
): T[] {
  const family = filter.family ?? "todas";
  const tier = filter.tier ?? "todas";
  const query = normalize(filter.query ?? "");
  const tokens = query.split(/\s+/).filter(Boolean);

  return senales.filter((senal) => {
    if (family !== "todas" && senal.family !== family) return false;
    if (tier !== "todas" && senal.tier !== tier) return false;
    if (tokens.length === 0) return true;
    const haystack = normalize(`${senal.code} ${senal.name} ${senal.meaning} ${senal.subfamily}`);
    return tokens.every((token) => haystack.includes(token));
  });
}

/** Groups codes by their letter prefix (P, R, S) so the UI can explain families. */
export function codePrefix(code: string): string {
  return code.split("-")[0] ?? code;
}

export function relatedSenales<T extends { code: string; family: string; related: string[] }>(
  senal: T,
  all: readonly T[],
  limit = 4,
): T[] {
  const explicit = senal.related
    .map((code) => all.find((candidate) => candidate.code === code))
    .filter((candidate): candidate is T => Boolean(candidate));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const sameFamily = sortSenales(all.filter((candidate) => candidate.family === senal.family))
    .filter(
      (candidate) => candidate.code !== senal.code && !explicit.some((item) => item.code === candidate.code),
    )
    .slice(0, limit - explicit.length);

  return [...explicit, ...sameFamily];
}
