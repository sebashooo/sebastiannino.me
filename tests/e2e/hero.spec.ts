import { expect, test, type Page } from "@playwright/test";
import { getProfile, getSkillGroups } from "../../src/data";
import { tabTo } from "./helpers";

const terminal = (page: Page) => page.getByRole("figure", { name: /sebastian --stack/ });

test("hero shows the availability label, headline and tagline from the data", async ({ page }) => {
  const profile = getProfile();
  await page.goto("/");
  const hero = page.locator('section[aria-labelledby="hero-heading"]');
  await expect(hero.getByText(profile.availability)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(profile.headline);
  await expect(page.getByText(profile.tagline)).toBeVisible();
});

test("hero has both CTAs pointing to the right places", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "See my work" })).toHaveAttribute("href", "#work");
  await expect(page.getByRole("link", { name: "Download résumé" })).toHaveAttribute(
    "href",
    getProfile().resumeUrl,
  );
});

test("'See my work' scrolls to the work section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "See my work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});

test("terminal shows the command and exactly the stack from the data", async ({ page }) => {
  await page.goto("/");
  const widget = terminal(page);
  await expect(widget).toBeVisible();
  await expect(widget).toContainText("sebastian --stack");

  const groups = getSkillGroups();
  const rows = widget.locator("dl > div");
  await expect(rows).toHaveCount(groups.length);
  for (const [i, group] of groups.entries()) {
    await expect(rows.nth(i).locator("dt")).toHaveText(group.name.toLowerCase());
    await expect(rows.nth(i).locator("dd")).toHaveText(group.items.join(" · "));
  }
});

test("terminal is static: no input, and the decorative characters are hidden from assistive tech", async ({
  page,
}) => {
  await page.goto("/");
  const widget = terminal(page);
  await expect(widget.locator("input, textarea, button")).toHaveCount(0);
  // Both ❯ prompts and the "terminal · zsh" bar are aria-hidden (3 elements + the nested ❯ span)
  const prompts = widget.locator('[aria-hidden="true"]', { hasText: "❯" });
  await expect(prompts).toHaveCount(2);
  await expect(widget.locator('div[aria-hidden="true"]')).toContainText("zsh");
});

for (const width of [375, 1440]) {
  test(`hero and terminal fit the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    const box = await terminal(page).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  });
}

test("terminal sits below the CTAs on mobile and beside the text on desktop", async ({ page }) => {
  const cta = page.getByRole("link", { name: "See my work" });

  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const ctaMobile = (await cta.boundingBox())!;
  const termMobile = (await terminal(page).boundingBox())!;
  expect(termMobile.y).toBeGreaterThan(ctaMobile.y + ctaMobile.height);

  await page.setViewportSize({ width: 1440, height: 900 });
  const ctaDesktop = (await cta.boundingBox())!;
  const termDesktop = (await terminal(page).boundingBox())!;
  expect(termDesktop.x).toBeGreaterThan(ctaDesktop.x + ctaDesktop.width);
});

test("both CTAs show a 2px accent focus outline from the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const name of ["See my work", "Download résumé"]) {
    const link = page.getByRole("link", { name });
    await tabTo(page, link);
    await expect(link).toBeFocused();
    const outline = await link.evaluate((el) => {
      const s = getComputedStyle(el);
      return { width: s.outlineWidth, offset: s.outlineOffset, color: s.outlineColor };
    });
    expect(outline).toEqual({ width: "2px", offset: "2px", color: "rgb(103, 232, 249)" });
  }
});
