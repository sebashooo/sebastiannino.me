import { expect, test } from "@playwright/test";

test("home loads and shows the headline", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Sebastián Niño/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("heading", { level: 1, name: "Backend-minded full-stack developer." }),
  ).toBeVisible();
});

test("page has header, main and footer landmarks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
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

test("skip link is first in the tab order and moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("keyboard focus shows a 2px accent outline", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab"); // skip link
  await page.keyboard.press("Tab"); // logo
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

test("desktop nav shows links and a mailto CTA, and no menu button", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const name of ["Work", "About", "Experience"]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }
  await expect(nav.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
    "href",
    "mailto:hello@sebastiannino.me",
  );
  await expect(page.getByRole("button", { name: /menu/i })).toBeHidden();
});

test("nav gets a blurred background and border after scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 500 });
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header).not.toHaveClass(/backdrop-blur/);
  await page.mouse.wheel(0, 400);
  await expect(header).toHaveClass(/backdrop-blur/);
});

test.describe("mobile menu (375px)", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("opens and closes with the keyboard", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Open menu" });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("link", { name: "Work", exact: true })).toBeHidden();

    // skip link → logo → menu button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();

    await page.keyboard.press("Enter");
    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Work", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get in touch" })).toBeVisible();

    // the opened panel is reachable with Tab
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Work", exact: true })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.getByRole("link", { name: "Work", exact: true })).toBeHidden();
  });

  test("no horizontal scroll with the menu open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
