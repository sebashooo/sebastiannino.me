import { expect, test } from "@playwright/test";
import { getCertifications, getExperience } from "../../src/data";

const certLabel: Record<string, string> = {
  certified: "Certified",
  "in-progress": "In progress",
  "course-completed": "Course completed",
  planned: "Planned",
};

test.describe("Experience", () => {
  test("sections appear in order: Selected work, About, Experience, Certifications", async ({
    page,
  }) => {
    await page.goto("/");
    const tops = await page.evaluate(() =>
      ["#work", "#about", "#experience", "#certifications"].map(
        (s) => document.querySelector(s)!.getBoundingClientRect().top,
      ),
    );
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
  });

  test("entries, roles, periods and bullets equal the data, in order", async ({ page }) => {
    await page.goto("/");
    const items = page.locator("#experience ol > li");
    const entries = getExperience();
    await expect(items).toHaveCount(entries.length);
    for (const [i, entry] of entries.entries()) {
      const item = items.nth(i);
      await expect(item.getByRole("heading", { level: 3 })).toHaveText(entry.company);
      await expect(item).toContainText(entry.role);
      await expect(item).toContainText(entry.period);
      await expect(item.locator("ul > li")).toHaveText(entry.bullets);
    }
  });

  test("shows both work and education entries", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("#experience").innerText();
    for (const e of getExperience()) expect(text).toContain(e.company);
    expect(getExperience("education").length).toBeGreaterThan(0);
  });

  test("is an ordered list with exactly one current-role marker, exposed as text and an accent dot", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#experience ol")).toHaveCount(1);

    const current = page.locator('#experience li[data-current="true"]');
    await expect(current).toHaveCount(1);
    await expect(current.locator(".sr-only")).toHaveText("Current role.");
    // The only entry flagged as the current role is the current *work* entry in the data
    const currentWork = getExperience("work").filter((e) => e.current);
    expect(currentWork).toHaveLength(1);
    await expect(current.getByRole("heading", { level: 3 })).toHaveText(currentWork[0].company);

    // Accent dot only on that entry; every other dot is muted
    const dots = page.locator("#experience ol > li > span[aria-hidden]");
    const colors = await dots.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).backgroundColor),
    );
    const accentCount = colors.filter((c) => c === "rgb(103, 232, 249)").length;
    expect(accentCount).toBe(1);
    expect(colors).toHaveLength(getExperience().length);
  });

  test("the timeline has a 1px vertical line", async ({ page }) => {
    await page.goto("/");
    const border = await page
      .locator("#experience ol")
      .evaluate((el) => getComputedStyle(el).borderLeftWidth);
    expect(border).toBe("1px");
  });

  test("the nav 'Experience' link lands on #experience", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Experience", exact: true })
      .click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator("#experience")).toBeInViewport();
  });
});

test.describe("Certifications", () => {
  test("cards show name, issuer and status from the data, in order", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('#certifications ul[aria-label="Certifications"] > li > article');
    const certs = getCertifications();
    await expect(cards).toHaveCount(certs.length);
    for (const [i, cert] of certs.entries()) {
      const card = cards.nth(i);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(cert.name);
      await expect(card).toContainText(cert.issuer);
      await expect(card.locator("[data-cert-status]")).toHaveAttribute(
        "data-cert-status",
        cert.status,
      );
      await expect(card.locator("[data-cert-status]")).toHaveText(certLabel[cert.status]);
      if (cert.detail) await expect(card).toContainText(cert.detail);
    }
  });

  test("the real statuses are exactly: AWS in progress, MongoDB in progress, GitHub Foundations course completed, SENA in progress", async ({
    page,
  }) => {
    await page.goto("/");
    const statusOf = async (namePart: RegExp) =>
      page
        .locator("#certifications article")
        .filter({ has: page.getByRole("heading", { name: namePart }) })
        .locator("[data-cert-status]")
        .innerText();
    expect(await statusOf(/AWS/)).toBe("In progress");
    expect(await statusOf(/MongoDB/)).toBe("In progress");
    expect(await statusOf(/GitHub Foundations/)).toBe("Course completed");
    expect(await statusOf(/Cybersecurity/)).toBe("In progress");
  });

  test("the AWS card shows its factual note as secondary text", async ({ page }) => {
    await page.goto("/");
    const aws = page.locator("#certifications article").filter({ hasText: "AWS" });
    await expect(aws).toContainText("Course completed; exam pending");
  });

  test("nothing says 'Certified' unless the data status is certified", async ({ page }) => {
    await page.goto("/");
    const certified = getCertifications().filter((c) => c.status === "certified");
    const chips = page.locator("#certifications [data-cert-status]");
    const count = await chips.count();
    let shown = 0;
    for (let i = 0; i < count; i++) {
      const chip = chips.nth(i);
      const status = await chip.getAttribute("data-cert-status");
      const text = (await chip.innerText()).trim();
      if (text === "Certified") {
        shown++;
        expect(status).toBe("certified");
      }
    }
    expect(shown).toBe(certified.length);

    // Outside the certification titles (AWS's official name contains the word "Certified"),
    // the word must not appear on any card whose data status is not "certified".
    const texts = await page.locator("#certifications article").evaluateAll((cards) =>
      cards.map((card) => {
        const clone = card.cloneNode(true) as HTMLElement;
        clone.querySelector("h3")?.remove();
        return clone.innerText ?? clone.textContent ?? "";
      }),
    );
    for (const [i, cert] of getCertifications().entries()) {
      const says = /Certified/.test(texts[i]);
      expect(says, cert.name).toBe(cert.status === "certified");
    }
    // No credential links or dates are fabricated
    await expect(page.locator("#certifications a")).toHaveCount(
      certified.filter((c) => c.credentialUrl).length,
    );
  });

  test("status chip text meets AA contrast (4.5:1) over its real background", async ({ page }) => {
    await page.goto("/");
    const ratios = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      // Normalize any CSS color (rgb, oklab, color-mix...) to sRGBA bytes
      const parse = (css: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return { rgb: [r, g, b], a: a / 255 };
      };
      const lum = ([r, g, b]: number[]) => {
        const c = [r, g, b].map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      };
      return [...document.querySelectorAll("#certifications [data-cert-status]")].map((chip) => {
        const card = parse(getComputedStyle(chip.closest("article")!).backgroundColor).rgb;
        const bg = parse(getComputedStyle(chip).backgroundColor);
        const fg = parse(getComputedStyle(chip).color).rgb;
        const blended = bg.rgb.map((c, i) => c * bg.a + card[i] * (1 - bg.a));
        const [hi, lo] = [lum(fg), lum(blended)].sort((x, y) => y - x);
        return { status: chip.getAttribute("data-cert-status"), ratio: (hi + 0.05) / (lo + 0.05) };
      });
    });
    expect(ratios.length).toBe(getCertifications().length);
    for (const { status, ratio } of ratios) expect(ratio, status!).toBeGreaterThanOrEqual(4.5);
  });
});

for (const width of [375, 1440]) {
  test(`Experience and Certifications fit the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    for (const selector of ["#experience ol", "#certifications ul"]) {
      const box = (await page.locator(selector).first().boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }

    const cards = page.locator('#certifications ul[aria-label="Certifications"] > li');
    const first = (await cards.nth(0).boundingBox())!;
    const second = (await cards.nth(1).boundingBox())!;
    if (width >= 768)
      expect(second.x).toBeGreaterThan(first.x); // two columns
    else expect(second.y).toBeGreaterThan(first.y); // one column
  });
}
