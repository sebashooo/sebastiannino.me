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
  title: SITE.title,
  description: SITE.description,
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
      </body>
    </html>
  );
}
