import { expect, test } from "@playwright/test";
import { getProfile, getSkillGroups } from "../../src/data";

test("About section exists after Selected work, with the paragraphs from the data", async ({
  page,
}) => {
  await page.goto("/");
  const about = page.locator("section#about");
  await expect(about.getByRole("heading", { level: 2, name: "About" })).toBeVisible();

  const paragraphs = about.locator("p");
  const expected = getProfile().about;
  await expect(paragraphs).toHaveCount(expected.length);
  for (const [i, text] of expected.entries()) await expect(paragraphs.nth(i)).toHaveText(text);

  // Order on the page: Hero, Selected work, About
  const order = await page.evaluate(() =>
    ["#work", "#about"].map((s) => document.querySelector(s)!.getBoundingClientRect().top),
  );
  expect(order[0]).toBeLessThan(order[1]);
});

test("every skill group and item equals the data, in order", async ({ page }) => {
  await page.goto("/");
  const groups = getSkillGroups();
  const rows = page.locator("section#about dl > div");
  await expect(rows).toHaveCount(groups.length);
  for (const [i, group] of groups.entries()) {
    await expect(rows.nth(i).locator("dt")).toHaveText(group.name);
    await expect(rows.nth(i).locator("li")).toHaveText(group.items);
  }
});

test("skills are plain chips: no progress bars or level indicators", async ({ page }) => {
  await page.goto("/");
  const about = page.locator("section#about");
  await expect(about.locator('progress, meter, [role="progressbar"], [role="meter"]')).toHaveCount(
    0,
  );
});

test("the nav 'About' link lands on #about", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
});

test("the mobile menu 'About' link lands on #about", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
});

test("skill and label text meets AA contrast (4.5:1) against the page background", async ({
  page,
}) => {
  await page.goto("/");
  const ratios = await page.evaluate(() => {
    const lum = ([r, g, b]: number[]) => {
      const c = [r, g, b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const rgb = (css: string) =>
      css
        .match(/\d+(\.\d+)?/g)!
        .slice(0, 3)
        .map(Number);
    const bg = rgb(getComputedStyle(document.body).backgroundColor);
    const ratio = (el: Element) => {
      const fg = rgb(getComputedStyle(el).color);
      const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      return (a + 0.05) / (b + 0.05);
    };
    const about = document.querySelector("#about")!;
    return [
      ratio(about.querySelector("dt")!),
      ratio(about.querySelector("li")!),
      ratio(about.querySelector("p")!),
    ];
  });
  for (const r of ratios) expect(r).toBeGreaterThanOrEqual(4.5);
});

for (const width of [375, 1440]) {
  test(`About fits the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // Every chip list stays inside the viewport
    const lists = page.locator("section#about ul");
    const count = await lists.count();
    for (let i = 0; i < count; i++) {
      const box = (await lists.nth(i).boundingBox())!;
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }

    // Two columns on desktop, stacked on mobile
    const text = (await page.locator("section#about p").first().boundingBox())!;
    const skills = (await page.getByRole("heading", { level: 3, name: "Skills" }).boundingBox())!;
    if (width >= 1024) expect(skills.x).toBeGreaterThan(text.x + text.width - 1);
    else expect(skills.y).toBeGreaterThan(text.y);
  });
}
