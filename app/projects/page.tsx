import type { Metadata } from "next";
import { siteProjects } from "@/lib/resume";
import { cn, container } from "@/lib/utils";
import { FeaturedProjectCard, ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — compilers, databases, libraries, and a methodology.",
};

/**
 * The full project list. Reads the same `siteProjects` the home page and the
 * résumé do (lib/resume.ts is the single source of truth), rendered `detailed`
 * so each card carries its stack chips and an #anchor the ⌘K palette links to.
 */
export default function ProjectsPage() {
  const featured = siteProjects.filter((p) => p.featured);
  const rest = siteProjects.filter((p) => !p.featured);

  return (
    <main className={cn(container, "py-16")}>
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
        <p className="mt-3 text-muted-foreground">
          Things I've built on my own time — compilers, databases, libraries, and a
          methodology. Most are open source; the links go to the code.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {featured.map((project) => (
          <FeaturedProjectCard key={project.name} project={project} detailed />
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((project) => (
          <ProjectCard key={project.name} project={project} detailed />
        ))}
      </div>
    </main>
  );
}
