import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
