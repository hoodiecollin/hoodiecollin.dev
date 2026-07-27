import type { ReactNode } from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://hoodiecollin.dev"),
  title: {
    default: "Collin Kokotas",
    template: "%s — Collin Kokotas",
  },
  description: "Collin Kokotas — engineer. Personal site and writing.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
