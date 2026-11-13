import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SkipLink } from "@/components/SkipLink";
import { SITE } from "@/lib/site";
import "./globals.css";

// Self-hosted by next/font at build time (no runtime request to Google, no layout shift).
// Only the weights the design uses are loaded. Each font exposes a CSS variable that
// globals.css maps to the font-display / font-sans / font-mono utilities.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-space-grotesk",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  // Resolves every relative URL below (canonical, Open Graph images) to the canonical origin
  metadataBase: new URL(SITE.url),
  // Pages set a short title; the template appends the name. The home uses the full default.
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    title: SITE.title,
    description: SITE.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
};

/** Shared shell: skip link → header (Nav) → main → footer. Every page renders inside <main>. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Nav />
        {/* tabIndex=-1 lets the skip link move focus here */}
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        {/*
          Vercel Web Analytics: cookieless, so no consent banner is needed (D-51). Mounted once, here,
          and only when the build runs on Vercel (VERCEL is set at build time), so local runs, CI and
          the e2e suite send nothing and never request the /_vercel script that only exists there.
        */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
