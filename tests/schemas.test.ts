import { describe, expect, it } from "vitest";
import type { z } from "zod";

import {
  glosarioFrontmatterSchema,
  glosarioSchema,
  keyFactSchema,
  recursoFrontmatterSchema,
  recursoSchema,
  senalFrontmatterSchema,
  senalSchema,
  sourceSchema,
  temaFrontmatterSchema,
  temaSchema,
} from "@/lib/schemas";

/**
 * Contract tests for the frontmatter schemas. Everything goes through the public
 * `safeParse` API: the reported issue paths are the contract the content loader
 * prints when a Markdown file drifts.
 */

interface SafeParsable {
  safeParse(input: unknown): { success: boolean; error?: z.ZodError };
}

function pathsOf(error: z.ZodError): string[] {
  return error.issues.map((issue) => issue.path.map(String).join("."));
}

/** Asserts the input is rejected *and* that the failure names the offending path. */
function expectRejected(schema: SafeParsable, input: unknown, expectedPath: string): void {
  const result = schema.safeParse(input);

  expect(result.success).toBe(false);
  if (result.success || !result.error) return;

  expect(pathsOf(result.error)).toContain(expectedPath);
  const field = expectedPath.split(".").pop() ?? expectedPath;
  expect(result.error.message).toContain(field);
}

/** Asserts the input is accepted and returns the parsed value (defaults applied). */
function expectAccepted<T = Record<string, unknown>>(schema: SafeParsable, input: unknown): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new Error(`expected acceptance, got: ${JSON.stringify(result.error?.issues)}`);
  }
  expect(result.success).toBe(true);

  return (result as unknown as { data: T }).data;
}

