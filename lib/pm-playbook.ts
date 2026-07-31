/**
 * The AI PM Playbook — typed data behind /ai-pm-playbook.
 *
 * The canonical methodology lives in the `hoodiecollin/ai-pm-playbook` repo
 * (PLAYBOOK.md). This file is the *site's* structured rendering of it: the same
 * rules, shaped as data so the page can render label chips, the commitment
 * ladder, and the rule tables as real components instead of a wall of prose.
 *
 * The repo is the source of truth. When PLAYBOOK.md changes, update this file —
 * and keep `playbookSections` in sync with the headings the page actually
 * renders, since both the sticky TOC and the ⌘K search entry derive from it.
 */

export const PLAYBOOK_REPO = "https://github.com/hoodiecollin/ai-pm-playbook";
export const PLAYBOOK_DOC = `${PLAYBOOK_REPO}/blob/main/PLAYBOOK.md`;
export const PLAYBOOK_BOOTSTRAP = `${PLAYBOOK_REPO}/blob/main/scripts/bootstrap-pm.ts`;
export const PLAYBOOK_TEMPLATES = `${PLAYBOOK_REPO}/tree/main/.github/ISSUE_TEMPLATE`;

/** A page section — drives the sticky TOC and the search-index headings. */
export interface PlaybookSection {
  id: string;
  title: string;
}

/** Every h2 on the page, in render order. Keep in sync with app/ai-pm-playbook/page.tsx. */
export const playbookSections: PlaybookSection[] = [
  { id: "why", title: "Why this exists" },
  { id: "two-axes", title: "The two-axis core" },
  { id: "ladder", title: "The commitment ladder" },
  { id: "labels", title: "Labels & invariants" },
  { id: "experiments", title: "Experiments never ride the spine" },
  { id: "surfaces", title: "Surfaces" },
  { id: "epics", title: "Epics & the derived roadmap" },
  { id: "gates", title: "Design → plan → spec" },
  { id: "disciplines", title: "Operating disciplines" },
  { id: "anti-patterns", title: "Anti-patterns it prevents" },
  { id: "adopt", title: "Adopt it" },
];

/** The rule the whole model hangs on. */
export const groundTruthRule =
  "Code + git history is ground truth. Every other artifact — a board card, a label, a roadmap doc, an RFC, a memory note — is a claim about ground truth and must point back to it. When a claim disagrees with the code, the claim is wrong.";

// ────────────────────────────────────────────────────────────────────────────
// §1 — the two axes
// ────────────────────────────────────────────────────────────────────────────

export interface PlaybookAxis {
  axis: string;
  mechanism: string;
  answers: string;
}

export const axes: PlaybookAxis[] = [
  {
    axis: "When",
    mechanism: "Milestone = a version release (the release spine)",
    answers: "Is this scheduled, and for which release?",
  },
  {
    axis: "What kind / maturity",
    mechanism: "Labels",
    answers: "What is this, and how committed are we?",
  },
];

/** The two structural rules that sit alongside the axes. */
export const structuralRules: string[] = [
  "Epics decompose via GitHub native sub-issues — the real Parent issue / Sub-issues progress link, not task-list checkboxes and not a Project field.",
  "The Project board is a view over issues, never a second source of truth.",
];

// ────────────────────────────────────────────────────────────────────────────
// §2 — the commitment ladder
// ────────────────────────────────────────────────────────────────────────────

export interface LadderRung {
  /** Short label used in the horizontal ladder diagram. */
  short: string;
  rung: string;
  means: string;
  /** Promotion gate to the next rung; null on the final rung. */
  gate: string | null;
}

export const ladder: LadderRung[] = [
  {
    short: "idea",
    rung: "idea",
    means: "Speculative. Not committed.",
    gate: "Gate 1: an accepted design-doc (rfc issue).",
  },
  {
    short: "plan-next",
    rung: "plan-next",
    means: "Committed, but not yet scheduled to a version.",
    gate: "Assign a milestone — and drop plan-next.",
  },
  {
    short: "milestone",
    rung: "milestone",
    means: "Scheduled into a specific release.",
    gate: "Gate 2: a reviewed implementation-plan → start work.",
  },
  {
    short: "in flight",
    rung: "In flight",
    means: "Being built. Gate 3: BDD specs RED → GREEN.",
    gate: "Merge; the issue closes into its milestone.",
  },
  {
    short: "closed",
    rung: "Closed-in-milestone",
    means: 'Done in code, but the roadmap reads "pending release".',
    gate: "Tag the GitHub Release for the milestone.",
  },
  {
    short: "released",
    rung: "Released",
    means: "Shipped reality.",
    gate: null,
  },
];

