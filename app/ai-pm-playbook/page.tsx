import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Ban, FileCode2, Quote } from "lucide-react";
import { cn, container } from "@/lib/utils";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  PLAYBOOK_BOOTSTRAP,
  PLAYBOOK_DOC,
  PLAYBOOK_REPO,
  PLAYBOOK_TEMPLATES,
  adoptionSteps,
  antiPatterns,
  axes,
  bannedFields,
  bannedFieldsRationale,
  derivedStateRule,
  disciplines,
  epicBodyShape,
  experimentRules,
  experimentTest,
  gates,
  gatesRationale,
  groundTruthRule,
  invariantPayoff,
  invariants,
  issueTemplates,
  labels,
  ladder,
  milestoneBoilerplate,
  playbookSections,
  quickStart,
  roadmapBuckets,
  structuralRules,
  surfaceExclusionRule,
  surfaceNaming,
  surfaces,
} from "@/lib/pm-playbook";

export const metadata: Metadata = {
  title: "AI Project-Management Playbook",
  description:
    "A portable, two-axis GitHub project-management methodology: milestone + labels and nothing else, epics via native sub-issues, and a design → plan → spec doctrine that keeps every claim pointed at the code.",
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
          A portable project-management system for GitHub repos. All work is Issues, organized
          by <span className="text-foreground">exactly two orthogonal axes</span> — milestone for{" "}
          <em>when</em>, labels for <em>what kind</em> — and nothing else decomposes work.
          Reverse-engineered from the model I worked out running ForgeDB, then generalized so any
          repo can adopt it.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button asChild size="lg">
            <a href={PLAYBOOK_REPO} target="_blank" rel="noreferrer noopener">
              <GitHubIcon /> View the repo
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={PLAYBOOK_DOC} target="_blank" rel="noreferrer noopener">
              <FileCode2 /> Read PLAYBOOK.md
            </a>
          </Button>
        </div>
      </header>

      {/* The rule everything hangs on */}
      <blockquote className="mt-10 max-w-3xl rounded-xl border border-primary/30 bg-primary/[0.06] p-5 sm:p-6">
        <Quote aria-hidden className="size-4 text-primary" />
        <p className="mt-3 leading-relaxed text-foreground/90">{groundTruthRule}</p>
      </blockquote>

      {/* Body + sticky TOC */}
      <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-start lg:gap-12">
        <div className="min-w-0 max-w-3xl space-y-16">
          <WhySection />
          <TwoAxesSection />
          <LadderSection />
          <LabelsSection />
          <ExperimentsSection />
          <SurfacesSection />
          <EpicsSection />
          <GatesSection />
          <DisciplinesSection />
          <AntiPatternsSection />
          <AdoptSection />
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
// Sections
// ────────────────────────────────────────────────────────────────────────────

function WhySection() {
  return (
    <Section id="why" title="Why this exists">
      <p>
        Every project-management tool I&apos;ve used degrades the same way. You start with a board,
        then add a Priority field, then a Size field, then a Workstream field — and each one is a
        second place where the truth about a piece of work is supposed to live. None of them are
        wired to the code, so they drift the moment you stop hand-feeding them. Eventually you have
        a board that looks organized and tells you nothing, and the only way to answer &ldquo;what
        is actually happening&rdquo; is to go read the repo.
      </p>
      <p>
        So this model does the opposite: it deletes fields until only two axes are left, then makes
        the rules <em>between</em>{" "}them mechanical. If an issue has a milestone it&apos;s scheduled.
        If it has <Code>plan-next</Code>{" "}it isn&apos;t, and by invariant it can&apos;t also have
        a milestone. Nothing needs interpretation, so nothing needs a meeting to reconcile.
      </p>
      <p>
        The AI part isn&apos;t a feature bolted on — it&apos;s why the constraints are this severe.
        I lean hard on coding agents, and an agent is far more literal than a teammate: it will
        happily act on a stale roadmap doc or a status label nobody updated, and it has no
        instinct for &ldquo;that card is obviously out of date.&rdquo; The fix is to give it a
        system where state is <em>derived from artifacts that can&apos;t lie</em>{" "}— does an
        accepted RFC issue exist, is there a plan on the issue, do the specs pass in CI — rather
        than asserted by a sticker someone forgot to move. That&apos;s also why the operating
        disciplines read like instructions to an agent (
        <Code>gh issue create</Code> before implementing, re-read the issue list each session, keep
        the cross-links current in both directions): they are.
      </p>
      <p>
        The result is a system a human can read off an issue at a glance and an agent can execute
        without guessing. Two axes, a handful of hard invariants, and one rule above all of them —
        the code is ground truth, and everything else is a claim that has to point back at it.
      </p>
    </Section>
  );
}

function TwoAxesSection() {
  return (
    <Section id="two-axes" title="The two-axis core">
      <p>
        All work is GitHub Issues, organized by exactly two orthogonal axes — and nothing else
        decomposes work.
      </p>

      <div className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
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
            <span>{r}</span>
          </li>
        ))}
      </ul>

      <Callout tone="danger" title="There are no Priority, Size, or Workstream fields">
        <div className="not-prose mb-3 flex flex-wrap gap-2">
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
    </Section>
  );
}

