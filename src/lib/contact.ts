import type { Profile } from "@/data";

/** Mono line under the contact links, built from the profile: location · languages · availability. */
export function buildContactLine(
  profile: Pick<Profile, "location" | "languages" | "availability">,
): string {
  return [profile.location, profile.languages.join(", "), profile.availability]
    .filter((part) => part.trim() !== "")
    .join(" · ");
}
