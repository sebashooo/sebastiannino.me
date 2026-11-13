import { expect, test } from "@playwright/test";

const CASES = [
  { slug: "managerapp", name: "Managerapp" },
  { slug: "tu-conjunto", name: "Tu Conjunto a la Mano" },
];

for (const { slug, name } of CASES) {
  test.describe(`/work/${slug}`, () => {
    test("returns 200 and shows the project name as H1", async ({ page }) => {
      const response = await page.goto(`/work/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
    });

    test("is a draft: noindex robots meta and canonical URL", async ({ page }) => {
      await page.goto(`/work/${slug}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`/work/${slug}$`),
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    });

    test("every TOC link targets an existing element id", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/work/${slug}`);
      const toc = page.getByRole("navigation", { name: "On this page" });
      const hrefs = await toc
        .getByRole("link")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
      expect(hrefs.length).toBeGreaterThanOrEqual(9);
      for (const href of hrefs) {
        expect(href).toMatch(/^#.+/);
        await expect(page.locator(`[id="${href!.slice(1)}"]`)).toHaveCount(1);
      }
    });

    test("clicking a TOC link moves to its heading", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/work/${slug}`);
      await page
        .getByRole("navigation", { name: "On this page" })
        .getByRole("link", { name: "Testing & delivery" })
        .click();
      await expect(page).toHaveURL(/#testing--delivery$/);
      await expect(page.getByRole("heading", { name: "Testing & delivery" })).toBeInViewport();
    });

    test("TOC is a collapsible details below lg and has no horizontal scroll at 375px", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(`/work/${slug}`);
      const summary = page.getByText("On this page").first();
      await expect(summary).toBeVisible();
      await summary.click();
      await expect(
        page.getByRole("navigation", { name: "On this page" }).getByRole("link").first(),
      ).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test("has no horizontal scroll at 1440px", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/work/${slug}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test("the body is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/work/managerapp");
  await expect(page.getByRole("heading", { level: 2, name: "TL;DR" })).toBeVisible();
  await context.close();
});

test("previous/next links navigate between case studies, no wrap-around", async ({ page }) => {
  await page.goto("/work/managerapp");
  const more = page.getByRole("navigation", { name: "More case studies" });
  await expect(more.getByRole("link", { name: /Previous case study/ })).toHaveCount(0);
  await more.getByRole("link", { name: /Next case study/ }).click();
  await expect(page).toHaveURL(/\/work\/tu-conjunto$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tu Conjunto a la Mano");
  await expect(more.getByRole("link", { name: /Next case study/ })).toHaveCount(0);
  await more.getByRole("link", { name: /Previous case study/ }).click();
  await expect(page).toHaveURL(/\/work\/managerapp$/);
});

test("back link and contact CTA go to the home", async ({ page }) => {
  await page.goto("/work/managerapp");
  await page.getByRole("link", { name: /All work/ }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await page.goto("/work/managerapp");
  await page.getByRole("link", { name: "Get in touch" }).last().click();
  await expect(page).toHaveURL(/\/#contact$/);
});

test("home card link opens the case study", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Read case study of Managerapp/ }).click();
  await expect(page).toHaveURL(/\/work\/managerapp$/);
  await expect(page.getByRole("heading", { level: 1, name: "Managerapp" })).toBeVisible();
});

test("an unknown slug returns 404", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist");
  expect(response?.status()).toBe(404);
});
