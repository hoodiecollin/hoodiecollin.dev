import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Globe, Mail } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";
import { cn, container, formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { resume, type ResumeProject } from "@/lib/resume";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const socials = [
  { label: "GitHub", href: site.github, icon: GitHubIcon, external: true },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon, external: true },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail, external: false },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  const featured = resume.projects.filter((p) => p.featured);
  const rest = resume.projects.filter((p) => !p.featured);

  return (
    <main className={cn(container, "py-16 sm:py-24")}>
      {/* Hero */}
      <section className="max-w-2xl">
        <p className="font-mono text-sm text-primary">Hi, I'm</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Collin Kokotas
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Engineer. I build systems and tools — and write about the parts worth
          remembering. This is where the <span className="text-primary">deep dives</span> live.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button asChild size="lg">
            <Link href="/resume/">
              <FileText /> Resume
            </Link>
          </Button>
          <div className="flex items-center gap-1">
            {socials.map(({ label, href, icon: Icon, external }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                asChild
                aria-label={label}
              >
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                >
                  <Icon className="size-4.5" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          About
        </h2>
        <div className="mt-4 max-w-5xl space-y-4">
          <p className="leading-relaxed text-foreground/90">
            I'm a staff engineer with 11+ years building web applications end-to-end — increasingly
            at principal scope: taking flagship platforms from a rough proof-of-concept to the top
            of a company's revenue, then architecting them into systems whole teams build on and
            setting the technical direction behind them. Over the past year and a half, that work
            has centered on shipping AI products into production. I lean
            hard on coding agents as productivity tools, but I treat them as exactly that:
            amplifiers, never a substitute for deep domain knowledge or the judgment that only
            comes from practical experience. I also believe great products are never built by
            programmers alone — the people in QA, project management, and customer relations are
            the unsung heroes behind every launch I'm proud of. And I think the discipline itself
            belongs to everyone: at its core, programming is just problem decomposition and
            logical reasoning — a skill worth teaching early, especially to kids, and one that
            pays off in every corner of work.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            I'm at my best owning ambiguous, high-impact problems from zero to production —
            deep in TypeScript, Next.js, Rust, and agentic AI — and lifting teams through
            documentation, technical leadership, and mentorship.{" "}
            <Link href="/resume/" className="text-primary underline-offset-4 hover:underline">
              See the full resume
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Projects
        </h2>

        {featured.map((project) => (
          <FeaturedProjectCard key={project.name} project={project} />
        ))}

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      {/* Writing */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Writing
          </h2>
          <Link
            href="/writing/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All posts <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No posts yet — check back soon.</p>
        ) : (
          <ul className="mt-6 divide-y divide-border/60">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={post.href}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-medium transition-colors group-hover:text-primary">
                    {post.frontmatter.title}
                  </span>
                  <time
                    dateTime={post.frontmatter.date}
                    className="shrink-0 font-mono text-xs text-muted-foreground"
                  >
                    {formatDate(post.frontmatter.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

/** Bare host for a link label, e.g. "https://forgedb.dev/" → "forgedb.dev". */
function shortHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

/** Prominent, full-width card for a highlighted project (logo, website + repo). */
function FeaturedProjectCard({ project }: { project: ResumeProject }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-card/40 to-transparent p-6 sm:p-8">
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
function ProjectCard({ project }: { project: ResumeProject }) {
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
    "group flex flex-col rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-border hover:bg-card";

  // A project with its own page on this site links there (internal nav); otherwise
  // the card is a straight shortcut out to the repo.
  if (project.page) {
    return (
      <Link href={project.page} className={className}>
        {inner}
      </Link>
    );
  }
  return project.href ? (
    <a href={project.href} target="_blank" rel="noreferrer noopener" className={className}>
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}
