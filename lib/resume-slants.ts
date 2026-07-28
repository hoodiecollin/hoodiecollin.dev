/**
 * Canonical résumé **slant taxonomy** — the identity of each variant, with no
 * content and (deliberately) no imports. This is the in-repo source of truth for
 * slant keys, tracker labels, display names, and when-to-send text.
 *
 * External tooling does NOT import this file. Instead, `bun run resume:variants`
 * bakes this taxonomy into the emitted manifest at ~/Documents/resume/index.json,
 * and the job-search pipeline reads *that* — a data contract, not a source-code
 * dependency between the two repos.
 *
 * Keep this dependency-free (no `@/…` aliases, no framework types). Content
 * (summary, skills, bullets) lives in lib/resume.ts, which builds on this.
 */

export type ResumeVariantKey = "staff-principal" | "agentic-ai" | "founding-engineer";

export interface ResumeSlant {
  key: ResumeVariantKey;
  /** Short human label (e.g. shown in reports; also the private PDF filename stem). */
  label: string;
  /** When to send this slant. */
  sendFor: string;
  /** Job-search tracker label applied to matching postings. */
  trackerLabel: string;
}

/** Every slant, in send-priority order (generalist first). */
export const resumeSlants: ResumeSlant[] = [
  {
    key: "staff-principal",
    label: "Staff / Principal",
    sendFor: "generalist senior-IC roles",
    trackerLabel: "slant:staff-principal",
  },
  {
    key: "agentic-ai",
    label: "Agentic AI",
    sendFor: "AI / LLM / agent product-engineering roles",
    trackerLabel: "slant:agentic",
  },
  {
    key: "founding-engineer",
    label: "Founding Engineer",
    sendFor: "founding / zero-to-one / early-stage roles",
    trackerLabel: "slant:founding",
  },
];

/** Slants keyed by their canonical key. */
export const resumeSlant: Record<ResumeVariantKey, ResumeSlant> = Object.fromEntries(
  resumeSlants.map((s) => [s.key, s]),
) as Record<ResumeVariantKey, ResumeSlant>;

/** Canonical slant keys, in send-priority order. */
export const variantOrder: ResumeVariantKey[] = resumeSlants.map((s) => s.key);
