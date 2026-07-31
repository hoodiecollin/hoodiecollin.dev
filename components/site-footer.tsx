import Link from "next/link";
import { cn, container } from "@/lib/utils";
import { site, headerNav } from "@/lib/site";
import { Logo, Wordmark, GitHubIcon, LinkedInIcon } from "@/components/icons";

// Same list as the header nav, so the two can't drift apart.
const explore = headerNav;

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-muted/20 print:hidden">
      <div className={cn(container, "py-12")}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="size-5" />
              <Wordmark />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>

          <nav aria-label="Explore" className="space-y-3 text-sm">
            <h3 className="font-medium text-foreground">Explore</h3>
            <ul className="space-y-2">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 text-sm">
            <h3 className="font-medium text-foreground">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GitHubIcon className="size-4" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LinkedInIcon className="size-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>
            Built with Next.js &amp; Tailwind — statically exported, no server.
          </p>
        </div>
      </div>
    </footer>
  );
}