/** Copy this into every milestone description. */
export const milestoneBoilerplate =
  "Issues close into this milestone until it is tagged; on the roadmap they read as “pending release” until the vX.Y.Z GitHub Release exists.";

// ────────────────────────────────────────────────────────────────────────────
// §3 — labels
// ────────────────────────────────────────────────────────────────────────────

export interface PlaybookLabel {
  name: string;
  /** GitHub label color (hex, no leading #) — rendered as a real label chip. */
  color: string;
  /** The label's GitHub description. This text *is* the process. */
  description: string;
}

export const labels: PlaybookLabel[] = [
  {
    name: "idea",
    color: "c5def5",
    description: "Speculative feature idea; needs a design note before implementation.",
  },
  {
    name: "plan-next",
    color: "0e8a16",
    description:
      "Committed but not yet scheduled to a version milestone (milestone = scheduled).",
  },
  {
    name: "rfc",
    color: "5319e7",
    description:
      "Request for comment: design captured as an issue (proposals no longer committed to the repo).",
  },
  {
    name: "experiment",
    color: "a2eeef",
    description:
      "A spike to measure; deliverable is a decision, not a shippable artifact. Never milestoned.",
  },
  {
    name: "epic",
    color: "6f42c1",
    description: "Umbrella tracking issue; decomposes via native sub-issues.",
  },
  { name: "tech-debt", color: "fbca04", description: "Known gap or stub in shipped code." },
  { name: "perf", color: "d93f0b", description: "Performance cost / triage item." },
  { name: "config", color: "1d76db", description: "Configurable-runtime-behavior work." },
  {
    name: "legacy-audit",
    color: "5319e7",
    description: "Legacy audit: prune dead / product-misaligned code.",
  },
];

export interface LabelInvariant {
  /** The mutual-exclusion, written with ⊕. */
  rule: string;
  why: string;
}

export const invariants: LabelInvariant[] = [
  {
    rule: "plan-next ⊕ milestone",
    why: "plan-next means committed but unscheduled. The moment you assign a milestone the item is scheduled — drop plan-next. They must never coexist.",
  },
  {
    rule: "idea ⊕ plan-next",
    why: "Speculative and committed are opposites. Pick one.",
  },
  {
    rule: "experiment ⊕ { idea, plan-next, milestone }",
    why: "A spike you've committed to running is no longer merely speculative, isn't feature work in a queue, and never rides the spine.",
  },
];

/** The payoff of the invariants — worth calling out on its own. */
export const invariantPayoff =
  "Because plan-next never has a milestone, “everything committed but unscheduled” is exactly the plan-next filter. No compound query needed.";

/** Fields this model deliberately does NOT have. */
export const bannedFields: string[] = ["Priority", "Size", "Workstream / Area"];

export const bannedFieldsRationale =
  "They create a parallel decomposition scheme — a second source of truth that drifts — and tempt work to be sliced by a guessed number instead of by when it ships and what it is. If you're migrating a board that has them, remove the fields and every view that depends on them.";

// ────────────────────────────────────────────────────────────────────────────
// §4 — experiments
// ────────────────────────────────────────────────────────────────────────────

export const experimentRules: string[] = [
  "An experiment issue is never placed on a v* milestone. Experiments run as an unscheduled research track, parallel to the spine.",
  "The experiment's measured conclusion may commit new feature work — and that feature, not the spike, is what gets a milestone.",
  "Never anchor a milestone's theme on an experiment's hoped-for outcome. You cannot schedule a feature whose existence the experiment has not yet decided.",
  "The measurement has to be fair and apples-to-apples. A verdict from an unfair comparison is worse than none.",
];

export const experimentTest =
  "If an issue's primary output is a measurement, evaluation, or verdict, it's an experiment (off-spine). If it's shippable code that ships regardless of any measurement, it's a feature / perf / config item (on-spine).";

// ────────────────────────────────────────────────────────────────────────────
// §6 — surfaces
// ────────────────────────────────────────────────────────────────────────────

export interface PlaybookSurface {
  label: string;
  color: string;
  covers: string;
}

export const surfaces: PlaybookSurface[] = [
  {
    label: "surface:core",
    color: "1d76db",
    covers: "The primary product line (core v* releases). Often implicit / default.",
  },
  {
    label: "surface:ide-extension",
    color: "007ACC",
    covers: "Editor extension + language server; ships on its own ext-v* / vscode-v* tag line.",
  },
  {
    label: "surface:website",
    color: "1d76db",
    covers: "Marketing + docs site; usually continuously deployed, no version tag.",
  },
  {
    label: "surface:cli / surface:sdk",
    color: "1d76db",
    covers: "Any other independently shipped user-facing artifact.",
  },
];

