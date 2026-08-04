/**
 * The AI PM Playbook — typed data behind /ai-pm-playbook.
 *
 * The canonical methodology lives in the `hoodiecollin/ai-pm-playbook` repo
 * (PLAYBOOK.md). This file is the *site's* rendering of it: the same rules,
 * shaped as data so the page can render label chips, the ladder, and the rule
 * tables as real components instead of a wall of prose — and deliberately
 * written in plainer language than the spec, since the page has to land with a
 * reader who has never seen the model.
 *
 * The repo is the source of truth for the *rules*. When PLAYBOOK.md changes,
 * update this file. A few things here are verbatim rather than paraphrased and
 * must stay that way, because they name something a reader will type or see:
 *   - `labels[].description` — the real GitHub label descriptions, written by
 *     the package's `bootstrap` command (src/lib/model.ts). Rewording them here
 *     would make the page describe labels that don't match what you'd get.
 *   - `milestoneBoilerplate` — meant to be copy-pasted into milestone bodies.
 *   - `rules[].id`, `cliCommands[].command`, `quickStart`, `ciSnippet`,
 *     `pluginInstall` — identifiers and commands that have to match the shipped
 *     CLI, or the page is telling people to run things that don't exist.
 *
 * The playbook is now a published package (`@hoodiecollin/pm-playbook`) whose
 * linter executes the same invariants this page describes, so the rule IDs and
 * the prose have to agree in both directions.
 *
 * Keep `playbookSections` in sync with the headings the page renders, since
 * both the sticky TOC and the ⌘K search entry derive from it.
 */

export const PLAYBOOK_REPO = "https://github.com/hoodiecollin/ai-pm-playbook";
export const PLAYBOOK_DOC = `${PLAYBOOK_REPO}/blob/main/PLAYBOOK.md`;
export const PLAYBOOK_TEMPLATES = `${PLAYBOOK_REPO}/tree/main/.github/ISSUE_TEMPLATE`;

/** The published package — the CLI, the linter, and the vendored doctrine all ship from here. */
export const PLAYBOOK_PACKAGE = "@hoodiecollin/pm-playbook";
export const PLAYBOOK_NPM = `https://www.npmjs.com/package/${PLAYBOOK_PACKAGE}`;

/** A page section — drives the sticky TOC and the search-index headings. */
export interface PlaybookSection {
  id: string;
  title: string;
}

/** Every top-level section on the page, in render order. Keep in sync with app/ai-pm-playbook/page.tsx. */
export const playbookSections: PlaybookSection[] = [
  { id: "tldr", title: "TL;DR" },
  { id: "how", title: "How it works" },
  { id: "labels", title: "Labels, and the rules between them" },
  { id: "releases", title: "Shipping, and what blocks it" },
  { id: "experiments", title: "Experiments stay off the schedule" },
  { id: "surfaces", title: "When a repo ships more than one thing" },
  { id: "epics", title: "Big work, and the roadmap" },
  { id: "gates", title: "Design, then plan, then tests" },
  { id: "practice", title: "Day-to-day" },
  { id: "mistakes", title: "Mistakes this prevents" },
  { id: "enforcement", title: "Written down, then enforced" },
  { id: "adopt", title: "Set it up in your repo" },
];

// ────────────────────────────────────────────────────────────────────────────
// The summary — the whole model, before any of the detail
// ────────────────────────────────────────────────────────────────────────────

export const tldr: string[] = [
  "Every piece of work is a GitHub issue. No TODO.md, no second backlog, no board that holds anything the issues don't.",
  "Two things organize those issues: the milestone it ships in, and its labels. There is no priority field, no size field, and no workstream field.",
  "The labels form a ladder from “just an idea” to “shipped,” and moving up a rung requires one specific thing each time.",
  "A short list of rules about which labels can coexist turns every question — what have we committed to? what's scheduled? can we ship? — into a one-line search.",
  "Nothing gets built until a design note exists and then an implementation plan, in that order. The tests get written before the code.",
  "The code is the only thing that's actually true. Every doc, card, and label is a claim about it, and a claim that disagrees with the code is wrong.",
  "Those rules are simple enough to check mechanically, so it ships as a command that fails your build when the backlog breaks one — not just as a document you hope people read.",
];

/** Why the constraints are this severe — the one bit of rationale that earns its place up top. */
export const tldrWhy =
  "The severity is the point, and it comes from working through coding agents. An agent is far more literal than a teammate: it will happily act on a stale roadmap doc or a status label nobody moved, and it has no instinct for “that card is obviously out of date.” So the system is built so that the state of a piece of work is something you look up, not something someone has to remember to update.";

