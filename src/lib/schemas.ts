import { z } from "zod";
import { STUDY_BLOCKS, FAMILY_LABELS } from "./constants";

/**
 * Frontmatter contracts. Every `.md` file under `content/` is validated against
 * one of these schemas at build time, and `npm run check:content` fails loudly
 * when a file drifts.
 */

const isoDate = z
  .union([z.string(), z.date()])
  .transform((value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected an ISO date (YYYY-MM-DD)"));

const httpsUrl = z.string().url().refine((url) => url.startsWith("https://") || url.startsWith("http://"), {
  message: "expected an absolute http(s) URL",
});

const nonEmpty = z.string().trim().min(1);

export const keyFactSchema = z.object({
  label: nonEmpty,
  value: nonEmpty,
});

export const sourceSchema = z.object({
  label: nonEmpty,
  url: httpsUrl,
});

export const temaFrontmatterSchema = z.object({
  title: nonEmpty,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "expected a kebab-case slug"),
  order: z.number().int().min(1).max(99),
  block: z.enum(STUDY_BLOCKS),
  description: nonEmpty,
  icon: nonEmpty,
  readingTime: z.number().int().min(1).max(120),
  examWeight: z.enum(["muy-alta", "alta", "media", "baja"]),
  updated: isoDate,
  keyFacts: z.array(keyFactSchema).min(1),
  mistakes: z.array(nonEmpty).min(1),
  sources: z.array(sourceSchema).min(1),
  verified: z.boolean().default(false),
});

export const temaSchema = temaFrontmatterSchema.extend({
  body: z.string().min(1),
  path: nonEmpty,
});

export const SIGN_FAMILIES = Object.keys(FAMILY_LABELS) as Array<keyof typeof FAMILY_LABELS>;

export const SIGN_SHAPES = [
  "circulo",
  "triangulo",
  "triangulo-invertido",
  "octogono",
  "cuadrado",
  "rectangulo",
  "rombo",
  "panel",
] as const;

export const senalFrontmatterSchema = z.object({
  code: z.string().regex(/^[A-Z]{1,3}-\d+[a-z]?(?:-\d+)?$/, "expected a code such as R-301 or P-1a"),
  name: nonEmpty,
  family: z.enum(SIGN_FAMILIES as [string, ...string[]]),
  subfamily: nonEmpty,
  shape: z.enum(SIGN_SHAPES),
  colors: z.array(nonEmpty).min(1),
  meaning: nonEmpty,
  action: nonEmpty,
  where: nonEmpty,
  mistake: nonEmpty.optional(),
  related: z.array(z.string()).default([]),
  image: z.string().regex(/^\/senales\/[a-z0-9-]+\.svg$/, "expected an SVG under /senales/"),
  imageAlt: nonEmpty,
  imageCredit: nonEmpty,
  officialSource: nonEmpty,
  tier: z.enum(["A", "B", "C"]),
  isNew: z.boolean().default(false),
  verified: z.boolean().default(false),
  updated: isoDate,
});

export const senalSchema = senalFrontmatterSchema.extend({
  body: z.string(),
  path: nonEmpty,
});

export const recursoFrontmatterSchema = z.object({
  title: nonEmpty,
  url: httpsUrl,
  type: z.enum(["oficial", "legal", "didactico", "video", "test"]),
  topics: z.array(nonEmpty).default([]),
  description: nonEmpty,
  free: z.boolean().default(true),
  language: z.string().default("es"),
});

export const recursoSchema = recursoFrontmatterSchema.extend({
  body: z.string(),
  path: nonEmpty,
});

export const glosarioFrontmatterSchema = z.object({
  term: nonEmpty,
  definition: nonEmpty,
  related: z.array(nonEmpty).default([]),
});

export const glosarioSchema = glosarioFrontmatterSchema.extend({
  slug: z.string().min(1),
  path: nonEmpty,
});

export type StudyBlock = (typeof STUDY_BLOCKS)[number];
export type TemaFrontmatter = z.infer<typeof temaFrontmatterSchema>;
export type Tema = z.infer<typeof temaSchema>;
export type Senal = z.infer<typeof senalSchema>;
export type SenalFrontmatter = z.infer<typeof senalFrontmatterSchema>;
export type Recurso = z.infer<typeof recursoSchema>;
export type GlosarioEntry = z.infer<typeof glosarioSchema>;
export type SignFamily = (typeof SIGN_FAMILIES)[number];
export type SignShape = (typeof SIGN_SHAPES)[number];
export type RecursoType = Recurso["type"];
