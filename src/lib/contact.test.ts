import { describe, expect, it } from "vitest";
import { getProfile } from "@/data";
import { buildContactLine } from "./contact";

describe("buildContactLine", () => {
  it("joins location, languages and availability from the profile", () => {
    const profile = getProfile();
    expect(buildContactLine(profile)).toBe(
      `${profile.location} · ${profile.languages.join(", ")} · ${profile.availability}`,
    );
  });

  it("is driven by its input (nothing hardcoded)", () => {
    expect(
      buildContactLine({
        location: "Somewhere",
        languages: ["A (native)", "B (C1)"],
        availability: "Open to X",
      }),
    ).toBe("Somewhere · A (native), B (C1) · Open to X");
  });

  it("skips empty parts instead of leaving stray separators", () => {
    expect(buildContactLine({ location: "Somewhere", languages: [], availability: "Open" })).toBe(
      "Somewhere · Open",
    );
  });
});
