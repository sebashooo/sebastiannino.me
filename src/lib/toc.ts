import GithubSlugger from "github-slugger";

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** Inline markdown that does not appear in the rendered heading text. */
function plainText(raw: string): string {
  return raw
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links and images → label
    .replace(/[*_`~]/g, "") // emphasis and code marks
    .replace(/<[^>]+>/g, "") // inline JSX/HTML tags
    .trim();
}

/**
 * Table of contents from the MDX source: ## and ### headings only, fenced code blocks skipped.
 * ids come from github-slugger, the same algorithm rehype-slug uses, with one shared instance per
 * document so duplicate headings get -1, -2 … suffixes exactly like the rendered ids.
 */
export function extractToc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let fence: string | null = null;

  for (const line of source.split(/\r?\n/)) {
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const heading = /^ {0,3}(#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/.exec(line);
    if (!heading) continue;
    const level = heading[1].length;
    const text = plainText(heading[2]);
    // Slug every heading level so ids stay aligned with rehype-slug; list only ## and ###.
    const id = slugger.slug(text);
    if (level === 2 || level === 3) items.push({ id, text, level });
  }
  return items;
}
