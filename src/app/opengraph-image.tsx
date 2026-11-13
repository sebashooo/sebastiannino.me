import { getProfile } from "@/data";
import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

// Share card for the home page (and every page without its own): name, headline and a mini terminal.
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const profile = getProfile();
  return ogImage({
    kicker: "sn.me",
    title: profile.name,
    subtitle: `${profile.headline} ${profile.availability}.`,
  });
}
