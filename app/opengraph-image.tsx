import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Required for metadata image routes under `output: export` (static export).
export const dynamic = "force-static";
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The logomark, inlined as a data URI so Satori renders the real mark (glyph
// fonts aren't available in the OG runtime).
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#16a34a"/><path d="M10 11l5 5-5 5" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="17" y="19" width="7" height="2.5" rx="1.25" fill="#fff"/></svg>`;
const LOGO_URI = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;

/** Build-time OG card: dark canvas, green terminal mark, name + tagline. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: 80,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URI} width={72} height={72} alt="" />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600 }}>
            collin<span style={{ color: "#4ade80" }}>.dev</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 40, color: "#a3a3a3" }}>
            {`${site.tagline} — systems, tools & deep dives.`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
