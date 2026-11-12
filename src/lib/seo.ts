import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./constants";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Builds page metadata with canonical URL and Open Graph tags. Titles are
 * composed as "<page> — Guía B" except for the home page.
 */
export function buildMetadata({ title, description, path, type = "website", noIndex }: PageMeta): Metadata {
  const isHome = path === "/";
  const url = absoluteUrl(path);

  return {
    // The root layout appends "— Guía B" through its title template, so the page
    // only contributes its own name; the home page opts out of the template.
    title: isHome ? { absolute: SITE.title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title: isHome ? SITE.title : `${title} — ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: isHome ? SITE.title : `${title} — ${SITE.name}`,
      description,
    },
  };
}
