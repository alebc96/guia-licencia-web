#!/usr/bin/env node
/**
 * Generates the sign catalogue from `data/senales.txt`:
 *   - one Markdown file per sign in `content/senales/`
 *   - one schematic SVG per sign in `public/senales/`
 *
 * The SVGs are schematic drawings (shape and colours of the real sign plus a
 * simplified pictogram), not reproductions of the official artwork. That is why
 * every generated ficha credits them as "pictograma esquemático propio".
 *
 * Usage:
 *   node scripts/generate-signs.mjs           write files
 *   node scripts/generate-signs.mjs --check   fail if generated files drift
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "data", "senales.txt");
const MD_DIR = path.join(ROOT, "content", "senales");
const SVG_DIR = path.join(ROOT, "public", "senales");
const CHECK = process.argv.includes("--check");
const UPDATED = "2026-11-11";

const RED = "#c8102e";
const BLUE = "#0055a4";
const YELLOW = "#f2c200";
const BLACK = "#111111";
const WHITE = "#ffffff";

/** Simplified pictograms, drawn inside a 100 × 100 box. */
const GLYPHS = {
  "p-cruce": (ink) => `<rect x="40" y="6" width="20" height="88" fill="${ink}"/><rect x="6" y="40" width="88" height="20" fill="${ink}"/>`,
  "p-obras": (ink) =>
    `<circle cx="44" cy="18" r="9" fill="${ink}"/><rect x="38" y="30" width="12" height="34" rx="6" fill="${ink}"/>` +
    `<rect x="22" y="64" width="56" height="8" rx="4" fill="${ink}"/><rect x="66" y="20" width="7" height="48" rx="3.5" transform="rotate(18 69 44)" fill="${ink}"/>`,
  "r-ceda": () => "",
  "r-stop": (ink) => `<text x="50" y="62" text-anchor="middle" font-family="system-ui, sans-serif" font-size="30" font-weight="700" fill="${ink}">STOP</text>`,
  "r-entrada-prohibida": (ink) => `<rect x="18" y="43" width="64" height="14" rx="4" fill="${ink}"/>`,
  "r-entrada-motor": (ink) =>
    `<path d="M20 62 q4 -14 14 -16 l10 -10 h12 l10 10 q10 2 14 16 l0 6 h-60 z" fill="${ink}"/>` +
    `<circle cx="30" cy="70" r="6" fill="${ink}"/><circle cx="70" cy="70" r="6" fill="${ink}"/>`,
  "r-entrada-bici": (ink) =>
    `<circle cx="28" cy="64" r="14" fill="none" stroke="${ink}" stroke-width="6"/>` +
    `<circle cx="72" cy="64" r="14" fill="none" stroke="${ink}" stroke-width="6"/>` +
    `<path d="M28 64 L46 40 L62 40 L72 64 M46 40 L56 64" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`,
  "r-velocidad": () => `<text x="50" y="64" text-anchor="middle" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="${BLACK}">50</text>`,
  "r-velocidad-minima": () => `<text x="50" y="64" text-anchor="middle" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="${WHITE}">60</text>`,
  "s-autopista": (ink) =>
    `<rect x="14" y="52" width="72" height="10" rx="3" fill="${ink}"/><rect x="26" y="20" width="10" height="44" fill="${ink}"/>` +
    `<rect x="64" y="20" width="10" height="44" fill="${ink}"/><rect x="26" y="20" width="48" height="10" rx="4" fill="${ink}"/>`,
  "s-autovia": (ink) => `<rect x="14" y="52" width="72" height="10" rx="3" fill="${ink}"/><rect x="40" y="18" width="20" height="34" rx="4" fill="${ink}"/>`,
  "s-aparcamiento": (ink) => `<text x="50" y="76" text-anchor="middle" font-family="system-ui, sans-serif" font-size="76" font-weight="700" fill="${ink}">P</text>`,
};

const SLASH = (color) => `<rect x="6" y="92" width="88" height="7" rx="3.5" fill="${color}" transform="rotate(-45 50 50)"/>`;

