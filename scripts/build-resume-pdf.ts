/// <reference types="bun" />
/**
 * Build the PUBLIC résumé PDF at public/collin-kokotas-resume.pdf — the file the
 * site's "Download PDF" button serves. This is the generalist (staff-principal)
 * slant with the phone number omitted. Runs as part of `prebuild`, and standalone
 * via `bun run resume:pdf`.
 *
 * Rendering lives in scripts/resume-pdf.ts (shared with the private per-slant
 * builder). Builds run in GitHub Actions (ubuntu-22.04), whose runner image ships
 * Google Chrome — so the PDF is regenerated fresh on every CI build (gitignored,
 * like public/search-index.json), never committed and never stale. In CI a missing
 * Chrome is a hard error (we won't ship a broken download link); in local dev
 * without Chrome it skips gracefully so `bun dev`/`bun build` aren't blocked.
 */
import { mkdir } from "node:fs/promises";
import { resume } from "../lib/resume.ts";
import { findChrome, renderResumePdf } from "./resume-pdf.ts";

const OUT = "public/collin-kokotas-resume.pdf";

async function main() {
  const chrome = await findChrome();
  if (!chrome) {
    if (process.env.CI) {
      throw new Error(
        "no Chrome/Chromium found on the CI runner — cannot generate the resume PDF. Ensure the runner image ships Chrome or set CHROME_BIN/CHROME_PATH.",
      );
    }
    console.log(
      `· resume PDF: no Chrome/Chromium found — skipping (local dev). Run \`bun run resume:pdf\` once Chrome is available to refresh ${OUT}. (Set CHROME_PATH to force.)`,
    );
    return;
  }

  await mkdir("public", { recursive: true });
  const size = await renderResumePdf(chrome, resume, OUT);
  console.log(`✓ resume PDF — ${OUT} (${(size / 1024).toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : err);
  process.exit(1);
});
