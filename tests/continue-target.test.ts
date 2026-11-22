import { describe, expect, it } from "vitest";

import { continueTarget } from "@/components/progress/ContinueLink";

const TEMAS = [
  { slug: "uno", order: 1 },
  { slug: "dos", order: 2 },
  { slug: "tres", order: 3 },
];

describe("continueTarget", () => {
  it("sin historial empieza por el tema 1", () => {
    expect(continueTarget(TEMAS, [], null, "Empezar")).toEqual({ href: "/temario/uno", label: "Empezar" });
  });

  it("vuelve al último tema abierto si no está leído", () => {
    expect(continueTarget(TEMAS, ["uno"], "tres", "Empezar")).toEqual({
      href: "/temario/tres",
      label: "Seguir en el tema 03",
    });
  });

  it("si el último abierto ya está leído, sigue por el primer pendiente", () => {
    expect(continueTarget(TEMAS, ["uno"], "uno", "Empezar")).toEqual({
      href: "/temario/dos",
      label: "Seguir con el tema 02",
    });
  });

  it("abrir el tema 1 sin marcarlo ya cuenta como empezado", () => {
    expect(continueTarget(TEMAS, [], "uno", "Empezar").label).toBe("Seguir en el tema 01");
  });

  it("con todo leído propone repasar el temario", () => {
    expect(continueTarget(TEMAS, ["uno", "dos", "tres"], "dos", "Empezar")).toEqual({
      href: "/temario",
      label: "Repasar el temario",
    });
  });

  it("ignora un último tema que ya no existe", () => {
    expect(continueTarget(TEMAS, [], "borrado", "Empezar").label).toBe("Seguir con el tema 01");
  });
});
