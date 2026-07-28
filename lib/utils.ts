import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared page-width container — the single knob for the site's content width.
 * Header, footer, and every page `main` use this so their left/right edges align
 * into one consistent gutter down the page. Callers append their own vertical
 * padding (e.g. `cn(container, "py-16")`).
 */
export const container = "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8";

/** Format an ISO date (YYYY-MM-DD) as "Jan 15, 2026" in UTC. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
