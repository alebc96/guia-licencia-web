// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

async function gaIdOn(hostname: string, buildId?: string) {
  vi.resetModules();
  if (buildId !== undefined) vi.stubEnv("NEXT_PUBLIC_GA_ID", buildId);
  vi.stubGlobal("location", { ...window.location, hostname });
  const { getGaId } = await import("@/lib/analytics");
  return getGaId();
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getGaId", () => {
  it("activa el id de producción solo en el dominio de producción", async () => {
    expect(await gaIdOn("autoescuelaguide.com")).toBe("G-68N32CQT0G");
    expect(await gaIdOn("www.autoescuelaguide.com")).toBe("G-68N32CQT0G");
    expect(await gaIdOn("localhost")).toBe("");
    expect(await gaIdOn("alebc96.github.io")).toBe("");
  });

  it("el valor del build manda, y vacío apaga la analítica", async () => {
    expect(await gaIdOn("localhost", "G-OTRO")).toBe("G-OTRO");
    expect(await gaIdOn("autoescuelaguide.com", "")).toBe("");
  });
});
