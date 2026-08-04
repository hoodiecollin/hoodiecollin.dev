"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A collapsed page section.
 *
 * Built on native `<details>` so it works without JS and so the body still
 * lives in the DOM for crawlers and in-page find. The client-side part exists
 * for one reason: a table-of-contents link pointing at a closed section would
 * otherwise scroll to a title with nothing under it, so we open the section
 * when the URL fragment names it — on load and on every later hash change.
 *
 * `data-disclosure` is the hook `ExpandAll` uses to reach every instance.
 */
export function Disclosure({
  id,
  title,
  teaser,
  children,
}: {
  id: string;
  title: string;
  /** One line shown next to the title while closed — how a reader decides to open it. */
  teaser: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const openIfTargeted = () => {
      if (decodeURIComponent(window.location.hash.slice(1)) !== id) return;
      const el = ref.current;
      if (!el || el.open) return;
      el.open = true;
      // Re-anchor: the browser already scrolled to the closed header, and
      // opening it shifts everything below. `scroll-margin` clears the header.
      el.scrollIntoView({ block: "start" });
    };

    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  return (
    <details
      ref={ref}
      id={id}
      data-disclosure
      className="group scroll-mt-20 rounded-xl border border-border/60 bg-card/30 open:bg-transparent"
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 rounded-xl p-4 transition-colors hover:bg-muted/40 sm:p-5 [&::-webkit-details-marker]:hidden">
        <ChevronRight
          aria-hidden
          className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
        />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground group-open:hidden">
            {teaser}
          </p>
        </div>
      </summary>
      {/* Paragraph rhythm lives here rather than on each `<p>`. Note the colour
          is a plain inherited class, not a `[&>p]` variant: an arbitrary variant
          out-specifies a class on the element itself, so a child asking for
          `text-muted-foreground` would silently lose. Margins are variants
          because no child should be overriding those. */}
      <div
        className={cn(
          "border-t border-border/60 px-4 pb-6 pt-5 leading-relaxed text-foreground/90 sm:px-5",
          "[&>p]:mt-5 [&>p:first-child]:mt-0 [&>h3+p]:mt-2 [&>h4+p]:mt-2",
        )}
      >
        {children}
      </div>
    </details>
  );
}

/**
 * Opens (or closes) every `Disclosure` on the page at once — the escape hatch
 * for someone who wants to read the whole thing straight through, or print it.
 */
export function ExpandAll() {
  const [expanded, setExpanded] = useState(false);

  // Track what's actually open rather than what this button last did — sections
  // also open on their own (a click on the summary, a fragment link), and a
  // label derived from local state would start lying the moment that happens.
  // `toggle` doesn't bubble, so listen in the capture phase.
  useEffect(() => {
    const sync = () => {
      const all = [...document.querySelectorAll<HTMLDetailsElement>("details[data-disclosure]")];
      setExpanded(all.length > 0 && all.every((el) => el.open));
    };
    sync();
    document.addEventListener("toggle", sync, true);
    return () => document.removeEventListener("toggle", sync, true);
  }, []);

  const toggle = () => {
    const all = [...document.querySelectorAll<HTMLDetailsElement>("details[data-disclosure]")];
    const next = all.some((el) => !el.open);
    all.forEach((el) => {
      el.open = next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "rounded-md border border-border/60 px-2.5 py-1 text-xs text-muted-foreground",
        "transition-colors hover:border-primary/40 hover:text-foreground",
      )}
    >
      {expanded ? "Collapse all" : "Expand all"}
    </button>
  );
}