export const surfaceExclusionRule =
  "Never put a non-core surface:* issue on a core v* milestone. A surface:website issue milestoned onto v0.5.0 would read as “done — awaiting v0.5.0” even though it already shipped on its own line, and it would never appear in the core changelog.";

export const surfaceNaming =
  "Why “surface,” not “channel”: release channel already means a stability stream (stable / beta / nightly) — an orthogonal concept that must stay separable, since you can ship a beta of the extension. A surface is a shippable face, not a maturity tier. And ci is not a surface: CI tooling ships nothing to a user. The test is “is a user touching this thing?”";

// ────────────────────────────────────────────────────────────────────────────
// §7 — the derived roadmap
// ────────────────────────────────────────────────────────────────────────────

export interface RoadmapBucket {
  bucket: string;
  derivation: string;
}

export const roadmapBuckets: RoadmapBucket[] = [
  { bucket: "Shipped", derivation: "closed + released" },
  { bucket: "Active", derivation: "scheduled (has a milestone) and/or in flight" },
  { bucket: "Planned", derivation: "plan-next (committed, unscheduled — and by invariant, milestone-free)" },
  { bucket: "Labs", derivation: "experiment or rfc" },
  { bucket: "Ideas", derivation: "idea" },
];

/** The shape of an epic body (the issue template's skeleton). */
export const epicBodyShape: { heading: string; note: string }[] = [
  {
    heading: "✅ Decisions locked (YYYY-MM-DD)",
    note: "A blockquoted block of settled decisions at the top, each with a one-line rationale. Supersedes stale discussion below it.",
  },
  { heading: "Summary", note: "What it delivers, with a release-blocking flag if applicable." },
  {
    heading: "Current state (ground truth)",
    note: "Where the code actually is right now — not intentions. If a claim here can't be pointed at code or commits, it doesn't belong.",
  },
  {
    heading: "Children",
    note: "Linked as native sub-issues; the Sub-issues progress bar rolls them up. Each child carries its own milestone, so an epic may span releases.",
  },
  { heading: "Upstream / downstream", note: "Relationships to other epics." },
];

// ────────────────────────────────────────────────────────────────────────────
// §9 — the three gates
// ────────────────────────────────────────────────────────────────────────────

export interface PlaybookGate {
  number: number;
  name: string;
  /** The question this gate answers. */
  question: string;
  artifact: string;
  detail: string;
  /** What kind of surprise this gate kills. */
  catches: string;
}

export const gates: PlaybookGate[] = [
  {
    number: 1,
    name: "Design-doc",
    question: "What & why",
    artifact: "an rfc issue",
    detail:
      "Problem, desired behavior, solution shape, alternatives, and explicit non-goals / limits. Solution-shaped, not code-shaped. Accepted → drop idea, add plan-next.",
    catches: "Conceptual gotchas",
  },
  {
    number: 2,
    name: "Implementation-plan",
    question: "How",
    artifact: "a section on the issue",
    detail:
      "Written after the design is accepted and the item is scheduled, before code: files to touch, build order, dependencies and blockers, interfaces, and the BDD scenarios to write.",
    catches: "Execution gotchas",
  },
  {
    number: 3,
    name: "BDD spec-first",
    question: "Is it done",
    artifact: "failing specs, then passing ones",
    detail:
      "Write the scenarios as failing specs (RED), implement to GREEN, refactor under green. The specs are the acceptance criteria, so “done” is unambiguous and regression-proof.",
    catches: "Ambiguity about done",
  },
];

export const gatesRationale =
  "Each stage's output is the next's input, so nothing is re-derived. Design kills conceptual surprises; the plan kills execution surprises; RED locks intent as executable truth before implementation exists.";

export const derivedStateRule =
  "No has-design / needs-design / effort labels. State is derived from ground truth: does an accepted design-doc exist (past Gate 1)? an implementation-plan on the issue (Gate 2)? passing specs (Gate 3, read from CI)? A status label is a claim a human must remember to update; the artifact's existence is the signal.";

// ────────────────────────────────────────────────────────────────────────────
// §11 — operating disciplines
// ────────────────────────────────────────────────────────────────────────────

export interface Discipline {
  title: string;
  detail: string;
}

