import { getCaseStudies, getCaseStudy, getProfile, getProjectBySlug } from "@/data";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

// Per-case share card: the project name as the title. Static: one image per case study at build time.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Case study";

export function generateStaticParams() {
  return getCaseStudies().map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const caseStudy = getCaseStudy(slug);
  return ogImage({
    kicker: "Case study",
    title: project?.name ?? getProfile().name,
    subtitle: caseStudy?.summary ?? getProfile().headline,
  });
}
