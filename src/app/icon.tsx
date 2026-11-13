import { iconImage } from "@/lib/og";

// Favicon (32x32 PNG). Next adds the <link rel="icon"> tag, so browsers do not guess /favicon.ico.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return iconImage(32);
}
