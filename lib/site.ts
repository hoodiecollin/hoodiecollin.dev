/** Site-wide constants. One place to change brand/links. */
export const site = {
  name: "Collin Kokotas",
  tagline: "Engineer",
  description:
    "Personal site of Collin Kokotas — the systems and tools I build, and how I work.",
  url: "https://hoodiecollin.dev",
  email: "collinkokotas@gmail.com",
  github: "https://github.com/hoodiecollin",
  linkedin: "https://www.linkedin.com/in/collinkokotas",
  /** Built into public/ by scripts/build-resume-pdf.ts; served as a static asset. */
  resumePdf: "/collin-kokotas-resume.pdf",
} as const;

/** Top-level nav shown in the site header. */
export const headerNav: { title: string; href: string }[] = [
  { title: "Projects", href: "/projects/" },
  { title: "Playbook", href: "/ai-pm-playbook/" },
  { title: "Resume", href: "/resume/" },
];