/** The rule the whole model hangs on. */
export const groundTruthRule =
  "The code and its git history are the only record of what is actually true. Everything else — a board card, a label, a roadmap doc, a design note — is a claim about the code and has to point back at it. When a claim and the code disagree, the claim is wrong.";

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
    mechanism: "The milestone — always a version number",
    answers: "Is this scheduled, and which release is it going out in?",
  },
  {
    axis: "What, and how committed",
    mechanism: "The labels",
    answers: "What kind of work is this, and have we actually decided to do it?",
  },
];

/** The two structural rules that sit alongside the axes. */
export const structuralRules: string[] = [
  "Large items break down through GitHub's built-in sub-issues — the real parent/child link that draws a progress bar, not checkboxes in the description and not a custom field.",
  "The project board is a saved view of the issues. It never holds anything the issues don't.",
];

// ────────────────────────────────────────────────────────────────────────────
// §2 — the commitment ladder
// ────────────────────────────────────────────────────────────────────────────

export interface LadderRung {
  /** Short label used in the horizontal ladder diagram. */
  short: string;
  rung: string;
  means: string;
  /** What it takes to move up to the next rung; null on the final rung. */
  gate: string | null;
}

export const ladder: LadderRung[] = [
  {
    short: "idea",
    rung: "idea",
    means: "Somebody thought of it. Nobody has committed to building it.",
    gate: "Write a design note and get it accepted.",
  },
  {
    short: "plan-next",
    rung: "plan-next",
    means: "We're going to build it. We haven't said which release.",
    gate: "Pick the version — then remove this label.",
  },
  {
    short: "milestone",
    rung: "on a milestone",
    means: "Scheduled for a specific version.",
    gate: "Write the implementation plan, then start building.",
  },
  {
    short: "in flight",
    rung: "In flight",
    means: "Being built, starting from failing tests.",
    gate: "Merge — which closes the issue into its milestone.",
  },
  {
    short: "closed",
    rung: "Closed, not released",
    means: "The code is done. Nobody can install it yet.",
    gate: "Cut the GitHub Release for that milestone.",
  },
  {
    short: "released",
    rung: "Released",
    means: "Actually shipped. A user can have it.",
    gate: null,
  },
];

/** Verbatim — meant to be pasted into every milestone description. */
export const milestoneBoilerplate =
  "Issues close into this milestone until it is tagged; on the roadmap they read as “pending release” until the vX.Y.Z GitHub Release exists.";

export const ladderPayoff =
  "The reason for the last two rungs: “done” is ambiguous and it costs you credibility. Splitting it into code-is-finished and users-can-install-it means the roadmap can never quietly over-promise.";

// ────────────────────────────────────────────────────────────────────────────
// §3 — labels
// ────────────────────────────────────────────────────────────────────────────

