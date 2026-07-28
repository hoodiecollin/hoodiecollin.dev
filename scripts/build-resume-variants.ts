/// <reference types="bun" />
/**
 * Build the PRIVATE per-application résumé PDFs — one per slant, WITH the phone
 * number — into resume-pdfs/ (gitignored, never deployed). These are the tailored
 * documents to attach to job applications; the tracker's `slant:*` label says which
 * to send. Run locally via `bun run resume:variants`.
 *
 *   resume-pdfs/collin-kokotas-staff-principal.pdf     (slant:staff-principal)
 *   resume-pdfs/collin-kokotas-agentic-ai.pdf          (slant:agentic)
 *   resume-pdfs/collin-kokotas-founding-engineer.pdf   (slant:founding)
 *
 * Unlike the public PDF, this is a local-only convenience — it is not part of the
 * site build, so a missing Chrome here is a plain error rather than a CI failure.
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { resolveResume, variantOrder, variants } from "../lib/resume.ts";
import { findChrome, renderResumePdf } from "./resume-pdf.ts";

const OUT_DIR = "resume-pdfs";

async function main() {
  const chrome = await findChrome();
  if (!chrome) {
    throw new Error(
      "no Chrome/Chromium found — cannot build the application PDFs. Install Google Chrome or set CHROME_PATH/CHROME_BIN.",
    );
  }

  await mkdir(OUT_DIR, { recursive: true });

  for (const key of variantOrder) {
    const v = variants[key];
    const resolved = resolveResume(key, { includePhone: true });
    const out = join(OUT_DIR, `collin-kokotas-${key}.pdf`);
    const size = await renderResumePdf(chrome, resolved, out);
    console.log(`✓ ${v.label.padEnd(18)} ${out} (${(size / 1024).toFixed(0)} KB) — ${v.trackerLabel}`);
  }

  console.log(`\nBuilt ${variantOrder.length} application PDFs into ${OUT_DIR}/ (with phone; gitignored).`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : err);
  process.exit(1);
});
