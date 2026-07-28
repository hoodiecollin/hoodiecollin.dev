import type { ReactNode } from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandMenu } from "@/components/search";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  // The site ships its own next-themes dark mode, so the Dark Reader extension
  // should not re-theme it — otherwise it mutates styles before hydration and
  // floods the console with unpatchable hydration mismatches.
  other: { "darkreader-lock": "hoodiecollin" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", GeistSans.variable, GeistMono.variable)}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Providers>
          <div className="relative flex min-h-dvh flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
          <CommandMenu />
        </Providers>
        {/*
          Vercel Web Analytics — pageview/visitor baseline that runs alongside the
          PostHog `/relay` proxy. Inert off-Vercel / in local dev.
        */}
        <Analytics />
      </body>
    </html>
  );
}
