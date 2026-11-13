import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getAllProjects } from "@/data";

const PUBLIC_DIR = join(process.cwd(), "public");
const COVER_MAX_BYTES = 250 * 1024;

const withMedia = getAllProjects().flatMap((p) =>
  p.media ? [{ slug: p.slug, media: p.media }] : [],
);

describe("project media", () => {
  it("has media on the two featured projects", () => {
    const slugs = withMedia.map((m) => m.slug);
    expect(slugs).toEqual(expect.arrayContaining(["managerapp", "tu-conjunto"]));
  });

  it("points every media.src (and poster) at an existing file under public/", () => {
    for (const { slug, media } of withMedia) {
      expect(media.src.startsWith("/"), `${slug} src is root-relative`).toBe(true);
      expect(existsSync(join(PUBLIC_DIR, media.src)), `${slug}: ${media.src}`).toBe(true);
      if (media.poster) {
        expect(existsSync(join(PUBLIC_DIR, media.poster)), `${slug}: ${media.poster}`).toBe(true);
      }
    }
  });

  it("has a non-empty alt on every media item", () => {
    for (const { slug, media } of withMedia) {
      expect(media.alt.trim().length, `${slug} alt`).toBeGreaterThan(0);
    }
  });

  it("keeps every image cover at or under 250 KB", () => {
    for (const { slug, media } of withMedia.filter((m) => m.media.type === "image")) {
      const size = statSync(join(PUBLIC_DIR, media.src)).size;
      expect(size, `${slug} cover is ${(size / 1024).toFixed(1)} KB`).toBeLessThanOrEqual(
        COVER_MAX_BYTES,
      );
    }
  });
});
