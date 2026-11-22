// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { ProgressProvider } from "@/components/progress/ProgressProvider";
import { ProgressTransfer } from "@/components/progress/ProgressTransfer";
import { encodeProgress } from "@/lib/progress-transfer";

const STORAGE_KEY = "guiab.progress.v1";
const KNOWN = { temas: ["a", "b", "c", "x"], senales: ["s1", "s2"] };

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, "", "/");
});

afterEach(cleanup);

function renderTransfer() {
  return render(
    <ProgressProvider totalTemas={17}>
      <ProgressTransfer known={KNOWN} />
    </ProgressProvider>,
  );
}

describe("ProgressTransfer", () => {
  it("combina un código válido con el progreso guardado", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ temas: ["a", "b"], senales: ["s1"] }));
    renderTransfer();

    const code = encodeProgress({ temas: ["b", "c"], senales: ["s2"] });
    fireEvent.change(screen.getByLabelText("Pega aquí el código o el enlace"), { target: { value: code } });
    fireEvent.click(screen.getByRole("button", { name: "Importar" }));

    expect(screen.getByText("Importado: 2 temas y 1 señal")).toBeTruthy();
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as { temas: string[]; senales: string[] };
    expect(saved.temas.sort()).toEqual(["a", "b", "c"]);
    expect(saved.senales.sort()).toEqual(["s1", "s2"]);
  });

  it("muestra un error con un código inválido y no guarda nada", () => {
    renderTransfer();

    fireEvent.change(screen.getByLabelText("Pega aquí el código o el enlace"), { target: { value: "basura" } });
    fireEvent.click(screen.getByRole("button", { name: "Importar" }));

    expect(screen.getByRole("alert").textContent).toContain("no es válido");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("pide confirmación antes de importar desde el hash", () => {
    window.history.replaceState(null, "", `/#importar=${encodeProgress({ temas: ["x"], senales: [] })}`);
    renderTransfer();

    expect(screen.getByRole("status").textContent).toContain("1 tema y 0 señales");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: "Importar" })[0]);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}").temas).toEqual(["x"]);
    expect(window.location.hash).toBe("");
  });
});
