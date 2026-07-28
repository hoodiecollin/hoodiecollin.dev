/**
 * Shared résumé → Markdown renderer. Takes a resolved résumé (lib/resume.ts) and
 * emits a clean, portable Markdown document — the plain-text companion to the PDF.
 *
 * Used by build-resume-variants.ts to write the per-slant records into
 * ~/Documents/resume/ alongside the PDFs. The typed data is the single source of
 * truth shared with the /resume page and the PDF renderer, so all three stay in
 * lockstep.
 */
import type { Resume } from "../lib/resume.ts";
import { site } from "../lib/site.ts";

function shortLink(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

export function resumeMarkdown(resume: Resume): string {
  const contacts = [
    resume.location,
    resume.phone, // present only for private application records
    site.email,
    shortLink(site.github),
    shortLink(site.linkedin),
    shortLink(site.url),
  ]
    .filter((c): c is string => Boolean(c))
    .join(" · ");

  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(`# ${resume.name}`, "", `**${resume.title}**`, "", contacts, "");

  push("## Summary", "", resume.summary, "");

  push("## Skills", "");
  for (const g of resume.skills) push(`- **${g.label}:** ${g.items}`);
  push("");

  push("## Experience", "");
  for (const j of resume.experience) {
    push(`### ${j.company} — ${j.role}`, `*${j.period}*`, "");
    for (const b of j.bullets) push(`- ${b}`);
    push("");
  }

  push("## Selected Projects", "");
  for (const p of resume.projects) {
    const url = p.website ?? p.href;
    push(url ? `### ${p.name} — [${shortLink(url)}](${url})` : `### ${p.name}`);
    push(`*${p.year}*`, "", p.description, "");
  }

  push("## Education", "");
  for (const e of resume.education) {
    push(`### ${e.school} — ${e.detail}`, `*${e.location}, ${e.year}*`, "");
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
