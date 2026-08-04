/**
 * Build the static ⌘K search index (public/search-index.json) from the project
 * list plus the hand-built pages worth finding. Runs as the `prebuild` step so
 * `next build` always ships a fresh index.
 *
 * Every entry is derived from the same typed data the pages render from, so the
 * index and the pages can't drift: projects come from `siteProjects`, and each
 * hand-built TSX page contributes an explicit entry built from its own module.
 */
import fs from "node:fs";
import path from "node:path";
import type { SearchDoc } from "../lib/search.ts";
import { siteProjects, projectSlug } from "../lib/resume.ts";
import { playbookSections, groundTruthRule } from "../lib/pm-playbook.ts";

// A project with its own page on this site points there; the rest deep-link to
// their card on /projects via the anchor id the card renders.
const projectDocs: SearchDoc[] = siteProjects.map((p) => ({
  title: p.name,
  href: p.page ?? `/projects/#${projectSlug(p.name)}`,
  description: p.description,
  headings: p.tags ?? [],
  excerpt: (p.detail ?? p.description).slice(0, 240),
  group: "Projects",
}));

const pageDocs: SearchDoc[] = [
  {
    title: "AI Project-Management Playbook",
    href: "/ai-pm-playbook/",
    description:
      "A project-management system for GitHub repos: every piece of work is an issue, and only its milestone and labels organize it.",
    headings: playbookSections.map((s) => s.title),
    excerpt: groundTruthRule.slice(0, 240),
    group: "Pages",
  },
];

const index: SearchDoc[] = [...projectDocs, ...pageDocs];

const outDir = path.join(process.cwd(), "public");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "search-index.json"), JSON.stringify(index));
console.log(
  `\n✓ search-index.json — ${projectDocs.length} projects + ${pageDocs.length} pages indexed`,
);
