"use client";

/* Slot 06 (build step 5): hardware. The video IS the demo, not a
   fallback. Until footage lands at /demos/rover.mp4 the slot states
   plainly that the repo and report are being prepared — a claim
   labelled as a claim, never a fake demo. */

import { useEffect, useRef, useState } from "react";
import { publish } from "@/lib/liveStore";

export default function RoverVideo({
  slug,
  height = 560,
}: {
  slug: string;
  height?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    publish(slug, { status: "recorded" });
  }, [slug]);

  return (
    <div
      className="relative w-full bg-shelf"
      style={{ height: `min(${height}px, 72vh)` }}
    >
      {available !== false && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          src="/demos/rover.mp4"
          muted
          loop
          playsInline
          controls
          preload="metadata"
          onLoadedData={() => setAvailable(true)}
          onError={() => setAvailable(false)}
        />
      )}
      {available === false && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="font-mono text-meta text-graphite">
            hardware — footage of the rover driving is the demo
          </div>
          <div className="max-w-[420px] font-mono text-micro text-graphite">
            repo and research report are being prepared. this slot makes no
            claims until they are public.
          </div>
        </div>
      )}
    </div>
  );
}
