import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Mail } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";
import { cn, container, formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { resume } from "@/lib/resume";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const socials = [
  { label: "GitHub", href: site.github, icon: GitHubIcon, external: true },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon, external: true },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail, external: false },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  const projects = resume.projects;

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

      {/* About — editorial two-column: section label in a left rail, text at a
          readable measure in the right column, so the band fills the full width. */}
      <section className="mt-16">
        <div className="grid gap-x-10 gap-y-4 md:grid-cols-[1fr_2fr]">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            About
          </h2>
          <div className="space-y-4">
            <p className="leading-relaxed text-foreground/90">
              I'm a staff-level engineer with 11+ years building web applications and AI
              products end-to-end. I've taken flagship platforms from a rough proof-of-concept
              to the top of a company's revenue, then architected them into systems whole teams
              build on.
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
        </div>
      </section>

      {/* Projects */}
      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Projects
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-medium transition-colors group-hover:text-primary">
                    {project.name}
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {project.year}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                {project.href ? (
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                    View on GitHub <ArrowUpRight className="size-3.5" />
                  </span>
                ) : null}
              </>
            );
            const className =
              "group flex flex-col rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-border hover:bg-card";
            return project.href ? (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
                className={className}
              >
                {inner}
              </a>
            ) : (
              <div key={project.name} className={className}>
                {inner}
              </div>
            );
          })}
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
