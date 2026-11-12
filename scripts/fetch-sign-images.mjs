#!/usr/bin/env node
/**
 * Downloads the official-looking SVG of each catalogue sign from Wikimedia
 * Commons into `public/senales/<code>.svg` and records the attribution in
 * `data/creditos.json`.
 *
 * Run it only when the catalogue changes: the downloaded files are committed, so
 * the build never needs the network.
 *
 *   node scripts/fetch-sign-images.mjs            download what is missing
 *   node scripts/fetch-sign-images.mjs --dry-run  only report the matching
 */

import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const ROOT = process.cwd();
const CATALOG = path.join(ROOT, "data", "catalogo-oficial.json");
const CREDITS = path.join(ROOT, "data", "creditos.json");
const OUT_DIR = path.join(ROOT, "public", "senales");
const DRY_RUN = process.argv.includes("--dry-run");
const MAX_BYTES = 300 * 1024;
// Wikimedia requires a descriptive User-Agent with contact information;
// a generic one is answered with HTTP 429.
const UA = { "user-agent": "guia-licencia-web/0.1 (https://github.com/alebc96/guia-licencia-web)" };

/** Commons is slow and occasionally drops connections; retry before giving up. */
async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: UA, signal: AbortSignal.timeout(45_000) });
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
  }
  throw lastError;
}

/** Rejects files that are not the plain official sign. */
const REJECT = /(non[_ ]official|old|historical|experimental|custom|4_lanes|aduana|feedback|section_radar|recommended_speed|toll_booth|bicycle_slope|distance_between)/i;

function normalizeCode(code) {
  return code.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function codeFromFileName(name) {
  const base = name
    .replace(/^Spain[_\s]+traffic[_\s]+signal[,_\s-]*/i, "")
    .replace(/\.(svg|png)$/i, "");
  const match = /^([prsm])[-_\s]?(\d+)[-_\s]?([a-z])?(?:[-_.,\s].*)?$/i.exec(base.trim());
  if (!match) return null;
  return `${match[1].toUpperCase()}-${match[2]}${match[3] ? match[3].toLowerCase() : ""}`;
}

/**
 * The Commons API is rate limited and fails often enough to break a long run.
 * When a previous listing is available we reuse it: names and URLs are stable.
 */
function cachedListing() {
  const candidates = [process.env.COMMONS_CACHE, "/tmp/commons-listing.json"].filter(Boolean);
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const parsed = JSON.parse(fs.readFileSync(candidate, "utf8"));
    if (Array.isArray(parsed) && parsed.length > 100) {
      console.log(`Using cached Commons listing: ${candidate} (${parsed.length} files)`);
      return parsed;
    }
  }
  return null;
}

async function listCommonsFiles() {
  const cached = cachedListing();
  if (cached) return cached;

  const files = [];
  let cont = null;

  for (let page = 0; page < 10; page += 1) {
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.search = new URLSearchParams({
      action: "query",
      list: "allimages",
      aiprefix: "Spain traffic signal",
      ailimit: "500",
      format: "json",
      aiprop: "url|size",
      ...(cont ? { aicontinue: cont } : {}),
    });

    const response = await fetchWithRetry(url);
    const body = await response.json();
    for (const image of body.query?.allimages ?? []) files.push(image);
    cont = body.continue?.aicontinue;
    if (!cont) break;
  }

  return files;
}

async function metadataFor(titles) {
  try {
    return await metadataRequest(titles);
  } catch {
    // Throttled or offline: the credit still names the source page.
    return new Map();
  }
}

async function metadataRequest(titles) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    titles: titles.join("|"),
    prop: "imageinfo",
    iiprop: "extmetadata",
    format: "json",
  });

  const response = await fetchWithRetry(url, 2);
  const body = await response.json();
  const result = new Map();

  for (const page of Object.values(body.query?.pages ?? {})) {
    const meta = page.imageinfo?.[0]?.extmetadata ?? {};
    const strip = (value) => (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    result.set(page.title, {
      artist: strip(meta.Artist?.value) || "Wikimedia Commons",
      license: strip(meta.LicenseShortName?.value) || "licencia en la página de origen",
    });
  }

  return result;
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
  const files = await listCommonsFiles();

  const byCode = new Map();
  for (const file of files) {
    if (REJECT.test(file.name)) continue;
    const code = codeFromFileName(file.name);
    if (!code) continue;
    const isSvg = /\.svg$/i.test(file.name);
    const score = (isSvg ? 10 : 0) + (file.size < MAX_BYTES ? 5 : 0) + (/2023/i.test(file.name) ? 3 : 0);
    const key = normalizeCode(code);
    const current = byCode.get(key);
    if (!current || score > current.score) byCode.set(key, { file, score });
  }

  const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, "utf8")) : {};
  const selected = [];
  for (const signal of catalog) {
    const entry = byCode.get(normalizeCode(signal.code));
    if (entry) selected.push({ signal, ...entry });
  }

  console.log(`Catalogue: ${catalog.length} signals · Commons matches: ${selected.length}`);

  if (DRY_RUN) {
    for (const item of selected.slice(0, 20)) console.log(`  ${item.signal.code} → ${item.file.name}`);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(CREDITS), { recursive: true });

  let downloaded = 0;
  let skipped = 0;

  for (let index = 0; index < selected.length; index += 20) {
    const batch = selected.slice(index, index + 20);
    const meta = await metadataFor(batch.map((item) => `File:${item.file.name}`));

    for (const item of batch) {
      const target = path.join(OUT_DIR, `${item.signal.code.toLowerCase()}.svg`);
      const attribution = meta.get(`File:${item.file.name}`) ?? {
        artist: "Wikimedia Commons",
        license: "licencia en la página de origen",
      };

      if (/\.png$/i.test(item.file.name)) {
        skipped += 1;
        continue;
      }

      // upload.wikimedia.org throttles bursty clients with HTTP 429; curl with a
      // descriptive user agent and a small pause is far more reliable than
      // node's fetch here.
      let svg;
      try {
        await run("curl", ["-fsSL", "--max-time", "40", "-A", UA["user-agent"], "-o", target, item.file.url]);
        svg = fs.readFileSync(target, "utf8");
        // A 429 or a proxy error arrives as an HTML page; never keep it as an SVG.
        if (!/^\s*(<\?xml[^>]*\?>\s*)?(<svg|<!DOCTYPE svg)/.test(svg.slice(0, 200))) {
          fs.unlinkSync(target);
          throw new Error("not an SVG");
        }
      } catch {
        skipped += 1;
        continue;
      }
      if (!svg.includes("<svg")) {
        skipped += 1;
        continue;
      }

      credits[item.signal.code] = {
        file: item.file.name,
        page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(item.file.name)}`,
        artist: attribution.artist,
        license: attribution.license,
      };
      downloaded += 1;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  fs.writeFileSync(CREDITS, `${JSON.stringify(credits, null, 1)}\n`);
  console.log(`Downloaded ${downloaded} SVGs, skipped ${skipped}. Credits: ${path.relative(ROOT, CREDITS)}`);
}

await main();
