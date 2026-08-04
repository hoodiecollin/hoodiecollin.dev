import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  FileCode2,
  Package,
  Quote,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn, container } from "@/lib/utils";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Disclosure, ExpandAll } from "@/components/disclosure";
import {
  PLAYBOOK_DOC,
  PLAYBOOK_NPM,
  PLAYBOOK_PACKAGE,
  PLAYBOOK_REPO,
  PLAYBOOK_TEMPLATES,
  adoptionSteps,
  agentStanza,
  antiPatterns,
  axes,
  bannedFields,
  bannedFieldsRationale,
  boardViews,
  boardViewsNote,
  branchQuestion,
  branchTargetWhy,
  branchTargets,
  ciSnippet,
  cliCommands,
  cycleDerivation,
  cycleScopeRule,
  cycleScopeShape,
  derivedStateRule,
  disciplines,
  docsDiscipline,
  enforcementWhy,
  epicBodyShape,
  experimentRules,
  experimentTest,
  gapOffTrunkRules,
  gates,
  gatesRationale,
  groundTruthRule,
  hookTradeoff,
  initIsLocal,
  invariantPayoff,
  invariants,
  issueTemplates,
  labels,
  labelsAreTheProcess,
  ladder,
  ladderPayoff,
  longLivedBranches,
  migrateWhy,
  milestoneBoilerplate,
  milestoneRules,
  nextCycleWork,
  oneBranchPayoff,
  oneBranchReasons,
  oneBranchRule,
  payloadRoutes,
  playbookSections,
  pluginInstall,
  pluginParts,
  pluginWhy,
  publishGap,
  publishGapApplies,
  publishGapWhyInvisible,
  quickStart,
  releaseGateRationale,
  releaseMechanics,
  roadmapBuckets,
  rules,
  rulesInterface,
  structuralRules,
  surfaceExclusionRule,
  surfaceNaming,
  surfaces,
  tldr,
  tldrWhy,
  trunkStrategies,
  trunkStrategyChoice,
  versioningPolicy,
  versioningWhy,
  vendoringDrift,
  vendoringWhy,
  whereDesignLives,
} from "@/lib/pm-playbook";

export const metadata: Metadata = {
  title: "AI Project-Management Playbook",
  description:
    "A project-management system for GitHub repos, built for working with coding agents: every piece of work is an issue, two things organize them — the release it ships in and its labels — and a linter fails your build when the backlog breaks one of the rules.",
};

