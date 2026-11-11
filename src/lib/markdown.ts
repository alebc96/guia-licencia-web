/**
 * Minimal Markdown helpers. Headings are extracted from the raw Markdown so the
 * table of contents can be rendered on the server without a DOM pass. The slug
 * rules mirror `rehype-slug` (github-slugger) closely enough for anchors that
 * contain letters, digits, spaces and hyphens.
 */

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const level = match[1]?.length === 2 ? 2 : 3;
    const text = stripInlineMarkdown((match[2] ?? "").trim());
    const base = slugify(text);
    if (!base) continue;

    const occurrences = seen.get(base) ?? 0;
    seen.set(base, occurrences + 1);
    const id = occurrences === 0 ? base : `${base}-${occurrences}`;

    headings.push({ id, text, level });
  }

  return headings;
}

/** Rough read time used when a document does not declare one. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
