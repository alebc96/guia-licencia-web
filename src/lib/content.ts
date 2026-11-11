import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ZodType } from "zod";
import {
  temaFrontmatterSchema,
  senalFrontmatterSchema,
  recursoFrontmatterSchema,
  glosarioFrontmatterSchema,
  type Tema,
  type Senal,
  type Recurso,
  type GlosarioEntry,
} from "./schemas";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

type Collection = "temas" | "senales" | "recursos" | "glosario";

function markdownFiles(collection: Collection): string[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => path.join(dir, file));
}

function parseFile<T>(file: string, schema: ZodType<T>): { frontmatter: T; body: string; path: string } {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  · ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${path.relative(process.cwd(), file)}\n${issues}`);
  }
  return { frontmatter: result.data, body: content.trim(), path: path.relative(process.cwd(), file) };
}

const cache = new Map<string, unknown>();

function memo<T>(key: string, factory: () => T): T {
  if (!cache.has(key)) cache.set(key, factory());
  return cache.get(key) as T;
}

export function loadTemas(): Tema[] {
  return memo("temas", () =>
    markdownFiles("temas")
      .map((file) => parseFile(file, temaFrontmatterSchema))
      .map(({ frontmatter, body, path: filePath }) => ({ ...frontmatter, body, path: filePath }))
      .sort((a, b) => a.order - b.order),
  );
}

export function loadTema(slug: string): Tema | undefined {
  return loadTemas().find((tema) => tema.slug === slug);
}

export function loadSenales(): Senal[] {
  return memo("senales", () =>
    markdownFiles("senales")
      .map((file) => parseFile(file, senalFrontmatterSchema))
      .map(({ frontmatter, body, path: filePath }) => ({ ...frontmatter, body, path: filePath }))
      .sort((a, b) => a.code.localeCompare(b.code, "es", { numeric: true })),
  );
}

export function senalSlug(senal: Pick<Senal, "code">): string {
  return senal.code.toLowerCase();
}

export function loadSenal(slug: string): Senal | undefined {
  const normalized = slug.toLowerCase();
  return loadSenales().find((senal) => senalSlug(senal) === normalized);
}

export function loadRecursos(): Recurso[] {
  return memo("recursos", () =>
    markdownFiles("recursos")
      .map((file) => parseFile(file, recursoFrontmatterSchema))
      .map(({ frontmatter, body, path: filePath }) => ({ ...frontmatter, body, path: filePath }))
      .sort((a, b) => a.title.localeCompare(b.title, "es")),
  );
}

export function loadGlosario(): GlosarioEntry[] {
  return memo("glosario", () =>
    markdownFiles("glosario")
      .map((file) => parseFile(file, glosarioFrontmatterSchema))
      .map(({ frontmatter, body, path: filePath }) => ({
        ...frontmatter,
        body,
        slug: path.basename(filePath, ".md"),
        path: filePath,
      }))
      .sort((a, b) => a.term.localeCompare(b.term, "es")),
  );
}

/** Test helper: drops the memoized collections so fixtures are re-read. */
export function resetContentCache(): void {
  cache.clear();
}
