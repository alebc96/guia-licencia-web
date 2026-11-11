import { describe, expect, it } from "vitest";

import {
  countByFamily,
  filterSenales,
  normalize,
  relatedSenales,
  sortSenales,
  type FilterableSenal,
} from "@/lib/catalog";

/**
 * Catalogue helpers: search normalisation, filtering, ordering and the
 * "related signs" rule. Fixtures are inline objects shaped like the real
 * catalogue entries (no filesystem, no build step).
 */

interface FixtureSenal extends FilterableSenal {
  related: string[];
}

const SENALES: FixtureSenal[] = [
  {
    code: "P-1",
    name: "Cruce de vías",
    family: "peligro",
    tier: "B",
    subfamily: "interseccion",
    meaning: "Anuncia una intersección con la norma general de prioridad.",
    related: ["R-1"],
  },
  {
    code: "R-301",
    name: "Velocidad máxima",
    family: "reglamentacion",
    tier: "A",
    subfamily: "velocidad",
    meaning: "Prohíbe circular a más de la velocidad indicada, en km/h.",
    related: ["R-411"],
  },
  {
    code: "R-2",
    name: "Parada obligatoria (STOP)",
    family: "reglamentacion",
    tier: "A",
    subfamily: "prioridad",
    meaning: "Obliga a detener por completo el vehículo.",
    related: [],
  },
  {
    code: "R-411",
    name: "Velocidad mínima",
    family: "reglamentacion",
    tier: "B",
    subfamily: "velocidad",
    meaning: "Obliga a circular, como mínimo, a la velocidad indicada.",
    related: ["R-301"],
  },
  {
    code: "S-1",
    name: "Entrada a autopista",
    family: "indicacion",
    tier: "A",
    subfamily: "via",
    meaning: "Indica el comienzo de una autopista.",
    related: [],
  },
];

function codes(senales: readonly { code: string }[]): string[] {
  return senales.map((senal) => senal.code);
}

describe("normalize", () => {
  it("quita acentos y pasa a minúsculas", () => {
    expect(normalize("Velocidad MÁXIMA")).toBe("velocidad maxima");
    expect(normalize("Peatón")).toBe("peaton");
    expect(normalize("ÁÉÍÓÚÜÑ")).toBe("aeiouun");
  });

  it("recorta los espacios de los extremos", () => {
    expect(normalize("  ceda el paso  ")).toBe("ceda el paso");
  });
});

describe("filterSenales", () => {
  it("devuelve todo el catálogo sin filtros", () => {
    expect(codes(filterSenales(SENALES))).toEqual(codes(SENALES));
  });

  it("filtra por familia", () => {
    expect(codes(filterSenales(SENALES, { family: "peligro" }))).toEqual(["P-1"]);
    expect(codes(filterSenales(SENALES, { family: "reglamentacion" }))).toEqual(["R-301", "R-2", "R-411"]);
  });

  it("filtra por nivel y combina con la familia", () => {
    expect(codes(filterSenales(SENALES, { tier: "B" }))).toEqual(["P-1", "R-411"]);
    expect(codes(filterSenales(SENALES, { family: "reglamentacion", tier: "A" }))).toEqual(["R-301", "R-2"]);
  });

  it("exige que la consulta multi-palabra case por completo", () => {
    expect(codes(filterSenales(SENALES, { query: "velocidad maxima" }))).toEqual(["R-301"]);
    expect(codes(filterSenales(SENALES, { query: "velocidad" }))).toEqual(["R-301", "R-411"]);
  });

  it("encuentra coincidencias sin importar acentos ni mayúsculas", () => {
    expect(codes(filterSenales(SENALES, { query: "MAXIMA" }))).toEqual(["R-301"]);
    expect(codes(filterSenales(SENALES, { query: "autopista" }))).toEqual(["S-1"]);
    expect(codes(filterSenales(SENALES, { query: "via" }))).toEqual(["P-1", "S-1"]);
  });

  it("busca también por código oficial", () => {
    expect(codes(filterSenales(SENALES, { query: "r-301" }))).toEqual(["R-301"]);
  });

  it("devuelve una lista vacía cuando no hay coincidencias", () => {
    expect(filterSenales(SENALES, { query: "helicoptero" })).toEqual([]);
    expect(filterSenales(SENALES, { family: "semaforo" })).toEqual([]);
  });
});

describe("sortSenales", () => {
  it("ordena por familia y después por código numérico", () => {
    const shuffled = [SENALES[4], SENALES[2], SENALES[1], SENALES[0], SENALES[3]] as FixtureSenal[];
    expect(codes(sortSenales(shuffled))).toEqual(["P-1", "R-2", "R-301", "R-411", "S-1"]);
  });

  it("no muta la lista original", () => {
    const original = [...SENALES];
    sortSenales(original);
    expect(codes(original)).toEqual(codes(SENALES));
  });
});

describe("countByFamily", () => {
  it("cuenta las señales de cada familia presente", () => {
    expect(countByFamily(SENALES)).toEqual({ peligro: 1, reglamentacion: 3, indicacion: 1 });
  });

  it("devuelve un objeto vacío para una lista vacía", () => {
    expect(countByFamily([])).toEqual({});
  });
});

describe("relatedSenales", () => {
  it("respeta los códigos explícitos antes del relleno por familia", () => {
    const senal = SENALES.find((item) => item.code === "R-301") as FixtureSenal;
    const related = relatedSenales(senal, SENALES, 2);

    expect(codes(related)).toEqual(["R-411", "R-2"]);
  });

  it("usa señales de la familia cuando no hay códigos explícitos", () => {
    const senal = SENALES.find((item) => item.code === "R-2") as FixtureSenal;

    expect(codes(relatedSenales(senal, SENALES, 2))).toEqual(["R-301", "R-411"]);
  });

  it("nunca devuelve la propia señal", () => {
    for (const senal of SENALES) {
      const related = relatedSenales(senal, SENALES, SENALES.length);
      expect(codes(related)).not.toContain(senal.code);
    }
  });

  it("no repite un código explícito al rellenar con la familia", () => {
    const senal = SENALES.find((item) => item.code === "R-301") as FixtureSenal;
    const related = relatedSenales(senal, SENALES, 4);

    expect(codes(related)).toEqual(["R-411", "R-2"]);
    expect(new Set(codes(related)).size).toBe(related.length);
  });
});