function baseShape(signal) {
  const { shape, code, family } = signal;

  if (shape === "triangulo") {
    return `<path d="M50 6 L96 90 L4 90 Z" fill="${WHITE}" stroke="${RED}" stroke-width="10" stroke-linejoin="round"/>`;
  }

  if (shape === "triangulo-invertido") {
    return `<path d="M4 10 L96 10 L50 94 Z" fill="${WHITE}" stroke="${RED}" stroke-width="10" stroke-linejoin="round"/>`;
  }

  if (shape === "octogono") {
    return `<path d="M31 4 H69 L96 31 V69 L69 96 H31 L4 69 V31 Z" fill="${RED}"/>`;
  }

  if (shape === "rombo") {
    const fill = code === "R-3" ? YELLOW : WHITE;
    return `<path d="M50 4 L96 50 L50 96 L4 50 Z" fill="${fill}" stroke="${BLACK}" stroke-width="6"/>`;
  }

  if (shape === "circulo") {
    if (family === "indicacion") return `<circle cx="50" cy="50" r="46" fill="${BLUE}"/>`;
    if (code === "R-101") return `<circle cx="50" cy="50" r="46" fill="${RED}"/>`;
    return `<circle cx="50" cy="50" r="45" fill="${WHITE}" stroke="${RED}" stroke-width="10"/>`;
  }

  if (shape === "cuadrado") {
    return `<rect x="5" y="5" width="90" height="90" rx="4" fill="${BLUE}"/>`;
  }

  if (shape === "rectangulo") {
    return `<rect x="4" y="22" width="92" height="56" rx="3" fill="${WHITE}" stroke="${RED}" stroke-width="6"/>`;
  }

  return `<rect x="4" y="4" width="92" height="92" rx="4" fill="${WHITE}" stroke="${BLACK}" stroke-width="5"/>`;
}

const GLYPH_TRANSFORM = {
  triangulo: "translate(22, 40) scale(0.5)",
  "triangulo-invertido": "translate(26, 18) scale(0.42)",
  octogono: "translate(0,0)",
  circulo: "translate(20, 20) scale(0.6)",
  cuadrado: "translate(22, 22) scale(0.56)",
  rectangulo: "translate(22, 34) scale(0.5)",
  rombo: "translate(0,0)",
  panel: "translate(20, 20) scale(0.6)",
};

