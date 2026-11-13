import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { getCaseStudies, getProfile } from "../../src/data";
import { SITE } from "../../src/lib/site";

const meta = (page: import("@playwright/test").Page, selector: string) =>
  page.locator(`head ${selector}`);

test.describe("home metadata", () => {
  test("has a title, description, canonical URL and Open Graph/Twitter tags", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(SITE.title);
    await expect(meta(page, 'meta[name="description"]')).toHaveAttribute(
      "content",
      SITE.description,
    );
    await expect(meta(page, 'link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https:\/\/sebastiannino\.me\/?$/,
    );

    await expect(meta(page, 'meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(meta(page, 'meta[property="og:site_name"]')).toHaveAttribute("content", SITE.name);
    await expect(meta(page, 'meta[property="og:title"]')).toHaveAttribute("content", SITE.title);
    await expect(meta(page, 'meta[property="og:image"]')).toHaveAttribute(
      "content",
      /^https:\/\/sebastiannino\.me\/opengraph-image/,
    );
    await expect(meta(page, 'meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(meta(page, 'meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
  });

  test("is indexable (no noindex)", async ({ page }) => {
    await page.goto("/");
    await expect(meta(page, 'meta[name="robots"]')).toHaveCount(0);
  });

  test("links a favicon and an Apple touch icon, so no /favicon.ico guess is needed", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(meta(page, 'link[rel="icon"]')).toHaveAttribute("href", /^\/icon/);
    await expect(meta(page, 'link[rel="apple-touch-icon"]')).toHaveAttribute(
      "href",
      /^\/apple-icon/,
    );
  });
});

test("JSON-LD is a Person with name, url, jobTitle and sameAs, and nothing private", async ({
  page,
}) => {
  await page.goto("/");
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(scripts).toHaveLength(1);
  const person = JSON.parse(scripts[0]);
  const profile = getProfile();

  expect(person["@context"]).toBe("https://schema.org");
  expect(person["@type"]).toBe("Person");
  expect(person.name).toBe(profile.name);
  expect(person.url).toBe(SITE.url);
  expect(person.jobTitle).toBeTruthy();
  expect(person.sameAs).toEqual([profile.socials.github, profile.socials.linkedin]);
  expect(Object.keys(person)).not.toEqual(expect.arrayContaining(["telephone"]));
  expect(Object.keys(person)).not.toEqual(expect.arrayContaining(["address"]));
  expect(scripts[0]).not.toMatch(/\+?\d[\d\s().-]{8,}\d/);
});

test("sitemap.xml lists the home page and leaves draft case studies out", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const xml = await response.text();

  expect(xml).toContain(`<loc>${SITE.url}/</loc>`);
  for (const c of getCaseStudies()) {
    const loc = `<loc>${SITE.url}/work/${c.slug}</loc>`;
    if (c.draft) expect(xml).not.toContain(loc);
    else expect(xml).toContain(loc);
  }
  // Drafts are the case studies today: the sitemap must not list any /work/ URL until F5-01
  if (getCaseStudies().every((c) => c.draft)) expect(xml).not.toContain("/work/");
});

test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toMatch(/User-Agent: \*/i);
  expect(text).toMatch(/Allow: \//);
  expect(text).toContain(`Sitemap: ${SITE.url}/sitemap.xml`);
  // Blocking drafts here would hide their noindex tag from crawlers
  expect(text).not.toMatch(/Disallow: \/work/);
});

test("icons and Open Graph images are served as PNGs, including /favicon.ico", async ({
  request,
}) => {
  for (const url of [
    "/favicon.ico",
    "/icon",
    "/apple-icon",
    "/opengraph-image",
    ...getCaseStudies().map((c) => `/work/${c.slug}/opengraph-image`),
  ]) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    expect(response.headers()["content-type"], url).toContain("image/png");
    expect((await response.body()).length, url).toBeGreaterThan(300);
  }
});

test.describe("case-study metadata", () => {
  for (const c of getCaseStudies()) {
    test(`/work/${c.slug}: article Open Graph, canonical and its own image`, async ({ page }) => {
      await page.goto(`/work/${c.slug}`);
      await expect(meta(page, 'link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE.url}/work/${c.slug}`,
      );
      await expect(meta(page, 'meta[property="og:type"]')).toHaveAttribute("content", "article");
      await expect(meta(page, 'meta[property="og:image"]')).toHaveAttribute(
        "content",
        new RegExp(`/work/${c.slug}/opengraph-image`),
      );
      await expect(meta(page, 'meta[property="og:site_name"]')).toHaveAttribute(
        "content",
        SITE.name,
      );
      await expect(page).toHaveTitle(/ · Sebastián Niño$/);
      // Draft case studies stay routable but out of the index
      if (c.draft)
        await expect(meta(page, 'meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    });
  }
});

// F4-07 is the owner's task: public/resume.pdf does not exist yet. The links must still render as
// links; once the file is added this test checks it is served as a PDF.
test.describe("résumé (F4-07 dependency)", () => {
  test("the home and the terminal link to the résumé URL from the data", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Download résumé" })).toHaveAttribute(
      "href",
      getProfile().resumeUrl,
    );
  });

  test("public/resume.pdf is served as a PDF", async ({ request }) => {
    test.skip(
      !existsSync(join(process.cwd(), "public", "resume.pdf")),
      "F4-07 pending: public/resume.pdf is the owner's task (not created on purpose)",
    );
    const response = await request.get(getProfile().resumeUrl);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });
});
