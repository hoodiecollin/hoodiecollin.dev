import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/**
 * The site builds to a fully static export (`output: "export"` → ./out) so it can
 * be hosted anywhere with no Node server at runtime. Content is compiled from MDX
 * at build time; search runs client-side over a prebuilt static index.
 *
 * Static export is a *deploy* concern (no-server hosting) and also forbids dynamic
 * route handlers even under `next dev`, so scope it to production builds. `next dev`
 * runs as a normal Node server; `next build` (NODE_ENV=production, incl. CI/Vercel)
 * still exports to ./out.
 */
const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  images: { unoptimized: true },
  devIndicators: false,
  // Trailing slashes keep the static export's directory-per-route URLs stable
  // across hosts (`/projects/` → `projects/index.html`).
  trailingSlash: true,
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
};

export default nextConfig;
