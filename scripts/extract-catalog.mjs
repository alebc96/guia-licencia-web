#!/usr/bin/env node
/**
 * Extracts the official sign catalogue from the BOE PDF of the Catálogo de
 * señales verticales de circulación (RD 465/2025, Tomo I) and writes
 * `data/catalogo-oficial.json`.
 *
 * The PDF is not vendored in the repository (it is ~14 MB and it is a public
 * document). Download it and pass the path:
 *
 *   pdftotext -layout 5-SENALES-VERTICALES-DE-CIRCULACION.pdf /tmp/tomo1.txt
 *   node scripts/extract-catalog.mjs /tmp/tomo1.txt
 *
 * Source of the PDF: https://www.boe.es/eli/es/rd/2025/06/10/465
 * (copy used while building: https://aeaclub.org/wp-content/uploads/2025/06/5-SENALES-VERTICALES-DE-CIRCULACION.pdf)
 *
 * The output is the artifact that `generate-signs.mjs` consumes, so the
 * catalogue can be rebuilt without the PDF.
 */

import fs from "node:fs";
import path from "node:path";

const input = process.argv[2] ?? "/tmp/tomo1.txt";
const output = path.join(process.cwd(), "data", "catalogo-oficial.json");

const SKIP = /^(BOLETÍN OFICIAL DEL ESTADO|Núm\. \d+|cve: BOE|Verificable en|https:\/\/www\.boe\.es|Sec\. I\.)/;
/** Definition text is indented to the same column as the entry name. */
const BODY = /^\s{12,}(\S.*)$/;
const ENTRY = /^\s{8,24}([PRS]-\d+[a-z]?(?:[.-]\d+)?)\s{2,}(\S.*)$/;
const CONTINUATION = /^\s{28,}(\S.*)$/;
const SECTION = /^\s{8,}(SEÑALES [A-ZÁÉÍÓÚÑÜÍ ,]+)\s*$/;

/** Section title from the BOE catalogue to the family used by the site. */
const SECTION_MAP = {
  "SEÑALES DE ADVERTENCIA DE PELIGRO": { family: "peligro", subfamily: "advertencia" },
  "SEÑALES DE PRIORIDAD": { family: "reglamentacion", subfamily: "prioridad" },
  "SEÑALES DE PROHIBICIÓN DE ENTRADA": { family: "reglamentacion", subfamily: "prohibicion-de-entrada" },
  "SEÑALES DE RESTRICCIÓN DE PASO": { family: "reglamentacion", subfamily: "restriccion-de-paso" },
  "SEÑALES DE OBLIGACIÓN": { family: "reglamentacion", subfamily: "obligacion" },
  "SEÑALES DE INDICACIONES GENERALES": { family: "indicacion", subfamily: "indicaciones-generales" },
  "SEÑALES DE CARRILES": { family: "indicacion", subfamily: "carriles" },
  "SEÑALES DE SERVICIO": { family: "indicacion", subfamily: "servicio" },
  "SEÑALES DE LOCALIZACIÓN": { family: "indicacion", subfamily: "localizacion" },
  "SEÑALES DE PRESEÑALIZACIÓN": { family: "indicacion", subfamily: "presenalizacion" },
  "SEÑALES DE CONFIRMACIÓN": { family: "indicacion", subfamily: "confirmacion" },
  "SEÑALES DE IDENTIFICACIÓN DE CARRETERAS": { family: "indicacion", subfamily: "identificacion-carreteras" },
  "SEÑALES DE USO ESPECÍFICO EN POBLADO": { family: "indicacion", subfamily: "uso-especifico-poblado" },
};

const text = fs.readFileSync(input, "utf8");
const lines = text.split("\n");

const entries = [];
let current = null;
let section = null;

function joinBlocks(blocks) {
  return blocks
    .map((block) => block.replace(/\s+/g, " ").replace(/\s+([.,;:])/g, "$1").trim())
    .filter(Boolean);
}

for (const raw of lines) {
  const line = raw.replace(/\s+$/, "");
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    // A blank line closes the definition paragraph that was being read.
    if (current) current.open = false;
    continue;
  }
  if (SKIP.test(trimmed)) continue;

  const sectionMatch = SECTION.exec(line);
  if (sectionMatch && sectionMatch[1] === sectionMatch[1].toUpperCase()) {
    section = sectionMatch[1].trim();
    current = null;
    continue;
  }

  const entryMatch = ENTRY.exec(line);
  if (entryMatch) {
    current = { code: entryMatch[1], name: entryMatch[2].trim(), section, blocks: [], open: false };
    entries.push(current);
    continue;
  }

  if (!current) continue;

  const continuation = CONTINUATION.exec(line);
  // A name wraps onto the next line at the same column as the name itself. It is
  // only a wrap while no definition text has started.
  if (continuation && current.blocks.length === 0 && !current.name.endsWith(".")) {
    current.name = `${current.name} ${continuation[1].trim()}`.replace(/\s+/g, " ");
    continue;
  }

  const body = BODY.exec(line);
  if (!body) continue;

  if (!current.open) {
    current.blocks.push(body[1].trim());
    current.open = true;
  } else {
    current.blocks[current.blocks.length - 1] += ` ${body[1].trim()}`;
  }
}

const signals = [];
const seen = new Set();

for (const entry of entries) {
  const code = entry.code.replace(/\./g, "-");
  if (seen.has(code)) continue;
  seen.add(code);

  const mapped = SECTION_MAP[entry.section ?? ""] ?? { family: "indicacion", subfamily: "otras" };
  const blocks = joinBlocks(entry.blocks);

  signals.push({
    code,
    name: entry.name.replace(/\s+/g, " ").trim(),
    family: mapped.family,
    subfamily: mapped.subfamily,
    section: entry.section ?? null,
    definition: blocks[0] ?? "",
    paragraphs: blocks,
  });
}

const withoutDefinition = signals.filter((signal) => signal.definition.length < 10);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(signals, null, 1)}\n`);

const byFamily = signals.reduce((acc, signal) => {
  acc[signal.family] = (acc[signal.family] ?? 0) + 1;
  return acc;
}, {});

console.log(`Extracted ${signals.length} signals → ${path.relative(process.cwd(), output)}`);
console.log(`Families: ${JSON.stringify(byFamily)}`);
if (withoutDefinition.length > 0) {
  console.warn(`  ! ${withoutDefinition.length} signals without a usable definition:`);
  for (const signal of withoutDefinition.slice(0, 10)) console.warn(`    · ${signal.code} ${signal.name}`);
}
