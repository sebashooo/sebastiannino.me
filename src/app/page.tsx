import { AboutSection } from "@/components/AboutSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Hero } from "@/components/Hero";
import { WorkSection } from "@/components/WorkSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkSection />
      <AboutSection />
      <ExperienceSection />
      <CertificationsSection />
    </>
  );
}
