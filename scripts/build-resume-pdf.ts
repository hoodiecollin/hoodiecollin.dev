/// <reference types="bun" />
/**
 * Render the canonical résumé (lib/resume.ts) to a clean, single-column PDF at
 * public/collin-kokotas-resume.pdf — the file the site's "Download PDF" button
 * serves. Runs as part of `prebuild`, and standalone via `bun run resume:pdf`.
 *
 * Pipeline: typed résumé data → styled HTML → PDF via headless Google Chrome.
 * The typed data is the single source of truth shared with the /resume web page,
 * so the page and the PDF can't drift.
 *
 * Builds run in GitHub Actions (ubuntu-22.04), whose runner image ships Google
 * Chrome — so the PDF is regenerated fresh on every CI build (gitignored, like
 * public/search-index.json), never committed and never stale. In CI a missing
 * Chrome is a hard error (we won't ship a broken download link); in local dev
 * without Chrome it skips gracefully so `bun dev`/`bun build` aren't blocked.
 * Set CHROME_PATH (or CHROME_BIN) to point at a specific binary.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resume } from "../lib/resume.ts";
import { site } from "../lib/site.ts";

const OUT = "public/collin-kokotas-resume.pdf";

/** First existing Chrome/Chromium binary, or null if none is installed here. */
async function findChrome(): Promise<string | null> {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter((p): p is string => Boolean(p));
  for (const p of candidates) {
    if (await Bun.file(p).exists()) return p;
  }
  return null;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function shortLink(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

function resumeHtml(): string {
  const contacts = [
    resume.location,
    site.email,
    shortLink(site.github),
    shortLink(site.linkedin),
    shortLink(site.url),
  ]
    .map(esc)
    .join(" · ");

  const skills = resume.skills
    .map((g) => `<p class="kv"><strong>${esc(g.label)}:</strong> ${esc(g.items)}</p>`)
    .join("\n");

  const experience = resume.experience
    .map(
      (j) => `
      <div class="entry">
        <div class="entry-head">
          <span class="entry-title"><strong>${esc(j.company)}</strong> — ${esc(j.role)}</span>
          <span class="entry-meta">${esc(j.period)}</span>
        </div>
        <ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      </div>`,
    )
    .join("\n");

  const projects = resume.projects
    .map((p) => {
      const url = p.website ?? p.href;
      return `
      <div class="entry">
        <div class="entry-head">
          <span class="entry-title"><strong>${esc(p.name)}</strong>${
            url ? ` <span class="entry-url">${esc(shortLink(url))}</span>` : ""
          }</span>
          <span class="entry-meta">${esc(p.year)}</span>
        </div>
        <p>${esc(p.description)}</p>
      </div>`;
    })
    .join("\n");

  const education = resume.education
    .map(
      (e) => `
      <div class="entry-head">
        <span class="entry-title"><strong>${esc(e.school)}</strong> — ${esc(e.detail)}</span>
        <span class="entry-meta">${esc(e.location)}, ${esc(e.year)}</span>
      </div>`,
    )
    .join("\n");

  const body = `
    <h1>${esc(resume.name)}</h1>
    <p class="title">${esc(resume.title)}</p>
    <p class="contact">${contacts}</p>

    <h2>Summary</h2>
    <p>${esc(resume.summary)}</p>

    <h2>Skills</h2>
    ${skills}

    <h2>Experience</h2>
    ${experience}

    <h2>Selected Projects</h2>
    ${projects}

    <h2>Education</h2>
    ${education}
  `;

  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(
    resume.name,
  )} — Resume</title><style>${CSS}</style></head><body>${body}</body></html>`;
}

const CSS = `
  @page { size: Letter; margin: 0.55in 0.65in; }
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #1a1a1a;
         font-size: 10.5pt; line-height: 1.4; margin: 0; -webkit-print-color-adjust: exact; }
  h1 { font-size: 23px; font-weight: 700; letter-spacing: .2px; margin: 0 0 2px; }
  p.title { font-size: 12.5px; font-weight: 600; color: #333; margin: 0 0 3px; }
  p.contact { font-size: 10px; color: #555; margin: 0 0 12px; }
  h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px;
       color: #111; border-bottom: 1.4px solid #bbb; padding-bottom: 3px;
       margin: 15px 0 7px; break-after: avoid; }
  p { margin: 0 0 7px; }
  p.kv { margin: 0 0 4px; }
  .entry { margin: 0 0 10px; break-inside: avoid; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline;
                gap: 12px; margin: 0 0 3px; }
  .entry-title { font-size: 11.5px; }
  .entry-url { font-size: 9.5px; color: #666; font-weight: 400; }
  .entry-url::before { content: "· "; color: #aaa; }
  .entry-meta { font-size: 9.5px; color: #555; white-space: nowrap; }
  ul { margin: 0 0 4px; padding-left: 17px; }
  li { margin: 0 0 3px; break-inside: avoid; }
  strong { font-weight: 700; }
`;

/** Print one HTML file to PDF via headless Chrome. New-headless Chrome writes the
 * PDF but then lingers, so poll until the output size is stable, then kill it. */
async function printToPdf(chrome: string, htmlPath: string, pdfPath: string, profileDir: string) {
  await rm(pdfPath, { force: true });
  const proc = Bun.spawn(
    [
      chrome,
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--no-first-run",
      "--disable-crash-reporter",
      "--disable-breakpad",
      "--disable-dev-shm-usage",
      "--disable-component-update",
      "--disable-background-networking",
      "--disable-sync",
      "--no-default-browser-check",
      "--no-pdf-header-footer",
      `--user-data-dir=${profileDir}`,
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ],
    { stdout: "ignore", stderr: "ignore" },
  );

  const deadline = Date.now() + 30_000;
  let lastSize = -1;
  try {
    for (;;) {
      if (proc.exitCode !== null && proc.exitCode !== 0)
        throw new Error(`Chrome exited ${proc.exitCode}`);
      const size = Bun.file(pdfPath).size; // 0 until the file exists
      if (size > 0 && size === lastSize) break; // written and stable → done
      lastSize = size;
      if (Date.now() > deadline) throw new Error("timed out waiting for PDF");
      await Bun.sleep(300);
    }
  } finally {
    proc.kill("SIGKILL");
    await proc.exited.catch(() => {});
  }
  if (Bun.file(pdfPath).size === 0) throw new Error(`no PDF produced for ${pdfPath}`);
}

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
  const work = join(tmpdir(), `resume-pdf-${process.pid}`);
  await mkdir(work, { recursive: true });

  const htmlPath = join(work, "resume.html");
  await writeFile(htmlPath, resumeHtml());
  await printToPdf(chrome, htmlPath, OUT, join(work, "profile"));

  const kb = (Bun.file(OUT).size / 1024).toFixed(0);
  console.log(`✓ resume PDF — ${OUT} (${kb} KB)`);
  await rm(work, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : err);
  process.exit(1);
});
