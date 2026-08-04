import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe } from "lucide-react";
import { projectSlug, type ResumeProject } from "@/lib/resume";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

/**
 * The project cards, shared by the home page (compact — a taste, linking on to
 * /projects) and /projects itself (`detailed` — chips, the long note, and an
 * anchor id so the ⌘K palette can deep-link straight to a card).
 */

/** Bare host for a link label, e.g. "https://forgedb.dev/" → "forgedb.dev". */
function shortHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

/** Stack/topic chips. Rendered only on /projects — the home cards stay skimmable. */
function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Prominent, full-width card for a highlighted project (logo, website + repo). */
export function FeaturedProjectCard({
  project,
  detailed = false,
}: {
  project: ResumeProject;
  detailed?: boolean;
}) {
  return (
    <div
      // `scroll-mt` clears the sticky h-14 header when a #anchor lands here.
      id={detailed ? projectSlug(project.name) : undefined}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-card/40 to-transparent p-6 scroll-mt-20 sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {project.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- static SVG, unoptimized export
          <img src={project.logo} alt="" aria-hidden className="size-14 shrink-0 sm:size-16" />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{project.name}</h3>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
              Featured
            </span>
            <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
              {project.year}
            </span>
          </div>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            {project.description}
          </p>
          {detailed && project.detail ? (
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{project.detail}</p>
          ) : null}
          {detailed && project.tags ? <Tags tags={project.tags} /> : null}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {project.website ? (
              <Button asChild size="sm">
                <a href={project.website} target="_blank" rel="noreferrer noopener">
                  <Globe /> {shortHost(project.website)}
                </a>
              </Button>
            ) : null}
            {project.href ? (
              <Button asChild size="sm" variant="outline">
                <a href={project.href} target="_blank" rel="noreferrer noopener">
                  <GitHubIcon /> GitHub
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Standard project card for the grid; shows a brand mark when the project has one. */
export function ProjectCard({
  project,
  detailed = false,
}: {
  project: ResumeProject;
  detailed?: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {project.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- static SVG, unoptimized export
            <img src={project.logo} alt="" aria-hidden className="size-7 shrink-0" />
          ) : null}
          {/* Wraps rather than truncates — a clipped project name reads as a typo,
              and `mt-auto` on the CTA keeps the cards' bottom edges aligned anyway. */}
          <h3 className="font-medium leading-snug transition-colors group-hover:text-primary">
            {project.name}
          </h3>
        </div>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">{project.year}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      {detailed && project.detail ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.detail}</p>
      ) : null}
      {detailed && project.tags ? <Tags tags={project.tags} /> : null}
      {project.page || project.href ? (
        // `mt-auto` pins the CTA to the card's bottom edge, so cards stretched by a
        // taller neighbor in the same grid row don't leave a gap under their link.
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
          {project.page ? (
            <>
              Read more <ArrowRight className="size-3.5" />
            </>
          ) : (
            <>
              View on GitHub <ArrowUpRight className="size-3.5" />
            </>
          )}
        </span>
      ) : null}
    </>
  );
  const className =
    "group flex flex-col rounded-xl border border-border/60 bg-card/40 p-5 scroll-mt-20 transition-colors hover:border-border hover:bg-card";
  const id = detailed ? projectSlug(project.name) : undefined;

  // A project with its own page on this site links there (internal nav); otherwise
  // the card is a straight shortcut out to the repo.
  if (project.page) {
    return (
      <Link id={id} href={project.page} className={className}>
        {inner}
      </Link>
    );
  }
  return project.href ? (
    <a id={id} href={project.href} target="_blank" rel="noreferrer noopener" className={className}>
      {inner}
    </a>
  ) : (
    <div id={id} className={className}>
      {inner}
    </div>
  );
}
