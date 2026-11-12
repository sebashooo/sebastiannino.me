import { expect, test, type Page } from "@playwright/test";
import { getFeaturedProjects, getOtherProjects } from "../../src/data";
import { tabTo } from "./helpers";

const featuredCards = (page: Page) =>
  page.locator('#work ul[aria-label="Selected projects"] > li > article');

test("Selected work shows the featured projects as cards, in data order", async ({ page }) => {
  const featured = getFeaturedProjects();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "Selected work" })).toBeVisible();
  const cards = featuredCards(page);
  await expect(cards).toHaveCount(featured.length);
  for (const [i, project] of featured.entries()) {
    await expect(cards.nth(i).getByRole("heading", { level: 3 })).toHaveText(project.name);
  }
});

test("each featured card matches the data: one-liner, stack, private note, case-study link", async ({
  page,
}) => {
  await page.goto("/");
  const cards = featuredCards(page);
  for (const [i, project] of getFeaturedProjects().entries()) {
    const card = cards.nth(i);
    await expect(card.getByText(project.oneLiner)).toBeVisible();
    await expect(card.locator('ul[aria-label="Tech stack"] > li')).toHaveText(project.stack);
    await expect(card.getByText(project.privateNote!)).toBeVisible();

    const link = card.getByRole("link", { name: /Read case study/ });
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("href", project.links.caseStudy!);
    await expect(link).toHaveAccessibleName(`Read case study of ${project.name}`);
  }
});

test("each card has exactly one interactive element and no repo links", async ({ page }) => {
  await page.goto("/");
  const cards = featuredCards(page);
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    await expect(card.locator("a, button, input, select, textarea, [tabindex]")).toHaveCount(1);
    await expect(card.locator('a[href*="github.com"]')).toHaveCount(0);
  }
});

test("missing media shows a clearly labeled placeholder, not a fake screenshot", async ({
  page,
}) => {
  await page.goto("/");
  const cards = featuredCards(page);
  for (const [i, project] of getFeaturedProjects().entries()) {
    if (project.media) continue;
    await expect(cards.nth(i).getByText("demo screenshot · coming soon")).toBeVisible();
    await expect(cards.nth(i).locator("img, video")).toHaveCount(0);
  }
});

test("Other projects lists the non-featured items; repo link only where the data has one", async ({
  page,
}) => {
  await page.goto("/");
  const list = page.locator('#work ul[aria-label="Other projects"] > li');
  const others = getOtherProjects();
  await expect(list).toHaveCount(others.length);
  for (const [i, project] of others.entries()) {
    const item = list.nth(i);
    await expect(item.getByRole("heading", { level: 4 })).toHaveText(project.name);
    await expect(item.getByText(project.oneLiner)).toBeVisible();
    await expect(item.locator('ul[aria-label="Tech stack"] > li')).toHaveText(project.stack);
    const repoLink = item.getByRole("link", { name: /View source on GitHub/ });
    if (project.links.repo) {
      await expect(repoLink).toHaveAttribute("href", project.links.repo);
      await expect(repoLink).toHaveAttribute("rel", "noopener noreferrer");
      await expect(repoLink).toHaveAttribute("target", "_blank");
    } else {
      await expect(repoLink).toHaveCount(0);
    }
  }
});

test("the whole card is clickable: clicking its body follows the case-study link", async ({
  page,
}) => {
  await page.goto("/");
  const first = featuredCards(page).first();
  const href = getFeaturedProjects()[0].links.caseStudy!;
  // Click the middle of the card, not the link text: the link's overlay must catch it.
  await first.scrollIntoViewIfNeeded();
  const box = (await first.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});

test("'See my work' still lands on the work section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "See my work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});

test("keyboard focus draws a 2px accent ring around the card", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const link = featuredCards(page)
    .first()
    .getByRole("link", { name: /Read case study/ });
  await tabTo(page, link);
  await expect(link).toBeFocused();

  const card = featuredCards(page).first();
  const ring = await card.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      width: s.outlineWidth,
      offset: s.outlineOffset,
      style: s.outlineStyle,
      color: s.outlineColor,
    };
  });
  expect(ring).toEqual({
    width: "2px",
    offset: "2px",
    style: "solid",
    color: "rgb(103, 232, 249)",
  });
  // one ring, not two: the link itself shows no outline
  expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("none");
});

test("hovering a card changes its border and zooms the media (motion allowed)", async ({
  page,
}) => {
  await page.goto("/");
  const card = featuredCards(page).first();
  const before = await card.evaluate((el) => getComputedStyle(el).borderColor);
  await card.hover();
  await expect.poll(() => card.evaluate((el) => getComputedStyle(el).borderColor)).not.toBe(before);
  const media = card.locator("div.absolute.inset-0").first();
  await expect.poll(() => media.evaluate((el) => getComputedStyle(el).scale)).not.toBe("none");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("hover does not zoom the media", async ({ page }) => {
    await page.goto("/");
    const card = featuredCards(page).first();
    await card.hover();
    const media = card.locator("div.absolute.inset-0").first();
    await page.waitForTimeout(500);
    expect(await media.evaluate((el) => getComputedStyle(el).scale)).toBe("none");
  });
});

for (const width of [375, 1440]) {
  test(`work section fits the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    const cards = featuredCards(page);
    const count = await cards.count();
    const boxes = [];
    for (let i = 0; i < count; i++) boxes.push((await cards.nth(i).boundingBox())!);
    for (const box of boxes) expect(box.x + box.width).toBeLessThanOrEqual(width);
    if (width >= 768) {
      expect(boxes[1].x).toBeGreaterThan(boxes[0].x); // two columns
    } else {
      expect(boxes[1].y).toBeGreaterThan(boxes[0].y + boxes[0].height - 1); // stacked
      expect(boxes[1].x).toBe(boxes[0].x);
    }
  });
}
