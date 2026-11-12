import { expect, test } from "@playwright/test";

test("home loads and shows the headline", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Sebastián Niño/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Backend-minded full-stack developer." }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
});

for (const width of [375, 1440]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("keyboard focus shows a 2px accent outline", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const logo = page.getByRole("link", { name: "sn.me — home" });
  await expect(logo).toBeFocused();
  const outline = await logo.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      width: s.outlineWidth,
      offset: s.outlineOffset,
      style: s.outlineStyle,
      color: s.outlineColor,
    };
  });
  expect(outline.width).toBe("2px");
  expect(outline.offset).toBe("2px");
  expect(outline.style).toBe("solid");
  expect(outline.color).toBe("rgb(103, 232, 249)"); // #67e8f9
});

test("uses the three design fonts", async ({ page }) => {
  await page.goto("/");
  const fonts = await page.evaluate(() => ({
    h1: getComputedStyle(document.querySelector("h1")!).fontFamily,
    body: getComputedStyle(document.body).fontFamily,
    mono: getComputedStyle(document.querySelector("main p")!).fontFamily,
  }));
  expect(fonts.h1).toMatch(/Space Grotesk/i);
  expect(fonts.body).toMatch(/Inter/i);
  expect(fonts.mono).toMatch(/JetBrains Mono/i);
});
