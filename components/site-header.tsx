"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, container } from "@/lib/utils";
import { site, headerNav } from "@/lib/site";
import { Logo, Wordmark, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchTrigger } from "@/components/search";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className={cn(container, "flex h-14 items-center gap-4")}>
        <Link href="/" className="flex items-center gap-2">
          <Logo className="size-6" />
          <Wordmark className="text-[15px]" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {headerNav.map((item) => {
            const active = pathname.startsWith(item.href.replace(/\/$/, ""));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden sm:block">
            <SearchTrigger />
          </div>
          <Button variant="ghost" size="icon" asChild aria-label="GitHub">
            <a href={site.github} target="_blank" rel="noreferrer noopener">
              <GitHubIcon className="size-4.5" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="LinkedIn"
            className="hidden sm:inline-flex"
          >
            <a href={site.linkedin} target="_blank" rel="noreferrer noopener">
              <LinkedInIcon className="size-4.5" />
            </a>
          </Button>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
