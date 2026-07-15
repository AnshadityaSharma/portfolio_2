"use client";

/* The mono line under the strip. Static text by default; when the demo
   publishes a live metric line for this slug, that takes over. */

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/liveStore";

export default function MetricLine({
  slug,
  fallback,
}: {
  slug: string;
  fallback: string;
}) {
  const snap = useSyncExternalStore(
    (cb) => subscribe(slug, cb),
    () => getSnapshot(slug),
    getServerSnapshot,
  );
  return (
    <div className="mt-3 font-mono text-meta text-graphite">
      {snap.metricLine ?? fallback}
    </div>
  );
}