export interface PlaybookLabel {
  name: string;
  /** GitHub label color (hex, no leading #) — rendered as a real label chip. */
  color: string;
  /** VERBATIM GitHub label description, as written by bootstrap-pm.ts. Do not reword. */
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
  {
    name: "release-gate",
    color: "b60205",
    description:
      "Blocks the tag: this milestone cannot be released until it is closed.",
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

export const labelsAreTheProcess =
  "Each label's description on GitHub is the rule it enforces, written out — so the process is visible in the label picker rather than in a document nobody opens. The setup command writes these for you.";

export interface LabelInvariant {
  /** The rule, in plain language. */
  rule: string;
  why: string;
}

export const invariants: LabelInvariant[] = [
  {
    rule: "plan-next and a milestone: never both",
    why: "plan-next means committed but not scheduled. The moment you pick a version, it is scheduled — so the label comes off. An issue carrying both is telling you two different things, and one of them is wrong.",
  },
  {
    rule: "idea and plan-next: never both",
    why: "One says nobody has committed to this; the other says somebody has. Pick.",
  },
  {
    rule: "An experiment never gets idea, plan-next, or a milestone",
    why: "A spike you've decided to run isn't speculative anymore, isn't feature work waiting in a queue, and never goes into a release.",
  },
  {
    rule: "A release-gate always has a milestone, and never idea, plan-next, or experiment",
    why: "It exists to block one specific release, so it means nothing without the version it blocks — and blocking a release is a commitment by definition. While one is open, that version cannot be tagged, even if every feature on it is closed.",
  },
];

/** The payoff of the invariants — worth calling out on its own. */
export const invariantPayoff =
  "Because plan-next can never carry a milestone, “everything we've committed to but haven't scheduled” is exactly the plan-next filter — no compound query, no interpretation. The same trick answers the release question: an open release-gate label is the entire “can we ship?” check.";

/** Fields this model deliberately does NOT have. */
export const bannedFields: string[] = ["Priority", "Size", "Workstream / Area"];

export const bannedFieldsRationale =
  "Each one is a second way to slice the work, which makes it a second thing to keep current — and it drifts, because nothing wires it to the code. They also push you to rank work by a number you guessed instead of by when it ships and what it is. If you're migrating a board that has them, delete the fields and every view built on them.";

// ────────────────────────────────────────────────────────────────────────────
// §4 — experiments
// ────────────────────────────────────────────────────────────────────────────

export const experimentRules: string[] = [
  "An experiment never goes on a version milestone. Experiments run as an unscheduled research track, alongside the release work rather than inside it.",
  "What the experiment concludes may commit you to new feature work — and that feature, not the experiment, is what gets scheduled.",
  "Never build a release around what you hope an experiment will find. You can't schedule a feature the experiment hasn't yet decided should exist.",
  "The comparison has to be fair and like-for-like. A verdict from a rigged measurement is worse than no verdict, because you'll act on it.",
];

export const experimentTest =
  "If the main thing an issue produces is a measurement or a verdict, it's an experiment and it stays off the release schedule. If it's code that ships regardless of what any measurement says, it's ordinary work and it gets a milestone.";

// ────────────────────────────────────────────────────────────────────────────
// §5 — milestones and release readiness
// ────────────────────────────────────────────────────────────────────────────

export const milestoneRules: string[] = [
  "A milestone is a version — v0.3.0, v1.0.0. Never a theme, never a sprint.",
  "Putting an issue on one is the only thing that means “scheduled.” Nothing else signals it.",
  "Keep several open ahead of the current release, so scheduled work always has somewhere to go. 1.0 is a horizon, not a milestone, until its contents are real.",
  "Closing an issue is not shipping it. The code merges and the issue closes into its milestone; the roadmap keeps saying “pending release” until you cut the tag.",
];

export const releaseMechanics: string[] = [
  "Conventional commits generate the changelog, and one changelog feeds both surfaces — the GitHub Release body and the website.",
  "The changelog and roadmap filter out everything that isn't the core product, so only core version work headlines a release.",
  "If you publish packages, dry-run the publish before you tag. Passing tests inside the repo don't prove an installed user can build.",
  "Refresh anything that reads “what's next” from the Releases API when the release finishes publishing, not when the tag is pushed — otherwise a just-tagged version shows up as still upcoming.",
];

/** §5.2 — the failure mode with no in-repo symptom. */
export const publishGapApplies =
  "This applies to one specific kind of product: one that publishes packages its own output then depends on. A code generator whose emitted code imports your published runtime. A library whose examples install the library. A plugin host and its SDK package. If your project publishes nothing, skip this entirely.";

export const publishGap =
  "Someone lands work that makes the built output need an API you haven't published yet. Inside the repo everything resolves by local path and every test passes. A user installing from the package registry can't build at all. CI is green and the branch is unshippable.";

export const publishGapWhyInvisible =
  "No test suite catches this, because what's broken isn't the code — it's the relationship between your repo and the package registry, and the repo can't see the registry. The only proof is a clean-room run: from an empty directory, using the published tool, do exactly what a user does — install, scaffold, generate, build — and confirm every dependency resolves from the registry. Green tests have never shown this and never will.";

export interface TrunkStrategy {
  name: string;
  how: string;
  cost: string;
}

export const trunkStrategies: TrunkStrategy[] = [
  {
    name: "Publish as you go",
    how: "The moment work needs a newly published API, publish it before the change that depends on it lands. The gap never opens on any branch.",
    cost: "A lot of intermediate versions, all of them permanent, most of which nobody will ever install.",
  },
  {
    name: "Keep the gap off your main branch",
    how: "Batch the publishing into the release and let an integration branch carry the unpublished state, so the main branch only ever holds things a user could actually install.",
    cost: "A second long-lived branch, and a release order you have to actually follow.",
  },
];

export const trunkStrategyChoice =
  "Either one works. Choosing neither doesn't. “We'll remember to publish before we tag” is not a mechanism — it's the exact thing that fails. Whichever you pick, write it into CONTRIBUTING.md so it outlives the person who picked it.";

export const gapOffTrunkRules: string[] = [
  "main holds released state. After a release it matches the tag, and it is always installable from source.",
  "develop is where the work integrates. It is allowed to depend on things you haven't published yet — that is its entire job.",
  "The release order is the whole point: publish the packages, then merge develop into main, then tag. Publishing after the merge puts the window right back.",
  "Run the clean-room check on main, not on develop. On the integration branch it would be red for an entire cycle, and a check that's always red is a check nobody reads.",
];

export interface BranchTarget {
  answer: string;
  branch: string;
  examples: string;
}

export const branchQuestion =
  "Does this change describe, use, or demonstrate something that isn't released yet?";

export const branchTargets: BranchTarget[] = [
  {
    answer: "No",
    branch: "straight to main",
    examples:
      "Typo fixes, styling, SEO, analytics, dependency bumps, broken links, corrections to docs for things already shipped. These deploy continuously and shouldn't wait on a release they have nothing to do with.",
  },
  {
    answer: "Yes",
    branch: "develop, in the same change as the feature",
    examples:
      "Documentation for an unreleased feature, examples using an unreleased API, screenshots of UI nobody can see yet, a changelog entry for behavior nobody can run.",
  },
];

export const branchTargetWhy =
  "Get this backwards and you publish documentation for a feature that doesn't exist yet — which is worse than having no page at all. It generates support load, and it makes your docs a liar at the exact moment someone is trusting them.";

// §5.3 — one integration branch, never one per version
export const oneBranchRule =
  "Once you have an integration branch, the obvious next thought is a second one — v0.5-develop sitting alongside v0.4-develop, so next-cycle work has somewhere to go. Don't. There is exactly one integration branch, and its name never contains a version.";

export const oneBranchReasons: { heading: string; why: string }[] = [
  {
    heading: "The registry has one version line, so only one cycle can be measured",
    why: "The publish gap is defined against what's currently published, and npm, crates.io, PyPI, a container tag — all of them are a single global namespace. Two branches carrying unpublished changes can't both be checked: whichever publishes first quietly redefines the other one's gap.",
  },
  {
    heading: "A version in the branch name writes the schedule down twice",
    why: "This one applies even if you publish nothing. The milestone already says when something ships. Putting the version in a branch name says it again somewhere harder to query and harder to correct, and the two copies will eventually disagree — the same second-source-of-truth problem, now with merge conflicts.",
  },
];

export const oneBranchPayoff =
  "Keep the name version-free and the branch advances itself. develop just means “the cycle in flight,” so the moment you tag a release it becomes the next cycle — no rename, no new branch, no workflow to edit.";

/** How next-cycle work is kept off the integration branch (the PM008 rule). */
export const cycleScopeRule =
  "A pull request targeting the integration branch may not close an issue milestoned later than the cycle in flight.";

export const cycleScopeShape =
  "Note the shape: it forbids future milestones rather than requiring the current one. That's what makes it usable without exceptions — untracked chores, CI fixes, and typo pull requests all pass, and they should, because work with no issue can't be next-cycle work. Next-cycle work is defined by carrying that milestone, so the milestone is the only thing the rule can fire on.";

export const cycleDerivation =
  "Never configure which cycle is in flight — derive it. It's the lowest open milestone by version order, so there's no constant to keep updated and nothing that can drift from the actual schedule. That has one prerequisite worth stating because it's easy to skip: closing the milestone has to be part of the release ritual, right next to publishing and tagging. Leave one open after its tag and the check freezes there and starts blocking legitimate next-cycle work — loudly, which is the right way for it to fail.";

export const nextCycleWork =
  "So where does next-cycle work live in the meantime? On its own branch off the integration branch, unmerged, carrying its real milestone. Rebase after the release merge and it lands normally. That's cheaper than a second integration branch, where you'd pay to forward-port every fix continuously instead of merging once at the end.";

export interface LongLivedBranch {
  name: string;
  when: string;
}

/** The two second long-lived branches that are legitimate — neither is a second release line. */
export const longLivedBranches: LongLivedBranch[] = [
  {
    name: "A maintenance line cut from a tag",
    when: "release/v0.4.x, when a patch is needed after the cycle has moved on. It branches backward off released state, so it carries no publish gap at all. Cut it when a patch actually comes up, not in advance.",
  },
  {
    name: "A track that can't merge into the current cycle",
    when: "A format break, a major rewrite. Name it for the work — format-v2 — and never for a version, precisely so nobody mistakes it for a release line.",
  },
];

export const releaseGateRationale =
  "The ladder ends closed → released. The work that lives in that gap isn't feature work: publishing the packages, reconciling a version number, running the clean-room check, rotating a credential before it expires. Filed as ordinary tech-debt it looks like something you could put off, which is precisely backwards. The release-gate label names it, so “are we ready to ship?” is a search instead of a memory and the tag workflow has something mechanical to check. File one the moment you knowingly defer a release obligation — that's exactly when it's most likely to be forgotten, because everything still works on your machine.";

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
    covers: "The main product line — what the core version numbers refer to. Usually left implicit.",
  },
  {
    label: "surface:ide-extension",
    color: "007ACC",
    covers: "Editor extension and language server. Ships on its own tag line, like ext-v0.1.0.",
  },
  {
    label: "surface:website",
    color: "1d76db",
    covers: "Marketing and docs site. Usually deployed continuously, with no version tag at all.",
  },
  {
    label: "surface:cli / surface:sdk",
    color: "1d76db",
    covers: "Anything else a user installs separately.",
  },
];

