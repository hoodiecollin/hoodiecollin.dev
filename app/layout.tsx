import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hoodiecollin.dev"),
  title: {
    default: "Collin Kokotas",
    template: "%s — Collin Kokotas",
  },
  description: "Collin Kokotas — engineer. Personal site and writing.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
