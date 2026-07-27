/**
 * Build the static ⌘K search index (public/search-index.json) from the writing
 * content tree. Runs as the `prebuild` step so `next build` always ships a fresh
 * index. Drafts are excluded in production (getAllPosts filters them).
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "../lib/mdx.ts";
import { extractToc } from "../lib/toc.ts";
import type { SearchDoc } from "../lib/search.ts";

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
const index: SearchDoc[] = posts.map((p) => ({
  title: p.frontmatter.title,
  href: p.href,
  description: p.frontmatter.description ?? "",
  headings: extractToc(p.content).map((h) => h.text),
  excerpt: toPlainText(p.content).slice(0, 240),
}));

const outDir = path.join(process.cwd(), "public");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "search-index.json"), JSON.stringify(index));
console.log(`\n✓ search-index.json — ${index.length} posts indexed`);