export const surfaceExclusionRule =
  "Never put one of these on a core version milestone. A website issue parked on v0.5.0 reads as “done, waiting for v0.5.0” when it actually shipped weeks ago on its own schedule — and it will never appear in the core changelog. Non-core work ships on its own tag line, is filtered out of the core roadmap and changelog, and gets its own milestones if it versions at all.";

export const surfaceNaming =
  "Why “surface” and not “channel”: a release channel already means a stability stream — stable, beta, nightly. You can ship a beta of the extension, so the two ideas have to stay separable. And CI isn't a surface, because it ships nothing to anyone. The test is whether a user touches the thing.";

// ────────────────────────────────────────────────────────────────────────────
// §7 — epics and the derived roadmap
// ────────────────────────────────────────────────────────────────────────────

export interface RoadmapBucket {
  bucket: string;
  derivation: string;
}

export const roadmapBuckets: RoadmapBucket[] = [
  { bucket: "Shipped", derivation: "closed, and the release is tagged" },
  { bucket: "Active", derivation: "has a milestone, or is being worked on now" },
  { bucket: "Planned", derivation: "labeled plan-next — so by the rules above, no milestone" },
  { bucket: "Labs", derivation: "labeled experiment or rfc" },
  { bucket: "Ideas", derivation: "labeled idea" },
];

