// @vitest-environment node
import { describe, expect, it } from "vitest";
import { scanText } from "../scripts/check-secrets.mjs";

/**
 * The guard is only useful if it catches the shapes that actually leak and stays
 * quiet on the content the repository legitimately publishes.
 *
 * The fixtures are assembled at runtime on purpose: `check-secrets` scans the
 * tracked files, so a literal sample token inside this test would be reported as
 * a leak — correctly.
 */
const ghToken = ["ghp", "abcdefghijklmnopqrstuvwxyz0123456789"].join("_");
const openaiKey = ["sk", "proj", "abcdefghijklmnopqrstuvwxyz"].join("-");
const awsKey = `AKIA${"IOSFODNN7EXAMPLE"}`;
const keyHeader = ["-----BEGIN", "RSA PRIVATE", "KEY-----"].join(" ");
const email = ["persona.apellido", "dominio.es"].join("@");
const homePath = [`/${["home", "persona"].join("/")}`, "proyecto"].join("/");

describe("check-secrets", () => {
  it("detecta credenciales con forma conocida", () => {
    const cases: Array<[string, string]> = [
      ["github-token", `const t = '${ghToken}';`],
      ["openai-key", `OPENAI=${openaiKey}`],
      ["aws-access-key", awsKey],
      ["private-key", keyHeader],
    ];

    for (const [code, line] of cases) {
      expect(scanText(line, "fixture.ts").map((finding) => finding.code), line).toContain(code);
    }
  });

  it("detecta correos y rutas personales", () => {
    expect(scanText(`contacto: ${email}`, "f.md").map((f) => f.code)).toContain("email");
    expect(scanText(`workdir ${homePath}`, "f.md").map((f) => f.code)).toContain("home-path");
  });

  it("no marca direcciones técnicas ni ejemplos de documentación", () => {
    const clean = [
      "git@github.com:usuario/repositorio.git",
      "noreply@github.com",
      "algo@example.com",
      "password: ${{ secrets.GITHUB_TOKEN }}",
      "server_tokens off;",
      "los tokens de diseño están en :root",
      "import { Hero } from '@/components/home/Hero';",
      'import { TopicGrid } from "@/components/home/TopicGrid";',
    ].join("\n");

    expect(scanText(clean, "fixture.yml")).toEqual([]);
  });

  it("informa de la línea exacta del hallazgo", () => {
    const findings = scanText(`línea uno\nlínea dos\nconst k = '${ghToken}';`, "f.ts");
    expect(findings).toHaveLength(1);
    expect(findings[0]?.line).toBe(3);
  });
});
