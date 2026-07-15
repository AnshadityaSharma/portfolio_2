"use client";

/* Hand Cricket gate (build step 5, hard constraint): the webcam demo
   must NEVER auto-request the camera. Nothing loads until an explicit
   click; the click loads the deployed game, which asks for the camera
   itself, inside its own origin. Render's free tier sleeps, so the
   post-click wait is allowed to run long — with the reason on screen. */

import { useEffect, useState } from "react";
import { publish } from "@/lib/liveStore";

type Phase = "gated" | "waking" | "loaded" | "failed";

const WAKE_ALLOWANCE_MS = 45_000;

export default function CameraGate({
  slug,
  src,
  title,
  height = 560,
}: {
  slug: string;
  src: string;
  title: string;
  height?: number;
}) {
  const [phase, setPhase] = useState<Phase>("gated");

  useEffect(() => {
    publish(slug, { status: "gated" });
  }, [slug]);

  useEffect(() => {
    if (phase !== "waking") return;
    const t = setTimeout(() => {
      setPhase("failed");
      publish(slug, { status: "offline" });
    }, WAKE_ALLOWANCE_MS);
    return () => clearTimeout(t);
  }, [phase, slug]);

  return (
    <div
      className="relative w-full bg-shelf"
      style={{ height: `min(${height}px, 72vh)` }}
    >
      {(phase === "waking" || phase === "loaded") && (
        <iframe
          src={src}
          title={title}
          allow="camera"
          className="absolute inset-0 h-full w-full border-0"
          onLoad={() => {
            setPhase("loaded");
            publish(slug, { status: "running" });
          }}
        />
      )}
      {phase === "gated" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="font-mono text-meta text-graphite">
            webcam demo — nothing starts until you say so
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase("waking");
              publish(slug, { status: "connecting" });
            }}
            className="border border-ink px-5 py-2 text-body text-ink"
          >
            start the demo
          </button>
          <div className="max-w-[420px] font-mono text-micro text-graphite">
            loads the deployed game, which will ask for camera permission
            itself. hosted on render&apos;s free tier — first start after a
            quiet spell can take ~45s.
          </div>
        </div>
      )}
      {phase === "waking" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
          <div className="font-mono text-micro text-graphite">
            waking render&apos;s free tier — this is the honest cost of a
            free demo…
          </div>
        </div>
      )}
      {phase === "failed" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
          <div className="font-mono text-meta text-graphite">
            ● offline — the free tier didn&apos;t wake in time
          </div>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-ink pb-0.5 text-body text-ink"
          >
            open it directly ↗
          </a>
        </div>
      )}
    </div>
  );
}