/** The shape of an epic body (the issue template's skeleton). */
export const epicBodyShape: { heading: string; note: string }[] = [
  {
    heading: "Decisions locked, with a date",
    note: "A quoted block at the top listing what's settled, each with a one-line reason. It overrides any stale discussion further down the thread.",
  },
  { heading: "Summary", note: "What this delivers, and whether it blocks a release." },
  {
    heading: "Current state",
    note: "Where the code actually is right now — not where you intend it to go. If you can't point a claim here at code or a commit, it doesn't belong.",
  },
  {
    heading: "Children",
    note: "Linked as real sub-issues so GitHub rolls up the progress bar. Each child carries its own milestone, which is how an epic can span several releases.",
  },
  { heading: "Upstream and downstream", note: "What this depends on, and what depends on it." },
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
    name: "The design note",
    question: "What and why",
    artifact: "an rfc issue",
    detail:
      "The problem, what you want to happen instead, the shape of the solution, what else you considered, and what you're explicitly not doing. It describes the solution, not the code. Once it's accepted, drop idea and add plan-next.",
    catches: "Ideas that fall apart on contact with the problem",
  },
  {
    number: 2,
    name: "The implementation plan",
    question: "How",
    artifact: "written on the issue",
    detail:
      "Written after the design is accepted and the work is scheduled, but before any code: which files you'll touch, what order to build in, what blocks what, the interfaces, and the tests you're going to write.",
    catches: "Surprises halfway through building",
  },
  {
    number: 3,
    name: "Tests first",
    question: "Is it done",
    artifact: "failing tests, then passing ones",
    detail:
      "Write the scenarios as failing tests, build until they pass, then clean up while they stay passing. The tests are the definition of done, so nobody has to argue about whether it's finished.",
    catches: "Arguments about whether it's finished",
  },
];

export const gatesRationale =
  "Each step feeds the next, so nothing gets worked out twice. The design catches the conceptual problems, the plan catches the execution problems, and the failing tests pin down what you meant before any code exists to disagree with it.";

export const derivedStateRule =
  "There are no has-design or needs-design labels, and no effort labels. You can already tell where something stands by looking: is there an accepted design note? is there a plan on the issue? do the tests pass in CI? A status label is a claim somebody has to remember to update. The artifact doesn't need remembering — either it exists or it doesn't.";

export const whereDesignLives =
  "The design note is the rfc issue, never a proposal file committed to the repo. The only design docs in the tree are durable architecture references for features that already shipped. When something ships, fold its lasting design into ARCHITECTURE.md and close the rfc.";

