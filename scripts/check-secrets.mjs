#!/usr/bin/env node
/**
 * Guards the repository and the built site against leaked secrets and personal
 * data. Runs over the tracked files (git) and, when it exists, over `out/`.
 *
 *   node scripts/check-secrets.mjs
 *
 * The rules are deliberately narrow: they look for things that must never be
 * published, not for style. A match means "stop and look", not "rewrite".
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

/** Credential shapes. Keep them specific to avoid noisy false positives. */
const SECRET_PATTERNS = [
  { code: "github-token", regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
  { code: "openai-key", regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { code: "aws-access-key", regex: /\bAKIA[0-9A-Z]{16}\b/g },
  { code: "google-api-key", regex: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { code: "slack-token", regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { code: "gitlab-token", regex: /\bglpat-[A-Za-z0-9_-]{20,}\b/g },
  { code: "private-key", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { code: "jwt", regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
];

/** Personal data that should not travel with a public repository. */
const PERSONAL_PATTERNS = [
  { code: "email", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  {
    code: "home-path",
    // Must look like an absolute home directory, not an import such as
    // `@/components/home/Hero`: the segment is lower-cased and the match cannot
    // start in the middle of another path.
    regex: /(?<![\w@/])(?:\/home\/[a-z][a-z0-9._-]{1,}|\/Users\/[a-z][a-z0-9._-]{1,}|[A-Z]:\\\\Users\\\\[A-Za-z][A-Za-z0-9._-]{1,})(?=\/|\s|$)/g,
  },
];

/** Documentation filenames that legitimately quote machine paths. */
const PATH_EXEMPTIONS = [/^docs\/estado\.md$/];

/** Lines that name a well-known non-personal address. */
const EMAIL_ALLOWLIST = [/example\.com$/, /noreply@github\.com$/, /git@github\.com$/];

function isBinary(file) {
  return /\.(svg|png|jpe?g|webp|avif|ico|woff2?|pdf|zip)$/i.test(file);
}

/**
 * Returns the findings for one file's content. Exported so the unit test can
 * feed it planted strings instead of touching the repository.
 */
export function scanText(text, file) {
  const findings = [];
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    for (const rule of SECRET_PATTERNS) {
      rule.regex.lastIndex = 0;
      for (const match of line.matchAll(rule.regex)) {
        findings.push({ file, line: index + 1, code: rule.code, sample: match[0].slice(0, 12) });
      }
    }

    for (const rule of PERSONAL_PATTERNS) {
      if (rule.code === "home-path" && PATH_EXEMPTIONS.some((pattern) => pattern.test(file))) continue;
      rule.regex.lastIndex = 0;
      for (const match of line.matchAll(rule.regex)) {
        if (rule.code === "email" && EMAIL_ALLOWLIST.some((pattern) => pattern.test(match[0]))) continue;
        findings.push({ file, line: index + 1, code: rule.code, sample: match[0].slice(0, 40) });
      }
    }
  });

  return findings;
}

function trackedFiles() {
  try {
    const output = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
    return output.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function builtFiles() {
  const out = path.join(ROOT, "out");
  if (!fs.existsSync(out)) return [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|txt|json)$/.test(entry.name)) files.push(path.relative(ROOT, full));
    }
  };
  walk(out);
  return files;
}

function main() {
  const targets = [
    ...trackedFiles().map((file) => ({ file, absolute: path.join(ROOT, file) })),
    ...builtFiles().map((file) => ({ file, absolute: path.join(ROOT, file) })),
  ].filter(({ file, absolute }) => !isBinary(file) && fs.existsSync(absolute));

  const findings = [];
  for (const { file, absolute } of targets) {
    findings.push(...scanText(fs.readFileSync(absolute, "utf8"), file));
  }

  if (findings.length === 0) {
    console.log(`check:secrets ok — ${targets.length} archivos revisados, 0 hallazgos.`);
    return;
  }

  console.error("check:secrets found personal data or credentials in published content:");
  for (const finding of findings.slice(0, 40)) {
    console.error(`  ✗ ${finding.file}:${finding.line} · ${finding.code} · ${finding.sample}…`);
  }
  if (findings.length > 40) console.error(`  … y ${findings.length - 40} más`);
  process.exit(1);
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main();
}
