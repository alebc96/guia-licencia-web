// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { ProgressProvider } from "@/components/progress/ProgressProvider";
import { ProgressToggle } from "@/components/progress/ProgressToggle";

/**
 * Progress is stored only in `localStorage` (no account, no cookie, no server).
 * These tests drive the public control: the label, `aria-pressed` and what ends
 * up in storage.
 */

const STORAGE_KEY = "guiab.progress.v1";
const TEMA = "tipos-de-vehiculos";

function renderToggle() {
  return render(
    <ProgressProvider totalTemas={17}>
      <ProgressToggle kind="tema" id={TEMA} doneLabel="Leído" pendingLabel="Marcar como leído" />
    </ProgressProvider>,
  );
}

function stored(): { temas: string[]; senales: string[] } {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as { temas: string[]; senales: string[] }) : { temas: [], senales: [] };
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(cleanup);

describe("ProgressToggle", () => {
  it("empieza en el estado pendiente", () => {
    renderToggle();

    const button = screen.getByRole("button", { name: "Marcar como leído" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByText("Leído")).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("marca el tema como leído y lo guarda en localStorage", () => {
    renderToggle();

    fireEvent.click(screen.getByRole("button", { name: "Marcar como leído" }));

    const button = screen.getByRole("button", { name: "Leído" });
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(stored().temas).toEqual([TEMA]);
  });

  it("vuelve al estado pendiente y borra el progreso al pulsar otra vez", () => {
    renderToggle();

    fireEvent.click(screen.getByRole("button", { name: "Marcar como leído" }));
    fireEvent.click(screen.getByRole("button", { name: "Leído" }));

    const button = screen.getByRole("button", { name: "Marcar como leído" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(stored().temas).toEqual([]);
  });

  it("recupera el estado guardado después de volver a montar el componente", () => {
    const first = renderToggle();
    fireEvent.click(screen.getByRole("button", { name: "Marcar como leído" }));
    first.unmount();

    renderToggle();

    const button = screen.getByRole("button", { name: "Leído" });
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });
});
