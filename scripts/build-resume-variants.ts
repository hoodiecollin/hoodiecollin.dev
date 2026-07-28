/// <reference types="bun" />
/**
 * Emit the PRIVATE per-application résumé records — one per slant, WITH the phone
 * number — into ~/Documents/resume/. Each slant gets a Markdown file and (when
 * Chrome is available) a PDF, plus a machine-readable `index.json` manifest that
 * external tooling reads. Run locally via `bun run resume:variants`.
 *
 *   ~/Documents/resume/
 *     index.json                                    ← taxonomy + file map
 *     collin-kokotas-staff-principal.{md,pdf}       (slant:staff-principal)
 *     collin-kokotas-agentic-ai.{md,pdf}            (slant:agentic)
 *     collin-kokotas-founding-engineer.{md,pdf}     (slant:founding)
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
    const stem = `collin-kokotas-${key}`;
    const mdName = `${stem}.md`;
    const pdfName = `${stem}.pdf`;

    // Markdown + manifest carry the contract job-search reads — no Chrome needed.
    await writeFile(join(OUT_DIR, mdName), resumeMarkdown(resolved));

    let pdf: string | null = null;
    if (chrome) {
      const size = await renderResumePdf(chrome, resolved, join(OUT_DIR, pdfName));
      pdf = pdfName;
      console.log(`✓ ${v.label.padEnd(18)} ${mdName} + ${pdfName} (${(size / 1024).toFixed(0)} KB) — ${v.trackerLabel}`);
    } else {
      console.log(`✓ ${v.label.padEnd(18)} ${mdName} — ${v.trackerLabel} (PDF skipped: no Chrome)`);
    }

    slants.push({ key: v.key, label: v.label, trackerLabel: v.trackerLabel, sendFor: v.sendFor, markdown: mdName, pdf });
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
