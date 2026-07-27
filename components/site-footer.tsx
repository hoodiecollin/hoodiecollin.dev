import Link from "next/link";
import { site } from "@/lib/site";
import { Logo, Wordmark, GitHubIcon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-5" />
            <Wordmark />
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">{site.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/writing/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Writing
          </Link>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <GitHubIcon className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
