// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

/**
 * The banner must ask before anything from Google loads, give accept and
 * reject the same weight and remember the choice.
 */

const CONSENT_KEY = "guiab.consent.v1";

async function renderBanner() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123");
  const { ConsentBanner } = await import("@/components/consent/ConsentBanner");
  return render(<ConsentBanner />);
}

function gaScripts() {
  return document.head.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length;
}

beforeEach(() => {
  window.localStorage.clear();
  document.head.innerHTML = "";
  delete window.gtag;
  delete window.dataLayer;
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("ConsentBanner", () => {
  it("pregunta sin cargar nada de Google", async () => {
    await renderBanner();

    expect(screen.getByRole("button", { name: "Aceptar" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Rechazar" })).toBeTruthy();
    expect(gaScripts()).toBe(0);
  });

  it("al aceptar carga Analytics y lo recuerda", async () => {
    await renderBanner();
    fireEvent.click(screen.getByRole("button", { name: "Aceptar" }));

    expect(gaScripts()).toBe(1);
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("granted");
    expect(screen.queryByRole("button", { name: "Aceptar" })).toBeNull();
  });

  it("al rechazar no carga nada y no vuelve a preguntar", async () => {
    await renderBanner();
    fireEvent.click(screen.getByRole("button", { name: "Rechazar" }));

    expect(gaScripts()).toBe(0);
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("denied");
    cleanup();

    await renderBanner();
    expect(screen.queryByRole("button", { name: "Rechazar" })).toBeNull();
  });

  it("sin id de Analytics no muestra nada", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    const { ConsentBanner } = await import("@/components/consent/ConsentBanner");
    render(<ConsentBanner />);

    expect(screen.queryByRole("button", { name: "Aceptar" })).toBeNull();
  });
});
