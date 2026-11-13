import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapEntries } from "@/lib/seo";

// Home plus published case studies. Drafts are excluded by sitemapEntries().
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map(({ path, lastModified }) => ({
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
  }));
}
