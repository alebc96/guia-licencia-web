#!/usr/bin/env node
/**
 * Audits the real author and licence of every image listed in
 * `data/creditos.json` using the Commons MediaWiki API (extmetadata).
 * Audit-only by default: it never modifies `data/creditos.json` or content.
 *
 *   node scripts/audit-commons-licenses.mjs                 print a summary
 *   node scripts/audit-commons-licenses.mjs report.json     also write the report
 *   node scripts/audit-commons-licenses.mjs --write         also update data/creditos.json
 *                                                           with the real artist, licence
 *                                                           and licenceUrl (then run
 *                                                           `node scripts/generate-signs.mjs`)
 *   node scripts/audit-commons-licenses.mjs --normalize     offline: only clean the authors already
 *                                                           stored in data/creditos.json
 */

import fs from "node:fs";
import path from "node:path";
import { normalizeAuthor } from "./normalize-author.mjs";

const ROOT = process.cwd();
const CREDITS = path.join(ROOT, "data", "creditos.json");
const ARGS = process.argv.slice(2);
const WRITE = ARGS.includes("--write");
const NORMALIZE_ONLY = ARGS.includes("--normalize");
const REPORT = ARGS.find((arg) => !arg.startsWith("--")) ? path.resolve(ARGS.find((arg) => !arg.startsWith("--"))) : null;
const API = "https://commons.wikimedia.org/w/api.php";
const BATCH = 50;
const PAUSE_MS = 1000;
const UA = { "user-agent": "guia-licencia-web/0.1 (https://github.com/alebc96/guia-licencia-web)" };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: UA, signal: AbortSignal.timeout(45_000) });
      if (response.ok) return await response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(1500 * attempt);
  }
  throw lastError;
}

