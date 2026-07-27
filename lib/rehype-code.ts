import { createHighlighter } from "shiki";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";

const BUILTIN_LANGS = [
  "bash",
  "rust",
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "toml",
  "yaml",
  "sql",
  "python",
  "go",
  "css",
  "html",
  "diff",
  "text",
] as const;

/** rehype-pretty-code options wired with dual light/dark themes. */
export const rehypePrettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
  defaultLang: { block: "text", inline: "text" },
  // Reuse one highlighter instance across the whole build.
  getHighlighter: (options) =>
    createHighlighter({
      ...options,
      langs: [...BUILTIN_LANGS],
    }),
};