export const disciplines: Discipline[] = [
  {
    title: "The backlog lives in Issues",
    detail:
      "No TASKS.md or TODO.md shadow list. Ask “what's next” with gh issue list --state open, not a file.",
  },
  {
    title: "Auto-file issues for new work",
    detail:
      "When you commit to a piece of work, gh issue create first (tech-debt for grounded gaps, idea for speculative features), then implement — don't wait to be asked.",
  },
  {
    title: "Re-check the issue list each session",
    detail:
      "State changes out-of-band; run gh issue list at the start of relevant work so you're not acting on a stale view.",
  },
  {
    title: "Cross-link docs ↔ issues proactively",
    detail:
      "When new issues or epics give a home to claims scattered in docs, add the pointers both directions without waiting for permission.",
  },
  {
    title: "Prioritize on engineering merit, never demand",
    detail:
      "For a pre-launch product, “demand” and “usage” signals don't exist, so leaning on them smuggles in data you don't have. Justify on scope, risk, foundational sequencing (does X unblock Y), and identity fit.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// §13 — anti-patterns
// ────────────────────────────────────────────────────────────────────────────

export interface AntiPattern {
  pattern: string;
  consequence: string;
}

export const antiPatterns: AntiPattern[] = [
  {
    pattern: "A parallel decomposition scheme",
    consequence:
      "Priority / Size / Workstream fields, or a labels convention doing a field's job. There is one model: milestone + labels + native sub-issues. A second axis is a second source of truth that drifts.",
  },
  {
    pattern: "plan-next + a milestone on the same issue",
    consequence: "Violates the invariants; the item's commitment state becomes ambiguous.",
  },
  {
    pattern: "An experiment on the release spine",
    consequence:
      "Experiments produce decisions, not artifacts. They feed the spine, never ride it — and a release theme must never be anchored on a spike's hoped-for result.",
  },
  {
    pattern: "Time or effort estimates driving scope",
    consequence: "Effort isn't reliably knowable, and a guess mis-steers scoping.",
  },
  {
    pattern: "Demand / usage justifications",
    consequence: "Prioritize on engineering merit instead.",
  },
  {
    pattern: "Coding before designing",
    consequence: "Design-doc, then implementation-plan, then BDD RED → GREEN.",
  },
  {
    pattern: "Stale status labels (has-design / needs-design)",
    consequence: "State is derived from artifacts, not stickered on by hand.",
  },
  {
    pattern: "Doc drift",
    consequence:
      "Design lives as rfc issues; only shipped-feature architecture is committed to the tree.",
  },
  {
    pattern: "“Done” ambiguity",
    consequence: "Closed-into-milestone and released are distinct rungs.",
  },
  {
    pattern: "Board as shadow backlog",
    consequence: "Issues are the backlog; the board is only a view.",
  },
  {
    pattern: "Non-core surface work on a core milestone",
    consequence:
      'It reads "done, awaiting vX" but shipped on its own line and never hits the core changelog.',
  },
  {
    pattern: "Roadmap over-promising",
    consequence: "WHAT_IT_IS.md states limits and cedes authority to the code.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// §12 — adoption
// ────────────────────────────────────────────────────────────────────────────

export const adoptionSteps: string[] = [
  "Run scripts/bootstrap-pm.ts to create the labels (with descriptions), starter milestones, and the scriptable filtered views.",
  "In the UI, set the group-by on the Release-spine / Surface / Execution boards — grouping isn't scriptable.",
  "If migrating an existing board: delete the Priority, Size, and Workstream / Area fields and every view that filters or groups by them.",
  "Copy .github/ISSUE_TEMPLATE/* into the repo.",
  "Define this product's surface:* labels — only if it ships more than one artifact.",
  "Seed VERSION_ROADMAP.md + WHAT_IT_IS.md, and put the two-axis model and the doctrine into CONTRIBUTING.md.",
  "Backfill: label the existing backlog along the ladder, assign milestones, and enforce the invariants — a plan-next + milestone collision is the #1 drift smell.",
  "Convert epic checklists to native sub-issues.",
];

export const quickStart = `bun install
bun run bootstrap --repo <owner>/<name> --project <N> \\
  --surfaces "core,ide-extension,website" --milestone v0.1.0`;

/** The four reusable issue templates the repo ships. */
export const issueTemplates: { name: string; purpose: string }[] = [
  { name: "idea", purpose: "The speculative rung. Filing one implies no commitment." },
  { name: "rfc", purpose: "Gate 1 — the design-doc, captured as an issue rather than a file." },
  { name: "implementation-plan", purpose: "Gate 2 — the ordered build, written before any code." },
  {
    name: "epic",
    purpose: 'Native sub-issues plus the "Decisions locked / ground truth" skeleton.',
  },
];
