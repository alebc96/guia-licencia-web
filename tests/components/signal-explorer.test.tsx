// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import { SignalExplorer, type ExplorerSignal } from "@/components/senales/SignalExplorer";

/**
 * Catalogue filter: search by code or name, family chips and an honest status
 * line. The component is client-side only and keeps no state outside React.
 */

const SIGNALS: ExplorerSignal[] = [
  {
    code: "P-1",
    name: "Cruce de vías",
    family: "peligro",
    subfamily: "interseccion",
    meaning: "Anuncia una intersección con la norma general de prioridad.",
    image: "/senales/p-1.svg",
    imageAlt: "P-1, Cruce de vías",
    tier: "B",
    isNew: false,
  },
  {
    code: "R-301",
    name: "Velocidad máxima",
    family: "reglamentacion",
    subfamily: "velocidad",
    meaning: "Prohíbe circular a más de la velocidad indicada, en km/h.",
    image: "/senales/r-301.svg",
    imageAlt: "R-301, Velocidad máxima",
    tier: "A",
    isNew: false,
  },
  {
    code: "S-1",
    name: "Entrada a autopista",
    family: "indicacion",
    subfamily: "via",
    meaning: "Indica el comienzo de una autopista.",
    image: "/senales/s-1.svg",
    imageAlt: "S-1, Entrada a autopista",
    tier: "A",
    isNew: false,
  },
];

const CODES = SIGNALS.map((signal) => signal.code);

function listedCodes(): string[] {
  return screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "")
    .map((href) => href.replace("/senales/", "").toUpperCase());
}

function searchBox(): HTMLInputElement {
  return screen.getByLabelText("Buscar por código o nombre") as HTMLInputElement;
}

function statusLine(): HTMLElement {
  return screen.getByRole("status");
}

function chip(name: RegExp): HTMLElement {
  return screen.getByRole("button", { name });
}

afterEach(cleanup);

describe("SignalExplorer", () => {
  it("lista todas las señales al arrancar", () => {
    render(<SignalExplorer signals={SIGNALS} />);

    expect(listedCodes()).toEqual(CODES);
    expect(statusLine().textContent).toContain("3 señales");
    expect(chip(/^Todas/).getAttribute("aria-pressed")).toBe("true");
  });

  it("filtra por código al escribir en el buscador", () => {
    render(<SignalExplorer signals={SIGNALS} />);

    fireEvent.change(searchBox(), { target: { value: "R-301" } });

    expect(listedCodes()).toEqual(["R-301"]);
    expect(screen.queryByText("Cruce de vías")).toBeNull();
    expect(statusLine().textContent).toContain("1 señal");
    expect(statusLine().textContent).toContain("para «R-301»");
  });

  it("filtra por nombre sin importar acentos ni mayúsculas", () => {
    render(<SignalExplorer signals={SIGNALS} />);

    fireEvent.change(searchBox(), { target: { value: "AUTOPISTA" } });

    expect(listedCodes()).toEqual(["S-1"]);
  });

  it("filtra por familia con el chip y lo marca como pulsado", () => {
    render(<SignalExplorer signals={SIGNALS} />);

    fireEvent.click(chip(/^Peligro/));

    expect(listedCodes()).toEqual(["P-1"]);
    expect(chip(/^Peligro/).getAttribute("aria-pressed")).toBe("true");
    expect(chip(/^Todas/).getAttribute("aria-pressed")).toBe("false");
    expect(statusLine().textContent).toContain("1 señal en Peligro");
  });

  it("informa del número de señales visibles en la línea de estado", () => {
    render(<SignalExplorer signals={SIGNALS} />);

    expect(statusLine().textContent).toContain("3 señales");

    fireEvent.click(chip(/^Reglamentación/));
    expect(statusLine().textContent).toContain("1 señal en Reglamentación");

    fireEvent.click(chip(/^Todas/));
    expect(statusLine().textContent).toContain("3 señales");
  });

  it("muestra un estado vacío con un botón que restaura el catálogo", () => {
    render(<SignalExplorer signals={SIGNALS} />);

    fireEvent.change(searchBox(), { target: { value: "helicoptero" } });

    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(statusLine().textContent).toContain("0 señales");
    expect(screen.getByText("No hay señales con ese criterio.")).not.toBeNull();

    const emptyState = screen.getByText("No hay señales con ese criterio.").closest("div") as HTMLElement;
    fireEvent.click(within(emptyState).getByRole("button", { name: "Limpiar filtros" }));

    expect(searchBox().value).toBe("");
    expect(listedCodes()).toEqual(CODES);
    expect(statusLine().textContent).toContain("3 señales");
    expect(screen.queryByText("No hay señales con ese criterio.")).toBeNull();
  });
});
