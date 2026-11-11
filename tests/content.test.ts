import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { loadGlosario, loadRecursos, loadSenales, loadTemas } from "@/lib/content";

/**
 * Content checks driven through the real Markdown loaders (frontmatter is
 * validated by Zod there). These assertions cover what a schema cannot see:
 * cross-file identifiers, on-disk assets and the mandatory section structure.
 */

const ROOT = process.cwd();

/** Section headings required in every topic, in the order they appear. */
const REQUIRED_SECTIONS = [
  "## Lo esencial",
  "## Explicado",
  "## Casos prácticos",
  "## Errores típicos",
  "## Para profundizar",
] as const;

/** Codes declared in `data/senales.txt`, the source of truth for the catalogue. */
function dataSenalCodes(): string[] {
  const raw = fs.readFileSync(path.join(ROOT, "data", "senales.txt"), "utf8");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => (line.split("|")[0] ?? "").trim());
}

describe("temario", () => {
  const temas = loadTemas();

  it("carga exactamente 17 temas", () => {
    expect(temas).toHaveLength(17);
  });

  it("numera los temas del 1 al 17 sin huecos ni duplicados", () => {
    const orders = temas.map((tema) => tema.order).sort((a, b) => a - b);
    expect(orders).toEqual(Array.from({ length: 17 }, (_, index) => index + 1));
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("no repite ningún slug de tema", () => {
    const slugs = temas.map((tema) => tema.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("da a cada tema cuerpo, dato clave, error típico y fuente con URL https", () => {
    const problems: string[] = [];

    for (const tema of temas) {
      if (tema.body.trim().length === 0) problems.push(`${tema.slug}: cuerpo vacío`);
      if (tema.keyFacts.length < 1) problems.push(`${tema.slug}: sin keyFacts`);
      if (tema.mistakes.length < 1) problems.push(`${tema.slug}: sin mistakes`);
      if (tema.sources.length < 1) problems.push(`${tema.slug}: sin sources`);

      for (const source of tema.sources) {
        if (!source.url.startsWith("https://")) {
          problems.push(`${tema.slug}: fuente "${source.label}" no es https (${source.url})`);
          continue;
        }
        try {
          const url = new URL(source.url);
          if (url.protocol !== "https:") {
            problems.push(`${tema.slug}: fuente "${source.label}" no es https (${source.url})`);
          }
        } catch {
          problems.push(`${tema.slug}: fuente "${source.label}" no es una URL válida (${source.url})`);
        }
      }
    }

    expect(problems).toEqual([]);
  });

  it("incluye las cinco secciones obligatorias en cada tema", () => {
    const problems: string[] = [];

    for (const tema of temas) {
      for (const section of REQUIRED_SECTIONS) {
        if (!tema.body.includes(section)) problems.push(`${tema.slug}: falta "${section}"`);
      }
    }

    expect(problems).toEqual([]);
  });
});

describe("señales", () => {
  const senales = loadSenales();

  it("usa como nombre de fichero el código en minúsculas", () => {
    const problems = senales
      .filter((senal) => path.basename(senal.path, ".md") !== senal.code.toLowerCase())
      .map((senal) => `${senal.path}: el código ${senal.code} no coincide con el nombre del fichero`);

    expect(problems).toEqual([]);
  });

  it("apunta cada imagen a un SVG que existe dentro de public/", () => {
    const problems: string[] = [];

    for (const senal of senales) {
      const relative = senal.image.replace(/^\//, "");
      if (!fs.existsSync(path.join(ROOT, "public", relative))) {
        problems.push(`${senal.code}: no existe public/${relative}`);
      }
    }

    expect(problems).toEqual([]);
  });

  it("no duplica códigos entre data/senales.txt y content/senales/", () => {
    const fromData = dataSenalCodes();
    const fromContent = senales.map((senal) => senal.code);

    expect(new Set(fromData).size).toBe(fromData.length);
    expect(new Set(fromContent).size).toBe(fromContent.length);
    expect([...fromContent].sort()).toEqual([...fromData].sort());
  });
});

describe("glosario y recursos", () => {
  const glosario = loadGlosario();
  const recursos = loadRecursos();

  it("carga el glosario con término y definición en cada entrada", () => {
    expect(glosario.length).toBeGreaterThan(0);
    const problems = glosario
      .filter((entry) => entry.term.trim().length === 0 || entry.definition.trim().length === 0)
      .map((entry) => `${entry.path}: entrada incompleta`);

    expect(problems).toEqual([]);
  });

  it("carga los recursos y exige URL absoluta http(s) en cada uno", () => {
    expect(recursos.length).toBeGreaterThan(0);
    const problems: string[] = [];

    for (const recurso of recursos) {
      if (!/^https?:\/\//.test(recurso.url)) {
        problems.push(`${recurso.path}: url no absoluta (${recurso.url})`);
        continue;
      }
      try {
        const url = new URL(recurso.url);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          problems.push(`${recurso.path}: protocolo no http(s) (${recurso.url})`);
        }
      } catch {
        problems.push(`${recurso.path}: url inválida (${recurso.url})`);
      }
    }

    expect(problems).toEqual([]);
  });
});
