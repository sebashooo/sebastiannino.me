import { expect, test } from "@playwright/test";

test("an unknown URL returns 404 with the terminal-style page", async ({ page }) => {
  const response = await page.goto("/that-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.locator("main")).toContainText("cd /that-page");
  await expect(page.locator("main")).toContainText("bash: cd: no such file or directory");
  await expect(page).toHaveTitle(/Page not found/);
});

test("the 404 is not indexed", async ({ page }) => {
  await page.goto("/that-page");
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("the 404 links back home and to the work", async ({ page }) => {
  await page.goto("/that-page");
  await page.getByRole("link", { name: /Back home/ }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/that-page");
  await page.getByRole("link", { name: "See my work" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});

test("the decorative terminal is hidden from assistive technology", async ({ page }) => {
  await page.goto("/that-page");
  const terminal = page.locator('main [aria-hidden="true"]', { hasText: "cd /that-page" });
  await expect(terminal).toHaveCount(1);
});

for (const width of [375, 1440]) {
  test(`the 404 fits the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/that-page");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("a deep unknown path under /work also 404s", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist/deeper");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
});
