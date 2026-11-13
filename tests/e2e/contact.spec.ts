import { expect, test, type Page } from "@playwright/test";
import { getProfile } from "../../src/data";
import { tabTo } from "./helpers";

const profile = getProfile();
const status = (page: Page) => page.locator("#contact [role=status]");
const copyButton = (page: Page) => page.getByRole("button", { name: "Copy email address" });

test("sections appear in order, ending with Contact", async ({ page }) => {
  await page.goto("/");
  const tops = await page.evaluate(() =>
    ["#work", "#about", "#experience", "#certifications", "#contact"].map(
      (s) => document.querySelector(s)!.getBoundingClientRect().top,
    ),
  );
  expect([...tops].sort((a, b) => a - b)).toEqual(tops);
  // The hero (the section without an id) comes first, before Selected work
  const firstSectionId = await page.evaluate(() => document.querySelector("main section")!.id);
  expect(firstSectionId).toBe("");
});

test("Contact shows the heading, the mailto link and the profile links from the data", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("section#contact");
  await expect(
    contact.getByRole("heading", { level: 2, name: "Let's build something." }),
  ).toBeVisible();

  const email = contact.getByRole("link", { name: profile.email });
  await expect(email).toHaveText(profile.email);
  await expect(email).toHaveAttribute("href", `mailto:${profile.email}`);

  for (const [name, href] of [
    ["LinkedIn", profile.socials.linkedin],
    ["GitHub", profile.socials.github],
  ]) {
    const link = contact.getByRole("link", { name: new RegExp(name) });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("the contact line is built from the profile data", async ({ page }) => {
  await page.goto("/");
  const line = `${profile.location} · ${profile.languages.join(", ")} · ${profile.availability}`;
  await expect(page.locator("section#contact").getByText(line, { exact: true })).toBeVisible();
});

test("there is no contact form (D-09)", async ({ page }) => {
  await page.goto("/");
  // Wait for hydration: the terminal's command box is the one input allowed on the page (F4-02)
  await expect(page.getByRole("textbox", { name: /type a command/i })).toBeVisible();
  await expect(page.locator("form, textarea")).toHaveCount(0);
  await expect(page.locator("input")).toHaveCount(1);
  await expect(page.locator("#contact").locator("form, input, textarea")).toHaveCount(0);
});

test("the footer is slim: no duplicated email or profile links", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.locator("a")).toHaveCount(0);
  await expect(footer).not.toContainText(profile.email);
});

test("nav 'Get in touch' lands on #contact (desktop)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Get in touch" })
    .click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
});

test("nav 'Get in touch' lands on #contact (mobile menu)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "Get in touch" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
});

test.describe("copy button", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  test("puts exactly the profile email on the clipboard and confirms in the live region", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(status(page)).toHaveText("");
    await copyButton(page).click();
    await expect(status(page)).toHaveText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);
    // The confirmation goes away after about 2 seconds
    await expect(status(page)).toHaveText("", { timeout: 4000 });
  });

  test("the live region is polite and always present", async ({ page }) => {
    await page.goto("/");
    await expect(status(page)).toHaveAttribute("aria-live", "polite");
    await expect(status(page)).toHaveCount(1);
  });

  test("is a real button with a 44px minimum height", async ({ page }) => {
    await page.goto("/");
    const button = copyButton(page);
    await expect(button).toHaveAttribute("type", "button");
    const box = (await button.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test("works from the keyboard (Enter)", async ({ page }) => {
    await page.goto("/");
    await tabTo(page, copyButton(page));
    await page.keyboard.press("Enter");
    await expect(status(page)).toHaveText("Copied");
  });

  test("keyboard focus shows a 2px accent ring immediately (no outline transition)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const button = copyButton(page);
    await tabTo(page, button);
    await expect(button).toBeFocused();
    const outline = await button.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        width: s.outlineWidth,
        offset: s.outlineOffset,
        style: s.outlineStyle,
        color: s.outlineColor,
      };
    });
    expect(outline).toEqual({
      width: "2px",
      offset: "2px",
      style: "solid",
      color: "rgb(103, 232, 249)",
    });
  });
});

test.describe("clipboard fallback", () => {
  test("without the Clipboard API: no crash, email text selected, Ctrl+C hint shown", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    });
    await page.goto("/");
    await copyButton(page).click();
    await expect(status(page)).toHaveText("Press Ctrl+C to copy");
    expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(profile.email);
    expect(errors).toEqual([]);
  });

  test("when writeText rejects: same graceful fallback", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.reject(new Error("denied")) },
        configurable: true,
      });
    });
    await page.goto("/");
    await copyButton(page).click();
    await expect(status(page)).toHaveText("Press Ctrl+C to copy");
    expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(profile.email);
    expect(errors).toEqual([]);
  });
});

test("without JavaScript the mailto link is still there", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.locator("section#contact").getByRole("link", { name: profile.email }),
  ).toHaveAttribute("href", `mailto:${profile.email}`);
  await context.close();
});

for (const width of [375, 1440]) {
  test(`Contact fits the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    for (const locator of [
      page.locator("section#contact a").first(),
      copyButton(page),
      page.locator("section#contact p").last(),
    ]) {
      const box = (await locator.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
  });
}
