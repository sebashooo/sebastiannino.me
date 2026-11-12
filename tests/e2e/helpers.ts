import type { Locator, Page } from "@playwright/test";

/** Tab until the locator has focus (so tests exercise real keyboard focus, not programmatic focus). */
export async function tabTo(page: Page, target: Locator, maxTabs = 30) {
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error("Element never received keyboard focus");
}
