/**
 * Canonical résumé data — the single source of truth for the public `/resume`
 * page, the public downloadable PDF, and the private per-application "slant" PDFs.
 *
 * This repo is now the home for all résumé variants (previously maintained in the
 * job-search pipeline). The model is **one shared base + thin per-slant overrides**
 * so shared facts (experience, projects, education, contact) live in exactly one
 * place and can't drift between variants:
 *
 *   base        — the facts: name, contact, phone, experience, projects, education.
 *   variants     — per-slant title, summary, skills, and (optional) reworded bullets.
 *   resolveResume(key, { includePhone }) — merges base + a variant into a full résumé.
 *
 * The PUBLIC surface (this repo's deployed site + `public/…​.pdf`) is the
 * `generalist` slant with the phone number omitted — that's the `resume` export
 * below, which the /resume page and scripts/build-resume-pdf.ts consume. The private
 * application records (scripts/build-resume-variants.ts) render every slant WITH the
 * phone number into ~/Documents/resume/ (Markdown + PDF + an index.json manifest) and
 * are never deployed; that manifest is the contract the job-search pipeline reads.
 */
import { site } from "@/lib/site";
import {
  resumeSlant,
  variantOrder,
  type ResumeSlant,
  type ResumeVariantKey,
} from "@/lib/resume-slants";

// The slant taxonomy (keys, labels, tracker labels, when-to-send) lives in the
// dependency-free lib/resume-slants.ts. Re-export it so `@/lib/resume` stays the
// one-stop résumé import.
export { variantOrder } from "@/lib/resume-slants";
export type { ResumeSlant, ResumeVariantKey } from "@/lib/resume-slants";

export interface ResumeExperience {
  company: string;
  role: string;
  /** Human range, e.g. "Sep 2024 – Jul 2026". */
  period: string;
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  year: string;
  description: string;
  /** Optional repo/link. */
  href?: string;
  /** Dedicated project website, if it has one (e.g. forgedb.dev). */
  website?: string;
  /** Path (under /public) to a brand mark shown on the home-page card. */
  logo?: string;
  /** Internal route for a project that has a dedicated page on this site. */
  page?: string;
  /** Highlight this project with a prominent card on the home page. */
  featured?: boolean;
}

export interface ResumeSkillGroup {
  label: string;
  items: string;
}

export interface ResumeEducation {
  school: string;
  detail: string;
  location: string;
  year: string;
}

/**
 * A slant: the canonical identity (from lib/resume-slants.ts) plus its content —
 * the intentionally-divergent layer sent for a particular kind of role.
 */
export interface ResumeVariant extends ResumeSlant {
  title: string;
  summary: string;
  skills: ResumeSkillGroup[];
  /**
   * Per-company bullet overrides. Companies absent here inherit the base bullets,
   * so shared history stays in one place; only genuinely reworded entries diverge.
   */
  experienceBullets?: Record<string, string[]>;
}

/** The content half of each variant; identity is merged in from resume-slants.ts. */
type VariantContent = Omit<ResumeVariant, keyof ResumeSlant>;

