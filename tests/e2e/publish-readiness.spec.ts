import { expect, test } from "@playwright/test";
import { getCaseStudies } from "../../src/data";
import { SITE } from "../../src/lib/site";

/**
 * F5-01 part (b): these run only for case studies that are published (draft: false). While the
 * drafts are still drafts they are skipped, so this file flips nothing and asserts nothing early.
 * Once src/data/case-studies.ts is flipped they check indexability end to end.
 */
for (const c of getCaseStudies()) {
  test.describe(`published /work/${c.slug}`, () => {
    test.skip(c.draft, `${c.slug} is still a draft (flipped in F5-01 part b)`);

    test("is listed in the sitemap with its absolute URL", async ({ request }) => {
      const xml = await (await request.get("/sitemap.xml")).text();
      expect(xml).toContain(`<loc>${SITE.url}/work/${c.slug}</loc>`);
    });

    test("is indexable: no noindex in the robots meta or the X-Robots-Tag header", async ({
      page,
    }) => {
      const response = await page.goto(`/work/${c.slug}`);
      expect(response?.status()).toBe(200);
      expect(response?.headers()["x-robots-tag"] ?? "").not.toMatch(/noindex/i);
      const robots = await page.locator('meta[name="robots"]').all();
      for (const tag of robots) {
        expect(await tag.getAttribute("content")).not.toMatch(/noindex/i);
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE.url}/work/${c.slug}`,
      );
    });

    test("robots.txt does not block it", async ({ request }) => {
      const text = await (await request.get("/robots.txt")).text();
      expect(text).not.toMatch(/Disallow: \/work/);
    });
  });
}