/** §10 — the two roadmap docs and where the system is written down. */
export const docsDiscipline: { name: string; role: string }[] = [
  {
    name: "VERSION_ROADMAP.md",
    role: "The honest state of the current release: where things stand, what's locked into scope, what's finished, what got deferred.",
  },
  {
    name: "WHAT_IT_IS.md",
    role: "An is/isn't account — what each feature actually guarantees and where it falls short. Where the README over-promises, this document wins.",
  },
  {
    name: "CONTRIBUTING.md",
    role: "Where a newcomer learns the system: the two axes, the ladder and its rules, and the design-then-plan-then-tests order.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// §11 — operating disciplines
// ────────────────────────────────────────────────────────────────────────────

export interface Discipline {
  title: string;
  detail: string;
}

export const disciplines: Discipline[] = [
  {
    title: "The backlog lives in issues",
    detail:
      "No TASKS.md, no TODO.md, no shadow list. You ask what's next by listing open issues, not by opening a file.",
  },
  {
    title: "File the issue before doing the work",
    detail:
      "The moment you commit to a piece of work, open an issue for it — tech-debt for a real gap, idea for something speculative — then build. Don't wait to be asked.",
  },
  {
    title: "Re-read the issue list every session",
    detail:
      "Things change while you weren't looking. List the issues at the start of the work so you're not acting on a stale picture.",
  },
  {
    title: "Cross-link docs and issues in both directions",
    detail:
      "When a new issue gives a home to claims scattered across docs, add the pointers both ways without waiting for permission.",
  },
  {
    title: "Prioritize on engineering merit, never on demand",
    detail:
      "Before launch there is no usage data, so any argument from “demand” is smuggling in numbers you don't have. Argue from scope, risk, what unblocks what, and whether it fits what the product is.",
  },
];

/** §8 — what the board is actually for. */
export interface BoardView {
  view: string;
  shows: string;
}

export const boardViews: BoardView[] = [
  { view: "Everything", shows: "The full backlog, unfiltered." },
  { view: "Release spine", shows: "Grouped by milestone: what's scheduled, by version." },
  { view: "Epics", shows: "The big containers, which is the top level of the roadmap." },
  { view: "Planned", shows: "Committed but not yet scheduled." },
  { view: "Labs", shows: "Experiments and design notes — the research track." },
  { view: "Ideas", shows: "The speculative pile." },
  { view: "Release gates", shows: "Open blockers on a tag. An empty list means you can ship." },
  { view: "Surface board", shows: "Work grouped by which shippable thing it belongs to." },
  { view: "Execution", shows: "A kanban of what's actually in progress." },
];

export const boardViewsNote =
  "GitHub's Status field (Todo / In Progress / Done) stays as a light in-flight indicator. It is not a third way of organizing work.";

// ────────────────────────────────────────────────────────────────────────────
// §13 — anti-patterns
// ────────────────────────────────────────────────────────────────────────────

export interface AntiPattern {
  pattern: string;
  consequence: string;
}

export const antiPatterns: AntiPattern[] = [
  {
    pattern: "A second way of slicing the work",
    consequence:
      "A priority field, a size field, a labels convention doing a field's job. There is one model — milestone, labels, sub-issues — and a second one is just another thing to keep current, which means it drifts.",
  },
  {
    pattern: "plan-next sitting next to a milestone",
    consequence:
      "The issue now says two contradictory things about whether it's scheduled, and you can't tell which is current.",
  },
  {
    pattern: "An experiment on a release milestone",
    consequence:
      "Experiments produce decisions, not things to install. They feed the schedule; they never sit on it. And a release should never be built around what you hope one will find.",
  },
  {
    pattern: "Estimates driving scope",
    consequence: "You can't reliably know how long something takes, and a guess mis-steers what gets cut.",
  },
  {
    pattern: "Justifying work by demand",
    consequence: "Before launch that data doesn't exist. Argue from engineering merit instead.",
  },
  {
    pattern: "Writing code before designing",
    consequence: "Design note, then implementation plan, then failing tests, then code.",
  },
  {
    pattern: "Status labels nobody updates",
    consequence:
      "has-design, needs-design, in-review. You can already see the answer by looking at whether the artifact exists.",
  },
  {
    pattern: "Design docs rotting in the repo",
    consequence:
      "Designs live as issues. Only the architecture of things that already shipped belongs in the tree.",
  },
  {
    pattern: "Calling it done when it isn't installable",
    consequence: "Closed and released are separate rungs for a reason.",
  },
  {
    pattern: "Treating the board as the backlog",
    consequence: "The issues are the backlog. The board is a saved search over them.",
  },
  {
    pattern: "Website or extension work on a core milestone",
    consequence:
      "It reads as “done, waiting for v0.5.0” when it shipped weeks ago, and it never appears in the core changelog.",
  },
  {
    pattern: "A branch with green tests that can't actually be released",
    consequence:
      "The publish gap. Tests inside the repo can't see it; only a clean-room install can. Publish as you go, or keep the gap off your main branch — remembering to do it before tagging is not a plan.",
  },
  {
    pattern: "Docs that ship ahead of the feature they document",
    consequence:
      "Documentation for unreleased behavior belongs on the integration branch with the feature, not merged early because “it's only docs.”",
  },
  {
    pattern: "An integration branch with a version in its name — or one per upcoming version",
    consequence:
      "The publish gap is measured against a single registry, so only one cycle can be in flight; and a version in the branch name records the schedule a second time, competing with the milestone that already says it.",
  },
  {
    pattern: "A release obligation filed as ordinary tech-debt",
    consequence:
      "It reads as deferrable when it's the opposite. Label it release-gate so “can we ship?” is a search rather than a memory.",
  },
  {
    pattern: "A roadmap that promises more than the code does",
    consequence: "State the limits in writing and let the code have the final word.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// The package — vendored doctrine, the linter, and the Claude Code plugin
// ────────────────────────────────────────────────────────────────────────────

export const enforcementWhy =
  "Written down, this is prose in a context window — which is to say a suggestion. The rules above are already yes-or-no questions about labels and milestones, so they can be run instead of read. That turns them into a command that exits non-zero, and an agent corrects itself against a failing check far more reliably than against a paragraph it only half-loaded.";

export interface PayloadRoute {
  payload: string;
  consumer: string;
  ships: string;
}

/** Two payloads with genuinely different delivery mechanics — the reason this isn't a normal dependency. */
export const payloadRoutes: PayloadRoute[] = [
  {
    payload: "The rules themselves",
    consumer: "Your agent's context window",
    ships: "Copied into your repo under .pm-playbook/ and committed, stamped with a version.",
  },
  {
    payload: "The setup command and the linter",
    consumer: "Your GitHub and your CI",
    ships: "An ordinary npx binary.",
  },
];

export const vendoringWhy =
  "The rules get copied into your repo rather than read out of node_modules, and that's deliberate: cloud agents, CI containers, and review sandboxes routinely have no node_modules at all; a committed file shows up in a pull request diff, so a change to the rules gets reviewed like anything else; and every agent harness can read a file in the repo, while none of them reliably resolve a package path mentioned in prose.";

export const vendoringDrift =
  "Copying costs you drift, so it's paid for with a manifest — the package version plus a hash of every file. The linter compares them and tells you to re-run setup when they've diverged. It's the lockfile idea applied to prose.";

export const agentStanza =
  "What lands in AGENTS.md is about twenty lines: a pointer to the vendored copy plus the label rules, never the whole doctrine. Always-loaded context is the scarcest thing in a repo, and spending hundreds of lines of it on project management would make the agent worse at everything else. The short stanza buys you the rest on demand. Setup can also write CLAUDE.md, .cursorrules, GEMINI.md, and the rest for whatever harnesses you already use, and re-running is safe — the stanza sits between markers, so your own writing is never touched.";

export interface PlaybookRule {
  id: string;
  /** What the rule checks, in plain language. */
  checks: string;
  severity: "error" | "warning";
}

/** The linter's rule index — the invariants above, plus the checks on the setup itself. */
export const rules: PlaybookRule[] = [
  { id: "PM001", checks: "plan-next sits next to a milestone", severity: "error" },
  { id: "PM002", checks: "idea sits next to plan-next", severity: "error" },
  {
    id: "PM003",
    checks: "An experiment carries idea, plan-next, or a milestone",
    severity: "error",
  },
  { id: "PM004", checks: "A release-gate has no milestone to block", severity: "error" },
  {
    id: "PM005",
    checks: "A release-gate carries idea, plan-next, or experiment",
    severity: "error",
  },
  {
    id: "PM006",
    checks: "Non-core surface work is sitting on a core version milestone",
    severity: "error",
  },
  {
    id: "PM007",
    checks: "An epic isn't broken down into real sub-issues",
    severity: "warning",
  },
  {
    id: "PM008",
    checks: "A pull request would land next-cycle work on the integration branch",
    severity: "error",
  },
  {
    id: "PM009",
    checks: "A pull request mentions next-cycle work it doesn't close",
    severity: "warning",
  },
  {
    id: "PM100",
    checks: "The copy of the rules in your repo has drifted from the package",
    severity: "warning",
  },
  { id: "PM101", checks: "An agent instruction file is missing its pointer", severity: "warning" },
  { id: "PM102", checks: "A markdown backlog file has reappeared", severity: "warning" },
  {
    id: "PM103",
    checks: "Label changes from a newer version haven't been applied yet",
    severity: "warning",
  },
];

export const rulesInterface =
  "Every violation comes with the command that fixes it, and there's a JSON mode that emits the whole report — that's the part meant for agents rather than people. A harness can hand the violations straight back to the model, which is the difference between the rules being documentation and the rules being a constraint.";

export interface CliCommand {
  command: string;
  does: string;
}

export const cliCommands: CliCommand[] = [
  {
    command: "init",
    does: "Copy the rules into your repo, add the issue templates, and wire your agent instruction files. Touches nothing outside your working directory.",
  },
  {
    command: "bootstrap",
    does: "Create the labels with their descriptions, a starter milestone, and the filtered board views. Safe to re-run.",
  },
  {
    command: "check",
    does: "Lint the backlog against every rule. Local-only, JSON, and fail-on-warnings modes.",
  },
  {
    command: "release-check",
    does: "Answers “can we tag this version?” — exits non-zero if the milestone is gated or unfinished.",
  },
  {
    command: "scope-check",
    does: "Refuses a pull request that would land next-cycle work on the integration branch.",
  },
  {
    command: "migrate",
    does: "Applies label renames and removals after a breaking version. Previews by default.",
  },
  { command: "rules", does: "Prints the rule index." },
];

export const initIsLocal =
  "Setup deliberately doesn't touch GitHub unless you ask it to. Creating labels changes state your whole team sees, and that should be a decision somebody made, not a side effect of installing a dependency.";

export const pluginInstall = `/plugin marketplace add hoodiecollin/ai-pm-playbook
/plugin install pm-playbook@pm-playbook`;

export const pluginWhy =
  "The vendored copy already works in any harness that reads repo files — Claude Code, Cursor, Codex, Copilot, Gemini, Windsurf. The Claude Code plugin is optional, and what it adds is enforcement earlier in the loop.";

export const pluginParts: { name: string; does: string }[] = [
  {
    name: "The skill",
    does: "The always-true core, loaded when it's relevant. It defers to the copy in your repo when there is one, since that copy is pinned to the version the project actually adopted.",
  },
  {
    name: "/pm-playbook:check",
    does: "Runs the linter and fixes what it finds, rather than reporting it back to you.",
  },
  {
    name: "/pm-playbook:promote",
    does: "Moves an issue up the ladder as one edit, so a promotion can't half-apply.",
  },
  {
    name: "/pm-playbook:rfc",
    does: "Files a design note grounded in the code, after checking it isn't a duplicate.",
  },
  {
    name: "/pm-playbook:release",
    does: "Answers “can we tag?”, keeping “blocked” and “unfinished” separate.",
  },
  {
    name: "The hook",
    does: "Blocks a gh issue command that would break a label rule — before the issue exists.",
  },
];

export const hookTradeoff =
  "The hook reads the command text and nothing else. That's on purpose: it catches what's self-evident in the command instantly and offline, and leaves anything that depends on repo state to the linter. A fast partial check beats a complete one that makes every command wait on the network. It also fails open on anything it can't parse — a hook that breaks your session is worse than no hook — and it never blocks the fix, because it only reads the flags that add things.";

export const versioningWhy =
  "The rules are versioned like code, because a change to them can turn issues you already have into violations.";

export const versioningPolicy: { bump: string; means: string }[] = [
  {
    bump: "Major",
    means: "A rule changed, or a label was renamed or removed. Your backlog might start failing the check, and a migration note ships with the release.",
  },
  { bump: "Minor", means: "A new label, rule, or section." },
  { bump: "Patch", means: "Wording." },
];

export const migrateWhy =
  "Your labels live in your GitHub, not in the package — so a release that renames one can't fix itself. The setup command writes labels by name and would just add the new one next to the old, leaving every existing issue on the stale taxonomy. That's what the migration command is for, and it previews before it acts, because the three cases aren't equally reversible: if only the old label exists it renames in place and GitHub keeps every assignment; if both exist it has to relabel each issue and then delete the old one; and if only the new one exists it skips, so re-running is safe.";

// ────────────────────────────────────────────────────────────────────────────
// §12 — adoption
// ────────────────────────────────────────────────────────────────────────────

export const adoptionSteps: string[] = [
  "Run init. It copies the rules into your repo, adds the issue templates, and wires your agent instruction files. Commit what it writes — agents read it out of the repo, so it can't be gitignored.",
  "Run bootstrap to provision GitHub: the labels with their descriptions, a starter milestone, and the filtered board views. It's safe to re-run.",
  "Set the group-by on the release-spine, surface, and execution boards by hand — grouping is the one thing the API won't do.",
  "Migrating an existing board? Delete the priority, size, and workstream fields, and every view that filtered or grouped by them.",
  "Define your surface labels — but only if the repo ships more than one thing.",
  "Seed the two roadmap docs, and write the model into CONTRIBUTING.md.",
  "If your project publishes packages its own output depends on, decide now whether you publish as you go or keep the gap off your main branch. Write down the answer and which branch a pull request should target, and make the clean-room check required on the default branch. If you publish nothing, skip this.",
  "Backfill: put the existing backlog on the ladder, assign milestones, and enforce the rules. A plan-next sitting next to a milestone is the number one sign of drift — check --all-states finds every violation at once.",
  "Convert epic checklists into real sub-issues.",
  "Wire the checks into CI, so the rules outlive whoever set them up: lint on pull requests, the release check before a tag, and the scope check on anything targeting the integration branch.",
];

export const quickStart = `npx @hoodiecollin/pm-playbook init
npx @hoodiecollin/pm-playbook bootstrap \\
  --repo <owner>/<name> --project <N> \\
  --surfaces "core,ide-extension,website"`;

export const ciSnippet = `# on pull requests — lint the backlog
- run: npx @hoodiecollin/pm-playbook check --repo \${{ github.repository }}

# before a tag — "can we actually release this?"
- run: npx @hoodiecollin/pm-playbook release-check \${{ github.ref_name }}

# on pull requests into the integration branch — keep next-cycle work out
- run: npx @hoodiecollin/pm-playbook scope-check \${{ github.event.pull_request.number }}`;

/** The four reusable issue templates the repo ships. */
export const issueTemplates: { name: string; purpose: string }[] = [
  { name: "idea", purpose: "The speculative rung. Filing one commits you to nothing." },
  { name: "rfc", purpose: "The design note, written as an issue instead of a file." },
  { name: "implementation-plan", purpose: "The ordered build, written before any code." },
  {
    name: "epic",
    purpose: "Sub-issues plus the decisions-locked and current-state skeleton.",
  },
];
