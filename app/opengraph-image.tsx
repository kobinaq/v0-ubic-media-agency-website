import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Ubic Media Agency — Brand identity, websites, and creative systems"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 45%, #2a2118 100%)",
          color: "#f5f0e8",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, monospace",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.72,
          }}
        >
          <span>Ubic Media Agency</span>
          <span>Accra · Worldwide</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 920 }}>
          <div style={{ fontSize: 72, lineHeight: 1.02, fontWeight: 600, letterSpacing: "-0.04em" }}>
            Brand identity, websites, and creative systems.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, opacity: 0.78, fontFamily: "ui-sans-serif, system-ui" }}>
            Strategy, design, and content-led execution for ambitious businesses.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "ui-monospace, monospace",
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#d4a574",
          }}
        >
          weareubic.com
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
