/** Site-wide constants. One place to change brand/links. */
export const site = {
  name: "Collin Kokotas",
  tagline: "Engineer",
  description:
    "Personal site and writing by Collin Kokotas — systems, tools, and the occasional deep dive.",
  url: "https://hoodiecollin.dev",
  github: "https://github.com/hoodiecollin",
} as const;

/** Top-level nav shown in the site header. */
export const headerNav: { title: string; href: string }[] = [
  { title: "Writing", href: "/writing/" },
];
