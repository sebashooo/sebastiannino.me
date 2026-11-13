import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHeader } from "@/components/CaseStudyHeader";
import { CaseStudyNav } from "@/components/CaseStudyNav";
import { Container } from "@/components/Container";
import { Toc } from "@/components/Toc";
import { caseStudyModules, CASE_STUDY_DIR } from "@/content/work";
import { getAdjacentCaseStudies, getCaseStudies, getCaseStudy, getProjectBySlug } from "@/data";
import { extractToc } from "@/lib/toc";

// Explicit type (not the generated PageProps helper): `npm run typecheck` must work on a clean
// checkout, before any build has generated .next/types.
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  const project = getProjectBySlug(slug);
  if (!caseStudy || !project) return {};
  const url = `/work/${slug}`;
  const title = `${project.name} — Case study`;
  return {
    title,
    description: caseStudy.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: caseStudy.summary,
      publishedTime: caseStudy.publishedAt,
      ...(caseStudy.updatedAt ? { modifiedTime: caseStudy.updatedAt } : {}),
    },
    ...(caseStudy.draft ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  const project = getProjectBySlug(slug);
  const load = caseStudyModules[slug];
  if (!caseStudy || !project || !load) notFound();

  const [{ default: Content }, source] = await Promise.all([
    load(),
    // Build time only (static generation): the TOC is derived from the same MDX file.
    readFile(path.join(process.cwd(), CASE_STUDY_DIR, `${slug}.mdx`), "utf8"),
  ]);
  const toc = extractToc(source);
  const { previous, next } = getAdjacentCaseStudies(slug);

  return (
    <>
      <CaseStudyHeader project={project} caseStudy={caseStudy} />
      <Container className="py-10 md:py-14">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
          <div className="lg:col-start-2 lg:row-start-1">
            <Toc items={toc} />
          </div>
          <article className="min-w-0 lg:col-start-1 lg:row-start-1 lg:max-w-3xl">
            <Content />
          </article>
        </div>
      </Container>
      <CaseStudyNav previous={previous} next={next} />
    </>
  );
}