function renderSign(signal) {
  const { glyph, shape, code, colors } = signal;
  const parts = [`<rect width="100" height="100" fill="none"/>`, baseShape(signal)];

  if (shape === "rombo") {
    parts.push(
      code === "R-3"
        ? `<path d="M50 20 L80 50 L50 80 L20 50 Z" fill="${BLACK}"/>`
        : `<path d="M50 20 L80 50 L50 80 L20 50 Z" fill="${WHITE}" stroke="${BLACK}" stroke-width="5"/><rect x="26" y="46" width="48" height="8" fill="${BLACK}" transform="rotate(-45 50 50)"/>`,
    );
  } else if (shape === "octogono") {
    parts.push(GLYPHS["r-stop"](WHITE));
  } else if (glyph && GLYPHS[glyph]) {
    const ink = colors.includes("blanco") && shape === "cuadrado" ? WHITE : BLUE;
    const inkColor = shape === "cuadrado" || shape === "rectangulo" ? WHITE : colors.includes("azul") ? WHITE : BLACK;
    const transform = GLYPH_TRANSFORM[shape] ?? "translate(0,0)";
    const draw = GLYPHS[glyph];
    parts.push(`<g transform="${transform}">${draw(glyph === "s-autopista" || glyph === "s-autovia" || glyph === "s-aparcamiento" ? inkColor : ink === WHITE ? WHITE : BLACK)}</g>`);
  }

  if (code === "P-18") {
    parts.push(`<path d="M6 92 L94 6" stroke="${YELLOW}" stroke-width="0" />`);
  }

  if (["R-101", "R-102", "R-108", "S-2", "S-4", "S-8"].includes(code)) {
    parts.push(SLASH(code.startsWith("S") ? BLACK : WHITE));
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="240" height="240" role="img">`,
    ...parts,
    `</svg>`,
  ].join("\n");
}

function yamlList(values) {
  return values.length === 0 ? "[]" : `\n${values.map((value) => `  - "${value}"`).join("\n")}`;
}

function renderFrontmatter(signal) {
  const related = signal.related.length === 0 ? "[]" : `[${signal.related.map((code) => `"${code}"`).join(", ")}]`;
  const lines = [
    "---",
    `code: "${signal.code}"`,
    `name: "${signal.name}"`,
    `family: "${signal.family}"`,
    `subfamily: "${signal.subfamily}"`,
    `shape: "${signal.shape}"`,
    `colors:${yamlList(signal.colors)}`,
    `meaning: "${signal.meaning}"`,
    `action: "${signal.action}"`,
    `where: "${signal.where}"`,
  ];

  if (signal.mistake) lines.push(`mistake: "${signal.mistake}"`);

  lines.push(
    `related: ${related}`,
    `image: "/senales/${signal.slug}.svg"`,
    `imageAlt: "${signal.code}, ${signal.name}"`,
    `imageCredit: "Pictograma esquemático propio; no reproduce el símbolo oficial"`,
    `officialSource: "RD 1428/2003, anexo I (catálogo de señales)"`,
    `tier: "${signal.tier}"`,
    `isNew: false`,
    `verified: ${signal.verified}`,
    `updated: ${UPDATED}`,
    "---",
    "",
  );

  return lines.join("\n");
}

function parseData() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const signals = [];
  const problems = [];

  raw.split("\n").forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("#")) return;

    const fields = trimmed.split("|");
    if (fields.length !== 14) {
      problems.push(`line ${index + 1}: expected 14 fields, found ${fields.length}`);
      return;
    }

    const [code, name, family, subfamily, shape, colors, glyph, meaning, action, where, mistake, related, tier, verified] =
      fields.map((field) => field.trim());

    const slug = code.toLowerCase();
    signals.push({
      code,
      name,
      family,
      subfamily,
      shape,
      colors: colors.split(",").map((color) => color.trim()).filter(Boolean),
      glyph: glyph || null,
      meaning,
      action,
      where,
      mistake: mistake || null,
      related: related ? related.split(",").map((value) => value.trim()) : [],
      tier,
      verified: verified === "true",
      slug,
    });
  });

  return { signals, problems };
}

function main() {
  const { signals, problems } = parseData();
  if (problems.length > 0) {
    console.error("data/senales.txt has invalid rows:");
    for (const problem of problems) console.error(`  · ${problem}`);
    process.exit(1);
  }

  const codes = new Set();
  for (const signal of signals) {
    if (codes.has(signal.code)) {
      console.error(`Duplicated code in data/senales.txt: ${signal.code}`);
      process.exit(1);
    }
    codes.add(signal.code);
  }

  if (!CHECK) {
    fs.mkdirSync(MD_DIR, { recursive: true });
    fs.mkdirSync(SVG_DIR, { recursive: true });
  }

  const drift = [];

  for (const signal of signals) {
    const mdPath = path.join(MD_DIR, `${signal.slug}.md`);
    const svgPath = path.join(SVG_DIR, `${signal.slug}.svg`);
    const md = renderFrontmatter(signal);
    const svg = renderSign(signal);

    if (CHECK) {
      const currentMd = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, "utf8") : null;
      const currentSvg = fs.existsSync(svgPath) ? fs.readFileSync(svgPath, "utf8") : null;
      if (currentMd !== md) drift.push(path.relative(ROOT, mdPath));
      if (currentSvg !== svg) drift.push(path.relative(ROOT, svgPath));
      continue;
    }

    fs.writeFileSync(mdPath, md);
    fs.writeFileSync(svgPath, svg);
  }

  if (CHECK && drift.length > 0) {
    console.error("Generated sign files are out of date. Run `npm run generate:signs`:");
    for (const file of drift) console.error(`  · ${file}`);
    process.exit(1);
  }

  console.log(`${CHECK ? "Checked" : "Generated"} ${signals.length} signs (${MD_DIR} and ${SVG_DIR}).`);
}

main();
