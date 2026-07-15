/* Per-project OG image — white cube in 1200×630: paper ground, mono
   number, display title, one hairline. Same discipline as the site. */

import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  const title = p?.title ?? "Anshaditya Sharma";
  const number = p?.number ?? "";
  const metric = p?.metricLine ?? "";

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 28,
            color: "#6B6C66",
          }}
        >
          <span style={{ color: "#12130F" }}>{number}</span>
          <div style={{ flex: 1, height: 1, background: "#D8D8D2" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: "#2B4CFF",
              }}
            />
            <span style={{ color: "#2B4CFF" }}>running</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: -1.5 }}>
            {title}
          </div>
          <div style={{ fontSize: 26, color: "#6B6C66" }}>{metric}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#6B6C66",
          }}
        >
          <span>anshaditya sharma</span>
          <span>systems + real-time software</span>
        </div>
      </div>
    ),
    size,
  );
}
