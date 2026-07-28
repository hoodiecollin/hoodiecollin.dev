import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { cn, container, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description: "Posts, notes, and deep dives.",
};

export default function WritingIndexPage() {
  const posts = getAllPosts();

  return (
    <main className={cn(container, "py-16")}>
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Writing</h1>
        <p className="mt-3 text-muted-foreground">Posts, notes, and deep dives.</p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <ul className="mt-10 divide-y divide-border/60">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={post.href} className="group block py-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h2 className="text-lg font-medium transition-colors group-hover:text-primary">
                    {post.frontmatter.title}
                  </h2>
                  <time
                    dateTime={post.frontmatter.date}
                    className="shrink-0 font-mono text-xs text-muted-foreground"
                  >
                    {formatDate(post.frontmatter.date)}
                  </time>
                </div>
                {post.frontmatter.description ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {post.frontmatter.description}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
