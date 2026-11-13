import { expect, test, type Page } from "@playwright/test";
import { getAllProjects, getProfile } from "../../src/data";

const widget = (page: Page) => page.getByRole("figure", { name: /sebastian --stack/ });
const input = (page: Page) => widget(page).getByRole("textbox", { name: /type a command/i });
const log = (page: Page) => widget(page).getByRole("log", { name: "Terminal output" });

/** Types a command the way a visitor does and presses Enter. */
async function run(page: Page, command: string) {
  await input(page).fill(command);
  await input(page).press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(input(page)).toBeVisible();
});

test("help lists the commands and clears the input", async ({ page }) => {
  await run(page, "help");
  await expect(log(page)).toContainText("Available commands:");
  for (const name of ["whoami", "projects", "stack", "experience", "resume", "contact", "clear"]) {
    await expect(log(page)).toContainText(name);
  }
  await expect(log(page)).not.toContainText("sudo");
  await expect(input(page)).toHaveValue("");
});

test("an unknown command answers command not found with a hint", async ({ page }) => {
  await run(page, "  FooBar  ");
  await expect(log(page)).toContainText("command not found: foobar — try 'help'");
});

test("empty input does nothing", async ({ page }) => {
  await run(page, "   ");
  await expect(log(page)).toBeEmpty();
});

test("clear empties the output", async ({ page }) => {
  await run(page, "help");
  await expect(log(page)).not.toBeEmpty();
  await run(page, "clear");
  await expect(log(page)).toBeEmpty();
});

test("Ctrl+L clears the output too", async ({ page }) => {
  await run(page, "whoami");
  await expect(log(page)).toContainText(getProfile().name);
  await input(page).press("Control+l");
  await expect(log(page)).toBeEmpty();
});

test("resume shows the résumé link from the data", async ({ page }) => {
  await run(page, "resume");
  const link = log(page).getByRole("link", { name: "Download résumé (PDF)" });
  await expect(link).toHaveAttribute("href", getProfile().resumeUrl);
  await expect(link).toHaveAttribute("download", "");
});

test("contact shows the email, LinkedIn and GitHub from the data", async ({ page }) => {
  await run(page, "contact");
  const p = getProfile();
  await expect(log(page).getByRole("link", { name: p.email })).toHaveAttribute(
    "href",
    `mailto:${p.email}`,
  );
  await expect(log(page).getByRole("link", { name: p.socials.linkedin })).toBeVisible();
  await expect(log(page).getByRole("link", { name: p.socials.github })).toBeVisible();
});

test("sudo hire-me grants permission and points at the email", async ({ page }) => {
  await run(page, "sudo hire-me");
  await expect(log(page)).toContainText("Permission granted. Opening email…");
  await expect(log(page).getByRole("link", { name: getProfile().email })).toHaveAttribute(
    "href",
    `mailto:${getProfile().email}`,
  );
  await expect(page).toHaveURL(/localhost:3100\/$/); // the page itself did not navigate away
});

test("projects lists every project and a case-study link that navigates", async ({ page }) => {
  await run(page, "projects");
  for (const p of getAllProjects()) await expect(log(page)).toContainText(p.name);
  await log(page).getByRole("link", { name: "Managerapp" }).click();
  await expect(page).toHaveURL(/\/work\/managerapp$/);
});

test("ArrowUp and ArrowDown browse the command history", async ({ page }) => {
  await run(page, "help");
  await run(page, "whoami");
  await input(page).press("ArrowUp");
  await expect(input(page)).toHaveValue("whoami");
  await input(page).press("ArrowUp");
  await expect(input(page)).toHaveValue("help");
  await input(page).press("ArrowDown");
  await expect(input(page)).toHaveValue("whoami");
  await input(page).press("ArrowDown");
  await expect(input(page)).toHaveValue("");
});

test("history keeps what was being typed", async ({ page }) => {
  await run(page, "help");
  await input(page).fill("pro");
  await input(page).press("ArrowUp");
  await expect(input(page)).toHaveValue("help");
  await input(page).press("ArrowDown");
  await expect(input(page)).toHaveValue("pro");
});

test("Tab completes a unique command and never traps keyboard focus", async ({ page }) => {
  await input(page).fill("pro");
  await input(page).press("Tab");
  await expect(input(page)).toHaveValue("projects");
  await expect(input(page)).toBeFocused();

  // Ambiguous (contact, clear), so Tab moves on instead of completing
  await input(page).fill("c");
  await input(page).press("Tab");
  await expect(input(page)).toHaveValue("c");
  await expect(input(page)).not.toBeFocused();
});

test("the input shows a visible 2px accent focus outline", async ({ page }) => {
  await input(page).focus();
  const outline = await input(page).evaluate((el) => {
    const s = getComputedStyle(el);
    return { width: s.outlineWidth, style: s.outlineStyle };
  });
  expect(outline).toEqual({ width: "2px", style: "solid" });
});

test("output is announced politely and nothing animates (reduced motion safe)", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await run(page, "stack");
  await expect(log(page)).toHaveAttribute("aria-live", "polite");
  await expect(log(page)).toContainText("languages");
  const animations = await widget(page).evaluate(
    (el) => el.getAnimations({ subtree: true }).length,
  );
  expect(animations).toBe(0);
});

test("text in the input does not break the layout, and the page never scrolls sideways", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await run(page, "x".repeat(150)); // an unbreakable string
  await run(page, "projects");
  await run(page, "experience");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  const box = await widget(page).boundingBox();
  expect(box!.x + box!.width).toBeLessThanOrEqual(375);
});

test("on a phone the input is 16px so iOS does not zoom the page", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  expect(await input(page).evaluate((el) => getComputedStyle(el).fontSize)).toBe("16px");
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await input(page).evaluate((el) => getComputedStyle(el).fontSize)).toBe("13px");
});
