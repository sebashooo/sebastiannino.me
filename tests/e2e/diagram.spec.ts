import { expect, test } from "@playwright/test";

const CASES = [
  { slug: "managerapp", title: "Managerapp architecture" },
  { slug: "tu-conjunto", title: "Tu Conjunto a la Mano architecture" },
];

for (const { slug, title } of CASES) {
  for (const width of [375, 1440]) {
    test(`/work/${slug}: diagram is visible, named and fits at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/work/${slug}`);

      const figure = page.locator("figure").filter({ has: page.getByText(title, { exact: true }) });
      await expect(figure).toHaveCount(1);
      await figure.scrollIntoViewIfNeeded();
      await expect(figure).toBeVisible();
      await expect(figure.locator("figcaption")).toHaveText(title);

      // Exactly one of the two SVGs is exposed, and it has an accessible name and description
      const diagram = figure.getByRole("img", { name: title });
      await expect(diagram).toHaveCount(1);
      await expect(diagram).toBeVisible();
      await expect(diagram).toHaveAttribute(
        "data-diagram-orientation",
        width >= 768 ? "horizontal" : "vertical",
      );
      await expect(diagram).toHaveAccessibleDescription(/\S+/);

      // Text stays legible: the SVG is not scaled far below its natural size
      const scale = await diagram.evaluate((el) => {
        const svg = el as unknown as SVGSVGElement;
        return svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      });
      expect(scale).toBeGreaterThan(0.9);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test(`/work/${slug}: the text version lists the flow and opens with the keyboard`, async ({
    page,
  }) => {
    await page.goto(`/work/${slug}`);
    const figure = page.locator("figure").filter({ has: page.getByText(title, { exact: true }) });
    const summary = figure.getByText("Text version");
    await summary.scrollIntoViewIfNeeded();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(figure.getByText("Flow", { exact: true })).toBeVisible();
    expect(await figure.locator("ol > li").count()).toBeGreaterThanOrEqual(3);
  });

  test(`/work/${slug}: arrowhead marker ids are unique on the page`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    const ids = await page
      .locator("marker, svg title, svg desc")
      .evaluateAll((els) => els.map((e) => e.id).filter(Boolean));
    expect(new Set(ids).size).toBe(ids.length);
  });
}
