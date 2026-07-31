/** Which command-palette group an entry lands in. */
export type SearchGroup = "Writing" | "Pages";

/** One entry in the prebuilt static search index (a post, or a static page). */
export interface SearchDoc {
  title: string;
  href: string;
  description: string;
  /** Section headings (h2/h3) for sub-page matching. */
  headings: string[];
  /** A short plain-text excerpt of the body for fuzzy matching. */
  excerpt: string;
  /** Group heading in the ⌘K palette. */
  group: SearchGroup;
}

/** Palette group order — posts first, then hand-built pages. */
export const searchGroups: SearchGroup[] = ["Writing", "Pages"];
