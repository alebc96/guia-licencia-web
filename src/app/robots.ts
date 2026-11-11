import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/constants";

// Static export requires an explicit opt-in for metadata routes.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
