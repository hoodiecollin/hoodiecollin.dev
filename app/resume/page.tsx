import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn, container } from "@/lib/utils";
import { site } from "@/lib/site";
import { resume } from "@/lib/resume";
import { ResumeActions } from "@/components/resume-actions";

export const metadata: Metadata = {
  title: "Resume",
  description: `${resume.title} — ${resume.name}. ${resume.summary}`,
};

/** Bare host + path, for compact contact links (e.g. "github.com/hoodiecollin"). */
function shortLink(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

const contacts = [
  { label: shortLink(site.email), href: `mailto:${site.email}` },
  { label: shortLink(site.github), href: site.github },
  { label: shortLink(site.linkedin), href: site.linkedin },
  { label: shortLink(site.url), href: site.url },
];

export default function ResumePage() {
  return (
    <main className={cn(container, "py-12 sm:py-16")}>
      {/* Toolbar — hidden when printing */}
      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Home
        </Link>
        <ResumeActions />
      </div>

      <article className="resume-sheet mt-8">
        {/* Header */}
        <header className="border-b border-border pb-5">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{resume.name}</h1>
          <p className="mt-1 text-lg font-semibold text-foreground/90">{resume.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{resume.location}</span>
            {contacts.map((c) => (
              <span key={c.href} className="flex items-center gap-2">
                <span aria-hidden className="text-border">·</span>
                <a
                  href={c.href}
                  target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-primary"
                >
                  {c.label}
                </a>
              </span>
            ))}
          </div>
        </header>

        {/* Summary */}
        <Section title="Summary">
          <p className="leading-relaxed text-foreground/90">{resume.summary}</p>
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <dl className="grid gap-2">
            {resume.skills.map((group) => (
              <div key={group.label} className="grid gap-0.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="font-semibold text-foreground">{group.label}</dt>
                <dd className="text-muted-foreground">{group.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Experience */}
        <Section title="Experience">
          <div className="space-y-6">
            {resume.experience.map((job) => (
              <div key={`${job.company}-${job.period}`} className="break-inside-avoid">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="font-semibold text-foreground">
                    {job.company} <span className="text-muted-foreground">— {job.role}</span>
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {job.period}
                  </span>
                </div>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-border">
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Selected Projects">
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <div key={project.name} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-foreground">
                    {project.website ?? project.href ? (
                      <a
                        href={project.website ?? project.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="transition-colors hover:text-primary"
                      >
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
                    {project.website && project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="transition-colors hover:text-primary"
                      >
                        source
                      </a>
                    ) : null}
                    <span>{project.year}</span>
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education">
          {resume.education.map((ed) => (
            <div
              key={ed.school}
              className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <p className="text-foreground">
                <span className="font-semibold">{ed.school}</span>
                <span className="text-muted-foreground"> — {ed.detail}</span>
              </p>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {ed.location}, {ed.year}
              </span>
            </div>
          ))}
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}
