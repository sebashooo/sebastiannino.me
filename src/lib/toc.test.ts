import GithubSlugger from "github-slugger";
import { describe, expect, it } from "vitest";
import { extractToc } from "./toc";

describe("extractToc", () => {
  it("lists ## and ### headings with their level and ignores # and ####", () => {
    const toc = extractToc("# Title\n\n## One\n\ntext\n\n### Two\n\n#### Four\n\n## Three\n");
    expect(toc).toEqual([
      { id: "one", text: "One", level: 2 },
      { id: "two", text: "Two", level: 3 },
      { id: "three", text: "Three", level: 2 },
    ]);
  });

  it("gives duplicate headings unique ids, like rehype-slug", () => {
    const toc = extractToc("## Notes\n\n## Notes\n\n### Notes\n");
    expect(toc.map((t) => t.id)).toEqual(["notes", "notes-1", "notes-2"]);
  });

  it("ignores headings inside fenced code blocks (backticks and tildes)", () => {
    const source = [
      "## Real",
      "```bash",
      "## not a heading",
      "```",
      "~~~",
      "### also not",
      "~~~",
      "## After",
    ].join("\n");
    expect(extractToc(source).map((t) => t.text)).toEqual(["Real", "After"]);
  });

  it("matches github-slugger on the real headings, punctuation included", () => {
    const headings = [
      "TL;DR",
      "Context & problem",
      "My role & stack",
      "Key decisions & trade-offs",
      "What I'd do next",
    ];
    const slugger = new GithubSlugger();
    const expected = headings.map((h) => slugger.slug(h));
    const toc = extractToc(headings.map((h) => `## ${h}`).join("\n\n"));
    expect(toc.map((t) => t.id)).toEqual(expected);
    expect(toc.map((t) => t.id)).toEqual([
      "tldr",
      "context--problem",
      "my-role--stack",
      "key-decisions--trade-offs",
      "what-id-do-next",
    ]);
  });

  it("strips inline markdown from the label and the slug", () => {
    const toc = extractToc("## The `RLS` **bypass** [fix](https://example.com)\n");
    expect(toc).toEqual([{ id: "the-rls-bypass-fix", text: "The RLS bypass fix", level: 2 }]);
  });

  it("handles CRLF line endings and trailing hashes", () => {
    const toc = extractToc("## One ##\r\n\r\n### Two\r\n");
    expect(toc.map((t) => t.text)).toEqual(["One", "Two"]);
  });
});
