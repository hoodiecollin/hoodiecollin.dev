/// <reference types="bun" />
/**
 * Emit the PRIVATE per-application résumé records — one per slant, WITH the phone
 * number — into ~/Documents/resume/. Each slant gets a Markdown file and (when
 * Chrome is available) a PDF, plus a machine-readable `index.json` manifest that
 * external tooling reads. Run locally via `bun run resume:variants`.
 *
 *   ~/Documents/resume/
 *     index.json                                    ← taxonomy + file map
 *     generalist/collin-kokotas-resume.{md,pdf}         (slant:generalist)
 *     agentic-ai/collin-kokotas-resume.{md,pdf}         (slant:agentic)
 *     founding-engineer/collin-kokotas-resume.{md,pdf}  (slant:founding)
 *
 * Every slant emits the SAME filename (collin-kokotas-resume.*), separated only by
 * its slant-named directory — so whichever one you attach to an email reads
 * identically by filename and never leaks the slant to the recipient.
 *
 * This is the published contract the job-search pipeline consumes: it reads
 * `~/Documents/resume/index.json` for its slant taxonomy instead of importing this
 * repo's source, so the two repos share data, not code. Markdown + manifest need no
 * Chrome and are always written; PDFs render only when a Chrome/Chromium is found.
 *
 * Local-only convenience — never part of the site build, never deployed.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { resolveResume, variantOrder, variants } from "../lib/resume.ts";
import { findChrome, renderResumePdf } from "./resume-pdf.ts";
import { resumeMarkdown } from "./resume-markdown.ts";

const OUT_DIR = join(homedir(), "Documents", "resume");
// Shared basename for every slant — the slant is carried by the directory, not the
// filename, so an attached résumé always reads as `collin-kokotas-resume`.
const STEM = "collin-kokotas-resume";

interface ManifestSlant {
  key: string;
  label: string;
  trackerLabel: string;
  sendFor: string;
  markdown: string;
  pdf: string | null;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const chrome = await findChrome();
  const slants: ManifestSlant[] = [];

  for (const key of variantOrder) {
    const v = variants[key];
    const resolved = resolveResume(key, { includePhone: true });
    // Each slant lives in its own directory; the file basename is identical across
    // slants. Manifest paths stay OUT_DIR-relative (e.g. `generalist/…`).
    await mkdir(join(OUT_DIR, key), { recursive: true });
    const mdRel = join(key, `${STEM}.md`);
    const pdfRel = join(key, `${STEM}.pdf`);

    // Markdown + manifest carry the contract job-search reads — no Chrome needed.
    await writeFile(join(OUT_DIR, mdRel), resumeMarkdown(resolved));

    let pdf: string | null = null;
    if (chrome) {
      const size = await renderResumePdf(chrome, resolved, join(OUT_DIR, pdfRel));
      pdf = pdfRel;
      console.log(`✓ ${v.label.padEnd(18)} ${mdRel} + ${pdfRel} (${(size / 1024).toFixed(0)} KB) — ${v.trackerLabel}`);
    } else {
      console.log(`✓ ${v.label.padEnd(18)} ${mdRel} — ${v.trackerLabel} (PDF skipped: no Chrome)`);
    }

    slants.push({ key: v.key, label: v.label, trackerLabel: v.trackerLabel, sendFor: v.sendFor, markdown: mdRel, pdf });
  }

  const manifest = { source: "hoodiecollin.dev", generatedAt: new Date().toISOString(), slants };
  await writeFile(join(OUT_DIR, "index.json"), JSON.stringify(manifest, null, 2) + "\n");

  console.log(`\nEmitted ${variantOrder.length} résumé records + index.json into ${OUT_DIR} (with phone).`);
  if (!chrome) {
    console.warn(
      "\n⚠️  No Chrome/Chromium found — PDFs were skipped (Markdown + index.json still written).\n" +
        "   Install Google Chrome or set CHROME_PATH/CHROME_BIN, then re-run `bun run resume:variants`.",
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : err);
  process.exit(1);
});
