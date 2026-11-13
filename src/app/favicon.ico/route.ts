import { iconImage } from "@/lib/og";

// Crawlers and old browsers still ask for /favicon.ico (it used to 404 and cost Best Practices).
// Serve the same mark as the icon; browsers accept a PNG at this URL.
export const dynamic = "force-static";

export function GET() {
  return iconImage(48);
}
