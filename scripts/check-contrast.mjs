#!/usr/bin/env node
/**
 * Comprueba el contraste WCAG 2.2 de los pares de color de cada tema.
 * Lee las paletas directamente de src/styles/themes/_palettes.scss, así que
 * cualquier cambio de color que rompa la accesibilidad hace fallar el check.
 *
 *   node scripts/check-contrast.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scss = readFileSync(join(root, "src/styles/themes/_palettes.scss"), "utf8");

function parsePalette(name) {
  const match = scss.match(new RegExp(`\\$${name}:\\s*\\(([\\s\\S]*?)\\n\\);`));
  if (!match) throw new Error(`Paleta $${name} no encontrada`);
  const palette = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^\s*([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*,/i);
    if (m) palette[m[1]] = m[2];
  }
  return palette;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [primer plano, fondo, mínimo, descripción]
const AAA = 7;
const AA = 4.5;
const UI = 3;
const pairs = [
  ["text", "bg", AAA, "cuerpo sobre lienzo"],
  ["text", "bg-soft", AAA, "cuerpo sobre banda"],
  ["text", "surface", AAA, "cuerpo sobre tarjeta"],
  ["text-muted", "bg", AA, "secundario sobre lienzo"],
  ["text-muted", "bg-soft", AA, "secundario sobre banda"],
  ["text-subtle", "bg", AA, "terciario sobre lienzo"],
  ["text-subtle", "bg-soft", AA, "terciario sobre banda"],
  ["text-subtle", "surface", AA, "terciario sobre tarjeta"],
  ["primary", "bg", AA, "enlace sobre lienzo"],
  ["primary", "bg-soft", AA, "enlace sobre banda"],
  ["primary", "primary-soft", AA, "chip activo"],
  ["primary-hover", "bg", AA, "enlace hover"],
  ["on-primary", "primary", AA, "botón primario"],
  ["on-primary", "primary-hover", AA, "botón primario hover"],
  ["on-accent", "accent", AA, "botón de marca"],
  ["accent-ink", "bg", AA, "etiqueta de marca sobre lienzo"],
  ["accent-ink", "surface", AA, "etiqueta de marca sobre tarjeta"],
  ["accent-ink", "accent-soft", AA, "aviso (callout)"],
  ["text", "accent-soft", AAA, "texto del aviso"],
  ["success", "bg", AA, "estado leído"],
  ["bg", "success", AA, "botón leído"],
  ["warning-ink", "warning-soft", AA, "badge pendiente"],
  ["text", "mark", AA, "texto resaltado"],
  ["inverse-text", "inverse-bg", AAA, "banda invertida"],
  ["inverse-muted", "inverse-bg", AA, "banda invertida secundario"],
  ["inverse-link", "inverse-bg", AA, "enlace en banda invertida"],
  ["selection-text", "selection-bg", AA, "selección"],
  ["border-strong", "bg", UI, "borde de control"],
  ["border-strong", "surface", UI, "borde de control en tarjeta"],
  ["focus", "bg", UI, "anillo de foco"],
  ["focus", "bg-soft", UI, "anillo de foco en banda"],
];

let failures = 0;
for (const theme of ["light", "dark", "reading"]) {
  const p = parsePalette(theme);
  console.log(`\n${theme.toUpperCase()}`);
  for (const [fg, bg, min, label] of pairs) {
    if (!p[fg] || !p[bg]) {
      console.log(`  ·  ${label.padEnd(34)} (omitido: ${!p[fg] ? fg : bg} no es un hex opaco)`);
      continue;
    }
    const r = ratio(p[fg], p[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    const level = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA-grande/UI" : "—";
    console.log(`  ${ok ? "✓" : "✗"}  ${label.padEnd(34)} ${r.toFixed(2).padStart(5)}:1  ${level.padEnd(12)} (mín. ${min})`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} par(es) por debajo del mínimo.`);
  process.exit(1);
}
console.log("\nTodos los pares cumplen.");
