/* Homepage OG image — white cube, 1200×630. */

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Anshaditya Sharma — systems + real-time software";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          color: "#12130F",
          padding: 72,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 28, color: "#6B6C66" }}>
          <span style={{ color: "#2B4CFF" }}>ansh sharma</span>
          <div style={{ flex: 1, height: 1, background: "#D8D8D2" }} />
          <span>cs @ vit chennai &apos;27</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: -1.5, lineHeight: 1.05 }}>
            I build systems that have to run in real time.
          </div>
          <div style={{ fontSize: 26, color: "#6B6C66" }}>
            six projects · every one measures itself
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6B6C66" }}>
          <span>github.com/anshadityasharma</span>
          <span>systems + real-time software</span>
        </div>
      </div>
    ),
    size,
  );
}
