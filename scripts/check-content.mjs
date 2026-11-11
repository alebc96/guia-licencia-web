#!/usr/bin/env node
/**
 * Filesystem-level content checks. Zod validation of the frontmatter happens in
 * `tests/content.test.ts` and at build time (`src/lib/content.ts`); this script
 * covers what schemas cannot see: missing files, broken internal links, orphan
 * images and incomplete section structure.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readDir(relative) {
  const dir = path.join(ROOT, relative);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(dir, file));
}

function frontmatter(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    fail(`${path.relative(ROOT, file)}: missing frontmatter block`);
    return { data: {}, body: "" };
  }
  const data = {};
  for (const line of match[1].split("\n")) {
    const entry = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (!entry) continue;
    data[entry[1]] = entry[2].replace(/^["']|["']$/g, "").trim();
  }
  return { data, body: match[2] };
}

/* ---------------------------------------------------------------- topics --- */

const temaFiles = readDir("content/temas");
if (temaFiles.length === 0) fail("content/temas: no topics found");

const temaSlugs = new Set();
const temaOrders = [];

const REQUIRED_SECTIONS = ["## Lo esencial", "## Explicado", "## Casos prácticos", "## Errores típicos", "## Para profundizar"];

for (const file of temaFiles) {
  const relative = path.relative(ROOT, file);
  const { data, body } = frontmatter(file);

  if (!data.slug) fail(`${relative}: missing slug`);
  if (!data.order) fail(`${relative}: missing order`);
  if (temaSlugs.has(data.slug)) fail(`${relative}: duplicated slug "${data.slug}"`);
  temaSlugs.add(data.slug);
  temaOrders.push(Number(data.order));

  const expectedPrefix = `${String(Number(data.order)).padStart(2, "0")}-`;
  if (!path.basename(file).startsWith(expectedPrefix)) {
    fail(`${relative}: file name must start with "${expectedPrefix}" to match order ${data.order}`);
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!body.includes(section)) fail(`${relative}: missing section "${section}"`);
  }

  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (words < 500) warn(`${relative}: only ${words} words of body content`);
}

const sortedOrders = [...temaOrders].sort((a, b) => a - b);
sortedOrders.forEach((order, index) => {
  if (order !== index + 1) fail(`content/temas: order sequence is broken at position ${index + 1} (found ${order})`);
});

/* ----------------------------------------------------------------- signs --- */

const senalFiles = readDir("content/senales");
const senalCodes = new Set();

