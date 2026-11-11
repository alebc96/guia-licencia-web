#!/usr/bin/env node
/**
 * Manual network sweep over every external URL the site publishes.
 *
 * Not part of `npm run verify`: it depends on the network and on third-party
 * sites being up, so a failure here means "check by hand", not "the content is
 * broken". Run it before a release or from the weekly workflow.
 *
 * Usage: node scripts/check-links.mjs [--strict]
 *   --strict  exit non-zero when any URL fails
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const STRICT = process.argv.includes("--strict");
const TIMEOUT_MS = 12_000;
const CONCURRENCY = 6;

const urlPattern = /https?:\/\/[^\s)"'<>\]]+/g;

function collectFiles(dir) {
  const absolute = path.join(ROOT, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { recursive: true }).flatMap((entry) => {
    const file = path.join(absolute, entry);
    return fs.statSync(file).isFile() && file.endsWith(".md") ? [file] : [];
  });
}

function extractUrls() {
  const urls = new Map();

  for (const file of collectFiles("content")) {
    const raw = fs.readFileSync(file, "utf8");
    for (const match of raw.matchAll(urlPattern)) {
      const clean = match[0].replace(/[.,;:]+$/, "");
      if (!urls.has(clean)) urls.set(clean, new Set());
      urls.get(clean).add(path.relative(ROOT, file));
    }
  }

  for (const file of ["src/lib/constants.ts", "src/lib/seo.ts"]) {
    const absolute = path.join(ROOT, file);
    if (!fs.existsSync(absolute)) continue;
    const raw = fs.readFileSync(absolute, "utf8");
    for (const match of raw.matchAll(urlPattern)) {
      const clean = match[0].replace(/[.,;:"`]+$/, "");
      if (clean.includes("${")) continue;
      if (!urls.has(clean)) urls.set(clean, new Set());
      urls.get(clean).add(file);
    }
  }

  return urls;
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "guia-licencia-web link-check" },
    });

    // Plenty of servers reject HEAD; retry with GET before reporting a failure.
    if (response.status === 405 || response.status === 403 || response.status === 501) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "guia-licencia-web link-check" },
      });
    }

    return { ok: response.status < 400, status: response.status };
  } catch (error) {
    return { ok: false, status: error?.name === "AbortError" ? "timeout" : "network error" };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const urls = extractUrls();
  const entries = [...urls.entries()];
  const failures = [];

  console.log(`Checking ${entries.length} external URLs…`);

  for (let index = 0; index < entries.length; index += CONCURRENCY) {
    const batch = entries.slice(index, index + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async ([url, files]) => ({ url, files: [...files], ...(await probe(url)) })),
    );

    for (const result of results) {
      if (result.ok) {
        console.log(`  ✓ ${result.status} ${result.url}`);
      } else {
        console.warn(`  ✗ ${result.status} ${result.url}\n      usado en: ${result.files.join(", ")}`);
        failures.push(result);
      }
    }
  }

  if (failures.length === 0) {
    console.log(`\nAll ${entries.length} external URLs responded.`);
    return;
  }

  console.warn(`\n${failures.length} of ${entries.length} URLs need a manual look.`);
  if (STRICT) process.exit(1);
}

await main();