function LadderSection() {
  return (
    <Section id="ladder" title="The commitment ladder">
      <p>
        The labels encode one idea: work is ranked by <em>distance from shipped</em>. Every rung
        has a single, explicit promotion gate to the next.
      </p>

      {/* Horizontal ladder — scrolls on narrow screens rather than wrapping. */}
      <div className="not-prose mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
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

      <div className="not-prose mt-6 divide-y divide-border/60 rounded-xl border border-border/60">
        {ladder.map((rung) => (
          <div key={rung.rung} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <div className="font-mono text-sm text-foreground">{rung.rung}</div>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-foreground/90">{rung.means}</p>
              {rung.gate ? (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  <span className="text-primary">Gate →</span> {rung.gate}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6">
        Why it matters: &ldquo;done&rdquo; is ambiguous. The ladder splits it into{" "}
        <em>code-complete</em> (issue closed) and <em>shipped</em> (release tagged), so the roadmap
        never over-promises. Every milestone description carries the same line:
      </p>

      <blockquote className="not-prose mt-4 rounded-lg border-l-2 border-primary/50 bg-muted/30 py-3 pl-4 pr-4 text-sm italic leading-relaxed text-muted-foreground">
        {milestoneBoilerplate}
      </blockquote>
    </Section>
  );
}

function LabelsSection() {
  return (
    <Section id="labels" title="Labels & invariants">
      <p>
        Labels are self-documenting: each label&apos;s <em>description</em> is the process, and the
        bootstrap script writes those descriptions for you.
      </p>

      <div className="not-prose mt-6 space-y-3">
        {labels.map((l) => (
          <div key={l.name} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <div className="shrink-0 sm:w-40">
              <LabelChip name={l.name} color={l.color} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{l.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Plus GitHub&apos;s stock labels (<Code>bug</Code>, <Code>documentation</Code>,{" "}
        <Code>enhancement</Code>, …) and the <Code>surface:*</Code> delivery labels.
      </p>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The integrity rules</h3>
      <p className="mt-2">
        These mutual exclusions keep the two axes clean and make every derived view a one-line
        filter. Enforce them on every issue.
      </p>

      <div className="not-prose mt-5 space-y-3">
        {invariants.map((inv) => (
          <div key={inv.rule} className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="font-mono text-sm font-medium text-primary">{inv.rule}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{inv.why}</p>
          </div>
        ))}
      </div>

      <Callout tone="primary" title="The payoff">
        <p>{invariantPayoff}</p>
      </Callout>
    </Section>
  );
}

function ExperimentsSection() {
  return (
    <Section id="experiments" title="Experiments never ride the spine">
      <p>
        A milestone ships features, fixes, and perf work — things that produce a binary a user
        installs. An <Code>experiment</Code> is a spike to <em>measure</em>; its deliverable is a{" "}
        <em>decision</em>, not a shippable artifact. So it runs off-spine, always.
      </p>

      <ul className="mt-5 space-y-2">
        {experimentRules.map((r) => (
          <li key={r} className="flex gap-2.5">
            <ArrowRight aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
            <span>{r}</span>
          </li>
        ))}
      </ul>

      <Callout tone="primary" title="The discipline test">
        <p>{experimentTest}</p>
      </Callout>
    </Section>
  );
}

function SurfacesSection() {
  return (
    <Section id="surfaces" title="Surfaces — the delivery axis">
      <p>
        A <strong>surface</strong> is a distinct, independently shippable face of the product — core
        library, IDE extension, marketing site — one that may have its own release cadence and tag
        namespace. Modeled as labels, and only when a repo ships more than one artifact; a
        single-artifact repo has one implicit surface and needs no labels at all.
      </p>

      <div className="not-prose mt-6 space-y-3">
        {surfaces.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <div className="shrink-0 sm:w-52">
              <LabelChip name={s.label} color={s.color} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.covers}</p>
          </div>
        ))}
      </div>

      <Callout tone="danger" title="The surface-exclusion rule (load-bearing)">
        <p>{surfaceExclusionRule}</p>
      </Callout>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{surfaceNaming}</p>
    </Section>
  );
}

function EpicsSection() {
  return (
    <Section id="epics" title="Epics & the derived roadmap">
      <p>
        An <Code>epic</Code> is an umbrella issue and a top-level container that{" "}
        <em>may span releases</em>{" "}— don&apos;t force it to be atomic. Its children ship incrementally, each
        carrying its own milestone, and they&apos;re linked as GitHub <strong>native
        sub-issues</strong> so the progress bar rolls them up automatically. Not task-list
        checkboxes, which drift. Not a Project field, which is a second axis.
      </p>

      <div className="not-prose mt-6 divide-y divide-border/60 rounded-xl border border-border/60">
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

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The roadmap is derived</h3>
      <p className="mt-2">
        A <Code>/roadmap</Code> page is computed from the two axes plus the sub-issue structure,
        never maintained by hand. Because of the invariants, every forward bucket is a one-line
        filter:
      </p>

      <div className="not-prose mt-5 overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 text-left font-medium">Bucket</th>
              <th className="py-2 text-left font-medium">Derivation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {roadmapBuckets.map((b) => (
              <tr key={b.bucket}>
                <td className="py-2.5 pr-4 align-top font-medium whitespace-nowrap">{b.bucket}</td>
                <td className="py-2.5 align-top font-mono text-xs text-muted-foreground">
                  {b.derivation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function GatesSection() {
  return (
    <Section id="gates" title="Design → plan → spec">
      <blockquote className="not-prose rounded-xl border border-primary/30 bg-primary/[0.06] p-5">
        <p className="leading-relaxed text-foreground/90">
          Nothing gets coded until two artifacts exist, in series: a <em>design-doc</em>, then an{" "}
          <em>implementation-plan</em>. Both live as issues, never as committed files.
        </p>
      </blockquote>

      <p className="mt-6">
        Design and planning are two distinct deliverables. Doing them in series <em>before</em>{" "}
        any code is what surfaces gotchas while they&apos;re still cheap.
      </p>

      <div className="not-prose mt-6 space-y-4">
        {gates.map((g) => (
          <div key={g.number} className="rounded-xl border border-border/60 bg-card/40 p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs text-primary">Gate {g.number}</span>
              <h3 className="font-semibold tracking-tight">{g.name}</h3>
              <span className="font-mono text-xs text-muted-foreground">{g.question}</span>
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

      <p className="mt-6">{gatesRationale}</p>

      <Callout tone="primary" title="State is derived, not stickered">
        <p>{derivedStateRule}</p>
      </Callout>

      <p className="mt-6">
        Where design lives: the design-doc <em>is</em> the <Code>rfc</Code> issue — never a
        committed <Code>proposal-*.md</Code>. The only design docs in the tree are durable
        architecture references for <em>shipped</em> features. When a feature ships, fold its
        durable design into <Code>ARCHITECTURE.md</Code> and close the RFC.
      </p>
    </Section>
  );
}

function DisciplinesSection() {
  return (
    <Section id="disciplines" title="Operating disciplines">
      <p>Standing rules that keep Issues the single, always-current source of truth.</p>
      <div className="not-prose mt-6 space-y-4">
        {disciplines.map((d) => (
          <div key={d.title}>
            <p className="text-sm font-medium">{d.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AntiPatternsSection() {
  return (
    <Section id="anti-patterns" title="Anti-patterns it prevents">
      <p>Every rule above exists because one of these bit me first.</p>
      <div className="not-prose mt-6 space-y-3">
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
    </Section>
  );
}

function AdoptSection() {
  return (
    <Section id="adopt" title="Adopt it">
      <p>
        The repo ships an idempotent Bun script that provisions the labels (with their
        descriptions), the starter milestones, and the scriptable filtered views:
      </p>

      <div className="not-prose mt-5 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4">
        <pre className="font-mono text-xs leading-relaxed text-foreground/90">
          <code>{quickStart}</code>
        </pre>
      </div>

      <ol className="mt-6 list-decimal space-y-2 pl-5 marker:font-mono marker:text-xs marker:text-muted-foreground">
        {adoptionSteps.map((s) => (
          <li key={s} className="pl-1">
            {s}
          </li>
        ))}
      </ol>

      <h3 className="mt-10 text-lg font-semibold tracking-tight">The issue templates</h3>
      <div className="not-prose mt-4 space-y-3">
        {issueTemplates.map((t) => (
          <div key={t.name} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <code className="shrink-0 font-mono text-sm text-primary sm:w-52">{t.name}</code>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.purpose}</p>
          </div>
        ))}
      </div>

      <div className="not-prose mt-8 flex flex-wrap items-center gap-2">
        <Button asChild size="sm">
          <a href={PLAYBOOK_REPO} target="_blank" rel="noreferrer noopener">
            <GitHubIcon /> ai-pm-playbook
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={PLAYBOOK_BOOTSTRAP} target="_blank" rel="noreferrer noopener">
            bootstrap-pm.ts
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={PLAYBOOK_TEMPLATES} target="_blank" rel="noreferrer noopener">
            Issue templates
          </a>
        </Button>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Primitives
// ────────────────────────────────────────────────────────────────────────────

/**
 * A page section. `scroll-mt` clears the sticky header so TOC anchors don't
 * land under it; paragraphs get their rhythm here rather than via a prose class,
 * so `not-prose` blocks opt out of the spacing without fighting typography.
 */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 [&>p]:mt-4 [&>p]:leading-relaxed [&>p]:text-foreground/90"
    >
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

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
