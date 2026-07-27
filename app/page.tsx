import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Collin Kokotas
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Engineer. I build systems and tools — and write about the parts worth
          remembering. This is where the <span className="text-primary">deep dives</span> live.
        </p>
      </section>

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

      <footer className="mt-16 border-t border-border/60 pt-6 text-sm text-muted-foreground">
        Find me on{" "}
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          GitHub
        </a>
        .
      </footer>
    </main>
  );
}
