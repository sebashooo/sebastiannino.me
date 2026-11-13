import { describe, expect, it } from "vitest";
import { getCaseStudies, getProfile } from "@/data";
import { absoluteUrl, personJsonLd, serializeJsonLd, sitemapEntries } from "./seo";
import { SITE } from "./site";

describe("personJsonLd", () => {
  const person = personJsonLd();

  it("is a schema.org Person with name, url, jobTitle and sameAs from the data", () => {
    expect(person["@context"]).toBe("https://schema.org");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe(getProfile().name);
    expect(person.url).toBe(SITE.url);
    expect(person.jobTitle).toBeTruthy();
    expect(person.sameAs).toEqual([getProfile().socials.github, getProfile().socials.linkedin]);
  });

  it("holds no phone, address or email", () => {
    const text = JSON.stringify(person);
    expect(text).not.toMatch(/telephone|phone|address|email|@sebastiannino/i);
    expect(text).not.toMatch(/\+?\d[\d\s().-]{8,}\d/);
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so the data can never close the script tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});

describe("sitemapEntries", () => {
  it("always lists the home page", () => {
    expect(sitemapEntries()[0]).toEqual({ path: "/" });
  });

  it("lists published case studies and leaves drafts out", () => {
    const published = getCaseStudies().filter((c) => !c.draft);
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).toEqual(["/", ...published.map((c) => `/work/${c.slug}`)]);
    for (const draft of getCaseStudies().filter((c) => c.draft)) {
      expect(paths).not.toContain(`/work/${draft.slug}`);
    }
  });

  it("gives published entries a lastModified date", () => {
    for (const e of sitemapEntries().filter((e) => e.path !== "/")) {
      expect(e.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("absoluteUrl", () => {
  it("builds URLs on the canonical origin", () => {
    expect(absoluteUrl("/")).toBe(`${SITE.url}/`);
    expect(absoluteUrl("/sitemap.xml")).toBe(`${SITE.url}/sitemap.xml`);
  });

  it("uses https and no trailing path in the origin", () => {
    expect(SITE.url).toMatch(/^https:\/\/[^/]+$/);
  });
});