for (const file of senalFiles) {
  const relative = path.relative(ROOT, file);
  const { data } = frontmatter(file);

  if (!data.code) fail(`${relative}: missing code`);
  if (senalCodes.has(data.code)) fail(`${relative}: duplicated code "${data.code}"`);
  senalCodes.add(data.code);

  if (path.basename(file, ".md") !== data.code.toLowerCase()) {
    fail(`${relative}: file name must be the lower-cased code (${data.code.toLowerCase()}.md)`);
  }

  if (!data.image) {
    fail(`${relative}: missing image`);
  } else {
    const imagePath = path.join(ROOT, "public", data.image.replace(/^\//, ""));
    if (!fs.existsSync(imagePath)) fail(`${relative}: image not found at public${data.image}`);
  }

  // `action`, `where` and `mistake` are optional: only curated fichas carry them.
  for (const required of ["meaning", "imageAlt", "imageCredit", "officialSource", "updated"]) {
    if (!data[required]) fail(`${relative}: missing ${required}`);
  }

}

/* related codes must exist, otherwise the UI silently drops them */
for (const file of senalFiles) {
  const relative = path.relative(ROOT, file);
  const raw = fs.readFileSync(file, "utf8");
  const related = /^related:\s*\[(.*)\]\s*$/m.exec(raw.replace(/^---\n[\s\S]*?\n---/, (block) => block));
  if (!related) continue;
  const codes = related[1]
    .split(",")
    .map((value) => value.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
  for (const code of codes) {
    if (!senalCodes.has(code)) fail(`${relative}: related code "${code}" has no ficha in content/senales`);
  }
}

const catalogFile = path.join(ROOT, "data", "catalogo-oficial.json");
const officialCodes = new Set();

if (!fs.existsSync(catalogFile)) {
  fail("data/catalogo-oficial.json: missing (run scripts/extract-catalog.mjs)");
} else {
  const catalog = JSON.parse(fs.readFileSync(catalogFile, "utf8"));
  if (catalog.length < 100) fail(`data/catalogo-oficial.json: only ${catalog.length} signals, expected the full catalogue`);

  for (const signal of catalog) {
    officialCodes.add(signal.code);
    if (!signal.name || !signal.definition) fail(`data/catalogo-oficial.json: ${signal.code} has no name or definition`);
  }

  for (const code of senalCodes) {
    if (!officialCodes.has(code)) fail(`content/senales/${code.toLowerCase()}.md: ${code} is not in the official catalogue`);
  }

  const curatedFile = path.join(ROOT, "data", "senales.txt");
  if (fs.existsSync(curatedFile)) {
    const rows = fs
      .readFileSync(curatedFile, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));

    for (const row of rows) {
      const code = row.split("|")[0].trim();
      if (!officialCodes.has(code)) fail(`data/senales.txt: curated row ${code} does not exist in the official catalogue`);
      if (!senalCodes.has(code)) fail(`data/senales.txt: curated row ${code} has no ficha in content/senales`);
    }
  }
}

/* --------------------------------------------------------- image credits --- */

const creditsFile = path.join(ROOT, "data", "creditos.json");
if (fs.existsSync(creditsFile)) {
  const credits = JSON.parse(fs.readFileSync(creditsFile, "utf8"));
  for (const [code, credit] of Object.entries(credits)) {
    if (!senalCodes.has(code)) fail(`data/creditos.json: ${code} has no ficha`);
    for (const field of ["artist", "license", "page"]) {
      if (!credit[field]) fail(`data/creditos.json: ${code} is missing ${field}`);
    }
    if (!fs.existsSync(path.join(ROOT, "public", "senales", `${code.toLowerCase()}.svg`))) {
      fail(`data/creditos.json: ${code} credits an image that does not exist`);
    }
  }
}

/* ------------------------------------------------------------ resources --- */

const recursoFile = readDir("content/recursos");
if (recursoFile.length === 0) warn("content/recursos: no resources yet");
for (const file of recursoFile) {
  const { data } = frontmatter(file);
  if (!data.url || !/^https?:\/\//.test(data.url)) fail(`${path.relative(ROOT, file)}: missing absolute url`);
  if (!data.description) fail(`${path.relative(ROOT, file)}: missing description`);
}

/* -------------------------------------------------------------- glossary --- */

const glosarioFile = readDir("content/glosario");
if (glosarioFile.length === 0) warn("content/glosario: no terms yet");
for (const file of glosarioFile) {
  const { data } = frontmatter(file);
  if (!data.term) fail(`${path.relative(ROOT, file)}: missing term`);
  if (!data.definition) fail(`${path.relative(ROOT, file)}: missing definition`);
}

/* --------------------------------------------------------- internal links --- */

const senalSlugs = new Set([...senalCodes].map((code) => code.toLowerCase()));
const internalPattern = /\]\((\/[^)#?\s]+)/g;

for (const file of [...temaFiles, ...senalFiles, ...recursoFile, ...glosarioFile]) {
  const relative = path.relative(ROOT, file);
  const { body } = frontmatter(file);

  for (const match of body.matchAll(internalPattern)) {
    const target = match[1].replace(/\/$/, "");
    if (target.startsWith("/temario/")) {
      if (!temaSlugs.has(target.replace("/temario/", ""))) fail(`${relative}: broken internal link ${target}`);
    } else if (target.startsWith("/senales/")) {
      if (!senalSlugs.has(target.replace("/senales/", ""))) fail(`${relative}: broken internal link ${target}`);
    } else if (target === "/temario" || target === "/senales") {
      continue;
    } else {
      warn(`${relative}: unchecked internal link ${target}`);
    }
  }
}

/* ----------------------------------------------------------------- output --- */

for (const message of warnings) console.warn(`  ! ${message}`);
for (const message of errors) console.error(`  ✗ ${message}`);

if (errors.length > 0) {
  console.error(`\ncheck:content failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(
  `check:content ok — ${temaFiles.length} temas, ${senalFiles.length} señales, ${recursoFile.length} recursos, ${glosarioFile.length} términos.`,
);
