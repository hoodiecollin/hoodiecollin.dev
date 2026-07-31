"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { Search } from "lucide-react";
import { searchOpenAtom } from "@/lib/atoms";
import { searchGroups, type SearchDoc } from "@/lib/search";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

/** Small header button that opens the palette; shows the ⌘K hint. */
export function SearchTrigger() {
  const [, setOpen] = useAtom(searchOpenAtom);
  return (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
    >
      <Search className="size-3.5" />
      <span className="hidden lg:inline">Search…</span>
      <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium lg:inline-flex">
        ⌘K
      </kbd>
    </button>
  );
}

/** The ⌘K command palette. Mounted once in the root layout. */
export function CommandMenu() {
  const [open, setOpen] = useAtom(searchOpenAtom);
  const [docs, setDocs] = React.useState<SearchDoc[]>([]);
  const router = useRouter();

  // Global ⌘K / Ctrl-K shortcut.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // Lazy-load the static index the first time the palette opens.
  React.useEffect(() => {
    if (open && docs.length === 0) {
      fetch("/search-index.json")
        .then((r) => (r.ok ? r.json() : []))
        .then((d: SearchDoc[]) => setDocs(d))
        .catch(() => setDocs([]));
    }
  }, [open, docs.length]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search the site"
      description="Find posts and pages across the site"
      className="max-w-xl"
    >
      {/* This shadcn variant's CommandDialog is only the Dialog shell — it does
          not provide the cmdk <Command> store, so we wrap the content here. */}
      <Command shouldFilter>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchGroups.map((group) => {
            // Older cached indexes predate `group`; treat those entries as Writing.
            const items = docs.filter((d) => (d.group ?? "Writing") === group);
            if (items.length === 0) return null;
            return (
              <CommandGroup key={group} heading={group}>
                {items.map((d) => (
                  <CommandItem
                    key={d.href}
                    value={`${d.title} ${d.headings.join(" ")} ${d.excerpt}`}
                    onSelect={() => go(d.href)}
                  >
                    <div className="flex flex-col">
                      <span>{d.title}</span>
                      {d.description ? (
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          {d.description}
                        </span>
                      ) : null}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
