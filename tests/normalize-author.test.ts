import { describe, expect, it } from "vitest";

// @ts-expect-error plain .mjs script without type declarations
import { normalizeAuthor } from "../scripts/normalize-author.mjs";

/** Commons boilerplate must collapse to a name or nothing; real authors stay as they are. */
describe("normalizeAuthor", () => {
  it.each([
    ["No machine-readable author provided. Benedicto16 assumed (based on copyright claims).", "Benedicto16"],
    ["The original uploader was Benedicto16 at Wikimedia Commons .", "Benedicto16"],
    ["Original PNG by Benedicto16", "Benedicto16"],
    ["Unknown author Unknown author", ""],
    ["   ", ""],
  ])("%s -> %j", (raw, expected) => {
    expect(normalizeAuthor(raw)).toBe(expected);
  });

  it.each(["Gigillo83", "Majafego", "Autopistero20502020", "SerrgioFdezz", "Musgosos", "มองโกเลีย๔๔", "Ministerio de Transportes, Movilidad y Agenda Urbana"])(
    "no altera el autor real %s",
    (author) => {
      expect(normalizeAuthor(` ${author} `)).toBe(author);
    },
  );
});