/** "File:Foo_bar.svg" title from the page URL, falling back to the file name. */
function commonsTitle(entry) {
  let name = entry.file;
  if (entry.page) {
    const match = /\/wiki\/(File:[^?#]+)/i.exec(entry.page);
    if (match) name = decodeURIComponent(match[1]).replace(/^File:/i, "");
  }
  return `File:${name.replace(/_/g, " ")}`;
}

function stripHtml(html) {
  return String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const meta = (ext, key) => (ext && ext[key] ? stripHtml(ext[key].value) : "");

/** Classifies by licence short name / terms. */
function classify({ license, usageTerms, publicDomain, copyrighted }) {
  const text = `${license} ${usageTerms}`.toLowerCase();
  if (!license && !usageTerms && !publicDomain) return "desconocida";
  if (/(\bnc\b|non[- ]?commercial|\bnd\b|no[- ]?deriv|noncommercial|fair use|gfdl-?(no|with-disclaimers)?\s*$)/i.test(text) && !publicDomain) {
    return "no-comercial";
  }
  if (publicDomain || /\bcc0\b|public domain|\bpd\b|pd-|cc zero/.test(text) || copyrighted === "false") {
    return "ok-comercial-sin-atribucion";
  }
  if (/cc[- ]by[- ]sa/.test(text)) return "ok-comercial-compartir-igual";
  if (/cc[- ]by/.test(text)) return "ok-comercial-con-atribucion";
  return "desconocida";
}

function extract(ext) {
  const license = meta(ext, "LicenseShortName");
  const usageTerms = meta(ext, "UsageTerms");
  const copyrighted = meta(ext, "Copyrighted").toLowerCase();
  const publicDomain =
    copyrighted === "false" || /public domain|^pd\b|^pd-|cc0/i.test(`${license} ${usageTerms}`);
  const info = {
    artist: meta(ext, "Artist"),
    license,
    licenseUrl: meta(ext, "LicenseUrl"),
    usageTerms,
    attributionRequired: meta(ext, "AttributionRequired"),
    copyrighted,
    publicDomain,
  };
  info.class = classify(info);
  return info;
}

/** Credit fields as shown on the site; PD/CC0 need no author. */
function creditFields(r) {
  if (/^cc0/i.test(r.license)) {
    return { artist: "", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" };
  }
  const artist = normalizeAuthor(r.artist);
  if (r.publicDomain) return { artist, license: "Dominio público", licenseUrl: "" };
  return { artist, license: r.license, licenseUrl: r.licenseUrl.replace(/^http:/, "https:") };
}

function writeCredits(credits, results) {
  let updated = 0;
  for (const r of results) {
    if (r.class === "no-comercial" || r.class === "desconocida") {
      console.log(`Skipped ${r.code}: ${r.class}`);
      continue;
    }
    const entry = credits[r.code];
    const { artist, license, licenseUrl } = creditFields(r);
    if (r.class !== "ok-comercial-sin-atribucion" && !artist) throw new Error(`${r.code}: attribution required but no artist`);
    const next = { file: entry.file, page: entry.page, artist, license, ...(licenseUrl ? { licenseUrl } : {}) };
    credits[r.code] = next;
    updated += 1;
  }
  fs.writeFileSync(CREDITS, `${JSON.stringify(credits, null, 1)}\n`);
  console.log(`Updated ${updated} entries in ${path.relative(ROOT, CREDITS)}`);
}

function normalizeStored(credits) {
  let changed = 0;
  for (const [code, entry] of Object.entries(credits)) {
    const artist = normalizeAuthor(entry.artist);
    if (artist !== entry.artist) {
      console.log(`${code}: ${JSON.stringify(entry.artist)} -> ${JSON.stringify(artist)}`);
      entry.artist = artist;
      changed += 1;
    }
  }
  fs.writeFileSync(CREDITS, `${JSON.stringify(credits, null, 1)}\n`);
  console.log(`Normalized ${changed} authors in ${path.relative(ROOT, CREDITS)}`);
}

async function main() {
  const credits = JSON.parse(fs.readFileSync(CREDITS, "utf8"));
  if (NORMALIZE_ONLY) return normalizeStored(credits);
  const items = Object.entries(credits).map(([code, entry]) => ({ code, file: entry.file, title: commonsTitle(entry) }));
  const byTitle = new Map();
  for (const item of items) byTitle.set(item.title, item);
  const titles = [...byTitle.keys()];

  const found = new Map();
  for (let i = 0; i < titles.length; i += BATCH) {
    const chunk = titles.slice(i, i + BATCH);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      prop: "imageinfo",
      iiprop: "extmetadata",
      titles: chunk.join("|"),
    });
    const data = await fetchJson(`${API}?${params}`);
    const normalized = new Map((data.query?.normalized ?? []).map((n) => [n.to, n.from]));
    for (const page of data.query?.pages ?? []) {
      const ext = page.imageinfo?.[0]?.extmetadata;
      const original = normalized.get(page.title) ?? page.title;
      found.set(original, ext ?? null);
      found.set(page.title, ext ?? null);
    }
    console.log(`Queried ${Math.min(i + BATCH, titles.length)}/${titles.length}`);
    if (i + BATCH < titles.length) await sleep(PAUSE_MS);
  }

  const results = items.map((item) => {
    const ext = found.get(item.title);
    const info = ext ? extract(ext) : { class: "desconocida", license: "", artist: "", publicDomain: false };
    return { code: item.code, file: item.file, title: item.title, ...info };
  });

  const counts = {};
  const licenses = {};
  for (const r of results) {
    counts[r.class] = (counts[r.class] ?? 0) + 1;
    const key = r.license || "(sin licencia)";
    licenses[key] = (licenses[key] ?? 0) + 1;
  }

  if (REPORT) {
    fs.mkdirSync(path.dirname(REPORT), { recursive: true });
    fs.writeFileSync(REPORT, `${JSON.stringify({ counts, licenses, results }, null, 2)}\n`);
    console.log(`Report written to ${REPORT}`);
  }

  if (WRITE) writeCredits(credits, results);

  console.log("\nCounts per class:");
  for (const [k, v] of Object.entries(counts).sort()) console.log(`  ${k}: ${v}`);
  for (const cls of ["no-comercial", "desconocida"]) {
    const list = results.filter((r) => r.class === cls);
    console.log(`\n${cls} (${list.length}):`);
    for (const r of list) console.log(`  ${r.file}  [${r.license || "?"}]`);
  }
  console.log("\nDistinct licences:");
  for (const [k, v] of Object.entries(licenses).sort((a, b) => b[1] - a[1])) console.log(`  ${v}\t${k}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
