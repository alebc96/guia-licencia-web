import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Internal links must go through `next/link` (which applies the deploy base
 * path) or `publicUrl`; a raw `<a href="/...">` breaks under the GitHub Pages
 * sub-path.
 */
function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.tsx$/.test(name)) files.push(full);
  }
  return files;
}

// Arrow functions inside attributes (`onClick={() => x}`) contain a `>` that would
// end the tag early, so they are dropped first. Matches "/x", '/x', {"/x"}, {'/x'}, {`/x`}.
const ROOT_HREF = /<a\b[^>]*\shref=\{?\s*["'`]\/(?!\/)/;
const RAW_ROOT_LINK = { test: (source: string) => ROOT_HREF.test(source.replace(/=>/g, "")) };

describe("internal links", () => {
  it("detecta href raíz-relativos en todas las formas de escribirlos", () => {
    for (const source of [
      '<a href="/x">',
      "<a href='/x'>",
      '<a href={"/x"}>',
      "<a href={`/x/${y}`}>",
      '<a onClick={() => go()} href="/x">',
    ]) {
      expect(RAW_ROOT_LINK.test(source), source).toBe(true);
    }
    expect(RAW_ROOT_LINK.test('<a href="https://x.es/">')).toBe(false);
    expect(RAW_ROOT_LINK.test('<a href="//cdn.x.es">')).toBe(false);
  });

  it("no raw <a> points at a root-relative path", () => {
    const offenders = walk(join(process.cwd(), "src")).filter((file) => RAW_ROOT_LINK.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});