function validTemaFrontmatter(overrides: Record<string, unknown> = {}) {
  return {
    title: "Tipos de vehículos",
    slug: "tipos-de-vehiculos",
    order: 1,
    block: "fundamentos",
    description: "Vocabulario imprescindible del temario.",
    icon: "car",
    readingTime: 12,
    examWeight: "media",
    updated: "2026-11-11",
    keyFacts: [{ label: "Permiso B", value: "Hasta 3.500 kg de MMA" }],
    mistakes: ["Confundir la tara con la MMA."],
    sources: [{ label: "RGC, arts. 2–4", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514" }],
    ...overrides,
  };
}

function validSenalFrontmatter(overrides: Record<string, unknown> = {}) {
  return {
    code: "R-301",
    name: "Velocidad máxima",
    family: "reglamentacion",
    subfamily: "velocidad",
    shape: "circulo",
    colors: ["blanco", "rojo"],
    meaning: "Prohíbe circular a más de la velocidad indicada.",
    action: "Reduce la velocidad antes de pasar la señal.",
    where: "En cualquier vía, hasta otra señal de fin de limitación.",
    image: "/senales/r-301.svg",
    imageAlt: "R-301, Velocidad máxima",
    imageCredit: "Pictograma esquemático propio",
    officialSource: "RD 1428/2003, anexo I",
    tier: "A",
    updated: "2026-11-11",
    ...overrides,
  };
}

function validRecursoFrontmatter(overrides: Record<string, unknown> = {}) {
  return {
    title: "DGT: sistemas ADAS",
    url: "https://www.dgt.es/muevete-con-seguridad/adas/",
    type: "oficial",
    description: "Qué hace cada ADAS y qué no puede sustituir.",
    ...overrides,
  };
}

describe("keyFactSchema y sourceSchema", () => {
  it("acepta un dato clave mínimo", () => {
    expect(expectAccepted(keyFactSchema, { label: "Permiso B", value: "3.500 kg" })).toMatchObject({
      label: "Permiso B",
      value: "3.500 kg",
    });
  });

  it("rechaza un dato clave sin label y señala `label`", () => {
    expectRejected(keyFactSchema, { value: "3.500 kg" }, "label");
  });

  it("rechaza un label en blanco y señala `label`", () => {
    expectRejected(keyFactSchema, { label: "   ", value: "3.500 kg" }, "label");
  });

  it("acepta una fuente con URL absoluta", () => {
    expect(
      expectAccepted(sourceSchema, { label: "BOE", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2003-23514" }),
    ).toMatchObject({ label: "BOE" });
  });

  it("rechaza una fuente con URL relativa y señala `url`", () => {
    expectRejected(sourceSchema, { label: "BOE", url: "/buscar/act.php" }, "url");
  });
});

describe("temaFrontmatterSchema", () => {
  it("acepta un frontmatter mínimo y aplica los valores por defecto", () => {
    const parsed = expectAccepted(temaFrontmatterSchema, validTemaFrontmatter());

    expect(parsed).toMatchObject({
      slug: "tipos-de-vehiculos",
      order: 1,
      block: "fundamentos",
      examWeight: "media",
      verified: false,
    });
  });

  it("rechaza el frontmatter sin título y señala `title`", () => {
    const { title: _title, ...rest } = validTemaFrontmatter();
    expectRejected(temaFrontmatterSchema, rest, "title");
  });

  it("rechaza un bloque de estudio desconocido y señala `block`", () => {
    expectRejected(temaFrontmatterSchema, validTemaFrontmatter({ block: "avanzado" }), "block");
  });

  it("rechaza un peso de examen desconocido y señala `examWeight`", () => {
    expectRejected(temaFrontmatterSchema, validTemaFrontmatter({ examWeight: "altísima" }), "examWeight");
  });

  it("rechaza una fecha `updated` que no es ISO y señala `updated`", () => {
    expectRejected(temaFrontmatterSchema, validTemaFrontmatter({ updated: "11/11/2026" }), "updated");
  });

  it("rechaza un slug que no es kebab-case y señala `slug`", () => {
    expectRejected(temaFrontmatterSchema, validTemaFrontmatter({ slug: "Tipos de Vehículos" }), "slug");
  });

  it("rechaza una lista de fuentes vacía y señala `sources`", () => {
    expectRejected(temaFrontmatterSchema, validTemaFrontmatter({ sources: [] }), "sources");
  });

  it("rechaza una fuente sin URL dentro de `sources` y señala el índice", () => {
    expectRejected(
      temaFrontmatterSchema,
      validTemaFrontmatter({ sources: [{ label: "BOE" }] }),
      "sources.0.url",
    );
  });

  it("acepta una fecha ISO en formato Date y la normaliza a YYYY-MM-DD", () => {
    const parsed = expectAccepted(temaFrontmatterSchema, validTemaFrontmatter({ updated: new Date("2026-11-11T00:00:00Z") }));
    expect(parsed.updated).toBe("2026-11-11");
  });
});

describe("temaSchema", () => {
  it("acepta un tema completo", () => {
    const parsed = expectAccepted(temaSchema, {
      ...validTemaFrontmatter(),
      body: "## Lo esencial\n\nContenido.",
      path: "content/temas/01-tipos-de-vehiculos.md",
    });

    expect(parsed).toMatchObject({ body: "## Lo esencial\n\nContenido." });
  });

  it("rechaza un cuerpo vacío y señala `body`", () => {
    expectRejected(
      temaSchema,
      { ...validTemaFrontmatter(), body: "", path: "content/temas/01-tipos-de-vehiculos.md" },
      "body",
    );
  });

  it("rechaza un tema sin ruta de origen y señala `path`", () => {
    expectRejected(temaSchema, { ...validTemaFrontmatter(), body: "Cuerpo" }, "path");
  });
});

describe("senalFrontmatterSchema", () => {
  it("acepta una ficha mínima y aplica los valores por defecto", () => {
    const parsed = expectAccepted(senalFrontmatterSchema, validSenalFrontmatter());

    expect(parsed).toMatchObject({ code: "R-301", family: "reglamentacion", tier: "A", isNew: false, verified: false });
    expect(parsed.related).toEqual([]);
  });

  it("rechaza un código mal formado como `X301` y señala `code`", () => {
    expectRejected(senalFrontmatterSchema, validSenalFrontmatter({ code: "X301" }), "code");
  });

  it("rechaza un código en minúsculas y señala `code`", () => {
    expectRejected(senalFrontmatterSchema, validSenalFrontmatter({ code: "r-301" }), "code");
  });

  it("rechaza una familia desconocida y señala `family`", () => {
    expectRejected(senalFrontmatterSchema, validSenalFrontmatter({ family: "servicio" }), "family");
  });

  it("rechaza una forma desconocida y señala `shape`", () => {
    expectRejected(senalFrontmatterSchema, validSenalFrontmatter({ shape: "estrella" }), "shape");
  });

  it("rechaza un nivel desconocido y señala `tier`", () => {
    expectRejected(senalFrontmatterSchema, validSenalFrontmatter({ tier: "D" }), "tier");
  });

  it("rechaza una imagen fuera de /senales/*.svg y señala `image`", () => {
    expectRejected(senalFrontmatterSchema, validSenalFrontmatter({ image: "/img/r-301.png" }), "image");
  });

  it("rechaza una ficha sin significado y señala `meaning`", () => {
    const { meaning: _meaning, ...rest } = validSenalFrontmatter();
    expectRejected(senalFrontmatterSchema, rest, "meaning");
  });

  it("rechaza una fecha `updated` que no es ISO y señala `updated`", () => {
    expectRejected(senalFrontmatterSchema, validSenalFrontmatter({ updated: "2026-11" }), "updated");
  });
});

describe("senalSchema", () => {
  it("acepta una ficha completa", () => {
    const parsed = expectAccepted(senalSchema, {
      ...validSenalFrontmatter(),
      body: "",
      path: "content/senales/r-301.md",
    });

    expect(parsed).toMatchObject({ code: "R-301" });
  });

  it("rechaza una ficha sin ruta de origen y señala `path`", () => {
    expectRejected(senalSchema, { ...validSenalFrontmatter(), body: "" }, "path");
  });
});

describe("recursoFrontmatterSchema", () => {
  it("acepta un recurso mínimo y aplica los valores por defecto", () => {
    const parsed = expectAccepted(recursoFrontmatterSchema, validRecursoFrontmatter());

    expect(parsed).toMatchObject({ type: "oficial", free: true, language: "es" });
    expect(parsed.topics).toEqual([]);
  });

  it("rechaza un tipo de recurso desconocido y señala `type`", () => {
    expectRejected(recursoFrontmatterSchema, validRecursoFrontmatter({ type: "podcast" }), "type");
  });

  it("rechaza una URL relativa y señala `url`", () => {
    expectRejected(recursoFrontmatterSchema, validRecursoFrontmatter({ url: "/recursos/adas" }), "url");
  });

  it("rechaza un recurso sin descripción y señala `description`", () => {
    const { description: _description, ...rest } = validRecursoFrontmatter();
    expectRejected(recursoFrontmatterSchema, rest, "description");
  });
});

describe("recursoSchema", () => {
  it("acepta un recurso completo", () => {
    const parsed = expectAccepted(recursoSchema, {
      ...validRecursoFrontmatter(),
      body: "",
      path: "content/recursos/dgt-adas.md",
    });

    expect(parsed).toMatchObject({ title: "DGT: sistemas ADAS" });
  });

  it("rechaza un recurso sin título y señala `title`", () => {
    const { title: _title, ...rest } = validRecursoFrontmatter();
    expectRejected(recursoSchema, { ...rest, body: "", path: "content/recursos/dgt-adas.md" }, "title");
  });
});

describe("glosarioFrontmatterSchema y glosarioSchema", () => {
  it("acepta una entrada mínima y deja `related` vacío por defecto", () => {
    const parsed = expectAccepted(glosarioFrontmatterSchema, {
      term: "ABS",
      definition: "Sistema antibloqueo de frenos.",
    });

    expect(parsed).toMatchObject({ term: "ABS" });
    expect(parsed.related).toEqual([]);
  });

  it("rechaza una entrada sin definición y señala `definition`", () => {
    expectRejected(glosarioFrontmatterSchema, { term: "ABS" }, "definition");
  });

  it("acepta una entrada de glosario completa", () => {
    const parsed = expectAccepted(glosarioSchema, {
      term: "ABS",
      definition: "Sistema antibloqueo de frenos.",
      body: "",
      slug: "abs",
      path: "content/glosario/abs.md",
    });

    expect(parsed).toMatchObject({ slug: "abs" });
  });

  it("rechaza una entrada de glosario sin slug y señala `slug`", () => {
    expectRejected(
      glosarioSchema,
      { term: "ABS", definition: "Sistema antibloqueo de frenos.", body: "", path: "content/glosario/abs.md" },
      "slug",
    );
  });
});
