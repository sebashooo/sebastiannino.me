import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Everything is crawlable. Drafts are kept out of the index by their noindex meta tag, which
// crawlers can only see if the page is not blocked here, so nothing is disallowed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
