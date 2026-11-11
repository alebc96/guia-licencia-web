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
  const fullTitle = isHome ? SITE.title : `${title} — ${SITE.name}`;
  const url = absoluteUrl(path);

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale.replace("-", "_"),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
