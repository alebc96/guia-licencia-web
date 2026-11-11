import type { MetadataRoute } from "next";
import { absoluteUrl, SITE } from "@/lib/constants";
import { loadSenales, loadTemas } from "@/lib/content";

const STATIC_PATHS = [
  "/",
  "/temario/",
  "/senales/",
  "/examen/",
  "/practico/",
  "/recursos/",
  "/glosario/",
  "/progreso/",
  "/buscar/",
  "/creditos/",
];

// Static export requires an explicit opt-in for metadata routes.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${SITE.updated}T00:00:00Z`);

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const topicEntries = loadTemas().map((tema) => ({
    url: absoluteUrl(`/temario/${tema.slug}/`),
    lastModified: new Date(`${tema.updated}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const signEntries = loadSenales().map((senal) => ({
    url: absoluteUrl(`/senales/${senal.code.toLowerCase()}/`),
    lastModified: new Date(`${senal.updated}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...topicEntries, ...signEntries];
}
