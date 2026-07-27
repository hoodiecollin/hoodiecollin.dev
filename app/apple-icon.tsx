import { ImageResponse } from "next/og";

// Required for metadata image routes under `output: export` (static export).
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Full-bleed green tile with the terminal prompt glyph, drawn as SVG so it
// renders without a glyph font in the OG runtime.
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="#16a34a"/><path d="M56 62l28 28-28 28" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><rect x="96" y="107" width="40" height="14" rx="7" fill="#fff"/></svg>`;
const ICON_URI = `data:image/svg+xml;base64,${Buffer.from(ICON_SVG).toString("base64")}`;

/** Build-time Apple touch icon. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ICON_URI} width={180} height={180} alt="" />
      </div>
    ),
    { ...size },
  );
}
