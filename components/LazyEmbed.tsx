"use client";

/* Lazy iframe (build step 5): nothing boots until scrolled near the
   viewport, then a 3s load timeout falls back to an honest offline
   panel. No recordings exist for these projects, so the fallback says
   "offline" — not "recorded". Degrading gracefully and saying so
   honestly is itself evidence. */

import { useEffect, useRef, useState } from "react";
import { publish } from "@/lib/liveStore";

type Phase = "waiting" | "loading" | "loaded" | "failed";

export default function LazyEmbed({
  slug,
  src,
  title,
  height = 560,
  timeoutMs = 3000,
}: {
  slug: string;
  src: string;
  title: string;
  height?: number;
  timeoutMs?: number;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("waiting");

  /* mount the iframe only when the slot approaches the viewport */
  useEffect(() => {
    const el = holder.current;
    if (!el || phase !== "waiting") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("loading");
          publish(slug, { status: "connecting" });
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase, slug]);

  /* 3s timeout → offline fallback */
  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => {
      setPhase("failed");
      publish(slug, { status: "offline" });
    }, timeoutMs);
    return () => clearTimeout(t);
  }, [phase, slug, timeoutMs]);

  return (
    <div
      ref={holder}
      className="relative w-full bg-shelf"
      style={{ height: `min(${height}px, 72vh)` }}
    >
      {(phase === "loading" || phase === "loaded") && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => {
            setPhase("loaded");
            publish(slug, { status: "running" });
          }}
        />
      )}
      {phase !== "loaded" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
          {phase === "failed" ? (
            <>
              <div className="font-mono text-meta text-graphite">
                ● offline — the free tier behind this demo is asleep
              </div>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-ink pb-0.5 text-body text-ink"
              >
                open it directly ↗
              </a>
            </>
          ) : (
            <div className="font-mono text-meta text-graphite">
              {phase === "waiting" ? "· scrolled into view, it boots" : "connecting…"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
