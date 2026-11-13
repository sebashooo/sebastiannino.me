import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Case studies are MDX modules imported from src/content/work (D-39); they are not file-based routes.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Tailwind v4 is wired through its Turbopack loader (Turbopack is the default bundler in Next 16).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    // Turbopack needs plugins by package name (strings), not imported functions.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
