import { describe, expect, it } from "vitest";

import { decodeProgress, encodeProgress } from "@/lib/progress-transfer";

const b64url = (text: string) => Buffer.from(text, "utf-8").toString("base64url");

describe("progress-transfer", () => {
  it("hace roundtrip del progreso", () => {
    const state = { temas: ["a", "b"], senales: ["P-1", "señal ñ"] };
    expect(decodeProgress(encodeProgress(state))).toEqual(state);
  });

  it("genera base64url sin padding", () => {
    expect(encodeProgress({ temas: ["ñ?>"], senales: [] })).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("acepta un enlace completo y espacios alrededor", () => {
    const state = { temas: ["a"], senales: ["b"] };
    const link = `https://x.test/progreso/#importar=${encodeProgress(state)}`;
    expect(decodeProgress(`  ${link}\n`)).toEqual(state);
  });

  it("rechaza basura, JSON inválido y otra versión", () => {
    expect(decodeProgress("")).toBeNull();
    expect(decodeProgress("%%%")).toBeNull();
    expect(decodeProgress(b64url("no es json"))).toBeNull();
    expect(decodeProgress(b64url(JSON.stringify({ v: 2, t: [], s: [] })))).toBeNull();
    expect(decodeProgress(b64url(JSON.stringify({ v: 1, t: [1], s: [] })))).toBeNull();
    expect(decodeProgress(b64url(JSON.stringify({ v: 1, t: [] })))).toBeNull();
  });

  it("deduplica", () => {
    const code = b64url(JSON.stringify({ v: 1, t: ["a", "a"], s: ["b", "b", "c"] }));
    expect(decodeProgress(code)).toEqual({ temas: ["a"], senales: ["b", "c"] });
  });

  it("con la lista de ids conocidos descarta lo que no existe", () => {
    const code = encodeProgress({ temas: ["a", "inventado"], senales: ["R-1", "<script>"] });
    expect(decodeProgress(code, { temas: ["a"], senales: ["R-1"] })).toEqual({ temas: ["a"], senales: ["R-1"] });
  });

  it("si no queda nada reconocible lo trata como inválido", () => {
    const code = encodeProgress({ temas: ["inventado"], senales: [] });
    expect(decodeProgress(code, { temas: ["a"], senales: [] })).toBeNull();
  });

  it("rechaza códigos desmesurados", () => {
    expect(decodeProgress("a".repeat(20_001))).toBeNull();
  });
});
