import { describe, expect, it } from "vitest";

import { extractHeadings, readingMinutes, slugify } from "@/lib/markdown";

/**
 * Table-of-contents helpers. Headings are extracted from raw Markdown so the
 * server can render anchors without a DOM pass.
 */

describe("extractHeadings", () => {
  it("extrae solo los niveles 2 y 3", () => {
    const markdown = ["# Título del tema", "## Lo esencial", "### Vehículos y masas", "#### Detalle"].join("\n");

    expect(extractHeadings(markdown)).toEqual([
      { id: "lo-esencial", text: "Lo esencial", level: 2 },
      { id: "vehículos-y-masas", text: "Vehículos y masas", level: 3 },
    ]);
  });

  it("ignora el H1 y el contenido de los bloques de código", () => {
    const markdown = [
      "# Título",
      "## Antes del bloque",
      "```md",
      "## Esto es un ejemplo dentro de un fence",
      "```",
      "## Después del bloque",
    ].join("\n");

    expect(extractHeadings(markdown).map((heading) => heading.text)).toEqual([
      "Antes del bloque",
      "Después del bloque",
    ]);
  });

  it("quita el markdown inline de la etiqueta", () => {
    const markdown = ["## La **tara** y la `MMA`", "## [Enlace](https://example.com) *destacado*"].join("\n");

    expect(extractHeadings(markdown)).toEqual([
      { id: "la-tara-y-la-mma", text: "La tara y la MMA", level: 2 },
      { id: "enlace-destacado", text: "Enlace destacado", level: 2 },
    ]);
  });

  it("genera ids únicos cuando se repite un título", () => {
    const markdown = ["## Repaso", "## Repaso", "## Repaso"].join("\n");
    const headings = extractHeadings(markdown);

    expect(headings.map((heading) => heading.id)).toEqual(["repaso", "repaso-1", "repaso-2"]);
    expect(new Set(headings.map((heading) => heading.id)).size).toBe(3);
  });

  it("devuelve una lista vacía cuando no hay encabezados válidos", () => {
    expect(extractHeadings("# Solo un H1\n\nTexto sin secciones.")).toEqual([]);
  });
});

describe("slugify", () => {
  it("conserva las letras acentuadas y normaliza los espacios", () => {
    expect(slugify("Vehículos y masas")).toBe("vehículos-y-masas");
    expect(slugify("  Casos   prácticos  ")).toBe("casos-prácticos");
  });

  it("elimina la puntuación y los signos que no son letras ni dígitos", () => {
    expect(slugify("¿Qué es la ITV? (2026)")).toBe("qué-es-la-itv-2026");
    expect(slugify("**Negrita** y `código`")).toBe("negrita-y-código");
  });

  it("colapsa los guiones repetidos y recorta los de los extremos", () => {
    expect(slugify("--Ceda el paso--")).toBe("ceda-el-paso");
  });
});

describe("readingMinutes", () => {
  it("devuelve siempre al menos un minuto", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("Tres palabras")).toBe(1);
  });

  it("redondea según 200 palabras por minuto", () => {
    expect(readingMinutes(Array.from({ length: 400 }, () => "palabra").join(" "))).toBe(2);
  });
});
