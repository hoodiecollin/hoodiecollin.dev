import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { rehypePrettyCodeOptions } from "@/lib/rehype-code";
import { mdxComponents } from "@/components/mdx/mdx-components";

// Fully static: enumerate every post at build time.
export const dynamic = "error";
export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/writing/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Writing
      </Link>

      <article className="mt-6">
        <header className="mb-8">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
            {post.frontmatter.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.frontmatter.date} className="font-mono text-xs">
              {formatDate(post.frontmatter.date)}
            </time>
          </div>
          {post.frontmatter.description ? (
            <p className="mt-4 text-lg text-muted-foreground">{post.frontmatter.description}</p>
          ) : null}
        </header>

        <div className="text-[15px]">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypePrettyCode, rehypePrettyCodeOptions]],
              },
            }}
          />
        </div>
      </article>
    </main>
  );
}
