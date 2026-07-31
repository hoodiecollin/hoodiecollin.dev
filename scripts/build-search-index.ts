/**
 * Build the static ⌘K search index (public/search-index.json) from the writing
 * content tree plus the hand-built pages worth finding. Runs as the `prebuild`
 * step so `next build` always ships a fresh index. Drafts are excluded in
 * production (getAllPosts filters them).
 *
 * Posts index themselves from their MDX. Hand-built TSX pages have no MDX to
 * parse, so each one contributes an explicit entry below — its headings come
 * from the same data the page renders its sections from, so the two can't drift.
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "../lib/mdx.ts";
import { extractToc } from "../lib/toc.ts";
import type { SearchDoc } from "../lib/search.ts";
import { playbookSections, groundTruthRule } from "../lib/pm-playbook.ts";

function toPlainText(mdx: string): string {
  return mdx
    .replace(/^---[\s\S]*?---/, " ") // frontmatter
    .replace(/```[\s\S]*?```/g, " ") // code fences
    .replace(/`[^`]+`/g, " ") // inline code
    .replace(/<[^>]+>/g, " ") // jsx/html tags
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links/images
    .replace(/[#>*_~|-]/g, " ") // markdown punctuation
    .replace(/\s+/g, " ")
    .trim();
}

const posts = getAllPosts();
const postDocs: SearchDoc[] = posts.map((p) => ({
  title: p.frontmatter.title,
  href: p.href,
  description: p.frontmatter.description ?? "",
  headings: extractToc(p.content).map((h) => h.text),
  excerpt: toPlainText(p.content).slice(0, 240),
  group: "Writing",
}));

const pageDocs: SearchDoc[] = [
  {
    title: "AI Project-Management Playbook",
    href: "/ai-pm-playbook/",
    description:
      "A portable, two-axis GitHub project-management methodology — milestone + labels, and nothing else.",
    headings: playbookSections.map((s) => s.title),
    excerpt: groundTruthRule.slice(0, 240),
    group: "Pages",
  },
];

const index: SearchDoc[] = [...postDocs, ...pageDocs];

const outDir = path.join(process.cwd(), "public");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "search-index.json"), JSON.stringify(index));
console.log(
  `\n✓ search-index.json — ${postDocs.length} posts + ${pageDocs.length} pages indexed`,
);
