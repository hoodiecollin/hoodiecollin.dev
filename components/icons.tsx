import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Logomark — a green terminal tile with a prompt chevron and cursor. The tile is
 * the house accent (`fill-primary`); the glyphs are cut in the page background so
 * the mark reads on both light and dark surfaces.
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <rect className="fill-primary" width="32" height="32" rx="8" />
      <path
        className="stroke-background"
        d="M10 11l5 5-5 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect className="fill-background" x="17" y="19" width="7" height="2.5" rx="1.25" />
    </svg>
  );
}

/** Wordmark — "collin" + a green ".dev", set in the display face. */
export function Wordmark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("font-semibold tracking-tight", className)} {...props}>
      collin<span className="text-primary">.dev</span>
    </span>
  );
}

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}
