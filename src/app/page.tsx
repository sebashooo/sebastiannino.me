import type { Metadata } from "next";
import { AboutSection } from "@/components/AboutSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { ContactSection } from "@/components/ContactSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Hero } from "@/components/Hero";
import { WorkSection } from "@/components/WorkSection";
import { personJsonLd, serializeJsonLd } from "@/lib/seo";

// Title, description and the Open Graph image come from the layout; the home sets only its canonical URL.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Built from src/data and escaped by serializeJsonLd, so it is safe to inline
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd()) }}
      />
      <Hero />
      <WorkSection />
      <AboutSection />
      <ExperienceSection />
      <CertificationsSection />
      <ContactSection />
    </>
  );
}
