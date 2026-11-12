import { getCertifications } from "@/data";
import { CertCard } from "./CertCard";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";

/** Certifications & learning. Statuses come from the data and are never upgraded in the UI. */
export function CertificationsSection() {
  const certifications = getCertifications();

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="py-14 md:py-20"
    >
      <Container className="flex flex-col gap-8">
        <SectionHeader id="certifications-heading" title="Certifications & learning" />
        <ul aria-label="Certifications" className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {certifications.map((cert) => (
            <li key={cert.name}>
              <CertCard cert={cert} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
