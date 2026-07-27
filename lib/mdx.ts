import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** All posts live as flat `.mdx` files under content/writing/. */
export const WRITING_DIR = path.join(process.cwd(), "content", "writing");

export interface PostFrontmatter {
  title: string;
  description?: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Drafts are hidden from listings and the search index in production. */
  draft?: boolean;
}

export interface Post {
  slug: string;
  /** Canonical href with a trailing slash, e.g. "/writing/hello-world/". */
  href: string;
  frontmatter: PostFrontmatter;
  content: string;
}

function isPublished(post: Post): boolean {
  return process.env.NODE_ENV !== "production" || !post.frontmatter.draft;
}

/** Every `.mdx` slug under content/writing (no directory recursion). */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(WRITING_DIR)) return [];
  return fs
    .readdirSync(WRITING_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""));
}

export function hrefForSlug(slug: string): string {
  return `/writing/${slug}/`;
}

/** Load a single post by slug, or null if no matching file exists. */
export function getPostBySlug(slug: string): Post | null {
  const file = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    href: hrefForSlug(slug),
    frontmatter: {
      title: (data.title as string) ?? "Untitled",
      description: data.description as string | undefined,
      date: (data.date as string) ?? "1970-01-01",
      draft: Boolean(data.draft),
    },
    content,
  };
}

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null)
    .filter(isPublished)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}
