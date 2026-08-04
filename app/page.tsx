import Link from "next/link";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { cn, container } from "@/lib/utils";
import { site } from "@/lib/site";
import { siteProjects } from "@/lib/resume";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { FeaturedProjectCard, ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";

const socials = [
  { label: "GitHub", href: site.github, icon: GitHubIcon, external: true },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon, external: true },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail, external: false },
];

export default function HomePage() {
  const featured = siteProjects.filter((p) => p.featured);
  // A taste, not the whole list — /projects carries the rest.
  const rest = siteProjects.filter((p) => !p.featured).slice(0, 3);

  return (
    <main className={cn(container, "py-16 sm:py-24")}>
      {/* Hero */}
      <section className="max-w-2xl">
        <p className="font-mono text-sm text-primary">Hi, I'm</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Collin Kokotas
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Engineer. I build systems and tools — compilers, databases, and the libraries
          underneath them. This is where the <span className="text-primary">deep work</span> lives.
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
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Projects
          </h2>
          <Link
            href="/projects/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All projects <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {featured.map((project) => (
            <FeaturedProjectCard key={project.name} project={project} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}