/** A fully-resolved résumé (base merged with one variant) — the shape pages/PDFs read. */
export interface Resume {
  name: string;
  variant: ResumeVariantKey;
  title: string;
  location: string;
  /** Present only when resolved with `includePhone` (private application PDFs). */
  phone?: string;
  summary: string;
  skills: ResumeSkillGroup[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
}

// ────────────────────────────────────────────────────────────────────────────
// Base — the shared facts. Experience carries the canonical (generalist) bullets;
// slants override specific companies' bullets via variant.experienceBullets.
// ────────────────────────────────────────────────────────────────────────────

const base = {
  name: site.name,
  location: "Elk Grove, CA",
  phone: "916-690-6988",

  experience: [
    {
      company: "Recentive Analytics",
      role: "Staff Software Engineer",
      period: "Sep 2024 – Jul 2026",
      bullets: [
        "Conceived, pitched, and built the proof-of-concept and v1 of Velo™, an AI-powered predictive-analytics and optimization platform for sports, media, and entertainment.",
        "Grew Velo™ into the company's #1 revenue source — generating more than all other revenue streams combined — scaling to 12+ enterprise clients (several multinational) and a few hundred executive and decision-maker users.",
        "Built the agentic-AI layer end-to-end (Vercel AI SDK, LangGraph, OpenRouter — Anthropic/OpenAI): tool-calling agents that generate and run warehouse queries via LLM-driven schema selection over a custom semantic-metadata layer I added to the Snowflake schema — an approach I adopted after vector RAG underperformed.",
        "Designed a generic file-ingestion engine (docx/csv/pdf/xlsx, a few MB to multi-GB) that uses an LLM to derive each file's purpose and semantic metadata and materialize it into dynamic Snowflake tables the agents query.",
        "Built “grounded facts,” a layer that mints verifiable facts from tool/query results and audits responses for unsupported figures — cutting responses containing ungrounded numbers from >60% to <10% across real customer threads.",
        "Architected the platform (monorepo, build tooling, type-safe codegen) and authored the architecture docs, design specs, and diagrams that onboarded data science, data engineering, and application teams to build on it.",
      ],
    },
    {
      company: "Mayan",
      role: "Staff Software Engineer",
      period: "May 2021 – Aug 2024",
      bullets: [
        "Technical lead for the core web app; wrote custom build tools generating strongly typed SDKs from backend services, cutting front-end effort and catching breaking changes before deploy.",
        "Designed the Snowflake and PostgreSQL database schemas underpinning the product, and delivered third-party integrations across Amazon Ads / Seller-Central, GCS, Intercom, Looker, and Chargebee.",
        "Built a Figma-driven React component library with a Storybook showcase, and added runtime metrics and error logging that measurably reduced error frequency and improved performance.",
        "Established CI/CD (GitHub Actions) and a release process that eliminated broken deployments; guided QA to comprehensive Cypress end-to-end coverage, driving regressions per release to zero.",
        "Contributed directly to other engineering teams' Python and TypeScript projects, unblocking cross-team delivery beyond my own product area.",
        "As engineering & QA manager, led a daily cross-functional standup that cut support-ticket resolution from 1–2 weeks to 1–3 days, overhauled the technical hiring process, ran annual performance reviews, and coached struggling engineers back to standing through structured improvement plans.",
      ],
    },
    {
      company: "AVB Marketing",
      role: "Senior Engineer",
      period: "Apr 2018 – Mar 2021",
      bullets: [
        "Front-end lead for an e-commerce platform powering 550+ websites; raised average Lighthouse performance from 12 to 92 and built a prerender service taking product-page SEO from 0 to 100.",
        "Integrated Amazon Payments, Synchrony, and PayPal (+33% cart conversion); Dockerized the project, cutting new-developer onboarding time by 25%.",
      ],
    },
    {
      company: "KeeperSecurity",
      role: "Senior Engineer",
      period: "Apr 2017 – Mar 2018",
      bullets: [
        "Rewrote the browser-extension autofill algorithm (~2s → <100ms) and cut site-compatibility failures from 20% to 3%.",
        "Extended the autofill engine to support payment and address forms, broadening coverage across the sites users relied on.",
      ],
    },
    {
      company: "VISA",
      role: "Software Engineer",
      period: "Apr 2015 – Mar 2017",
      bullets: [
        "Built a QA request-recording proxy that drove “cannot reproduce” tickets to near zero on the Express Checkout widget; optimized bundle size and client-side loading.",
      ],
    },
  ] satisfies ResumeExperience[],

  projects: [
    {
      name: "ForgeDB",
      year: "2026",
      description:
        "An application-database generator: write one declarative .forge schema and, at compile time, get a tailored Rust database, a typed TypeScript SDK, and a REST API with an OpenAPI 3.1 spec. It's a code generator, not an ORM or query engine — the output is specialized per schema over columnar storage, so there's no generic runtime to pay for.",
      href: "https://github.com/hoodiecollin/forgedb",
      website: "https://forgedb.dev",
      logo: "/projects/forgedb.svg",
      featured: true,
    },
    {
      name: "typescript-to-rust (ttr)",
      year: "2026",
      description:
        "Language-level translator that compiles a strict TypeScript dialect into idiomatic Rust with true ownership semantics (borrows vs. owned values, &self / &mut self methods), with output verified by a real cargo toolchain rather than string matching.",
      href: "https://github.com/HoodieCollin/typescript-to-rust",
      logo: "/projects/typescript-to-rust.svg",
    },
    {
      name: "Optigon",
      year: "2026",
      description:
        "Packages several interchangeable implementations of an operation (sorting, dictionary lookup, more to come) behind one interface, then learns per workload which is fastest via regret-scored adaptive dispatch. One Rust core, shipped as native addons to TypeScript (Node + Bun) and Python.",
      href: "https://github.com/hoodiecollin/optigon",
      logo: "/projects/optigon.svg",
    },
    {
      name: "AI Project-Management Playbook",
      year: "2026",
      description:
        "A portable GitHub project-management methodology organized by exactly two axes — milestone and labels — so a project's state stays derivable from the code instead of asserted by a board that drifts. Ships an idempotent Bun bootstrap script and issue templates.",
      href: "https://github.com/hoodiecollin/ai-pm-playbook",
      page: "/ai-pm-playbook/",
    },
    {
      name: "checked-rs",
      year: "2024",
      description:
        "Rust library that encodes arbitrary validation logic into the type system, with a proc-macro that generates specialized, self-validating integer types.",
      href: "https://github.com/HoodieCollin/checked-rs",
    },
    {
      name: "use-quantum-state",
      year: "2024",
      description:
        "TypeScript / React library for fine-grained cross-component state: subscribers update without replacing the provider's value, so only components bound to a changed property rerender — cutting render cycles in high-frequency UI such as large tables.",
      href: "https://github.com/HoodieCollin/use-quantum-state",
    },
  ] satisfies ResumeProject[],

  education: [
    {
      school: "Hack Reactor",
      detail: "Advanced Software Engineering Immersive",
      location: "San Francisco",
      year: "2014",
    },
  ] satisfies ResumeEducation[],
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Variants — the intentionally-divergent slants. generalist is the default
// (no bullet overrides); agentic-ai and founding-engineer rewrite title, summary,
// skills, and the bullets that actually change per slant.
// ────────────────────────────────────────────────────────────────────────────

const variantContent: Record<ResumeVariantKey, VariantContent> = {
  generalist: {
    title: "Staff Software Engineer",
    summary:
      "Staff engineer and product-minded builder with 11+ years shipping web applications and AI products end-to-end — increasingly at principal scope. I conceived, pitched, and single-handedly built Velo™ — Recentive's flagship AI predictive-analytics platform — grew it into the company's #1 revenue source, and architected it into a platform multiple teams now build on. Deep in TypeScript/Next.js and agentic AI; at my best owning ambiguous, high-impact problems from zero to production, setting the technical direction others build behind, and lifting teams through architecture, documentation, and mentorship.",
    skills: [
      { label: "Languages", items: "TypeScript / JavaScript (11+ yrs), Rust, Go, Python" },
      {
        label: "AI & Agents",
        items:
          "Vercel AI SDK, LangGraph, OpenRouter, Anthropic, OpenAI, Ollama, tool-calling, structured-output extraction, schema-aware query generation, fact-grounding, prompt engineering",
      },
      {
        label: "Frameworks & Infra",
        items:
          "Node.js, Next.js, React, Redux, GraphQL, SQL, Snowflake, PostgreSQL, Docker, AWS, GCP, Redis, CI/CD, Jest, Cypress",
      },
      {
        label: "Practices & Tools",
        items:
          "Monorepo architecture, type-safe codegen, CI/CD (GitHub Actions), Storybook, technical leadership & mentorship, cross-functional Agile/SDLC",
      },
    ],
  },

  "agentic-ai": {
    title: "Staff AI Engineer · Agentic Application Development",
    summary:
      "Software engineer with 11+ years building web applications and deep hands-on experience shipping production LLM and agent-powered products. I conceived and single-handedly built Velo™ — Recentive's flagship AI application — including its agentic query-generation layer, multimodal ingestion engine, and fact-grounding system, and grew it into the company's #1 revenue source. I turn frontier models into reliable, source-grounded product features, and design the platforms and docs that let other teams build on top.",
    skills: [
      {
        label: "Agentic AI",
        items:
          "Agent systems (Vercel AI SDK, LangGraph), tool-calling, structured-output extraction, schema-aware query generation, prompt engineering, multi-provider orchestration (OpenRouter), Anthropic, OpenAI, Ollama, fact-grounding, evaluation",
      },
      { label: "Languages", items: "TypeScript / JavaScript (11+ yrs), Rust, Go, Python" },
      {
        label: "Platform & Infra",
        items:
          "Node.js, Next.js, React, SQL, Snowflake, PostgreSQL, Docker, AWS, GCP, Redis, CI/CD, Jest, Cypress",
      },
    ],
    experienceBullets: {
      "Recentive Analytics": [
        "Conceived and built the proof-of-concept and v1 of Velo™, an AI-powered predictive-analytics and optimization application for sports, media, and entertainment.",
        "Built the agentic-AI layer end-to-end (Vercel AI SDK, LangGraph, OpenRouter — Anthropic/OpenAI): tool-calling agents that generate and run warehouse queries, using LLM-driven schema selection over a custom semantic-metadata layer I added to the foundational Snowflake schema — an approach I adopted after vector RAG underperformed.",
        "Designed and built a generic file-ingestion engine (docx/csv/pdf/xlsx, a few MB to multi-GB) that uses an LLM to derive each file's purpose and semantic metadata and materialize it into dynamic Snowflake tables the agents query.",
        "Built “grounded facts,” a layer that mints verifiable facts from tool/query results and audits responses for unsupported figures — cutting responses containing ungrounded numbers from >60% to <10% across real customer threads.",
        "Grew Velo™ into the company's #1 revenue source — more than all other streams combined — scaling to 12+ enterprise clients (several multinational) and a few hundred executive users.",
        "Architected the platform (monorepo, tooling, type-safe codegen) and authored the docs, designs, and diagrams that onboarded data science, data engineering, and application teams to build on it.",
      ],
      Mayan: [
        "Technical lead for the core web app; wrote custom build tools generating strongly typed SDKs from backend services, cutting front-end effort and catching breaking changes before deploy.",
        "Designed the Snowflake and PostgreSQL database schemas underpinning the product, and delivered third-party integrations across Amazon Ads / Seller-Central, GCS, Intercom, Looker, and Chargebee.",
        "Built a Figma-driven React component library with a Storybook showcase, and added runtime metrics and error logging that measurably reduced error frequency and improved performance.",
        "Established CI/CD (GitHub Actions) and a release process that eliminated broken deployments; guided QA to comprehensive Cypress end-to-end coverage, driving regressions per release to zero.",
        "Contributed directly to other engineering teams' Python and TypeScript projects, unblocking cross-team delivery beyond my own product area.",
        "As engineering & QA manager, led a cross-functional standup that cut support-ticket resolution from 1–2 weeks to 1–3 days, overhauled technical hiring, ran annual performance reviews, and mentored engineers on code quality.",
      ],
      VISA: [
        "Built a QA request-recording proxy that drove “cannot reproduce” tickets to near zero on the Express Checkout widget.",
      ],
    },
  },

  "founding-engineer": {
    title: "Founding Engineer · Staff Software Engineer",
    summary:
      "Founding-style engineer and product-minded builder with 11+ years taking products from napkin sketch to production. At Recentive, I pitched the idea for Velo™, built the proof-of-concept and v1, and grew it into the company's #1 revenue source — more than all other streams combined — serving 12+ enterprise clients. I thrive in ambiguity, own problems end-to-end across the full stack and AI, and build the architecture, docs, and momentum that let a team scale behind me.",
    skills: [
      { label: "Languages", items: "TypeScript / JavaScript (11+ yrs), Rust, Go, Python" },
      {
        label: "Full-Stack",
        items:
          "Node.js, Next.js, React, Redux, GraphQL, SQL, Snowflake, PostgreSQL, Docker, AWS, GCP, Redis, CI/CD, Jest, Cypress",
      },
      {
        label: "AI & Agents",
        items:
          "Vercel AI SDK, LangGraph, tool-calling, structured-output extraction, prompt engineering, fact-grounding, OpenRouter, Anthropic, OpenAI",
      },
    ],
    experienceBullets: {
      "Recentive Analytics": [
        "Pitched the original concept for Velo™ and single-handedly built the proof-of-concept and v1 — an AI predictive-analytics and optimization platform for sports, media, and entertainment.",
        "Grew Velo™ into the company's #1 revenue source, generating more than all other revenue streams combined.",
        "Won and scaled 12+ enterprise clients (several multinational), serving a few hundred executive and decision-maker users.",
        "Owned the full stack end-to-end — Next.js frontend, Node.js/SQL APIs, a generic file-ingestion engine (docx/csv/pdf/xlsx → queryable Snowflake tables), and agentic-AI features (AI SDK, LangGraph): tool-calling agents with LLM-driven schema selection and a “grounded facts” layer that cut responses containing ungrounded numbers from >60% to <10%.",
        "Scaled the project past myself: authored the architecture docs, designs, and diagrams that onboarded data science, data engineering, and application teams to contribute.",
      ],
      Mayan: [
        "Technical lead and top IC for the core web app; wrote custom build tools generating strongly typed SDKs from backend services, cutting front-end effort and catching breaking changes before deploy.",
        "Designed the Snowflake and PostgreSQL database schemas underpinning the product, and delivered third-party integrations across Amazon Ads / Seller-Central, GCS, Intercom, Looker, and Chargebee.",
        "Built a Figma-driven React component library with a Storybook showcase, and added runtime metrics and error logging that measurably reduced error frequency and improved performance.",
        "Established CI/CD (GitHub Actions) and a release process that eliminated broken deployments; guided QA to comprehensive Cypress end-to-end coverage, driving regressions per release to zero.",
        "Contributed directly to other engineering teams' Python and TypeScript projects, unblocking cross-team delivery beyond my own product area.",
        "As engineering & QA manager, led a cross-functional standup that cut support-ticket resolution from 1–2 weeks to 1–3 days, overhauled technical hiring, ran annual performance reviews, and coached struggling engineers back to standing.",
      ],
      "AVB Marketing": [
        "Front-end lead for an e-commerce platform powering 550+ websites; raised average Lighthouse performance from 12 to 92 and took product-page SEO from 0 to 100 with a custom prerender service.",
        "Integrated Amazon Payments, Synchrony, and PayPal (+33% cart conversion); Dockerized the project, cutting new-developer onboarding time by 25%.",
      ],
      VISA: [
        "Built a QA request-recording proxy that drove “cannot reproduce” tickets to near zero on the Express Checkout widget.",
      ],
    },
  },
};

/** Full slants — canonical identity (resume-slants.ts) merged with the content above. */
export const variants: Record<ResumeVariantKey, ResumeVariant> = Object.fromEntries(
  variantOrder.map((k) => [k, { ...resumeSlant[k], ...variantContent[k] }]),
) as Record<ResumeVariantKey, ResumeVariant>;

/** Merge the shared base with one slant into a full résumé. Phone is included only
 * when `includePhone` is set (private application PDFs) — never on public surfaces. */
export function resolveResume(
  key: ResumeVariantKey,
  opts: { includePhone?: boolean } = {},
): Resume {
  const v = variants[key];
  const experience = base.experience.map((job) => {
    const override = v.experienceBullets?.[job.company];
    return override ? { ...job, bullets: override } : job;
  });
  return {
    name: base.name,
    variant: key,
    title: v.title,
    location: base.location,
    phone: opts.includePhone ? base.phone : undefined,
    summary: v.summary,
    skills: v.skills,
    experience,
    projects: [...base.projects],
    education: [...base.education],
  };
}

/**
 * The PUBLIC résumé: the generalist slant with the phone number omitted. This is
 * what the /resume page and the deployed PDF (scripts/build-resume-pdf.ts) render.
 */
export const resume = resolveResume("generalist");
