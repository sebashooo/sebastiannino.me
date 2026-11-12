import type { Certification } from "@/data";
import { CHIP_STYLES, certStatusLabel, certStatusVariant } from "@/lib/cert-status";

/**
 * Certification card: name, issuer, status chip (always a text label), an optional factual note,
 * and, only when the data has them, the date and credential link of a certified item.
 */
export function CertCard({ cert }: { cert: Certification }) {
  const titleId = `cert-${cert.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const chip = CHIP_STYLES[certStatusVariant(cert.status)];
  const isCertified = cert.status === "certified";

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col gap-3 rounded-card border border-border bg-surface p-5"
    >
      <div className="flex flex-col gap-1">
        <h3 id={titleId} className="m-0 font-display text-lg leading-snug font-semibold text-text">
          {cert.name}
        </h3>
        <p className="m-0 text-sm text-text-muted">{cert.issuer}</p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <p
          data-cert-status={cert.status}
          className={`m-0 w-fit rounded-pill px-2.5 py-0.5 font-mono text-xs ${chip.className}`}
        >
          {certStatusLabel(cert.status)}
        </p>

        {cert.detail ? <p className="m-0 text-sm text-text-muted">{cert.detail}</p> : null}

        {isCertified && cert.date ? (
          <p className="m-0 font-mono text-xs text-text-muted">{cert.date}</p>
        ) : null}

        {isCertified && cert.credentialUrl ? (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-button text-sm font-medium text-accent hover:text-accent-hover"
          >
            View credential
            <span className="sr-only"> for {cert.name} (opens in a new tab)</span>
            <span aria-hidden="true"> ↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
