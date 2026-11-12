import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectMedia } from "./ProjectMedia";

describe("ProjectMedia", () => {
  it("shows a clearly labeled placeholder when there is no media", () => {
    const html = renderToStaticMarkup(<ProjectMedia media={undefined} />);
    expect(html).toContain("demo screenshot · coming soon");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<video");
  });

  it("renders an image with the alt text from the data", () => {
    const html = renderToStaticMarkup(
      <ProjectMedia media={{ type: "image", src: "/media/demo.webp", alt: "Demo dashboard" }} />,
    );
    expect(html).toContain("<img");
    expect(html).toContain('alt="Demo dashboard"');
    expect(html).not.toContain("coming soon");
  });

  it("renders a muted, looping video with no autoplay, deferred loading and a poster", () => {
    const html = renderToStaticMarkup(
      <ProjectMedia
        media={{
          type: "video",
          src: "/media/demo.mp4",
          poster: "/media/demo.webp",
          alt: "Demo walkthrough",
        }}
      />,
    );
    expect(html).toContain("<video");
    expect(html).toMatch(/\bmuted\b/);
    expect(html).toMatch(/\bloop\b/);
    expect(html).toContain('preload="none"');
    expect(html).toContain('poster="/media/demo.webp"');
    expect(html).not.toMatch(/autoplay/i);
  });
});
