// @vitest-environment node
import { describe, expect, it } from "vitest";
import { scanText } from "../scripts/check-secrets.mjs";

/**
 * The guard is only useful if it catches the shapes that actually leak and
 * stays quiet on the content the repository legitimately publishes.
 */
describe("check-secrets", () => {
  it("detecta credenciales con forma conocida", () => {
    const cases: Array<[string, string]> = [
      ["github-token", "const t = 'ghp_abcdefghijklmnopqrstuvwxyz0123456789';"],
      ["openai-key", "OPENAI=sk-proj-abcdefghijklmnopqrstuvwxyz"],
      ["aws-access-key", "AKIAIOSFODNN7EXAMPLE"],
      ["private-key", "-----BEGIN RSA PRIVATE KEY-----"],
    ];

    for (const [code, line] of cases) {
      const findings = scanText(line, "fixture.ts");
      expect(findings.map((finding) => finding.code), line).toContain(code);
    }
  });

  it("detecta correos y rutas personales", () => {
    expect(scanText("contacto: persona.apellido@dominio.es", "f.md").map((f) => f.code)).toContain("email");
    expect(scanText("workdir /home/persona/proyecto", "f.md").map((f) => f.code)).toContain("home-path");
  });

  it("no marca direcciones técnicas ni examples de documentación", () => {
    const clean = [
      "git@github.com:usuario/repositorio.git",
      "noreply@github.com",
      "algo@example.com",
      "password: ${{ secrets.GITHUB_TOKEN }}",
      "server_tokens off;",
      "los tokens de diseño están en :root",
      "import { Hero } from '@/components/home/Hero';",
      "import { TopicGrid } from \"@/components/home/TopicGrid\";",
    ].join("\n");

    expect(scanText(clean, "fixture.yml")).toEqual([]);
  });

  it("informa de la línea exacta del hallazgo", () => {
    const findings = scanText("línea uno\nlínea dos\nconst k = 'ghp_abcdefghijklmnopqrstuvwxyz0123456789';", "f.ts");
    expect(findings).toHaveLength(1);
    expect(findings[0]?.line).toBe(3);
  });
});
