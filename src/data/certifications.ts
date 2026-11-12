import type { Certification } from "./types";

// Statuses must match context/01 exactly. Nothing is "certified" until it is passed:
// then set status to "certified" and add date and credentialUrl (a test enforces this).
export const certifications: Certification[] = [
  {
    name: "AWS Certified Cloud Practitioner (CLF-C02)",
    issuer: "Amazon Web Services",
    status: "in-progress",
    detail: "Course completed; exam pending",
  },
  {
    name: "GitHub Foundations",
    issuer: "GitHub",
    status: "course-completed",
    detail: "Course completed on DataCamp",
  },
  {
    name: "MongoDB Associate Developer (Node.js)",
    issuer: "MongoDB",
    status: "in-progress",
  },
  {
    name: "Cybersecurity Technician",
    issuer: "SENA",
    status: "in-progress",
  },
];