export default function PlaybookPage() {
  return (
    <main className={cn(container, "py-12 sm:py-16")}>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Home
      </Link>

      {/* Hero */}
      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-sm text-primary">Methodology</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          AI Project-Management Playbook
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          A project-management system for GitHub repos, built for working with coding agents.
          Every piece of work is an issue, and{" "}
          <span className="text-foreground">two things organize them</span> — the release it
          ships in, and its labels. Nothing else. I worked it out running ForgeDB, then
          generalized it so any repo can pick it up — and packaged it so your agents read the
          rules and a linter enforces them.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button asChild size="lg">
            <a href={PLAYBOOK_REPO} target="_blank" rel="noreferrer noopener">
              <GitHubIcon /> View the repo
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={PLAYBOOK_DOC} target="_blank" rel="noreferrer noopener">
              <FileCode2 /> Read the full spec
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={PLAYBOOK_NPM} target="_blank" rel="noreferrer noopener">
              <Package /> {PLAYBOOK_PACKAGE}
            </a>
          </Button>
        </div>
      </header>

      {/* Body + sticky TOC */}
      <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-start lg:gap-12">
        <div className="min-w-0 max-w-3xl">
          <TldrSection />
          <HowItWorksSection />

          {/* Everything below is collapsed by default — the page above is the
              whole model; these are the details you open when you want them. */}
          <div className="mt-16">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                The details
              </h2>
              <ExpandAll />
            </div>

            <div className="mt-4 space-y-3">
              <LabelsSection />
              <ReleasesSection />
              <ExperimentsSection />
              <SurfacesSection />
              <EpicsSection />
              <GatesSection />
              <PracticeSection />
              <MistakesSection />
              <EnforcementSection />
              <AdoptSection />
            </div>
          </div>
        </div>

        <nav
          aria-label="On this page"
          className="sticky top-20 hidden self-start lg:block print:hidden"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            On this page
          </p>
          <ul className="mt-3 space-y-2 border-l border-border/60">
            {playbookSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l border-transparent pl-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// The always-open top of the page
// ────────────────────────────────────────────────────────────────────────────

function TldrSection() {
  return (
    <section id="tldr" className="scroll-mt-20">
      <h2 className="text-2xl font-bold tracking-tight">TL;DR</h2>

      <ul className="mt-5 space-y-3">
        {tldr.map((line) => (
          <li key={line} className="flex gap-3">
            <Check aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
            <span className="leading-relaxed text-foreground/90">{line}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 leading-relaxed text-muted-foreground">{tldrWhy}</p>

      <blockquote className="mt-8 rounded-xl border border-primary/30 bg-primary/[0.06] p-5 sm:p-6">
        <Quote aria-hidden className="size-4 text-primary" />
        <p className="mt-3 leading-relaxed text-foreground/90">{groundTruthRule}</p>
      </blockquote>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how" className="mt-16 scroll-mt-20">
      <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
      <p className="mt-4 leading-relaxed text-foreground/90">
        Every issue answers two questions, and each question has exactly one mechanism behind it.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {axes.map((a) => (
          <div key={a.axis} className="rounded-xl border border-border/60 bg-card/40 p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-primary">{a.axis}</p>
            <p className="mt-2 font-medium">{a.mechanism}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.answers}</p>
          </div>
        ))}
      </div>

      <ul className="mt-6 space-y-2">
        {structuralRules.map((r) => (
          <li key={r} className="flex gap-2.5">
            <ArrowRight aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
            <span className="leading-relaxed text-foreground/90">{r}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">
        The labels are a ladder, not a pile
      </h3>
      <p className="mt-2 leading-relaxed text-foreground/90">
        They rank work by how far it is from being in a user&apos;s hands. Moving up a rung takes
        one specific thing each time — never a judgement call.
      </p>

      {/* Horizontal ladder — scrolls on narrow screens rather than wrapping. */}
      <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ol className="flex min-w-max items-center gap-2">
          {ladder.map((rung, i) => (
            <li key={rung.rung} className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-md border px-2.5 py-1 font-mono text-xs whitespace-nowrap",
                  i === ladder.length - 1
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 bg-muted/40 text-muted-foreground",
                )}
              >
                {rung.short}
              </span>
              {i < ladder.length - 1 ? (
                <ArrowRight aria-hidden className="size-3.5 shrink-0 text-border" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 divide-y divide-border/60 rounded-xl border border-border/60">
        {ladder.map((rung) => (
          <div key={rung.rung} className="grid gap-1 p-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <div className="font-mono text-sm text-foreground">{rung.rung}</div>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-foreground/90">{rung.means}</p>
              {rung.gate ? (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  <span className="text-primary">To move up →</span> {rung.gate}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 leading-relaxed text-foreground/90">{ladderPayoff}</p>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// The collapsed detail sections
// ────────────────────────────────────────────────────────────────────────────

function LabelsSection() {
  return (
    <Disclosure
      id="labels"
      title="Labels, and the rules between them"
      teaser="The ten labels, and the four rules about which ones can appear together — the rules are what make every question a one-line search."
    >
      <p>{labelsAreTheProcess}</p>

      <div className="mt-6 space-y-3">
        {labels.map((l) => (
          <div key={l.name} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <div className="shrink-0 sm:w-40">
              <LabelChip name={l.name} color={l.color} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{l.description}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Plus GitHub&apos;s stock labels (<Code>bug</Code>, <Code>documentation</Code>,{" "}
        <Code>enhancement</Code>, …) and the <Code>surface:*</Code> labels, if the repo ships more
        than one thing.
      </p>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">Which labels can coexist</h3>
      <p>
        Four rules, enforced on every issue. They&apos;re what keep the two axes from blurring
        into each other, and they&apos;re why the roadmap can be computed instead of maintained.
      </p>

      <div className="mt-5 space-y-3">
        {invariants.map((inv) => (
          <div key={inv.rule} className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="text-sm font-medium text-primary">{inv.rule}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{inv.why}</p>
          </div>
        ))}
      </div>

      <Callout tone="primary" title="What that buys you">
        <p>{invariantPayoff}</p>
      </Callout>

      <Callout tone="danger" title="And what the board deliberately doesn't have">
        <div className="mb-3 flex flex-wrap gap-2">
          {bannedFields.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 font-mono text-xs text-destructive line-through"
            >
              <Ban aria-hidden className="size-3" />
              {f}
            </span>
          ))}
        </div>
        <p>{bannedFieldsRationale}</p>
      </Callout>
    </Disclosure>
  );
}

function ReleasesSection() {
  return (
    <Disclosure
      id="releases"
      title="Shipping, and what blocks it"
      teaser="What a milestone is, why closed isn't shipped, the failure mode where every test passes but nobody can install what you built, and how many long-lived branches you actually need."
    >
      <ul className="space-y-2">
        {milestoneRules.map((r) => (
          <li key={r} className="flex gap-2.5">
            <ArrowRight aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
            <span className="text-sm leading-relaxed text-foreground/90">{r}</span>
          </li>
        ))}
      </ul>

      <p>Paste this into every milestone description:</p>

      <blockquote className="mt-4 rounded-lg border-l-2 border-primary/50 bg-muted/30 px-4 py-3 text-sm italic leading-relaxed text-muted-foreground">
        {milestoneBoilerplate}
      </blockquote>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">Release mechanics</h3>
      <ul className="mt-4 space-y-2">
        {releaseMechanics.map((r) => (
          <li key={r} className="flex gap-2.5">
            <ArrowRight aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
            <span className="text-sm leading-relaxed text-foreground/90">{r}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">
        When green tests aren&apos;t enough
      </h3>
      <p>{publishGapApplies}</p>

      <Callout tone="danger" title="The publish gap">
        <p>{publishGap}</p>
      </Callout>

      <p>{publishGapWhyInvisible}</p>

      <h4 className="mt-8 font-semibold tracking-tight">
        Two ways to prevent it — pick one, and write it down
      </h4>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {trunkStrategies.map((s, i) => (
          <div key={s.name} className="rounded-xl border border-border/60 bg-card/40 p-5">
            <p className="font-mono text-xs text-primary">Option {i + 1}</p>
            <p className="mt-1.5 font-medium">{s.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.how}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="text-foreground/80">Cost:</span> {s.cost}
            </p>
          </div>
        ))}
      </div>
      <p>{trunkStrategyChoice}</p>

      <h4 className="mt-8 font-semibold tracking-tight">If you keep the gap off your main branch</h4>
      <ul className="mt-4 space-y-2">
        {gapOffTrunkRules.map((r) => (
          <li key={r} className="flex gap-2.5">
            <ArrowRight aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
            <span className="text-sm leading-relaxed text-foreground/90">{r}</span>
          </li>
        ))}
      </ul>

      <h4 className="mt-8 font-semibold tracking-tight">
        So which branch does a docs or website change go to?
      </h4>
      <p>
        Not a question about which part of the product it belongs to. One question:
      </p>
      <p className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium">
        {branchQuestion}
      </p>

      <div className="mt-4 space-y-3">
        {branchTargets.map((t) => {
          const yes = t.answer === "Yes";
          return (
            <div
              key={t.answer}
              className={cn(
                "rounded-xl border p-4",
                yes ? "border-primary/30 bg-primary/[0.05]" : "border-border/60 bg-card/40",
              )}
            >
              <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
                {yes ? (
                  <Check aria-hidden className="size-3.5 shrink-0 self-center text-primary" />
                ) : (
                  <X aria-hidden className="size-3.5 shrink-0 self-center text-muted-foreground" />
                )}
                {t.answer}
                <span className="text-muted-foreground">→</span>
                <span className="font-mono text-xs">{t.branch}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.examples}</p>
            </div>
          );
        })}
      </div>
      <p>{branchTargetWhy}</p>

      <h4 className="mt-8 font-semibold tracking-tight">
        <LabelChip name="release-gate" color="b60205" /> — the rung between closed and released
      </h4>
      <p>{releaseGateRationale}</p>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">
        One integration branch, never one per version
      </h3>
      <p>{oneBranchRule}</p>

      <div className="mt-5 space-y-3">
        {oneBranchReasons.map((r) => (
          <div key={r.heading} className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="text-sm font-medium text-primary">{r.heading}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.why}</p>
          </div>
        ))}
      </div>

      <p>{oneBranchPayoff}</p>

      <h4 className="mt-8 font-semibold tracking-tight">
        Keeping next-cycle work off that branch
      </h4>
      <p>
        The check reads the milestone rather than the branch name — the schedule already lives on
        the issue, so there&apos;s no reason to write it down again:
      </p>
      <p className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium">
        {cycleScopeRule}
      </p>
      <p>{cycleScopeShape}</p>
      <p>{cycleDerivation}</p>
      <p>{nextCycleWork}</p>

      <h4 className="mt-8 font-semibold tracking-tight">
        The two long-lived branches that are fine
      </h4>
      <p>Neither of these is a second release line, which is why they don&apos;t break the rule.</p>
      <div className="mt-4 space-y-3">
        {longLivedBranches.map((b) => (
          <div key={b.name} className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="text-sm font-medium">{b.name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.when}</p>
          </div>
        ))}
      </div>
    </Disclosure>
  );
}

function ExperimentsSection() {
  return (
    <Disclosure
      id="experiments"
      title="Experiments stay off the schedule"
      teaser="A spike produces a decision, not something a user installs — so it never goes into a release, and a release never depends on how one turns out."
    >
      <p>
        A release ships features, fixes, and performance work — things that turn into a binary
        somebody installs. An <Code>experiment</Code> is a spike to measure something, and what
        it delivers is a decision. So it runs alongside the release schedule, never inside it.
      </p>

      <ul className="mt-5 space-y-2">
        {experimentRules.map((r) => (
          <li key={r} className="flex gap-2.5">
            <ArrowRight aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
            <span className="text-sm leading-relaxed text-foreground/90">{r}</span>
          </li>
        ))}
      </ul>

      <Callout tone="primary" title="How to tell which one you have">
        <p>{experimentTest}</p>
      </Callout>
    </Disclosure>
  );
}

function SurfacesSection() {
  return (
    <Disclosure
      id="surfaces"
      title="When a repo ships more than one thing"
      teaser="A core library, an editor extension, and a website all release on different schedules. Labels keep them from contaminating each other's roadmaps."
    >
      <p>
        A <strong>surface</strong> is one independently shippable face of the product — the core
        library, the editor extension, the marketing site — each with its own release cadence and
        its own tags. They&apos;re labels, and you only need them if the repo ships more than one
        thing. A single-artifact repo has one implicit surface and needs no labels at all.
      </p>

      <div className="mt-6 space-y-3">
        {surfaces.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <div className="shrink-0 sm:w-52">
              <LabelChip name={s.label} color={s.color} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.covers}</p>
          </div>
        ))}
      </div>

      <Callout tone="danger" title="The one rule that matters here">
        <p>{surfaceExclusionRule}</p>
      </Callout>

      <p className="text-sm text-muted-foreground">{surfaceNaming}</p>
    </Disclosure>
  );
}

function EpicsSection() {
  return (
    <Disclosure
      id="epics"
      title="Big work, and the roadmap"
      teaser="Epics break down through real sub-issues and may span several releases. The roadmap is computed from that structure rather than written by hand."
    >
      <p>
        An <Code>epic</Code> is an umbrella issue, and it&apos;s allowed to span several releases
        — don&apos;t force it to be small. Its children ship one at a time, each carrying its own
        milestone, and they&apos;re linked as real GitHub sub-issues so the progress bar rolls up
        on its own. Not checkboxes in the description, which drift. Not a custom field, which
        would be a third way of organizing work.
      </p>

      <div className="mt-6 divide-y divide-border/60 rounded-xl border border-border/60">
        {epicBodyShape.map((part, i) => (
          <div key={part.heading} className="flex gap-4 p-4">
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{i + 1}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{part.heading}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{part.note}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The roadmap is computed</h3>
      <p>
        A <Code>/roadmap</Code> page is generated from the two axes plus the sub-issue structure,
        never maintained by hand. Because of the label rules, every bucket is a single filter:
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 text-left font-medium">Bucket</th>
              <th className="py-2 text-left font-medium">Which issues land in it</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {roadmapBuckets.map((b) => (
              <tr key={b.bucket}>
                <td className="py-2.5 pr-4 align-top font-medium whitespace-nowrap">{b.bucket}</td>
                <td className="py-2.5 align-top text-muted-foreground">{b.derivation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Disclosure>
  );
}

function GatesSection() {
  return (
    <Disclosure
      id="gates"
      title="Design, then plan, then tests"
      teaser="Nothing gets coded until a design note and an implementation plan exist, in that order — and the tests get written before the code that passes them."
    >
      <blockquote className="rounded-xl border border-primary/30 bg-primary/[0.06] p-5">
        <p className="leading-relaxed text-foreground/90">
          Nothing gets coded until two things exist, in this order: a design note, then an
          implementation plan. Both live as issues, never as files committed to the repo.
        </p>
      </blockquote>

      <p>
        Designing and planning are separate jobs. Doing them one after the other, before any code,
        is what surfaces the problems while they&apos;re still cheap to fix.
      </p>

      <div className="mt-6 space-y-4">
        {gates.map((g) => (
          <div key={g.number} className="rounded-xl border border-border/60 bg-card/40 p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs text-primary">Step {g.number}</span>
              <h3 className="font-semibold tracking-tight">{g.name}</h3>
              <span className="text-xs text-muted-foreground">{g.question}</span>
              <span className="ml-auto rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                {g.artifact}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{g.detail}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="text-primary">Catches:</span> {g.catches}
            </p>
          </div>
        ))}
      </div>

      <p>{gatesRationale}</p>

      <Callout tone="primary" title="You never label the status — you look">
        <p>{derivedStateRule}</p>
      </Callout>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">Where the writing lives</h3>
      <p>{whereDesignLives}</p>

      <div className="mt-5 space-y-3">
        {docsDiscipline.map((d) => (
          <div key={d.name} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <code className="shrink-0 font-mono text-sm text-primary sm:w-48">{d.name}</code>
            <p className="text-sm leading-relaxed text-muted-foreground">{d.role}</p>
          </div>
        ))}
      </div>
    </Disclosure>
  );
}

function PracticeSection() {
  return (
    <Disclosure
      id="practice"
      title="Day-to-day"
      teaser="The standing habits that keep the issues current — and what the project board is actually allowed to do."
    >
      <p>These are the rules that keep the issues worth trusting.</p>
      <div className="mt-6 space-y-4">
        {disciplines.map((d) => (
          <div key={d.title}>
            <p className="text-sm font-medium">{d.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The board is just saved searches</h3>
      <p>
        Its entire job is to give you the views below. Because of the label rules, each one is a
        trivial filter rather than a query you have to think about.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 text-left font-medium">View</th>
              <th className="py-2 text-left font-medium">What it answers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {boardViews.map((v) => (
              <tr key={v.view}>
                <td className="py-2.5 pr-4 align-top font-medium whitespace-nowrap">{v.view}</td>
                <td className="py-2.5 align-top text-muted-foreground">{v.shows}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">{boardViewsNote}</p>
    </Disclosure>
  );
}

function MistakesSection() {
  return (
    <Disclosure
      id="mistakes"
      title="Mistakes this prevents"
      teaser="Every rule above exists because one of these bit me first. If you only read one section, read this one."
    >
      <div className="space-y-3">
        {antiPatterns.map((a) => (
          <div key={a.pattern} className="flex gap-3">
            <Ban aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive/70" />
            <div className="min-w-0">
              <p className="text-sm font-medium">{a.pattern}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                {a.consequence}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Disclosure>
  );
}

function EnforcementSection() {
  return (
    <Disclosure
      id="enforcement"
      title="Written down, then enforced"
      teaser="The rules ship as a package: your agents read them out of your repo, and a linter fails the build when the backlog breaks one."
    >
      <p>{enforcementWhy}</p>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">
        Why it isn&apos;t a normal dependency
      </h3>
      <p>Two payloads, going to two different places by two different routes.</p>

      <div className="mt-5 space-y-3">
        {payloadRoutes.map((r) => (
          <div key={r.payload} className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
              {r.payload}
              <span className="text-muted-foreground">→</span>
              <span className="text-primary">{r.consumer}</span>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.ships}</p>
          </div>
        ))}
      </div>

      <p>{vendoringWhy}</p>
      <p>{vendoringDrift}</p>
      <p>{agentStanza}</p>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The rules it checks</h3>
      <p>
        Everything above the line is one of the label rules from earlier, executed instead of
        described. The rest checks that the setup itself hasn&apos;t rotted.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 text-left font-medium">Rule</th>
              <th className="py-2 pr-4 text-left font-medium">Fires when</th>
              <th className="py-2 text-left font-medium">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rules.map((r) => (
              <tr key={r.id}>
                <td className="py-2.5 pr-4 align-top font-mono text-xs whitespace-nowrap">
                  {r.id}
                </td>
                <td className="py-2.5 pr-4 align-top text-muted-foreground">{r.checks}</td>
                <td className="py-2.5 align-top">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs whitespace-nowrap",
                      r.severity === "error" ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {r.severity === "error" ? (
                      <X aria-hidden className="size-3" />
                    ) : (
                      <TriangleAlert aria-hidden className="size-3" />
                    )}
                    {r.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="primary" title="The part that's aimed at agents, not people">
        <p>{rulesInterface}</p>
      </Callout>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The commands</h3>
      <div className="mt-4 space-y-3">
        {cliCommands.map((c) => (
          <div key={c.command} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <code className="shrink-0 font-mono text-sm text-primary sm:w-36">{c.command}</code>
            <p className="text-sm leading-relaxed text-muted-foreground">{c.does}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{initIsLocal}</p>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The Claude Code plugin</h3>
      <p>{pluginWhy}</p>
      <CodeBlock>{pluginInstall}</CodeBlock>

      <div className="mt-5 space-y-3">
        {pluginParts.map((p) => (
          <div key={p.name} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <code className="shrink-0 font-mono text-sm text-primary sm:w-52">{p.name}</code>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.does}</p>
          </div>
        ))}
      </div>
      <p>{hookTradeoff}</p>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">
        Versioning, and what happens when a label changes
      </h3>
      <p>{versioningWhy}</p>

      <div className="mt-4 space-y-3">
        {versioningPolicy.map((v) => (
          <div key={v.bump} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <span className="shrink-0 font-mono text-sm text-primary sm:w-36">{v.bump}</span>
            <p className="text-sm leading-relaxed text-muted-foreground">{v.means}</p>
          </div>
        ))}
      </div>
      <p>{migrateWhy}</p>
    </Disclosure>
  );
}

function AdoptSection() {
  return (
    <Disclosure
      id="adopt"
      title="Set it up in your repo"
      teaser="Two commands get you the rules in the repo and the labels on GitHub. Then a checklist, most of which you can skip."
    >
      <p>
        The first command is local — it copies the rules into your repo and wires up your agent
        instruction files. The second provisions GitHub: the labels with their descriptions, a
        starter milestone, and the filtered board views. Both are safe to re-run.
      </p>

      <CodeBlock>{quickStart}</CodeBlock>

      <ol className="mt-6 list-decimal space-y-2 pl-5 marker:font-mono marker:text-xs marker:text-muted-foreground">
        {adoptionSteps.map((s) => (
          <li key={s} className="pl-1 text-sm leading-relaxed text-foreground/90">
            {s}
          </li>
        ))}
      </ol>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">Wiring it into CI</h3>
      <p>
        This is the step that makes the rules stick — everything above is a convention until
        something exits non-zero.
      </p>
      <CodeBlock>{ciSnippet}</CodeBlock>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The issue templates</h3>
      <div className="mt-4 space-y-3">
        {issueTemplates.map((t) => (
          <div key={t.name} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <code className="shrink-0 font-mono text-sm text-primary sm:w-52">{t.name}</code>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.purpose}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Button asChild size="sm">
          <a href={PLAYBOOK_REPO} target="_blank" rel="noreferrer noopener">
            <GitHubIcon /> ai-pm-playbook
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={PLAYBOOK_NPM} target="_blank" rel="noreferrer noopener">
            <Package /> {PLAYBOOK_PACKAGE}
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={PLAYBOOK_TEMPLATES} target="_blank" rel="noreferrer noopener">
            Issue templates
          </a>
        </Button>
      </div>
    </Disclosure>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Primitives
// ────────────────────────────────────────────────────────────────────────────

/** A GitHub-style label chip, tinted by the label's real hex color. */
function LabelChip({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium"
      style={{
        // The label's own GitHub color, used as a translucent tint so the chip
        // stays legible in both themes without hardcoding a foreground color.
        borderColor: `#${color}59`,
        backgroundColor: `#${color}26`,
      }}
    >
      {name}
    </span>
  );
}

/**
 * A shell / config snippet. Scrolls sideways rather than wrapping, since a
 * wrapped command line reads as two commands.
 */
function CodeBlock({ children }: { children: string }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4">
      <pre className="font-mono text-xs leading-relaxed text-foreground/90">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** Inline code token, matching the site's mono treatment. */
function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-border/60 bg-muted/50 px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  );
}

/** A highlighted aside — `primary` for payoffs, `danger` for hard prohibitions. */
function Callout({
  tone,
  title,
  children,
}: {
  tone: "primary" | "danger";
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-6 rounded-xl border p-5",
        tone === "primary"
          ? "border-primary/30 bg-primary/[0.06]"
          : "border-destructive/30 bg-destructive/[0.06]",
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold",
          tone === "primary" ? "text-primary" : "text-destructive",
        )}
      >
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground [&>p+p]:mt-3">
        {children}
      </div>
    </div>
  );
}
