"use client";

import { Download, Printer } from "lucide-react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";

/**
 * Resume toolbar. "Download PDF" points at the statically-bundled PDF
 * (built by scripts/build-resume-pdf.ts into public/); "Print" hands off to the
 * browser's print dialog, which the page's `@media print` rules style cleanly.
 */
export function ResumeActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="lg">
        <a href={site.resumePdf} download>
          <Download /> Download PDF
        </a>
      </Button>
      <Button variant="outline" size="lg" onClick={() => window.print()}>
        <Printer /> Print
      </Button>
    </div>
  );
}
