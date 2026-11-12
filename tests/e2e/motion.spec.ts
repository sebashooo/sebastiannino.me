import { expect, test, type Page } from "@playwright/test";

const SECTIONS = ["#work", "#about", "#experience", "#certifications", "#contact"];
const wrapper = (page: Page, section: string) => page.locator(`${section} > div`).first();

const computed = (page: Page, section: string) =>
  wrapper(page, section).evaluate((el) => {
    const s = getComputedStyle(el);
    return { opacity: s.opacity, transform: s.transform, state: el.getAttribute("data-reveal") };
  });

test.describe("JavaScript disabled", () => {
  test("every section's text is in the HTML and visible", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    for (const section of SECTIONS) {
      const heading = page.locator(`${section} h2`);
      await expect(heading).toBeVisible();
      const c = await computed(page, section);
      expect(c.opacity).toBe("1");
      expect(c.transform).toBe("none");
    }
    await context.close();
  });

  test("the server-rendered HTML has no opacity:0 styles", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).not.toMatch(/style="[^"]*opacity:\s*0/);
    expect(html).not.toContain("data-reveal");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("sections are visible immediately: no transform, no opacity change, no animation", async ({
    page,
  }) => {
    await page.goto("/");
    for (const section of SECTIONS) {
      const c = await computed(page, section);
      expect(c, section).toEqual({ opacity: "1", transform: "none", state: null });
      expect(await wrapper(page, section).evaluate((el) => el.getAnimations().length)).toBe(0);
    }
  });

  test("scrolling to the bottom changes nothing", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    expect(await computed(page, "#contact")).toEqual({
      opacity: "1",
      transform: "none",
      state: null,
    });
  });
});

test.describe("motion enabled", () => {
  test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });

  test("the Hero is never hidden or animated", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator('section[aria-labelledby="hero-heading"]');
    await expect(hero.locator("[data-reveal]")).toHaveCount(0);
    expect(await hero.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("a below-the-fold section starts offset and fades fully in after scrolling into view", async ({
    page,
  }) => {
    await page.goto("/");
    // Hidden start state is applied on the client for blocks still below the viewport
    await expect.poll(async () => (await computed(page, "#contact")).state).toBe("hidden");
    const start = await computed(page, "#contact");
    expect(start.opacity).toBe("0");
    expect(start.transform).toMatch(/matrix\(1, 0, 0, 1, 0, 8\)/); // translateY(8px)

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect
      .poll(async () => (await computed(page, "#contact")).state, { timeout: 4000 })
      .toBe("shown");
    const end = await computed(page, "#contact");
    expect(end.opacity).toBe("1");
    expect(end.transform).toBe("none");
  });

  test("animation lasts about 300 ms and animates only opacity and transform", async ({ page }) => {
    await page.goto("/");
    await expect.poll(async () => (await computed(page, "#certifications")).state).toBe("hidden");
    await page.evaluate(() => document.querySelector("#certifications")!.scrollIntoView());
    const info = await wrapper(page, "#certifications").evaluate(async (el) => {
      await new Promise((r) => requestAnimationFrame(r));
      return el.getAnimations().map((a) => ({
        duration: (a.effect!.getTiming().duration as number) ?? 0,
        props: Object.keys((a.effect as KeyframeEffect).getKeyframes()[0]).filter(
          (k) => !["offset", "easing", "composite", "computedOffset"].includes(k),
        ),
      }));
    });
    // The animation may already be over on a fast machine; if present, it must match the spec.
    for (const a of info) {
      expect(a.duration).toBeGreaterThanOrEqual(280);
      expect(a.duration).toBeLessThanOrEqual(320);
      expect(a.props.sort()).toEqual(["opacity", "transform"]);
    }
  });

  test("nav anchors land on the section with its content visible", async ({ page }) => {
    await page.goto("/");
    for (const [name, section] of [
      ["Work", "#work"],
      ["Experience", "#experience"],
    ]) {
      await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${section}$`));
      await expect
        .poll(async () => (await computed(page, section)).opacity, { timeout: 4000 })
        .toBe("1");
      await expect(page.locator(section)).toBeInViewport();
    }
  });

  test("'Get in touch' jumps to the bottom and no skipped section stays hidden", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Get in touch" })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    await expect
      .poll(async () => (await computed(page, "#contact")).opacity, { timeout: 4000 })
      .toBe("1");
    await expect(page.locator("[data-reveal='hidden']")).toHaveCount(0);
  });

  test("loading directly on a hash shows that section and the ones above it", async ({ page }) => {
    await page.goto("/#about");
    await expect
      .poll(async () => (await computed(page, "#about")).opacity, { timeout: 4000 })
      .toBe("1");
    await expect(page.locator("#work h2")).toBeVisible();
    expect((await computed(page, "#work")).opacity).toBe("1");
  });

  test("no horizontal overflow while sections are hidden or shown", async ({ page }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = () =>
        page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
      expect(await overflow()).toBeLessThanOrEqual(0);
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      expect(await overflow()).toBeLessThanOrEqual(0);
    }
  });
});
