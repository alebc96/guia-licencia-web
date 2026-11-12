import { describe, expect, it } from "vitest";
import { compile } from "sass";

const css = compile("src/styles/main.scss").css;

describe("tamaño de texto", () => {
  it.each([
    ["s", "92%"],
    ["m", "100%"],
    ["l", "112%"],
    ["xl", "125%"],
  ])("html[data-text-size=%s] escala la raíz a %s", (size, pct) => {
    const rule = new RegExp(`html\\[data-text-size="?${size}"?\\]\\s*\\{([^}]*)\\}`).exec(css);
    expect(rule?.[1]).toMatch(new RegExp(`font-size:\\s*${pct}`));
  });

  it("no queda ninguna variable de escala que otra regla pueda pisar", () => {
    expect(css).not.toContain("--user-scale");
  });
});
